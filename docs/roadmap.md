# Roadmap

Plan de trabajo por fases. Marcamos con ✅ a medida que avanzamos.

---

## Fase 0 — Diseño y documentación ✅
- [x] Definir la idea y el alcance.
- [x] Elegir stack tecnológico.
- [x] Documentar visión, modelo de datos, recomendaciones y setup de Google Maps.

## Fase 1 — Fundaciones ✅ (casi completa)
- [x] Scaffold del frontend: Vite + React + TypeScript.
- [x] Tailwind CSS v4 (shadcn/ui se pospuso; primitivos propios por ahora).
- [x] Proyecto en Supabase (DB + Auth + Storage).
- [x] Esquema de base de datos + RLS (migraciones 0001 y 0002).
- [x] Google Maps conectado (con restricción de key).
- [x] Identidad visual (paleta fría + verde agua, claro/oscuro, tipografía).
- [ ] Configurar PWA (vite-plugin-pwa).
- [ ] Deploy inicial en Vercel/Cloudflare.

## Fase 2 — Núcleo funcional (en curso)
- [x] Login / registro (una cuenta por persona).
- [x] Mapa con Google Maps a pantalla completa.
- [x] **Entrega 1:** alta de experiencia tocando el mapa (nombre, barrio, fecha, plato,
      nota, tu puntuación) → pin en el mapa.
- [ ] **Entrega 2 — el Diario y sus complementos:**
  - [ ] **Diario**: timeline de experiencias con tarjetas + doble puntuación.
  - [ ] Tocar un pin → detalle del lugar + historial de visitas.
  - [ ] Elegir un lugar YA existente para sumar otra visita.
  - [ ] 📸 **Subir fotos por experiencia** (Supabase Storage — bucket y tabla ya listos).
  - [ ] 📍 **Centrar el mapa en tu ubicación (GPS)** al abrir — gratis (geolocalización del
        navegador). Clave para usar desde el celular parado en el lugar.
  - [ ] 🔎 **Buscar el lugar con Places autocomplete** (funciona en mobile; con session
        tokens el costo es mínimo). Requiere habilitar "Places API (New)".
- [ ] Filtros (barrio / tag / puntuación).

## Fase 3 — Recomendaciones
- [ ] Motor propio (mejor puntuado por zona).
- [ ] Descubrimiento con Google Places (lugares nuevos + rating real).
- [ ] Cruce (ocultar los ya visitados).

## Fase 4 — Pulido
- [ ] UI/UX fina, animaciones, estados vacíos lindos.
- [ ] Optimización mobile / instalación PWA.
- [ ] Testing de los flujos principales.

## Fase 5 — Futuro (solo si se decide escalar)
- [ ] Multiusuario público.
- [ ] Compartir listas / perfiles.
- [ ] Evaluar planes pagos según tráfico.

---

## Próximo paso concreto
**Entrega 2**: arrancar por el **Diario** (ver las experiencias) y **subir fotos**.
