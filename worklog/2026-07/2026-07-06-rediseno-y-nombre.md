# 2026-07-06 — Rediseño visual + nombre "Gordillos Club"

## Qué se hizo
- **Sistema de diseño nuevo** siguiendo la skill `frontend-design` (y sin Mobbin, que no se
  pudo conectar):
  - Paleta **fría + verde agua** (no pastel). Tokens semánticos en `index.css` con
    `@theme inline`, modo claro/oscuro por `data-theme`.
  - **Modo claro por defecto + toggle a oscuro** (`features/theme/ThemeProvider`,
    `components/ui/ThemeToggle`), persistido en localStorage, con script anti-parpadeo en
    `index.html`.
  - Tipografía **Fraunces** (display) + **Hanken Grotesk** (cuerpo), self-hosteadas
    (`@fontsource-variable/*`).
  - Firma del producto: **doble puntuación** (`components/ratings/DualRating`).
  - Componentes: `Button`/`Input` reestilizados, `icons.tsx`, `PlaceCard`, `Contours`
    (anillos de zona de fondo).
  - Rediseñados login, header/layout y home (con tarjetas de ejemplo).
- **Nombre del producto**: pasó a **Gordillos Club** (antes "Restaurant Judge"). Actualizado
  en UI (login, header), `index.html`, `package.json` (`gordillos-club`), `CLAUDE.md` y ADRs.
  El repo/carpeta sigue como codename `Restaurant-Judge`.

## Verificación
- `npm run build` → OK (fuentes empaquetadas, tipado limpio).
- `npm run dev` → HTTP 200, script de tema presente.
- Usuario aprobó el rediseño ("muchísimo mejor, me gustó").

## Pendientes
- Propagar el nombre "Gordillos Club" al resto de docs si se quiere consistencia total
  (por ahora solo CLAUDE.md + código; el resto usa el codename).
- shadcn/ui completo y react-router: cuando haga falta.

## Próximo paso
- **El mapa** (Google Maps) + alta de restaurantes: la funcionalidad central.
