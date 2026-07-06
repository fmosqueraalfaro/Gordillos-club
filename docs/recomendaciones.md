# Recomendaciones

Objetivo: sugerir dónde comer. Dos vías complementarias, ambas dentro del free tier.

---

## Vía 1 — Motor propio (desde nuestra data)

**Qué hace:** recomienda entre los lugares que YA visitamos, en base a lo que puntuamos alto.

**Cómo:** consulta a nuestra propia base (`reviews` + `restaurants`).

Ejemplos de recomendación:
- "En **Palermo**, lo mejor puntuado por ustedes: Don Julio (9.0), La Mezzetta (8.5)."
- "Para **volver**: lugares con rating alto que no visitan hace mucho."
- "**Coincidencias**: lugares donde los dos pusieron 8+."

**Ventajas:** gratis, instantáneo, personalísimo, útil desde el día 1.
**Límite:** solo recomienda lugares ya conocidos (no descubre nuevos). Para eso, la Vía 2.

---

## Vía 2 — Descubrimiento con Google Places

**Qué hace:** sugiere lugares **nuevos** (que aún no visitamos) en una zona, con **rating de
calidad real** de Google.

**Cómo:** Google Places API — *Nearby Search* / *Text Search* alrededor de un punto o zona,
filtrando por tipo (`restaurant`, `cafe`, etc.).

Ejemplos:
- "Restaurantes bien puntuados **cerca de acá** que todavía no probaron."
- "Sushi en **Belgrano** con 4.5+ estrellas en Google."

**Ventajas:** ratings reales, mapa lindo, autocompletado de direcciones.
**Costo:** dentro del free tier (10.000 eventos/mes). Uso de dos personas → sin costo.
Ver `setup-google-maps.md` para blindar contra cobros.

### Cruce inteligente (lo bueno de juntar las dos vías)
Al descubrir con Places, filtramos los que ya tenemos en nuestra base (por `google_place_id`
o cercanía), así solo mostramos **lugares nuevos**. Y podemos ordenar combinando el rating
de Google con "qué tan lejos de zonas que ya nos gustaron".

---

## Resumen

| | Vía 1 — Propia | Vía 2 — Google Places |
|---|---|---|
| Recomienda | Lugares ya visitados | Lugares nuevos |
| Rating | El nuestro | El de Google (real) |
| Costo | $0 | $0 dentro del free tier |
| Cuándo | Desde el día 1 | Fase 1 (junto con el mapa) |

**Regla de UX:** la Vía 1 es el corazón (es *nuestra* experiencia); la Vía 2 es para
"¿y ahora a dónde vamos?". Las dos conviven en la misma pantalla de recomendaciones.
