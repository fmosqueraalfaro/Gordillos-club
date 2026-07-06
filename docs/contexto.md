# Contexto del proyecto

Este documento es el "porqué" del proyecto: la historia, el norte y el vocabulario común.
Complementa a `CLAUDE.md` (que es más operativo/técnico).

---

## La historia

La idea nace de un uso muy concreto y personal: **anotar a qué restaurantes fuimos con mi
novia, en cada barrio**, poder puntuarlos, dejar un comentario y después mirar el historial
para acordarnos ("¿cómo se llamaba ese lugar de Palermo que nos encantó?").

No es un proyecto "de empresa" que arranca queriendo ser grande. Es una herramienta que
queremos *usar de verdad*. Si funciona y nos gusta, más adelante veremos si tiene sentido
escalarlo a algo más grande (producto/ventas). Pero esa decisión es futura y opcional.

---

## El norte (north star)

> **Que abrir la app y registrar un restaurante que visitamos sea tan fácil y agradable que
> lo hagamos siempre, y que mirar el mapa de "nuestros lugares" nos dé ganas de volver.**

Todo lo que construimos se mide contra eso. Si una feature no ayuda a *registrar más fácil*
o a *disfrutar mirando nuestra data*, probablemente no es prioritaria.

---

## Quién es quién

- **Los usuarios (hoy):** dos personas, una pareja. Cada uno con su cuenta. Se conocen y
  confían entre sí (la data es compartida). No hay "público" todavía.
- **Roles:** ambos son iguales en la app (los dos agregan lugares y reseñan). No hay admin
  vs invitado por ahora.

---

## Alcance

### Dentro del alcance (lo que la app SÍ hace)
- Registrar restaurantes visitados sobre un mapa, por zona/barrio.
- Puntuar y comentar, por persona, con fecha y fotos.
- Ver historial y filtrar.
- Recomendar (data propia + descubrimiento con Google Places).

### Fuera del alcance (por ahora — NO construir sin decidirlo)
- Reservas / pedidos / delivery.
- Red social pública, seguir gente, feed.
- Multiusuario abierto / registro público.
- Monetización / pagos.
- App nativa en las tiendas (usamos PWA).

> Mantener este límite claro evita el "scope creep" (que el proyecto crezca sin control y
> no se termine nunca). Si aparece una idea nueva, se anota y se decide si entra.

---

## Principios de producto

1. **Registrar tiene que ser rápido.** El flujo de "agregar un restaurante que visité" es
   el más importante de toda la app. Menos pasos = mejor.
2. **La data propia es el corazón.** Las recomendaciones externas están al servicio de
   nuestra experiencia, no al revés.
3. **Lindo y simple > lleno de features.** Preferimos pocas cosas que se sientan pulidas.
4. **Mobile primero.** Se usa en el celular, saliendo a comer. El desktop es secundario.

---

## Glosario

Vocabulario común para que hablemos (y nombremos en el código) de forma consistente.

| Término | Significado |
|---|---|
| **Restaurante / lugar** (`restaurant`) | El sitio físico. Único por ubicación. Compartido entre los dos. |
| **Reseña** (`review`) | La opinión de UNA persona sobre un restaurante: puntuación + comentario + fecha. |
| **Puntuación / rating** | El número que le pone cada persona (escala a definir, ej. 0–10). |
| **Zona / barrio** (`neighborhood`) | La agrupación geográfica (ej. "Palermo", "Belgrano"). |
| **Tag** | Etiqueta de tipo de comida/lugar (pizza, sushi, café…). |
| **Motor propio** | Recomendación basada en nuestra propia data. |
| **Descubrimiento** | Recomendación de lugares nuevos vía Google Places. |
| **PWA** | App web instalable que se comporta como nativa en el celular. |
