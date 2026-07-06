# 2026-07-06 (noche) — Fotos + Búsqueda con Places (Entrega 2 completa)

Se cierra la **Entrega 2** con las dos features que faltaban.

## Qué se hizo

### 📸 Fotos por experiencia
- `features/experiences/photos.ts`: `uploadExperiencePhotos()` (sube al bucket `photos` de
  Supabase Storage en `<userId>/<experienceId>/<uuid>.<ext>` y registra en la tabla `photos`)
  + `photoPublicUrl()` (URL pública, el bucket es público).
- `AddExperienceSheet.tsx`: selector multi-foto con preview (object URLs, se revocan al
  cambiar/desmontar) y botón de quitar. Al guardar, sube las fotos (best-effort: si una foto
  falla, la visita igual queda guardada).
- `useExperiences.ts`: el SELECT ahora trae `photos (id, storage_path, caption)` → se mapean
  a `{ id, url, caption }`.
- `ExperienceCard.tsx`: fila de miniaturas (scroll horizontal) en el Diario y el detalle.

### 🔎 Búsqueda con Places (autocomplete)
- `features/map/PlaceSearch.tsx`: buscador con la **API nueva** (`AutocompleteSuggestion.
  fetchAutocompleteSuggestions` + `place.fetchFields`), con **session tokens** (una sesión =
  varias teclas + un fetchFields → costo mínimo), debounce 300ms, sesgo por `es`/`AR` y por
  los límites visibles del mapa. Deduce el barrio de los `addressComponents`.
- `MapView.tsx`: el buscador va arriba; al elegir un lugar, centra el mapa y abre el alta
  **prellenada** (nombre + barrio + ubicación), editable.
- `AddExperienceSheet.tsx`: modo "new" ahora acepta `prefill` (nombre/barrio).
- Si Places (New) no está habilitada, el buscador muestra un aviso y el resto sigue andando.

### Config
- `tsconfig.app.json`: sumé `"google.maps"` a `types` (el `types: ["vite/client"]` dejaba
  fuera el namespace global `google` que usa el buscador).
- `docs/setup-google-maps.md`: paso para habilitar "Places API (New)" + nota de costo.

## Verificación
- `tsc -b`, `oxlint` y `vite build` → todo en verde.
- **Pendiente del usuario:** habilitar "Places API (New)" en Google Cloud para probar el
  buscador. Las fotos andan sin config extra (el bucket ya existía). Drive E2E real del lado
  del usuario (login + datos).

## Próximo paso
- Fase 3: recomendaciones (motor propio + descubrimiento con Places) y pulido (filtros,
  editar/borrar, tags, medias estrellas, PWA instalable). Ver `docs/pendientes.md`.
