# 2026-07-06 (noche 5) — Platos por persona + precio + abrir experiencia

Feedback de Caro. Cambia el modelo de platos y agrega la vista de detalle.

## Decisiones (ADR-011)
- **Entrada:** compartida (una). **Precio:** la cuenta total. Ambos en `experiences`.
- **Principal** y **postre** (opcional): **de cada uno** → en `experience_ratings` (la fila
  por persona que ya existía). Reemplaza el campo único `dish`.

## Qué se hizo

### DB — `0005_courses_and_price.sql`  ‼️ hay que correrla
- `experiences`: + `starter` (entrada), + `price` numeric(10,2). Backfill `dish` → `starter`.
  Drop `dish`.
- `experience_ratings`: + `main` (principal), + `dessert` (postre).
- **Ojo:** hasta correrla, el Diario/detalle tiran error (el front pide columnas nuevas).

### Datos
- `types.ts`: `PersonEntry {userId, rating, main, dessert}`; `NewExperienceInput` con
  `starter`, `price`, `people[]`.
- `createExperience.ts`: insert/update/upsert con entrada+precio (experiencia) y
  principal/postre por persona; `upsertPeople` (antes `upsertRatings`).
- `useExperiences.ts`: `ExperienceEntry` ahora trae `starter`, `price`, `people[]`
  (rating/main/dessert/name) y `photos`.
- `lib/format.ts`: `formatPrice` (pesos, "$12.500").

### UI
- `AddExperienceSheet` / `EditExperienceSheet`: fecha + **precio**; **entrada** compartida;
  bloque **"lo de cada uno"** con principal + postre + estrellas por persona; fotos; nota.
- `ExperienceCard`: nueva estructura (entrada, precio, principal/postre por persona) y
  **clickeable** (abre el detalle).
- `ExperienceDetailSheet` (nuevo): abre la experiencia con la **foto grande** y todo el
  desglose. Botón "Editar".
- `ExperienceRow`: tocar la tarjeta → detalle; se mantienen Editar / Borrar.
- `DiaryStats` y `RestaurantDetailSheet`: `exp.ratings` → `exp.people`.

## Verificación
- `tsc -b`, `oxlint`, `vite build` (con PWA) → todo verde.
- "No se ve la foto": el detalle ahora muestra la foto grande. Si igual no aparece en una
  experiencia, puede ser que la subida haya fallado antes (best-effort) — reintentar y avisar.

## Ideas de Caro para Fase 3 (documentadas en pendientes)
- **Bodegones por barrio** (qué bodegones tenemos/hay en cada barrio; 48 barrios de CABA).
- **Mapa coloreado por barrio/comuna** (choropleth con los GeoJSON de CABA sobre Google Maps).

## Pendiente del usuario
- **Correr `0005_courses_and_price.sql`** en Supabase (crítico).
