# 2026-07-06 (noche 2) — Doble puntuación: uno carga las dos

El usuario preguntó cómo cargan cada uno su nota (van a comer juntos, uno anota mientras
charlan) y pidió ver la nota de cada uno, no el promedio. También planteó "grupos de comida".

## Decisión
- **Uno carga las dos notas** en el mismo form (con edición posterior). Ver **ADR-010**.
- **Grupos: diferido** a la fase de escalado — para dos personas el grupo son ellos dos,
  implícito, y la base ya soporta N notas por experiencia (se suma encima sin reescribir).

## Qué se hizo
- **DB** `0003_ratings_shared.sql`: RLS de `experience_ratings` pasa de "cada uno solo su
  fila" a "los dos escriben cualquier nota" (confianza de pareja). La unicidad
  `(experience_id, user_id)` sigue asegurando una nota por persona.
  ⚠️ **Hay que correrla en Supabase (SQL Editor → Run).**
- **Alta con doble estrella** (`AddExperienceSheet`): una `StarRatingInput` por perfil
  (`useProfiles` nuevo, trae los dos gordillos, el logueado primero). Se guarda una fila por
  persona con nota > 0. Vale con al menos una cargada.
- **Capa de datos** (`createExperience`): `VisitInput`/`NewExperienceInput` ahora llevan
  `ratings: {userId, rating}[]`. Nuevo `upsertRatings()` para editar (upsert por conflicto;
  nota en 0 = se borra esa fila).
- **Detalle del lugar** (`RestaurantDetailSheet`): el resumen muestra **la nota promedio de
  cada persona** (no un promedio mezclado) + cantidad de visitas. Cada experiencia del
  historial tiene **"Editar puntuaciones"** → editor inline con una estrella por persona.

## Verificación
- `tsc -b`, `oxlint`, `vite build` → verde.
- **Pendiente del usuario:** correr `0003_ratings_shared.sql`. Sin eso, guardar la nota del
  otro falla por RLS.

## Próximo paso
- Fase 3 (recomendaciones) y pulido (filtros, editar/borrar el resto de la experiencia,
  tags, medias estrellas, PWA). Grupos cuando sumen gente. Ver `docs/pendientes.md`.
