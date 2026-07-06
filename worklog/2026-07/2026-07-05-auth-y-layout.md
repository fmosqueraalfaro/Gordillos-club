# 2026-07-05 — Auth + Layout base

## Qué se hizo
- Estructura por feature: `src/features/{auth,home}`, `src/components/{ui,layout}`.
- **Primitivos de UI** propios (evitando el instalador interactivo de shadcn):
  `components/ui/Button.tsx`, `components/ui/Input.tsx`, con la paleta pastel verde agua.
- **AuthProvider** (`features/auth/AuthProvider.tsx`): maneja sesión (getSession +
  onAuthStateChange), carga el `profile`, y expone `signIn` / `signUp` / `signOut` +
  hook `useAuth`.
- **AuthPage** (`features/auth/AuthPage.tsx`): formulario login/registro con toggle,
  manejo de errores, mensaje de confirmación de email, estados de carga.
- **AppLayout** (`components/layout/AppLayout.tsx`): header con nombre de usuario + botón
  Salir, contenedor centrado.
- **HomeView** (`features/home/HomeView.tsx`): placeholder para el mapa (próximo paso).
- **App.tsx**: "auth gate" (loading → sin sesión = login → con sesión = layout+home).
- **main.tsx**: envuelto en `<AuthProvider>`.

## Verificación
- `npm run build` → OK (69 módulos, tipado limpio).
- `npm run dev` → HTTP 200.
- Auth de Supabase alcanzable: login inválido → 400 `invalid_credentials` (key válida).
- Config de auth: `mailer_autoconfirm: false` → **confirmación de email ACTIVADA**.

## Problemas / pendientes
- 👤 **Recomendado**: en Supabase → Authentication → desactivar "Confirm email" para que el
  registro loguee directo (uso personal). La app funciona igual con confirmación activada.
- 👤 Registrarse desde el navegador (vos y tu novia) para crear las cuentas reales.
- Verificar (después del primer registro real) que el trigger `handle_new_user` creó el
  `profile`. No se testeó con usuario real para no mandar emails a direcciones falsas
  (Supabase bloquea `example.com`).
- Pendiente técnico: enrutador (react-router) cuando haya varias vistas; set completo de
  shadcn/ui si se quiere.

## Próximo paso
- Con las cuentas creadas: arrancar el **mapa** (Google Maps) y el alta de restaurantes.
