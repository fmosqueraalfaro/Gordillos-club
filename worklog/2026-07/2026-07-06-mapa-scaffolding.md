# 2026-07-06 — Mapa: andamiaje (Google Maps)

Decisión del usuario: ir por el mapa primero.

## Qué se hizo
- Instalada la librería **`@vis.gl/react-google-maps`** (wrapper oficial para React).
- `features/restaurants/types.ts` (tipo `Restaurant`) + `useRestaurants.ts` (hook que lee
  de Supabase; hoy devuelve [] porque no hay datos).
- `features/map/MapView.tsx`: mapa a pantalla completa centrado en Buenos Aires, con
  `<Marker>` por restaurante. Si falta `VITE_GOOGLE_MAPS_API_KEY`, muestra un panel amable
  ("Falta conectar Google Maps") en vez de romperse.
- `AppLayout` ahora acepta `bleed` (pantalla completa, sin el contenedor centrado) para el
  mapa; `App.tsx` renderiza `<AppLayout bleed><MapView/></AppLayout>`.
- `HomeView` queda sin usar por ahora (se reutilizará como vista de lista más adelante).

## Verificación
- `npm run build` → OK (tipado limpio con la librería de mapas).
- Sin key: la app muestra el panel de fallback (no crashea).

## Pendientes
- 👤 **Sacar la API key de Google Maps** (con salvaguardas) y pegarla en `.env` como
  `VITE_GOOGLE_MAPS_API_KEY`. Ver `docs/setup-google-maps.md`.
- Marker con estilo de marca (AdvancedMarker + mapId) — mejora posterior.
- Alta de restaurante (click en el mapa / búsqueda con Places) + puntuación: próximo paso
  grande, una vez que el mapa renderice con la key.

## Próximo paso
- Con la key puesta: verificar que el mapa carga, y construir el alta de restaurantes
  (Places autocomplete + click en mapa) con la puntuación 1–5.
