# 2026-07-06 (noche 6) — Mapa coloreado por barrio (choropleth)

Idea de Caro: un mapa que pinte los barrios según dónde ya visitamos, en vez de solo pins.

## Qué se hizo
- **Datos:** bajé el GeoJSON oficial de los **48 barrios de CABA**
  (cdn.buenosaires.gob.ar), lo simplifiqué (redondeo a 4 decimales, solo `nombre`+`comuna`):
  723 KB → **195 KB**. Queda en `public/caba-barrios.geojson` y se carga **solo al activar la
  capa** (no infla el bundle; no está en el precache del SW).
- **`features/map/geo.ts`:** punto-en-polígono (ray casting) + `countByBarrio` — cuenta cuántos
  lugares caen en cada barrio por **lat/lng** (robusto; no depende del texto del barrio).
- **`features/map/BarriosLayer.tsx`:** dibuja los polígonos con `map.data`, estilo choropleth
  (un solo tono verde agua, opacidad por cantidad), **leyenda** (0·1·2·3·4+) y al **tocar** un
  barrio muestra nombre + cantidad. Limpia los features al desactivar.
- **`MapView.tsx`:** toggle **"Barrios"** (abajo-izquierda). Al activarlo, se oculta el
  buscador y aparece la capa + leyenda.

## Verificación
- `tsc -b`, `oxlint`, `vite build` → verde. GeoJSON presente en `dist/`.
- Sin migración (todo frontend + asset estático).

## Deuda / próximo
- Hoy cuenta **todos los lugares** por barrio; para "bodegones por barrio" hace falta **tags**
  (marcar "bodegón") y filtrar el conteo por ese tag.
- Falta la vista por **comuna** (15) como alternativa a barrios (48).
- Pin de marca (verde agua) para diferenciar mejor sobre el choropleth.
