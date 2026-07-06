# Modelo de datos

Base: **Supabase (Postgres + PostGIS)**. Cuentas individuales (un login por persona).
Filosofía: el **restaurante es un lugar único**; las **reseñas son por persona**.

---

## Diagrama conceptual

```
profiles (1) ───< reviews >─── (1) restaurants
                    │                  │
                    └──< photos >──────┘   (una foto pertenece a una review)
```

- Un `restaurant` puede tener muchas `reviews` (una por cada persona).
- Un `profile` puede escribir muchas `reviews` (una por cada restaurante que visitó).
- Restricción única: un usuario deja **una sola** reseña por restaurante
  (`UNIQUE (restaurant_id, user_id)`). Si vuelve, edita esa reseña o agregamos "visitas"
  como tabla aparte en el futuro.

---

## Tablas

### `profiles`
Extiende `auth.users` de Supabase (que ya maneja email/password).

| Columna | Tipo | Notas |
|---|---|---|
| `id` | uuid (PK) | = `auth.users.id` |
| `display_name` | text | Nombre a mostrar (ej. "Fran", "Novia") |
| `avatar_url` | text | Opcional |
| `created_at` | timestamptz | default now() |

### `restaurants`
El lugar físico. Único por ubicación. Compartido entre los dos usuarios.

| Columna | Tipo | Notas |
|---|---|---|
| `id` | uuid (PK) | |
| `name` | text | Nombre del restaurante |
| `lat` | double precision | Latitud |
| `lng` | double precision | Longitud |
| `geom` | geography(Point) | PostGIS, para consultas "cerca de" |
| `neighborhood` | text | Barrio / zona (ej. "Palermo") |
| `city` | text | Opcional |
| `tags` | text[] | ej. {pizza, sushi, cafe} |
| `google_place_id` | text | Opcional — vincula con Google Places |
| `created_by` | uuid (FK profiles) | Quién lo agregó |
| `created_at` | timestamptz | default now() |

> `geom` se puede completar automáticamente desde `lat`/`lng` con un trigger.

### `reviews`
La reseña de una persona sobre un restaurante. **El corazón de la app.**

| Columna | Tipo | Notas |
|---|---|---|
| `id` | uuid (PK) | |
| `restaurant_id` | uuid (FK restaurants) | |
| `user_id` | uuid (FK profiles) | |
| `rating` | numeric(2,1) | Puntuación **escala 1–5** (estrellas). Admite medias (ej. 4.5). CHECK entre 1 y 5. |
| `comment` | text | Comentario libre |
| `visited_on` | date | Fecha de la visita |
| `created_at` | timestamptz | default now() |
| `updated_at` | timestamptz | |

Restricción: `UNIQUE (restaurant_id, user_id)`.

### `photos`
Fotos de platos/lugar. Se guardan en **Supabase Storage**; acá va la referencia.

| Columna | Tipo | Notas |
|---|---|---|
| `id` | uuid (PK) | |
| `review_id` | uuid (FK reviews) | A qué reseña pertenece |
| `storage_path` | text | Path en el bucket de Storage |
| `caption` | text | Opcional |
| `created_at` | timestamptz | default now() |

---

## Consultas típicas

- **Pins del mapa:** todos los `restaurants` + su rating promedio (`AVG(reviews.rating)`).
- **"A él 5★, a ella 3★":** `reviews` de un restaurante, agrupadas por `user_id`.
- **Filtrar por barrio:** `WHERE neighborhood = 'Palermo'`.
- **Recomendación propia por zona:** restaurantes de una zona ordenados por rating promedio.
- **Cercanía (PostGIS):** `ST_DWithin(geom, punto, radio)` para "cerca de acá".

---

## Seguridad (RLS — Row Level Security)

Supabase permite políticas por fila. Para esta fase (dos personas de confianza):
- Ambos usuarios pueden **leer** todos los restaurantes y reseñas (es data compartida).
- Un usuario solo puede **crear/editar/borrar SUS propias** reseñas y fotos
  (`user_id = auth.uid()`).
- Los restaurantes los puede crear cualquiera de los dos; editar, definir según preferencia.

> Cuando se escale a multiusuario público, RLS será la pieza clave para aislar datos entre
> cuentas. Por eso conviene dejarlo bien desde el arranque.
