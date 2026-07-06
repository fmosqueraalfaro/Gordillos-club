# Bitácora de decisiones (ADR liviano)

Registro de las decisiones importantes: **qué** decidimos, **por qué**, y **qué alternativas**
descartamos. Formato liviano tipo ADR (Architecture Decision Record). Orden cronológico.

> Regla: cuando tomamos una decisión que cambia el rumbo (stack, datos, servicios, alcance),
> se agrega una entrada acá. No se borran; si algo se revierte, se agrega una entrada nueva
> que lo explica.

---

## ADR-001 — Stack base
- **Fecha:** 2026-07-05
- **Estado:** Aceptada
- **Decisión:** Frontend React + Vite + TypeScript; Tailwind + shadcn/ui; Supabase (DB +
  Auth + Storage); hosting en Vercel/Cloudflare; PWA para mobile.
- **Por qué:** stack estándar, gratis para uso personal, escalable a futuro sin reescribir.
- **Alternativas descartadas:** Next.js (más pesado de lo necesario para arrancar); Firebase
  (Supabase da Postgres relacional + PostGIS, mejor para nuestra data).

## ADR-002 — Cuentas individuales
- **Fecha:** 2026-07-05
- **Estado:** Aceptada
- **Decisión:** cada persona tiene su propia cuenta (no una compartida).
- **Por qué:** habilita ver "a él 8, a ella 6", promedios y coincidencias. Data más rica.
- **Alternativas descartadas:** cuenta compartida única (más simple, pero pierde el "quién
  puntuó qué", que es parte de la gracia).

## ADR-003 — Fotos de platos/lugares
- **Fecha:** 2026-07-05
- **Estado:** Aceptada
- **Decisión:** se pueden subir fotos, guardadas en Supabase Storage.
- **Por qué:** suma mucho al recuerdo; entra en el free tier (1 GB).

## ADR-004 — Mapas: Google Maps en vez de OpenStreetMap
- **Fecha:** 2026-07-05
- **Estado:** Aceptada
- **Decisión:** usar Google Maps JavaScript API + Google Places API. Requiere cuenta de
  facturación con tarjeta.
- **Por qué:** el usuario aceptó poner tarjeta mientras no haya cobro. El uso de dos personas
  cae holgado en el free tier 2026 (10.000 cargas de mapa/mes + 10.000 eventos Places/mes).
  Ventaja decisiva: **Google Places tiene ratings de calidad reales**, que OSM no tiene →
  mejora la feature de "descubrir lugares nuevos".
- **Condición obligatoria:** blindar contra cobros con topes de cuota diarios + alerta de
  presupuesto US$1 + restricción de API key por dominio (ver `setup-google-maps.md`).
- **Alternativas descartadas:** Leaflet + OpenStreetMap (gratis sin tarjeta, pero sin ratings
  de calidad para recomendar).

## ADR-005 — Recomendaciones en dos vías
- **Fecha:** 2026-07-05
- **Estado:** Aceptada
- **Decisión:** (1) motor propio desde nuestra data por zona + (2) descubrimiento de lugares
  nuevos con Google Places.
- **Por qué:** la vía propia es útil desde el día 1 y es el corazón; la de Places aporta
  descubrimiento con ratings reales. Se complementan.

## ADR-006 — Escala de puntuación 1–5
- **Fecha:** 2026-07-05
- **Estado:** Aceptada
- **Decisión:** la puntuación es una escala **1 a 5 (estrellas)**, con medias estrellas
  admitidas (ej. 4.5). En la DB: `numeric(2,1)` con CHECK entre 1 y 5.
- **Por qué:** las estrellas 1–5 son universalmente entendibles, alineadas con Google, y
  fáciles de mostrar en mobile. Descartamos 0–10 por ser menos visual.
