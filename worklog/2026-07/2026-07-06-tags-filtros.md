# 2026-07-06 (noche 7) — Tags + Filtros + color del mapa de barrios

Sin migración: `restaurants.tags` (text[]) ya existía desde 0001.

## Qué se hizo

### Tags por lugar
- `components/ui/TagsInput.tsx`: chips quitables + sugeridos (bodegón, parrilla, pizza…) +
  agregar libre (Enter/coma).
- Alta de lugar nuevo (`AddExperienceSheet`): campo Tags → se guardan en `restaurants.tags`.
- Detalle del pin (`RestaurantDetailSheet`): muestra los tags y permite editarlos
  (`updateRestaurantTags`; RLS de restaurants ya es compartida).
- `ExperienceCard`: chips del lugar. `useExperiences` ahora trae `restaurant.tags`.

### Filtros en el Diario
- `DiaryFilters.tsx`: barrio, tag y puntuación mínima (selects). Las opciones se derivan de la
  data. La lista **y** las stats se recalculan con el filtro.

### Mapa de barrios — color + filtro por tag
- Colores nuevos: **ámbar donde no fuimos**, verde agua donde sí (más intenso = más lugares).
  Pedido de la usuaria (resaltar lo pendiente).
- **Filtro por tag** en la capa (dropdown "Sólo: Bodegón") → completa "bodegones por barrio"
  (data propia): ves en qué barrios tenemos bodegones y en cuáles no.

## Verificación
- `tsc -b`, `oxlint`, `vite build` → verde. Sin migración.

## Próximo
- Recomendaciones (motor propio + descubrimiento Places por barrio), vista por comuna, pin de
  marca (para diferenciar sobre el choropleth), borrar lugar, perfil.
