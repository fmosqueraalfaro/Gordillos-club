# Gordillos Club 🍽️

App personal para registrar en un mapa los restaurantes que visitamos por zona/barrio,
puntuarlos, dejar comentarios y ver el historial. Uso personal (dos personas) con posible
escalado futuro a nivel producto/ventas.

> **Nombre del producto:** Gordillos Club ("gordillos" = forma cariñosa de "gordos de
> comer"). El repo/carpeta conserva el codename original `Restaurant-Judge` por historia;
> en la UI y de cara al usuario siempre es **Gordillos Club**.

> Este archivo es el contexto principal del proyecto. Se lee al iniciar cada sesión.
> Mantenerlo actualizado y prolijo. Las decisiones detalladas viven en `docs/`.

---

## 1. Visión

- **Qué es:** un "diario de restaurantes" sobre un mapa. Pineamos dónde fuimos, por barrio,
  con puntuación + comentario + fecha + fotos, y podemos ver el historial y recomendaciones.
- **Para quién (hoy):** uso personal, dos usuarios (una pareja). Cada uno con su cuenta.
- **A futuro (fase escalado):** multiusuario público / producto. NO se construye ahora,
  pero el stack elegido lo soporta sin reescribir.

### Principios rectores
1. **Costo cero en la práctica.** Uso personal de dos personas cae holgadamente dentro de
   los free tiers. Donde un servicio pida tarjeta (Google Maps), se configuran topes de
   cuota y alertas para que NUNCA haya un cobro sorpresa. Ver `docs/setup-google-maps.md`.
2. **Mobile-first / PWA.** Se tiene que sentir como una app nativa en el celular, instalable
   desde "Agregar a pantalla de inicio", sin pasar por las tiendas.
3. **UI hermosa y amigable.** Prolijo, simple, agradable de usar.
4. **Prolijidad y documentación.** Cada decisión importante queda documentada en `docs/`.

---

## 2. Stack tecnológico

| Pieza | Elección | Motivo |
|---|---|---|
| Frontend | **React + Vite + TypeScript** | Rápido, estándar, escalable. TS evita bugs. |
| Estilos / UI | **Tailwind CSS + shadcn/ui** | UI linda y consistente, mobile-first. |
| Mapa | **Google Maps JavaScript API** | Mapa lindo, Street View, mejor geocoding. Free tier: 10.000 cargas/mes. |
| Descubrir lugares | **Google Places API** | Ratings de calidad reales para recomendar lugares nuevos. |
| Backend + DB + Auth + Storage | **Supabase** (free tier) | Postgres + PostGIS + Auth + Storage de fotos, gratis. |
| Consultas geográficas | **PostGIS** (dentro de Supabase) | "Restaurantes cerca de este punto" de verdad. |
| Hosting | **Vercel** o **Cloudflare Pages** | Deploy gratis, HTTPS, dominio incluido. |
| Mobile | **PWA** (vite-plugin-pwa) | Instalable, sin costo, sin tiendas. |

### Sobre el costo de Google Maps (importante)
- Free tier 2026: **10.000 cargas de mapa/mes** + **10.000 eventos de Places/mes**. Uso de
  dos personas ≈ cientos por mes → sin costo real.
- **Obligatorio en el setup:** topes de cuota diarios + alerta de presupuesto en US$1 +
  restricción de API key por dominio. Detalle paso a paso en `docs/setup-google-maps.md`.

---

## 3. Funcionalidades

### Núcleo (Fase 1 — lo que construimos primero)
- [ ] Auth con Supabase — **una cuenta por persona** (login individual).
- [ ] Mapa (Google Maps) mostrando los restaurantes visitados como pins.
- [ ] Agregar experiencia: elegir/crear el lugar (Places o click en mapa) + fecha + **plato**
      + nota + la puntuación 1–5 de cada uno.
- [ ] **Diario**: timeline de experiencias (lo más nuevo arriba).
- [ ] Detalle de un lugar: historial de experiencias ahí.
- [ ] Subir **fotos** por experiencia (Supabase Storage).
- [ ] Filtrar por barrio / tag / puntuación.
- [ ] PWA instalable + responsive mobile-first.

### Recomendaciones (las dos vías — ver `docs/recomendaciones.md`)
- [ ] **Motor propio:** recomienda desde la data propia por zona (lo mejor puntuado).
- [ ] **Descubrimiento con Google Places:** lugares nuevos en una zona que aún no visitamos,
      **con rating de calidad real** de Google.

### Fase 2 / futuro (documentar, NO construir aún)
- [ ] Multiusuario público / compartir listas.
- [ ] Escalado a producto / ventas (planes pagos recién con tráfico real).

---

## 4. Modelo de datos (resumen)

Detalle completo en `docs/modelo-datos.md`. Idea central:

- `profiles` — usuarios (extiende auth de Supabase).
- `restaurants` — el **lugar** (único por ubicación): pin del mapa. nombre, lat/lng, barrio,
  tags, `google_place_id`.
- `experiences` — **una visita** a un lugar: fecha, plato, nota. Un lugar tiene muchas.
- `experience_ratings` — la estrella de **cada persona** sobre una experiencia (1–5).
- `photos` — fotos de una experiencia (archivo en Supabase Storage).

Modelo **diario**: las experiencias son compartidas (una salida de los dos) y cada uno pone
su nota → la doble puntuación vive en cada experiencia. Ver `docs/modelo-datos.md`.

---

## 5. Estado del proyecto

- **Fase actual:** 🏗️ Fase 2 — Núcleo funcional (en curso).
- **En vivo:** 🌐 https://gordillos-club-swart.vercel.app/ · Repo:
  https://github.com/fmosqueraalfaro/Gordillos-club (`main`, auto-deploy en cada push).
- **Hecho:** documentación; scaffold; Supabase (esquema 0001+0002 verificado); auth + layout;
  identidad visual (fríos + verde agua, claro/oscuro, Fraunces+Hanken, firma doble puntuación);
  nombre Gordillos Club; **mapa Google Maps**; **alta de experiencia** (tocar el mapa →
  nombre/barrio/fecha/plato/nota/estrellas → pin); **Diario (timeline)**; **navegación
  Mapa/Diario**; **detalle del lugar al tocar el pin** (historial + promedio); **GPS**
  (centrado al abrir + botón "mi ubicación"); **sumar visita a un lugar existente** (desde
  el detalle del pin, sin duplicar). Deploy en Vercel funcionando en el celular.
- **Próximo paso:** Entrega 2 (resto) — 📸 **fotos** por experiencia + 🔎 **Places search**.
  Ver `docs/pendientes.md`.
- Ver último detalle en `worklog/2026-07/2026-07-06-sumar-visita-existente.md`.

---

## 6. Convenciones

- Idioma de trabajo y documentación: **español**.
- Código y nombres de variables/archivos: **inglés** (estándar).
- Commits: mensajes claros, en presente. (Definir convención al iniciar el repo.)
- Toda decisión de arquitectura importante se registra en `docs/`.
- Secretos (API keys) NUNCA en el repo → variables de entorno (`.env`, ignorado por git).

---

## 7. Documentación relacionada

- `docs/contexto.md` — historia, norte del producto, alcance y glosario.
- `docs/protocolo-trabajo.md` — cómo trabajamos (flujo, "definición de hecho", cómo actúa Claude).
- `docs/decisiones.md` — bitácora de decisiones (ADR: qué se decidió y por qué).
- `docs/modelo-datos.md` — esquema de base de datos detallado.
- `docs/recomendaciones.md` — cómo funcionan las dos vías de recomendación.
- `docs/setup-google-maps.md` — configurar Google Maps de forma segura (sin cobros sorpresa).
- `docs/roadmap.md` — plan de trabajo por fases.
- `worklog/` — bitácora de trabajo por fecha (ver `worklog/README.md`).

> Al iniciar una sesión, leer `CLAUDE.md` + la última entrada del `worklog/` para retomar
> el hilo. Al cerrar una sesión con avances, dejar una entrada nueva en el `worklog/`.
