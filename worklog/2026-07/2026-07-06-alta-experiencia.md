# 2026-07-06 — Alta de experiencia (entrega 1)

Migración 0002 verificada en Supabase (experiences/experience_ratings/restaurant_summaries
→ 200; reviews → 404). La novia se hará su propia cuenta (cada uno su estrella).

## Qué se hizo
- **Flujo de alta por "tocar el mapa"** (confiable, sin depender de Places API):
  - `MapView`: botón flotante **＋ Agregar** → modo "placing" (banner "tocá el mapa") →
    click en el mapa captura lat/lng y abre la hoja.
  - `AddExperienceSheet`: nombre del lugar, barrio (opc.), fecha, plato (opc.), nota (opc.),
    y **tu puntuación** (`StarRatingInput` 1–5). Guarda y refresca los pins.
  - `createExperience`: inserta restaurant + experience + tu rating en cadena (respeta RLS).
  - `useRestaurants` ahora expone `reload()`.
- `StarRatingInput` nuevo (estrellas verde agua interactivas).

## Verificación
- `npm run build` → OK.
- El alta real necesita cuentas creadas + navegador → pendiente de test del usuario.

## Decisión / límites de esta entrega
- Ubicación por click en el mapa (no autocompletado). Places autocomplete = entrega 2
  (requiere habilitar "Places API (New)" en Google).
- Cada alta crea un lugar nuevo. Elegir un lugar YA existente para sumar otra visita =
  entrega 2 (junto con el Diario).
- Barrio manual (sin reverse geocoding por ahora).

## Pendientes / próximo
- 👤 Crear las dos cuentas (conviene desactivar "Confirm email" en Supabase) y cargar la
  primera experiencia.
- Entrega 2: **Diario** (timeline de experiencias) + elegir lugar existente + popup al tocar
  un pin + fotos + Places autocomplete.
