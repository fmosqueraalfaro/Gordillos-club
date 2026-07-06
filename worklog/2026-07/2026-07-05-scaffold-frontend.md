# 2026-07-05 — Scaffold del frontend

Segunda tanda del día: armamos el esqueleto del frontend y lo dejamos corriendo.

## Qué se hizo
- Scaffold oficial con Vite → **React 19.2 + TypeScript 6 + Vite 8** (lint con oxlint).
- Renombrado el proyecto a `restaurant-judge`.
- **Tailwind CSS v4** con el plugin `@tailwindcss/vite` (setup moderno, sin `tailwind.config.js`).
- Alias de imports `@/` → `src` (en `vite.config.ts` y `tsconfig.app.json`).
- Base para shadcn/ui: instalado `clsx` + `tailwind-merge` y creado `src/lib/utils.ts` (helper `cn`).
- Limpieza de la demo de Vite (`App.css`, `assets/`), `App.tsx` de arranque propio.
- Paleta definida: **pastel con tintes verdes y verde agua** (teal). Tokens en `index.css`
  (`--color-brand` verde agua, `--color-aqua`, `--color-mint`, `--color-sage`).
- HTML: `lang="es"`, título "Restaurant Judge 🍽️", theme-color.

## Verificación
- `npm run build` → OK (TS + Tailwind + alias compilan limpio).
- `npm run dev` → server en http://localhost:5173, responde 200 y renderiza la app.
- Entorno: Node v20.20.2, npm 10.8.2.

## Problemas / pendientes
- ✅ Resuelto: TypeScript 6 deprecó `baseUrl` en tsconfig → se quitó, los `paths` relativos
  funcionan solos.
- Inicializar git (aún no es repo). Pendiente de confirmar con el usuario.
- Definir estructura de carpetas por feature (features/, components/, pages/…).
- Instalar/inicializar shadcn/ui cuando armemos los primeros componentes de UI.

## Próximo paso
- Inicializar git + primer commit.
- Empezar Fase 1 propiamente: proyecto en Supabase + esquema de base de datos, o primero
  el layout base + navegación de la app. A decidir con el usuario.
