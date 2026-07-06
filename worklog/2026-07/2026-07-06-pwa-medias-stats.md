# 2026-07-06 (noche 3) — Registro cerrado + PWA + medias estrellas + estadísticas

Tanda de pulido y blindaje. El usuario pidió cerrar el registro, PWA, medias estrellas y
estadísticas.

## Qué se hizo

### 🚪 Registro cerrado (candado B en frontend)
- `AuthPage`: se quitó el modo "Crear cuenta"; queda solo login. Nota: "Club privado de dos".
- El bloqueo REAL va en Supabase (Auth → "Allow new users to sign up" → OFF) — pendiente del
  usuario. El frontend solo esconde la opción.

### 📱 PWA instalable
- `vite-plugin-pwa` (registerType autoUpdate) + `@vite-pwa/assets-generator`.
- `public/logo.svg`: ícono de marca (tenedor + cuchillo en verde agua, gradiente petróleo).
- Íconos PNG generados (64/192/512 + maskable 512 + apple-touch 180) con
  `pwa-assets-generator --preset minimal-2023`.
- `vite.config.ts`: manifest (name/short_name/theme_color #0FB4A3/standalone/portrait) +
  workbox (precache del app shell; Supabase y Google van a red, cross-origin).
- `index.html`: apple-touch-icon + metas apple-mobile-web-app + viewport-fit=cover.
- Build genera `sw.js`, `manifest.webmanifest`, `registerSW.js` (25 entradas precacheadas).

### ⭐ Medias estrellas
- `StarRatingInput` reescrito: cada estrella se parte en dos (mitad izq = .5, der = entera).
  Soporta 1, 1.5, … 5. Mínimo 1 (el CHECK de la DB exige rating >= 1), así la primera
  estrella no baja de 1. La base ya guardaba numeric(2,1).

### 📊 Estadísticas
- `DiaryStats` (nuevo): resumen arriba del Diario, calculado de la data ya cargada (sin
  consultas extra): lugares, visitas, barrio top, promedio de cada uno (RatingStrip) y mejor
  puntuado. Se muestra solo si hay experiencias.

## Verificación
- `tsc -b`, `oxlint`, `vite build` (incl. PWA) → todo verde.

## Pendiente del usuario
1. Cerrar registros en Supabase (Auth → "Allow new users to sign up" → OFF; solo proveedor Email).
2. Correr `0003_ratings_shared.sql` (de la tanda anterior).
3. Verificar topes de cuota + alerta de presupuesto en Google Cloud.

## Próximo paso
- Fase 3 (recomendaciones) y pulido restante: filtros, editar/borrar el resto de la
  experiencia, tags, pins de marca. Ver `docs/pendientes.md`.
