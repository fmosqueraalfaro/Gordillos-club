# Supabase — Setup

Guía para dejar la base de datos andando. Las partes que requieren tu cuenta están marcadas
con 👤; el resto ya está en el repo.

---

## 1. 👤 Crear el proyecto en Supabase
1. Entrar a https://supabase.com y crear una cuenta (gratis, sin tarjeta).
2. **New project**:
   - Name: `restaurant-judge`
   - Database Password: generá una fuerte y **guardala** (por si la necesitás después).
   - Region: la más cercana (ej. `South America (São Paulo)`).
3. Esperar ~2 min a que se aprovisione.

## 2. Aplicar el esquema
1. En el proyecto → **SQL Editor** → **New query**.
2. Pegar TODO el contenido de `migrations/0001_initial_schema.sql`.
3. **Run**. Debería terminar sin errores (crea tablas, PostGIS, RLS, triggers y el bucket
   de fotos).

## 3. 👤 Activar el login por email
1. **Authentication → Providers → Email**: dejar habilitado.
2. Para uso personal, en **Authentication → Sign In / Providers** conviene **desactivar
   "Confirm email"** (así no tenés que confirmar mails al crear las dos cuentas). Opcional.

## 4. 👤 Conectar el frontend
1. **Project Settings → API**. Copiar:
   - `Project URL` → `VITE_SUPABASE_URL`
   - `anon` `public` key → `VITE_SUPABASE_ANON_KEY`
2. En la raíz del repo: copiar `.env.example` a `.env` y pegar esos dos valores.
3. Listo: `src/lib/supabase.ts` ya lee esas variables.

## 5. 👤 Crear las dos cuentas (vos y tu novia)
Una vez que la app tenga el registro (lo hacemos en el próximo paso de código), cada uno se
crea su usuario. El trigger `handle_new_user` crea el `profile` automáticamente.

---

## Notas
- La `anon key` es pública por diseño (va en el frontend). Lo que protege los datos es el
  **RLS** (Row Level Security), ya configurado en la migración.
- Migraciones futuras: agregar archivos `0002_*.sql`, `0003_*.sql`… en `migrations/` y
  correrlos en orden en el SQL Editor.
- Modelo de datos completo: `../docs/modelo-datos.md`.
