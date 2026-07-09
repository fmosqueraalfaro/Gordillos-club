import { useState } from "react"
import type { FormEvent, ReactNode } from "react"
import { useAuth } from "@/features/auth/AuthProvider"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Contours } from "@/components/brand/Contours"
import { ThemeToggle } from "@/components/ui/ThemeToggle"

export function AuthPage() {
  const { signIn } = useAuth()
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  // El registro está cerrado a propósito: Gordillos Club es de dos. Los nuevos
  // registros se bloquean también en Supabase (Auth → "Allow new users to sign up").
  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setBusy(true)
    try {
      await signIn(email, password)
    } catch (err) {
      setError(err instanceof Error ? err.message : "No pudimos completar la acción. Probá de nuevo.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="relative grid min-h-dvh place-items-center overflow-hidden px-6 py-10">
      <div className="absolute right-5 top-5 z-10">
        <ThemeToggle />
      </div>

      {/* Atmósfera: anillos de zona en verde agua, muy tenue */}
      <Contours className="pointer-events-none absolute -top-40 left-1/2 h-[640px] w-[640px] -translate-x-1/2 text-aqua opacity-[0.10]" />

      <div className="relative w-full max-w-sm">
        <header className="mb-8 text-center">
          <p className="text-xs font-semibold uppercase tracking-[0.2em] text-aqua">
            Diario de mesa
          </p>
          <h1 className="mt-2 font-display text-4xl font-semibold leading-none tracking-tight text-ink">
            Gordillos Club
          </h1>
          <p className="mt-3 text-sm text-muted">
            Nuestro mapa de restaurantes, barrio por barrio.
          </p>
        </header>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 rounded-2xl border border-border bg-surface/80 p-6 shadow-sm backdrop-blur"
        >
          <Field label="Email">
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vos@email.com"
              required
              autoComplete="email"
            />
          </Field>

          <Field label="Contraseña">
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              autoComplete="current-password"
            />
          </Field>

          {error && (
            <p className="rounded-lg bg-rose-500/10 px-3 py-2 text-sm text-rose-600 dark:text-rose-300">
              {error}
            </p>
          )}

          <Button type="submit" disabled={busy} className="mt-1">
            {busy ? "Un momento…" : "Entrar"}
          </Button>
        </form>

        <p className="mt-5 text-center text-xs text-muted">
          Club privado de dos. El registro está cerrado.
        </p>
        <p className="mt-2 text-center text-xs text-pink-500">
          Para Pili, te quiero mucho 💗
        </p>
      </div>
    </main>
  )
}

function Field({ label, children }: { label: string; children: ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm font-medium text-ink">
      {label}
      {children}
    </label>
  )
}
