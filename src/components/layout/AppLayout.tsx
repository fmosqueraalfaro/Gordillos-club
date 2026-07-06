import type { ReactNode } from "react"
import { useAuth } from "@/features/auth/AuthProvider"
import { Button } from "@/components/ui/Button"
import { ThemeToggle } from "@/components/ui/ThemeToggle"

export function AppLayout({ children }: { children: ReactNode }) {
  const { profile, user, signOut } = useAuth()
  const name = profile?.display_name ?? user?.email ?? "Vos"

  return (
    <div className="flex min-h-dvh flex-col">
      <header className="sticky top-0 z-10 border-b border-border bg-paper/80 backdrop-blur">
        <div className="mx-auto flex w-full max-w-3xl items-center justify-between gap-3 px-4 py-3">
          <a href="/" className="flex items-baseline gap-2">
            <span className="font-display text-lg font-semibold tracking-tight text-ink">
              Gordillos Club
            </span>
            <span className="hidden text-xs font-medium uppercase tracking-[0.16em] text-aqua sm:inline">
              diario de mesa
            </span>
          </a>
          <div className="flex items-center gap-2">
            <span className="hidden text-sm text-muted sm:inline">{name}</span>
            <ThemeToggle />
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
