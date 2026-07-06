-- ============================================================================
-- Gordillos Club — Migración 0003
-- La doble puntuación: que CUALQUIERA de los dos pueda cargar/editar las notas
-- de una experiencia (la propia y la del otro), porque van a comer juntos y uno
-- solo carga la salida con las dos estrellas.
-- ============================================================================
-- Aplicar en Supabase: SQL Editor → pegar todo → Run.
-- Modelo de confianza de pareja: data compartida entre los dos.
-- La unicidad (experience_id, user_id) sigue garantizando UNA nota por persona.
-- ============================================================================

-- Antes: cada uno solo escribía su propia fila (user_id = auth.uid()).
-- Ahora: los dos usuarios de confianza pueden escribir cualquier nota.
drop policy if exists exp_ratings_write_own on public.experience_ratings;

create policy exp_ratings_write on public.experience_ratings
  for all to authenticated
  using (true)
  with check (true);

-- ============================================================================
-- Fin de la migración 0003.
-- ============================================================================
