# Pendientes / Backlog

Lista viva de lo que falta, ordenada por prioridad. El plan por fases está en `roadmap.md`;
esto es la vista práctica de "qué sigue".

Última actualización: 2026-07-06 (noche).

---

## ✅ Entrega 2 — el Diario y el uso en el celular (COMPLETA)

Lo más importante para que la app se sienta completa y cómoda en mobile. Todo hecho; solo
falta que habilites **"Places API (New)"** en Google Cloud para que ande el buscador.

- [x] **Diario (timeline)**: ver todas las experiencias, lo más nuevo arriba, en tarjetas
      con la doble puntuación, el plato y la nota. Es el "ver nuestras experiencias".
- [x] **Tocar un pin** → panel de detalle del lugar: sus visitas (historial), promedio y
      las notas de cada uno.
- [x] **Elegir un lugar YA existente** al agregar (para sumar otra visita sin duplicar el
      pin). Resuelto vía el detalle del pin → botón "Sumar visita acá" (modo existente del
      alta, sin volver a pedir nombre/barrio/ubicación).
- [x] 📸 **Subir fotos por experiencia** — uploader (multi-foto, con preview) en el alta →
      Supabase Storage (bucket `photos`) → se muestran en la tarjeta del Diario y en el detalle.
- [x] 📍 **Centrar el mapa en tu ubicación (GPS)** al abrir — gratis (geolocalización del
      navegador) + botón "mi ubicación" para recentrar. Si no hay permiso, queda en Buenos Aires.
- [x] 🔎 **Buscar el lugar con Places autocomplete** — escribís el nombre y lo elegís (trae
      ubicación y barrio solos, prellena el alta). Con session tokens el costo es mínimo.
      ⚠️ **Requiere habilitar "Places API (New)" en Google Cloud** para que funcione (ver
      `docs/setup-google-maps.md`); hasta entonces el buscador muestra un aviso.

## 🧭 Navegación

- [x] Barra de navegación (mobile) para alternar **Mapa / Diario** (y a futuro Recomendar /
      Perfil). Resuelto con estado local (sin react-router aún): el mapa queda montado y
      oculto al pasar al Diario, para no gastar cargas de Google Maps. Sumar **react-router**
      cuando haya más vistas o haga falta deep-linking.

## ✏️ Gestión de experiencias

- [x] **Doble puntuación en el alta**: una estrella por cada uno; el que carga pone las dos
      (van a comer juntos). Requiere la migración `0003_ratings_shared.sql`.
- [x] **Editar experiencia**: fecha, plato, nota, fotos (agregar/quitar) y las puntuaciones,
      desde el Diario y el detalle (botón "Editar").
- [x] **Borrar experiencia** (con confirmación) desde el Diario y el detalle. Los dos pueden
      borrar (migración `0004_experiences_shared_delete.sql`).
- [ ] **Borrar un lugar** (restaurante) entero.
- [ ] **Tags** por restaurante (parrilla, pizza, café…) con UI de chips.
- [x] **Medias estrellas** en la carga (input 1–5 con medias, ej. 4.5; mín. 1 por el CHECK).

## 🔍 Explorar

- [ ] **Filtros**: por barrio, tag, puntuación.
- [x] **Estadísticas / resumen**: resumen arriba del Diario (lugares, visitas, barrio top,
      promedio de cada uno, mejor puntuado). Falta "mejor del mes" y cortes por período.

## 👥 Grupos de comida (Fase escalado — ver ADR-010)

- [ ] **Grupos de usuarios que comen juntos** ("nosotros dos", "los del laburo", "la familia").
      Al puntuar se elige el grupo y se cargan las notas de cada miembro. Hoy el "grupo" son
      los dos usuarios, implícito. La base ya soporta N notas por experiencia → es una capa de
      membresía encima, sin reescribir. Recién tiene sentido con más de dos personas.

## 💡 Recomendaciones y descubrimiento (Fase 3 — ver `recomendaciones.md`)

