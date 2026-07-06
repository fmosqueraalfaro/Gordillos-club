import type { ReactNode } from "react"
import { useAuth } from "@/features/auth/AuthProvider"
import { Button } from "@/components/ui/Button"

export function AppLayout({ children }: { children: ReactNode }) {
  const { profile, user, signOut } = useAuth()
  const name = profile?.display_name ?? user?.email ?? "Vos"

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-10 border-b border-teal-200/50 bg-white/70 backdrop-blur dark:border-teal-800/30 dark:bg-[#0f1917]/70">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-3 px-4 py-3">
          <div className="flex items-center gap-2">
            <span className="grid size-9 place-items-center rounded-xl bg-aqua text-lg shadow-sm">
              🍽️
            </span>
            <span className="font-semibold tracking-tight text-brand-ink dark:text-brand">
              Restaurant Judge
            </span>
          </div>
          <div className="flex items-center gap-3">
            <span className="hidden text-sm text-teal-800/70 sm:inline dark:text-teal-100/70">
              Hola, {name} 👋
            </span>
            <Button variant="ghost" onClick={() => void signOut()}>
              Salir
            </Button>
          </div>
        </div>
      </header>

      <main className="mx-auto w-full max-w-3xl flex-1 px-4 py-6">{children}</main>
    </div>
  )
}
