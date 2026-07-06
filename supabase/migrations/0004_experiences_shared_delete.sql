-- ============================================================================
-- Gordillos Club — Migración 0004
-- Editar/borrar experiencias como pareja: que CUALQUIERA de los dos pueda
-- borrar una experiencia y sus fotos (no solo quien la cargó). Editar ya era
-- compartido (experiences_update using(true)).
-- ============================================================================
-- Aplicar en Supabase: SQL Editor → pegar todo → Run.
-- Modelo de confianza de pareja (mismo criterio que 0003).
-- ============================================================================

-- experiences: borrar compartido (antes: solo el creador).
drop policy if exists experiences_delete_own on public.experiences;
create policy experiences_delete on public.experiences
  for delete to authenticated using (true);

-- storage: que los dos puedan editar/borrar fotos del bucket compartido
-- (antes: solo el que subió el archivo, owner = auth.uid()).
drop policy if exists photos_bucket_update on storage.objects;
create policy photos_bucket_update on storage.objects
  for update to authenticated using (bucket_id = 'photos') with check (bucket_id = 'photos');

drop policy if exists photos_bucket_delete on storage.objects;
create policy photos_bucket_delete on storage.objects
  for delete to authenticated using (bucket_id = 'photos');

-- ============================================================================
-- Fin de la migración 0004.
-- ============================================================================
