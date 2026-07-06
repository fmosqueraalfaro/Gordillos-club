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

## ADR-007 — Identidad visual: fríos + verde agua, tipografía editorial
- **Fecha:** 2026-07-06
- **Estado:** Aceptada
- **Decisión:** sistema de diseño con **tonos fríos** (no pastel) y **verde agua** (`#0FB4A3`)
  como único acento vibrante; **modo claro por defecto** + toggle a oscuro (persistido).
  Tipografía: **Fraunces** (display, editorial/gastronómica) + **Hanken Grotesk** (cuerpo),
  self-hosteadas vía Fontsource. Firma del producto: la **doble puntuación** (él/ella).
- **Por qué:** el usuario rechazó el look pastel teal genérico; quería algo frío, con
  carácter y verde agua. Se siguió la skill `frontend-design` (evitar defaults, gastar la
  audacia en un solo lugar = la firma).
- **Alternativas descartadas:** paleta pastel (rechazada por el usuario); Inter como body
  (demasiado genérico).

## ADR-008 — Nombre del producto: Gordillos Club
- **Fecha:** 2026-07-06
- **Estado:** Aceptada
- **Decisión:** el producto se llama **Gordillos Club** ("gordillos" = forma cariñosa de
  "gordos de comer"). El repo/carpeta mantiene el codename `Restaurant-Judge`.
- **Por qué:** nombre personal y cálido, con aire de "club de dos socios". Elegido entre
  varias opciones (Comité Gordillo, Los Gordillos, Ruta Gordilla).

## ADR-009 — Modelo "experiencias/diario" (no solo lugares)
- **Fecha:** 2026-07-06
- **Estado:** Aceptada
- **Decisión:** la unidad central es la **experiencia** (una visita), no el restaurante.
  Jerarquía: `restaurants` (pin del mapa) 1─N `experiences` (visita: fecha, plato, nota,
  fotos) 1─N `experience_ratings` (la estrella de cada persona). Las experiencias son
  **compartidas** (una salida de los dos) y cada uno pone su nota. Se registra el **plato**.
  Reemplaza la tabla `reviews` de 0001 (migración `0002_experiences.sql`).
- **Por qué:** el usuario quería "ver sus experiencias" y pensar en comidas, no en lugares
  estáticos. Un diario está hecho de eventos, soporta volver al mismo lugar, y es más
  emotivo. La doble puntuación (firma) pasa a vivir en cada experiencia.
- **Alternativas descartadas:** solo lugares con una puntuación por persona (más simple,
  pero pierde el diario y las visitas repetidas); experiencias individuales por persona
  (se prefirió compartida, acorde al "club de dos").

## ADR-010 — Doble nota compartida: uno carga las dos (grupos, diferido)
- **Fecha:** 2026-07-06
- **Estado:** Aceptada
- **Decisión:** como salen a comer **juntos y en persona**, el que carga una experiencia pone
  **las dos estrellas** (la suya y la del otro) en el mismo formulario; y desde el detalle
  cualquiera puede **editar** las notas después. Para habilitarlo, la RLS de
  `experience_ratings` pasa de "cada uno solo su fila" a **los dos pueden escribir cualquier
  nota** (modelo de confianza de pareja) → migración `0003_ratings_shared.sql`. La unicidad
  `(experience_id, user_id)` sigue garantizando UNA nota por persona.
- **Por qué:** es como se usa de verdad (uno anota mientras charlan). Pedir que cada uno entre
  con su cuenta a poner su nota era fricción innecesaria para dos personas de confianza.
- **Grupos (diferido):** se evaluó generalizar a **"grupos de comida"** (círculos de usuarios
  que comen juntos, y al puntuar se cargan las notas de todos los miembros). Se **difiere a la
  fase de escalado**: para dos personas el "grupo" son ellos dos, implícito. La base ya guarda
  **N notas por experiencia** (una fila por persona), así que grupos es una capa de membresía
  que se suma **encima sin reescribir**. Ver `docs/pendientes.md` (sección futuro).
- **Alternativas descartadas:** cada uno carga su nota desde su cuenta (más seguro pero con
  fricción); sistema de grupos ahora (sobredimensionado para dos usuarios).
