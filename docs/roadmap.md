# Roadmap

Plan de trabajo por fases. Marcamos con ✅ a medida que avanzamos.

---

## Fase 0 — Diseño y documentación ✅ (en curso)
- [x] Definir la idea y el alcance.
- [x] Elegir stack tecnológico.
- [x] Documentar visión, modelo de datos, recomendaciones y setup de Google Maps.
- [ ] Definir estructura de carpetas del proyecto.

## Fase 1 — Fundaciones
- [ ] Scaffold del frontend: Vite + React + TypeScript.
- [ ] Configurar Tailwind CSS + shadcn/ui.
- [ ] Crear proyecto en Supabase (DB + Auth + Storage).
- [ ] Aplicar el esquema de base de datos (`docs/modelo-datos.md`) + RLS.
- [ ] Configurar Google Maps con el checklist de seguridad (`docs/setup-google-maps.md`).
- [ ] Configurar PWA (vite-plugin-pwa).
- [ ] Deploy inicial en Vercel/Cloudflare (aunque sea un "hola mundo").

## Fase 2 — Núcleo funcional
- [ ] Login / registro (una cuenta por persona).
- [ ] Mapa con Google Maps mostrando restaurantes visitados.
- [ ] Alta de restaurante (pin en mapa + autocompletado Places + barrio + tags).
- [ ] Crear/editar reseña propia (puntuación + comentario + fecha).
- [ ] Vista de detalle: "a él X, a ella Y" + promedio.
- [ ] Subir fotos (Supabase Storage).
- [ ] Historial + filtros (barrio, tag, puntuación, usuario).

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
Definir la **estructura de carpetas** y hacer el **scaffold de Vite** (Fase 1).
