# 2026-07-06 (noche 4) — Editar y borrar experiencias

El usuario ya dejó configurado lo pendiente (registro cerrado, 0003, cuotas Google).

## Qué se hizo

### DB
- `0004_experiences_shared_delete.sql`: borrar experiencias compartido (los dos, no solo el
  creador) + storage update/delete del bucket `photos` compartido. ⚠️ **Correr en Supabase.**

### Datos
- `createExperience.ts`: `updateExperience()` (fecha/plato/nota) y `deleteExperience()`
  (borra la experiencia — cascada de notas y filas de fotos — y limpia los archivos de
  Storage best-effort).
- `photos.ts`: `deletePhotos()` (borra filas + archivos).
- `useExperiences.ts`: la foto ahora incluye `storagePath` (para poder borrar el archivo).

### UI
- `EditExperienceSheet` (nuevo): edita fecha, plato, nota, **fotos** (quitar existentes +
  agregar nuevas) y las **puntuaciones** de cada uno.
- `ExperienceRow` (nuevo, compartido): tarjeta + acciones **Editar** / **Borrar** (con
  confirmación inline "¿Borrar? Sí/No"). Se usa en el Diario y en el detalle del lugar.
- `DiaryView` y `RestaurantDetailSheet` ahora usan `ExperienceRow`. Se eliminó el editor
  inline de puntuaciones del detalle (quedó absorbido por "Editar", un solo camino).

## Verificación
- `tsc -b`, `oxlint`, `vite build` (con PWA) → todo verde.

## Pendiente del usuario
- Correr `0004_experiences_shared_delete.sql` en Supabase (si no, borrar lo que cargó el otro
  falla por RLS).

## Próximo paso
- Fase 3 (recomendaciones) y pulido: filtros, tags, pins de marca, borrar lugar entero.
