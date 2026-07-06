# 2026-07-06 — GitHub + deploy en Vercel (¡en vivo!)

## Qué se hizo
- **GitHub**: creado el repo y conectado. Código pusheado.
  - Repo: https://github.com/fmosqueraalfaro/Gordillos-club (privado)
  - Branch principal: `main`.
- **README** del proyecto (reemplaza el de Vite).
- **Deploy en Vercel**: la app está en vivo.
  - URL: https://gordillos-club-swart.vercel.app/
  - Variables de entorno cargadas en Vercel (Supabase + Google Maps).
  - Dominio de Vercel agregado a las restricciones de la key de Google → el mapa carga.
- **docs/pendientes.md**: backlog completo y priorizado para retomar.

## Verificación
- App en Vercel → HTTP 200, sirve el login.
- Usuario confirmó: ve el login, el mapa carga, "anda todo bastante bien". Probado en cel.

## Flujo de ahora en más
- Auto-deploy: cada `git push` a `main` → Vercel reconstruye y publica solo (~1 min).
- Cambios de variables de entorno: actualizar en Vercel + re-deploy (no alcanza con el push).

## Próximo paso (otro día)
- **Entrega 2**: Diario + fotos + GPS + Places search + elegir lugar existente + pin detail.
  Ver `docs/pendientes.md`.
