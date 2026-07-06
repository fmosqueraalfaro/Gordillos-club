-- ============================================================================
-- Restaurant Judge — Esquema inicial
-- ============================================================================
-- Aplicar en Supabase: SQL Editor → pegar todo → Run.
-- Idempotente en lo posible (usa IF NOT EXISTS / CREATE OR REPLACE).
-- Modelo: el restaurante es un lugar único; las reseñas son por persona.
-- Ver docs/modelo-datos.md.
-- ============================================================================

-- Extensiones -----------------------------------------------------------------
create extension if not exists postgis;      -- consultas geográficas (cercanía)

-- ============================================================================
-- 1. profiles  (extiende auth.users)
-- ============================================================================
create table if not exists public.profiles (
  id           uuid primary key references auth.users (id) on delete cascade,
  display_name text,
  avatar_url   text,
  created_at   timestamptz not null default now()
);

-- Crea automáticamente un profile cuando se registra un usuario nuevo.
create or replace function public.handle_new_user()
returns trigger
language plpgsql
security definer set search_path = public
as $$
begin
  insert into public.profiles (id, display_name)
  values (new.id, coalesce(new.raw_user_meta_data ->> 'display_name', split_part(new.email, '@', 1)));
  return new;
end;
$$;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- ============================================================================
-- 2. restaurants  (el lugar físico, único y compartido)
-- ============================================================================
create table if not exists public.restaurants (
  id              uuid primary key default gen_random_uuid(),
  name            text not null,
  lat             double precision not null,
  lng             double precision not null,
  geom            geography(Point, 4326),          -- se completa por trigger
  neighborhood    text,
  city            text,
  tags            text[] not null default '{}',
  google_place_id text,
  created_by      uuid references public.profiles (id) on delete set null,
  created_at      timestamptz not null default now()
);

-- Completa geom a partir de lat/lng en cada insert/update.
create or replace function public.set_restaurant_geom()
returns trigger
language plpgsql
as $$
begin
  new.geom := ST_SetSRID(ST_MakePoint(new.lng, new.lat), 4326)::geography;
  return new;
end;
$$;

drop trigger if exists trg_set_restaurant_geom on public.restaurants;
create trigger trg_set_restaurant_geom
  before insert or update of lat, lng on public.restaurants
  for each row execute function public.set_restaurant_geom();

create index if not exists restaurants_geom_idx on public.restaurants using gist (geom);
create index if not exists restaurants_neighborhood_idx on public.restaurants (neighborhood);
create index if not exists restaurants_tags_idx on public.restaurants using gin (tags);

-- ============================================================================
-- 3. reviews  (reseña de UNA persona sobre un restaurante)
-- ============================================================================
create table if not exists public.reviews (
  id            uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants (id) on delete cascade,
  user_id       uuid not null references public.profiles (id) on delete cascade,
  rating        numeric(2, 1) not null check (rating >= 1 and rating <= 5),  -- 1..5 estrellas (admite 4.5)
  comment       text,
  visited_on    date,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now(),
  unique (restaurant_id, user_id)                 -- una reseña por persona y lugar
);

create index if not exists reviews_restaurant_idx on public.reviews (restaurant_id);
create index if not exists reviews_user_idx on public.reviews (user_id);

-- Mantiene updated_at al día.
create or replace function public.touch_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at := now();
  return new;
end;
$$;

drop trigger if exists trg_reviews_updated_at on public.reviews;
create trigger trg_reviews_updated_at
  before update on public.reviews
  for each row execute function public.touch_updated_at();

-- ============================================================================
-- 4. photos  (fotos de una reseña; el archivo vive en Storage)
-- ============================================================================
create table if not exists public.photos (
  id           uuid primary key default gen_random_uuid(),
  review_id    uuid not null references public.reviews (id) on delete cascade,
  storage_path text not null,
  caption      text,
  created_at   timestamptz not null default now()
);

create index if not exists photos_review_idx on public.photos (review_id);

-- ============================================================================
-- 5. Row Level Security (RLS)
-- ============================================================================
-- Contexto: dos personas de confianza, data compartida.
--   * Todos los usuarios autenticados LEEN todo (restaurantes y reseñas comunes).
--   * Cada uno solo ESCRIBE sus propias reseñas y fotos.
--   * Los restaurantes los agrega/edita cualquiera; borra quien lo creó.

alter table public.profiles    enable row level security;
alter table public.restaurants enable row level security;
alter table public.reviews     enable row level security;
alter table public.photos      enable row level security;

-- profiles
drop policy if exists profiles_select on public.profiles;
create policy profiles_select on public.profiles
  for select to authenticated using (true);

drop policy if exists profiles_update_own on public.profiles;
create policy profiles_update_own on public.profiles
  for update to authenticated using (id = auth.uid()) with check (id = auth.uid());

-- restaurants
drop policy if exists restaurants_select on public.restaurants;
create policy restaurants_select on public.restaurants
  for select to authenticated using (true);

drop policy if exists restaurants_insert on public.restaurants;
create policy restaurants_insert on public.restaurants
  for insert to authenticated with check (created_by = auth.uid());

drop policy if exists restaurants_update on public.restaurants;
create policy restaurants_update on public.restaurants
  for update to authenticated using (true) with check (true);

drop policy if exists restaurants_delete_own on public.restaurants;
create policy restaurants_delete_own on public.restaurants
  for delete to authenticated using (created_by = auth.uid());

-- reviews  (solo las propias para escribir)
drop policy if exists reviews_select on public.reviews;
create policy reviews_select on public.reviews
  for select to authenticated using (true);

drop policy if exists reviews_insert_own on public.reviews;
create policy reviews_insert_own on public.reviews
  for insert to authenticated with check (user_id = auth.uid());

drop policy if exists reviews_update_own on public.reviews;
create policy reviews_update_own on public.reviews
  for update to authenticated using (user_id = auth.uid()) with check (user_id = auth.uid());

drop policy if exists reviews_delete_own on public.reviews;
create policy reviews_delete_own on public.reviews
  for delete to authenticated using (user_id = auth.uid());

-- photos  (ligadas a la reseña propia)
drop policy if exists photos_select on public.photos;
create policy photos_select on public.photos
  for select to authenticated using (true);

drop policy if exists photos_write_own on public.photos;
create policy photos_write_own on public.photos
  for all to authenticated
  using (exists (select 1 from public.reviews r where r.id = review_id and r.user_id = auth.uid()))
  with check (exists (select 1 from public.reviews r where r.id = review_id and r.user_id = auth.uid()));

-- ============================================================================
-- 6. Storage: bucket de fotos
-- ============================================================================
insert into storage.buckets (id, name, public)
values ('photos', 'photos', true)
on conflict (id) do nothing;

-- Lectura pública (fotos de comida, no sensibles) y escritura solo autenticada.
drop policy if exists photos_bucket_read on storage.objects;
create policy photos_bucket_read on storage.objects
  for select using (bucket_id = 'photos');

drop policy if exists photos_bucket_insert on storage.objects;
create policy photos_bucket_insert on storage.objects
  for insert to authenticated with check (bucket_id = 'photos');

drop policy if exists photos_bucket_update on storage.objects;
create policy photos_bucket_update on storage.objects
  for update to authenticated using (bucket_id = 'photos' and owner = auth.uid());

drop policy if exists photos_bucket_delete on storage.objects;
create policy photos_bucket_delete on storage.objects
  for delete to authenticated using (bucket_id = 'photos' and owner = auth.uid());

-- ============================================================================
-- Fin del esquema inicial.
-- ============================================================================
