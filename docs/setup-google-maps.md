# Setup de Google Maps sin cobros sorpresa

Google Maps pide una cuenta de facturación con tarjeta, PERO el uso de dos personas cae
holgadamente dentro del free tier. Este documento es el **checklist obligatorio** para que
NUNCA haya un cobro, aunque haya un bug o alguien robe la key.

---

## Contexto de costos (2026)

- Free tier por API: **10.000 cargas de mapa/mes** (Maps JavaScript API) y **10.000 eventos
  de Places/mes** (tier Essentials).
- Estimación de uso real (dos personas): **cientos por mes**, no miles.
- Conclusión: **sin costo real.** Las redes de seguridad de abajo son por las dudas.

---

## Checklist de seguridad (hacer TODO esto en Google Cloud Console)

### 1. Crear proyecto y activar facturación
- Crear un proyecto nuevo dedicado (ej. "restaurant-judge").
- Activar la cuenta de facturación (pide tarjeta).

### 2. Habilitar solo las APIs necesarias
- Maps JavaScript API
- **Places API (New)** ← necesaria para el buscador de restaurantes (autocomplete). Es la
  versión nueva; buscar en la biblioteca de APIs *"Places API (New)"* y habilitarla. Sin
  esto, el buscador del mapa muestra un aviso y no trae resultados (el resto de la app anda).
- Geocoding API (si se usa)
- ❌ No habilitar nada más (menos superficie = menos riesgo).

> **Costo del buscador:** usamos *session tokens*, así que una búsqueda entera (varias teclas
> + elegir el lugar) se cobra como un solo evento. Con el tope diario del punto 3 y el uso de
> dos personas, queda dentro del free tier.

### 3. 🔒 Topes de cuota diarios (LA red más importante)
En *APIs & Services → cada API → Quotas*, poner un límite diario bajo. Ejemplo:
- Map loads: **300/día**
- Places requests: **300/día**

> Aunque un bug dispare la API en loop, al llegar al tope la API deja de responder. Es
> imposible que te cobren: preferís que la app falle un rato antes que un cobro.

### 4. 🔔 Alerta de presupuesto
En *Billing → Budgets & alerts*:
- Crear presupuesto de **US$1**.
- Alerta por email al 50% y 100%.

> Si alguna vez algo registra costo, te enterás el mismo día.

### 5. 🔑 Restringir la API key
En *APIs & Services → Credentials → tu key*:
- **Application restriction:** HTTP referrers → solo tu dominio (y `localhost` para
  desarrollo).
- **API restriction:** solo las APIs de arriba.

> Así, si la key se filtra (va en el frontend, es visible), nadie puede usarla desde otro
> sitio.

### 6. Key en variable de entorno
- La key va en `.env` (`VITE_GOOGLE_MAPS_API_KEY=...`), **nunca** hardcodeada ni commiteada.
- `.env` en `.gitignore`.
- En Vercel/Cloudflare, cargarla como variable de entorno del proyecto.

---

## Resumen

| Red de seguridad | Protege contra |
|---|---|
| Topes de cuota diarios | Bugs / loops que disparan la API |
| Alerta de presupuesto US$1 | Enterarte de cualquier costo al instante |
| Restricción de key por dominio | Robo/uso de la key desde afuera |
| Key en `.env` | Filtrar el secreto en el repo |

Con las cuatro, el peor caso posible es que la app deje de andar unas horas. **Nunca un
cobro inesperado.**
