# 2026-07-06 (tarde) — Diario + Navegación + Detalle de pin + GPS

Arranque de la **Entrega 2**: el primer bloque, todo gratis y sin config externa.

## Qué se hizo

- **Navegación Mapa / Diario** (`components/layout/BottomNav.tsx`): barra inferior
  mobile-first con dos tabs. Estado local en `App.tsx` (sin react-router todavía).
  - El mapa queda **siempre montado** y solo se oculta (`invisible`) al pasar al Diario,
    para **no gastar cargas de Google Maps** al alternar. Conserva el tamaño → no se rompe
    al volver.
- **Diario (timeline)** (`features/diary/DiaryView.tsx`): todas las experiencias, de la más
  nueva a la más vieja, en tarjetas con la doble puntuación, el plato y la nota. Con
  skeleton de carga y estado vacío (con botón "Ir al mapa").
- **Detalle del lugar al tocar el pin** (`features/restaurants/RestaurantDetailSheet.tsx`):
  bottom sheet con promedio, cantidad de visitas y el historial de experiencias ahí (con la
  nota de cada uno).
- **GPS** (`MyLocation` dentro de `features/map/MapView.tsx`): centra el mapa en tu
  ubicación al abrir (una sola vez) + botón "mi ubicación" para recentrar. Geolocalización
  del navegador (gratis, requiere HTTPS/localhost). Sin permiso → queda en Buenos Aires.

### Piezas nuevas reutilizables
- `features/experiences/useExperiences.ts` — hook que trae experiencias con lugar + notas de
  cada persona (join a `profiles`). Con `restaurantId` filtra las de un lugar (detalle del
  pin); sin él, el Diario entero.
- `features/experiences/ExperienceCard.tsx` — tarjeta de una experiencia, con `showPlace`
  para el Diario (muestra el lugar) vs. el detalle (muestra la fecha).
- `components/ratings/DualRating.tsx` — generalizado a `RatingStrip` (1 o 2 personas) y
  `ScoreBadge`, manteniendo la firma de la doble puntuación.
- `lib/date.ts` — `formatVisitedOn` (parseo local para evitar el corrimiento de un día por
  zona horaria).
- Íconos nuevos: `MapIcon`, `BookIcon`, `LocateIcon`.

## Verificación
- `tsc -b`, `oxlint` y `vite build` → todo en verde (0 errores, 87 módulos).
- Drive E2E real (login + datos en vivo) pendiente del lado del usuario: la app está detrás
  de auth con Supabase/Maps.

## Detalle a tener en cuenta
- Reposicioné el FAB "Agregar" y sumé el botón de GPS a `bottom-20` para que no los tape la
  barra de navegación.

## Próximo paso
- Resto de la Entrega 2: **elegir lugar existente** al agregar (arregla el duplicado de
  pins), **fotos** por experiencia, y **Places search** (requiere habilitar "Places API
  (New)" en Google Cloud). Ver `docs/pendientes.md`.
