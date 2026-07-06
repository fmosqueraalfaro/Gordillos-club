# Gordillos Club 🍽️

Diario de restaurantes sobre un mapa, para dos. Registramos a dónde fuimos por barrio,
puntuamos con estrellas, dejamos notas y fotos, y vemos nuestras experiencias.

> Uso personal. El nombre de producto es **Gordillos Club**; el repo mantiene el codename
> `Restaurant-Judge` por historia.

## Stack

- **Frontend:** React 19 + Vite + TypeScript + Tailwind CSS v4
- **Backend:** Supabase (Postgres + PostGIS + Auth + Storage)
- **Mapa:** Google Maps (`@vis.gl/react-google-maps`)
- **Tipografía:** Fraunces + Hanken Grotesk

## Desarrollo

```bash
npm install
cp .env.example .env   # y completá los valores reales
npm run dev
```

Variables de entorno (ver `.env.example`):

- `VITE_SUPABASE_URL`, `VITE_SUPABASE_ANON_KEY` — Supabase (Project Settings → API)
- `VITE_GOOGLE_MAPS_API_KEY` — Google Maps (ver `docs/setup-google-maps.md`)

## Base de datos

Las migraciones SQL están en `supabase/migrations/`. Se aplican en el SQL Editor de Supabase.
Ver `supabase/README.md`.

## Documentación

- `CLAUDE.md` — contexto principal del proyecto.
- `docs/` — contexto, modelo de datos, decisiones (ADR), recomendaciones, setup, roadmap.
- `worklog/` — bitácora de trabajo por fecha.

## Scripts

- `npm run dev` — servidor de desarrollo
- `npm run build` — build de producción (typecheck + Vite)
- `npm run preview` — previsualizar el build
- `npm run lint` — oxlint
