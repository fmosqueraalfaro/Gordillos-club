# 2026-07-05 — Diseño y documentación inicial

Primera sesión. Definimos la idea, el stack y dejamos toda la documentación base.

## Qué se hizo
- Definimos la idea: app personal (de a dos) para registrar restaurantes visitados en un
  mapa por barrio, puntuar, comentar, ver historial y recibir recomendaciones.
- Elegimos el stack tecnológico completo.
- Creamos la documentación base del proyecto:
  - `CLAUDE.md` — contexto operativo principal.
  - `docs/contexto.md` — historia, norte, alcance, glosario.
  - `docs/modelo-datos.md` — esquema de base de datos.
  - `docs/recomendaciones.md` — las dos vías de recomendación.
  - `docs/setup-google-maps.md` — configuración segura de Google Maps.
  - `docs/protocolo-trabajo.md` — cómo trabajamos.
  - `docs/decisiones.md` — bitácora de decisiones (ADR).
  - `docs/roadmap.md` — plan por fases.
  - `worklog/` — esta bitácora de trabajo.

## Decisiones tomadas
(Detalle en `docs/decisiones.md`.)
- Stack: React+Vite+TS, Tailwind+shadcn/ui, Supabase, Vercel/Cloudflare, PWA.
- Cuentas individuales (una por persona).
- Fotos con Supabase Storage.
- Mapas con Google Maps + Places (con tarjeta, pero blindado contra cobros).
- Recomendaciones en dos vías (data propia + descubrimiento con Places).

## Problemas / pendientes
- ✅ Node.js instalado: v20.20.2 (npm 10.8.2) — OK para Vite.
- ✅ Escala de puntuación definida: **1–5 estrellas** (con medias). Ver ADR-006.
- Definir estructura de carpetas del frontend.

## Próximo paso
- Fase 1: scaffold del frontend (Vite + React + TypeScript + Tailwind) e inicializar el
  repo git.
