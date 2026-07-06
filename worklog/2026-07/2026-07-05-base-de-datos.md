# 2026-07-05 — Base de datos (Supabase) + git

## Qué se hizo
- **git:** inicializado el repo, `.gitignore` reforzado (`.env`, `.env.*`), primer commit
  del scaffold + docs (`27a06c8`).
- **Preferencia del usuario:** los commits van **sin trailer `Co-Authored-By`** de ahora en
  más. Documentado en `docs/protocolo-trabajo.md` y en memoria.
- **Esquema SQL** (`supabase/migrations/0001_initial_schema.sql`), listo para pegar en el
  SQL Editor de Supabase:
  - Tablas: `profiles`, `restaurants`, `reviews`, `photos`.
  - PostGIS + trigger que completa `geom` desde lat/lng + índices (gist, gin, etc.).
  - Trigger `handle_new_user` (crea profile al registrarse) y `updated_at` en reviews.
  - RLS completo (lectura compartida; escritura solo de lo propio).
  - Bucket de Storage `photos` (lectura pública, escritura autenticada) + policies.
- **Frontend:** instalado `@supabase/supabase-js`, creado `src/lib/supabase.ts`,
  `src/env.d.ts` (tipado de env vars), `.env.example`.
- **Guía:** `supabase/README.md` con los pasos que dependen del usuario (👤).

## Verificación
- `npm run build` → OK con el cliente de Supabase y el tipado nuevo.

## Problemas / pendientes
- 👤 Pendiente del usuario: crear el proyecto en Supabase, correr la migración, copiar
  URL + anon key al `.env`. (Ver `supabase/README.md`.)
- Definir estructura de carpetas por feature.
- Instalar shadcn/ui al armar los primeros componentes.

## Próximo paso
- Con Supabase creado y el `.env` cargado: armar **auth** (registro/login) + el layout base
  de la app.
