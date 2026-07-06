-- ============================================================================
-- Gordillos Club — Migración 0005
-- Platos como los usamos de verdad:
--   * entrada: COMPARTIDA (una por experiencia)
--   * precio: la cuenta total (una por experiencia)
--   * principal + postre: DE CADA UNO (por persona) → viven en la nota de cada uno
-- Reemplaza el viejo campo único `dish`.
-- ============================================================================
-- Aplicar en Supabase: SQL Editor → pegar todo → Run.
-- ============================================================================

-- 1. experiences: entrada compartida + precio total ----------------------------
alter table public.experiences
  add column if not exists starter text,               -- entrada (compartida)
  add column if not exists price   numeric(10, 2);     -- la cuenta (total)

-- Migrar lo que había en dish → entrada (mejor que perderlo; se puede reeditar).
update public.experiences
  set starter = dish
  where dish is not null and (starter is null or starter = '');

alter table public.experiences drop column if exists dish;

-- 2. experience_ratings: principal + postre de cada persona --------------------
alter table public.experience_ratings
  add column if not exists main    text,   -- principal (de cada uno)
  add column if not exists dessert text;   -- postre (de cada uno, opcional)

-- ============================================================================
-- Fin de la migración 0005.
-- ============================================================================
