# Pendientes / Backlog

Lista viva de lo que falta, ordenada por prioridad. El plan por fases está en `roadmap.md`;
esto es la vista práctica de "qué sigue".

Última actualización: 2026-07-06 (tarde).

---

## 🎯 Entrega 2 — el Diario y el uso en el celular (lo próximo)

Lo más importante para que la app se sienta completa y cómoda en mobile:

- [x] **Diario (timeline)**: ver todas las experiencias, lo más nuevo arriba, en tarjetas
      con la doble puntuación, el plato y la nota. Es el "ver nuestras experiencias".
- [x] **Tocar un pin** → panel de detalle del lugar: sus visitas (historial), promedio y
      las notas de cada uno.
- [ ] **Elegir un lugar YA existente** al agregar (para sumar otra visita sin duplicar el
      pin). Hoy cada alta crea un lugar nuevo.
- [ ] 📸 **Subir fotos por experiencia** (el bucket `photos` y la tabla ya están listos en
      Supabase; falta el uploader + mostrarlas en la tarjeta/detalle).
- [x] 📍 **Centrar el mapa en tu ubicación (GPS)** al abrir — gratis (geolocalización del
      navegador) + botón "mi ubicación" para recentrar. Si no hay permiso, queda en Buenos Aires.
- [ ] 🔎 **Buscar el lugar con Places autocomplete** — escribís el nombre y lo elegís (trae
      ubicación y barrio solos). Requiere habilitar **"Places API (New)"** en Google Cloud.
      Con session tokens el costo es mínimo.

## 🧭 Navegación

- [x] Barra de navegación (mobile) para alternar **Mapa / Diario** (y a futuro Recomendar /
      Perfil). Resuelto con estado local (sin react-router aún): el mapa queda montado y
      oculto al pasar al Diario, para no gastar cargas de Google Maps. Sumar **react-router**
      cuando haya más vistas o haga falta deep-linking.

## ✏️ Gestión de experiencias

- [ ] **Editar** y **borrar** una experiencia / un lugar.
- [ ] **Tags** por restaurante (parrilla, pizza, café…) con UI de chips.
- [ ] **Medias estrellas** en la carga (la base ya admite 4.5; hoy el input es de 1 a 5
      enteros).

## 🔍 Explorar

- [ ] **Filtros**: por barrio, tag, puntuación.
- [ ] **Estadísticas / resumen**: cuántos lugares, barrio favorito, promedio, "mejor del
      mes", etc.

## 💡 Recomendaciones (Fase 3 — ver `recomendaciones.md`)

- [ ] **Motor propio**: sugerir desde nuestra data por zona (lo mejor puntuado).
- [ ] **Descubrimiento con Places**: lugares nuevos cerca, con rating real de Google.

## 🎨 Pulido y marca

- [ ] **Pins con estilo de marca** (AdvancedMarker + Map ID) en verde agua, en vez del pin
      rojo default de Google.
- [ ] **Estados de carga** (skeletons) y **estados vacíos** lindos.
- [ ] **Perfil**: editar nombre y avatar.

## 📱 Infraestructura

- [ ] **PWA**: instalable en el celular ("Agregar a pantalla de inicio") + ícono propio
      (`vite-plugin-pwa`).
- [ ] (Opcional) **Dominio propio** en Vercel en vez de `*.vercel.app`.
- [ ] (Opcional) **shadcn/ui** completo si queremos más componentes.

---

## ⚠️ Deuda técnica / cosas a tener en cuenta

- Cada alta crea un lugar nuevo (falta el "elegir existente" — arriba).
- El barrio se carga a mano (sin reverse geocoding).
- El input de estrellas es de enteros (la DB admite medias).
- Si algún día cambia el dominio de Vercel, hay que **agregarlo a las restricciones de la
  key de Google Maps** (si no, el mapa no carga).
- Las variables de entorno viven en dos lados: `.env` (local) y **Vercel** (producción). Si
  cambia una key, hay que actualizarla en Vercel y volver a deployar.
