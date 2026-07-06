# Modelo de datos

Base: **Supabase (Postgres + PostGIS)**. Cuentas individuales (un login por persona).
Filosofía: **diario de experiencias sobre el mapa**. El restaurante es el *lugar* (pin);
cada visita es una *experiencia* con su plato, notas y fotos.

Migraciones: `0001_initial_schema.sql` (base) + `0002_experiences.sql` (modelo actual).

---

## Diagrama conceptual

```
restaurants (lugar / pin en el mapa)
    │ 1
    │
    │ N
experiences (una visita: fecha, plato, nota)
    ├─ N experience_ratings   (la estrella de cada persona)
    └─ N photos               (fotos de esa experiencia)
```

- Un `restaurant` puede tener muchas `experiences` (si vuelven, suman otra).
- Una `experience` es **compartida** (una salida de los dos) y tiene hasta 2
  `experience_ratings` (la nota de cada uno) → así vive la **doble puntuación**.
- Las `photos` cuelgan de la experiencia.

---

## Tablas

### `profiles`
Extiende `auth.users`. (Sin cambios respecto de 0001.)

| Columna | Tipo | Notas |
|---|---|---|
| `id` | uuid (PK) | = `auth.users.id` |
| `display_name` | text | Nombre a mostrar |
| `avatar_url` | text | Opcional |

### `restaurants`
El lugar físico, único por ubicación. El nodo del mapa.

| Columna | Tipo | Notas |
|---|---|---|
| `id` | uuid (PK) | |
| `name` | text | |
| `lat` / `lng` | double precision | |
| `geom` | geography(Point) | PostGIS, para "cerca de" (trigger desde lat/lng) |
| `neighborhood` | text | Barrio / zona |
| `city` | text | Opcional |
| `tags` | text[] | ej. {parrilla, pizza} |
| `google_place_id` | text | Vincula con Google Places |
| `created_by` | uuid (FK profiles) | |

### `experiences`  ⭐ (el corazón del diario)
Una visita/comida a un restaurante.

| Columna | Tipo | Notas |
|---|---|---|
| `id` | uuid (PK) | |
| `restaurant_id` | uuid (FK restaurants) | |
| `visited_on` | date | Fecha de la visita (default hoy) |
| `starter` | text | **Entrada compartida** (una por experiencia). Mig. 0005. |
| `price` | numeric(10,2) | **La cuenta** (total de la salida). Mig. 0005. |
| `note` | text | Comentario / anécdota |
| `created_by` | uuid (FK profiles) | Quién la cargó |
| `created_at` / `updated_at` | timestamptz | |

> El viejo campo único `dish` se reemplazó (mig. 0005): la **entrada** es compartida (acá),
> y el **principal** y el **postre** son **de cada uno** (en `experience_ratings`).

### `experience_ratings` (lo de cada persona)
La puntuación **y los platos** de cada persona sobre una experiencia.

| Columna | Tipo | Notas |
|---|---|---|
| `id` | uuid (PK) | |
| `experience_id` | uuid (FK experiences) | |
| `user_id` | uuid (FK profiles) | |
| `rating` | numeric(2,1) | 1–5 estrellas (admite 4.5). CHECK 1–5. |
| `main` | text | **Principal** de esa persona. Mig. 0005. |
| `dessert` | text | **Postre** de esa persona (opcional). Mig. 0005. |
| — | — | `UNIQUE (experience_id, user_id)` |

### `photos`
Fotos de una experiencia. El archivo vive en Supabase Storage (bucket `photos`).

| Columna | Tipo | Notas |
|---|---|---|
| `id` | uuid (PK) | |
| `experience_id` | uuid (FK experiences) | |
| `storage_path` | text | Path en el bucket |
| `caption` | text | Opcional |

### `restaurant_summaries` (vista)
Resumen por restaurante para pins/tarjetas: `experiences_count`, `avg_rating`,
`last_visited_on`. Definida con `security_invoker` (respeta el RLS del usuario).

---

## Consultas típicas

- **Diario (timeline):** `experiences` ordenadas por `visited_on desc`, con su restaurante,
  sus ratings y fotos.
- **Pins del mapa:** `restaurants` + `restaurant_summaries` (promedio y cantidad de visitas).
- **Detalle de un lugar:** sus `experiences` (historial de visitas).
- **"Él ★4.5 / Ella ★5" de una experiencia:** sus `experience_ratings` por `user_id`.
- **Cercanía (PostGIS):** `ST_DWithin(geom, punto, radio)`.

---

## Seguridad (RLS)

Dos personas de confianza, data compartida:
- **Leer:** todo lo pueden leer ambos (restaurantes, experiencias, ratings, fotos).
- **experiences:** las crea/edita cualquiera de los dos; las borra quien las creó.
- **experience_ratings:** cada uno solo escribe **su propia** nota (`user_id = auth.uid()`).
- **photos:** compartidas (cualquiera suma/saca fotos de la experiencia).

> Al escalar a multiusuario público, el RLS será la pieza clave para aislar datos entre
> parejas/cuentas. Por eso conviene dejarlo prolijo desde ahora.
