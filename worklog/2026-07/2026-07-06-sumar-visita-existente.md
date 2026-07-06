# 2026-07-06 (tarde 2) — Sumar visita a un lugar existente

Sigue la **Entrega 2**: se arregla la deuda técnica de los pins duplicados.

## Qué se hizo

- **Sumar visita a un lugar YA existente** sin duplicar el pin. Punto de entrada natural:
  tocar el pin → detalle → botón **"Sumar visita acá"**.
  - `createExperience.ts`: se extrajo `insertVisit()` (experiencia + puntuación) y se sumó
    `addVisitToRestaurant()` para atar una visita a un `restaurant_id` existente. `createExperience()`
    (lugar nuevo) sigue igual, ahora reusando el helper.
  - `AddExperienceSheet.tsx`: ahora tiene dos modos (union discriminada por `mode`):
    - `"new"` (default): pide nombre/barrio + ubicación del mapa (como antes).
    - `"existing"`: recibe el `restaurant`; oculta nombre/barrio/ubicación y solo pide
      fecha/plato/nota/estrellas. Título "Sumar visita".
  - `RestaurantDetailSheet.tsx`: botón "Sumar visita acá" → abre el alta en modo existente;
    al guardar refresca el historial (`reload`) y avisa al mapa (`onChanged`).

## Verificación
- `tsc -b`, `oxlint` y `vite build` → todo en verde.
- Drive E2E (login + datos) pendiente del lado del usuario.

## Detalle / deuda
- El "Agregar" del mapa sigue creando siempre lugar nuevo; para sumar a uno existente se
  entra por el pin. No hay merge de duplicados si ya se crearon dos pins iguales antes.

## Próximo paso
- Resto de la Entrega 2: 📸 **fotos** por experiencia (bucket `photos` ya existe) y
  🔎 **Places search** (requiere habilitar "Places API (New)" en Google Cloud).
