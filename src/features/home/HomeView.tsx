import { useAuth } from "@/features/auth/AuthProvider"

export function HomeView() {
  const { profile, user } = useAuth()
  const name = profile?.display_name ?? user?.email ?? "che"

  return (
    <div className="flex flex-col items-center gap-4 py-16 text-center">
      <div className="text-5xl">🗺️</div>
      <h2 className="text-xl font-semibold text-brand-ink dark:text-teal-100">
        ¡Estás adentro, {name}!
      </h2>
      <p className="max-w-md text-sm text-teal-800/70 dark:text-teal-100/60">
        Acá va a vivir el mapa con los restaurantes que visitamos. Lo armamos en el
        próximo paso. Por ahora, la sesión y el layout ya funcionan. ✅
      </p>
    </div>
  )
}