- [ ] **Motor propio**: sugerir desde nuestra data por zona (lo mejor puntuado).
- [ ] **Descubrimiento con Places**: lugares nuevos cerca, con rating real de Google.
- [ ] **Bodegones por barrio** (idea de Caro): que la app diga qué bodegones tenemos/hay en
      cada barrio. Requiere **tags** (marcar "bodegón") + agrupar por barrio (data propia), y
      a futuro descubrir nuevos con Places por barrio. CABA = 48 barrios / 15 comunas.
- [x] **Mapa coloreado por barrio** (idea de Caro): toggle "Barrios" en el mapa → pinta los
      48 barrios de CABA (choropleth verde agua) según cuántos lugares visitamos en cada uno,
      con leyenda y tocar un barrio muestra su nombre + cantidad. GeoJSON oficial simplificado
      en `public/caba-barrios.geojson` (se carga solo al activar). Conteo por punto-en-polígono
      (lat/lng), no por texto. **Falta:** vista por **comuna** y cruzar con **tag "bodegón"**
      (hoy cuenta todos los lugares, no solo bodegones — necesita tags).

## 🎨 Pulido y marca

- [ ] **Pins con estilo de marca** (AdvancedMarker + Map ID) en verde agua, en vez del pin
      rojo default de Google.
- [ ] **Estados de carga** (skeletons) y **estados vacíos** lindos.
- [ ] **Perfil**: editar nombre y avatar.

## 📱 Infraestructura

- [x] **PWA**: instalable en el celular ("Agregar a pantalla de inicio") + ícono de marca
      (tenedor/cuchillo en verde agua) + service worker con auto-update (`vite-plugin-pwa`).
      Íconos generados con `@vite-pwa/assets-generator` desde `public/logo.svg`.
- [ ] (Opcional) **Dominio propio** en Vercel en vez de `*.vercel.app`.
- [ ] (Opcional) **shadcn/ui** completo si queremos más componentes.

---

## ⚠️ Deuda técnica / cosas a tener en cuenta

- **‼️ Correr `0005_courses_and_price.sql` en Supabase (SQL Editor → Run).** Cambia el modelo
  de platos (entrada compartida + precio en `experiences`; principal/postre por persona en
  `experience_ratings`; saca `dish`). **Hasta correrla, el Diario y el detalle tiran error**
  (el front pide columnas que aún no existen).
- **Correr en Supabase la migración `0003_ratings_shared.sql`** (SQL Editor → Run). Sin ella,
  guardar la nota del otro falla por RLS (cada uno solo podría escribir la suya).
- **Correr en Supabase la migración `0004_experiences_shared_delete.sql`** (SQL Editor → Run).
  Sin ella, borrar una experiencia que cargó el otro falla por RLS.
- **Cerrar el registro en Supabase**: Auth → "Allow new users to sign up" → OFF (candado B).
  El frontend ya esconde el "Creá una cuenta", pero el bloqueo real es este toggle. Así nadie
  nuevo puede registrarse ni disparar la API. Confirmar también que solo esté el proveedor
  Email (sin logins sociales).
- **Blindaje de costo (Google)**: verificar topes de cuota diarios + alerta de presupuesto
  US$1 + restricción de key por dominio (ver `setup-google-maps.md`). Es lo que garantiza
  cero cobro pase lo que pase.

- El "Agregar" del mapa siempre crea un lugar nuevo; para sumar a uno existente se entra por
  el pin → "Sumar visita acá". (No hay merge de duplicados si ya se crearon dos pins iguales.)
- El barrio se carga a mano (sin reverse geocoding).
- Si algún día cambia el dominio de Vercel, hay que **agregarlo a las restricciones de la
  key de Google Maps** (si no, el mapa no carga).
- Las variables de entorno viven en dos lados: `.env` (local) y **Vercel** (producción). Si
  cambia una key, hay que actualizarla en Vercel y volver a deployar.
