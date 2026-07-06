-- ============================================================================
-- Restaurant Judge / Gordillos Club — Migración 0002
-- De "una reseña por lugar" → "experiencias por visita" (modelo diario).
-- ============================================================================
-- Aplicar en Supabase: SQL Editor → pegar todo → Run.
-- Seguro de correr: la base todavía no tiene datos.
-- Modelo: restaurants 1─N experiences 1─N experience_ratings (+ photos).
-- Ver docs/modelo-datos.md.
-- ============================================================================

-- 1. Quitar el modelo viejo (sin datos que migrar) -----------------------------
drop table if exists public.photos cascade;
drop table if exists public.reviews cascade;

-- 2. experiences: una visita/comida a un restaurante ---------------------------
create table public.experiences (
  id            uuid primary key default gen_random_uuid(),
  restaurant_id uuid not null references public.restaurants (id) on delete cascade,
  visited_on    date not null default current_date,
  dish          text,               -- qué comimos (parte del recuerdo)
  note          text,               -- comentario / anécdota
  created_by    uuid references public.profiles (id) on delete set null,
  created_at    timestamptz not null default now(),
  updated_at    timestamptz not null default now()
);
create index experiences_restaurant_idx on public.experiences (restaurant_id);
create index experiences_visited_idx on public.experiences (visited_on desc);

drop trigger if exists trg_experiences_updated_at on public.experiences;
create trigger trg_experiences_updated_at
  before update on public.experiences
  for each row execute function public.touch_updated_at();

-- 3. experience_ratings: la estrella de cada persona por experiencia ------------
create table public.experience_ratings (
  id            uuid primary key default gen_random_uuid(),
  experience_id uuid not null references public.experiences (id) on delete cascade,
  user_id       uuid not null references public.profiles (id) on delete cascade,
  rating        numeric(2, 1) not null check (rating >= 1 and rating <= 5),
  created_at    timestamptz not null default now(),
  unique (experience_id, user_id)   -- una nota por persona y experiencia
);
create index experience_ratings_exp_idx on public.experience_ratings (experience_id);

-- 4. photos: ahora ligadas a la experiencia ------------------------------------
create table public.photos (
  id            uuid primary key default gen_random_uuid(),
  experience_id uuid not null references public.experiences (id) on delete cascade,
  storage_path  text not null,
  caption       text,
  created_at    timestamptz not null default now()
);
create index photos_experience_idx on public.photos (experience_id);

-- 5. Vista resumen por restaurante (para pins y tarjetas) ----------------------
-- security_invoker: respeta el RLS del usuario que consulta.
create or replace view public.restaurant_summaries
with (security_invoker = true) as
select
  r.id                       as restaurant_id,
  count(distinct e.id)       as experiences_count,
  round(avg(er.rating), 1)   as avg_rating,
  max(e.visited_on)          as last_visited_on
from public.restaurants r
left join public.experiences e on e.restaurant_id = r.id
left join public.experience_ratings er on er.experience_id = e.id
group by r.id;

grant select on public.restaurant_summaries to authenticated;

-- 6. Row Level Security --------------------------------------------------------
-- Data compartida entre los dos: todos leen todo. Cada uno escribe lo suyo.
alter table public.experiences        enable row level security;
alter table public.experience_ratings enable row level security;
alter table public.photos             enable row level security;

-- experiences: lectura y edición compartidas; borra quien la creó.
drop policy if exists experiences_select on public.experiences;
create policy experiences_select on public.experiences
  for select to authenticated using (true);

drop policy if exists experiences_insert on public.experiences;
create policy experiences_insert on public.experiences
  for insert to authenticated with check (created_by = auth.uid());

drop policy if exists experiences_update on public.experiences;
create policy experiences_update on public.experiences
  for update to authenticated using (true) with check (true);

drop policy if exists experiences_delete_own on public.experiences;
create policy experiences_delete_own on public.experiences
  for delete to authenticated using (created_by = auth.uid());

-- experience_ratings: cada uno solo su propia nota.
drop policy if exists exp_ratings_select on public.experience_ratings;
create policy exp_ratings_select on public.experience_ratings
  for select to authenticated using (true);

drop policy if exists exp_ratings_write_own on public.experience_ratings;
create policy exp_ratings_write_own on public.experience_ratings
  for all to authenticated
  using (user_id = auth.uid())
  with check (user_id = auth.uid());

-- photos: compartidas (cualquiera de los dos suma/saca fotos de la experiencia).
drop policy if exists photos_all on public.photos;
create policy photos_all on public.photos
  for all to authenticated using (true) with check (true);

-- ============================================================================
-- Fin de la migración 0002.
-- ============================================================================
