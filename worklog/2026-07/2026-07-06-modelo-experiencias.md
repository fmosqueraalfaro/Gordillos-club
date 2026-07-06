# 2026-07-06 — Modelo de datos: experiencias/diario

Conversación de producto: el usuario definió que la unidad es la **experiencia** (comida/
visita), no el restaurante. Ver `ver mis experiencias` como un diario. Se registra el plato.

## Qué se hizo
- **Migración `0002_experiences.sql`**: reemplaza `reviews` por:
  - `experiences` (visita: restaurant_id, visited_on, dish, note, created_by) — compartidas.
  - `experience_ratings` (rating 1–5 por persona y experiencia; unique).
  - `photos` re-apuntadas a `experience_id`.
  - Vista `restaurant_summaries` (avg_rating, experiences_count, last_visited_on) con
    `security_invoker`.
  - RLS: lectura compartida; ratings solo propios; experiences editables por ambos, borra
    quien creó; photos compartidas.
- Docs actualizadas: `modelo-datos.md` (reescrito), `decisiones.md` (ADR-009), `CLAUDE.md`
  (features + resumen de modelo).

## Decisión de diseño confirmada
- Experiencias **compartidas** (una salida de los dos), cada uno pone su estrella → la doble
  puntuación vive en cada experiencia. El diario es "de los dos".

## Pendientes
- 👤 Correr `0002_experiences.sql` en el SQL Editor de Supabase.
- Frontend: tipos/hooks de experiencias, flujo de alta (Places + click en mapa), vista Diario.

## Próximo paso
- Con la migración aplicada: construir el **alta de experiencia** (elegir lugar + fecha +
  plato + nota + estrellas) y la vista **Diario**.
