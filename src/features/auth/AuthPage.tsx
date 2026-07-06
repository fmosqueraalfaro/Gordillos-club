import { useState } from "react"
import type { FormEvent, ReactNode } from "react"
import { useAuth } from "@/features/auth/AuthProvider"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { Contours } from "@/components/brand/Contours"
import { ThemeToggle } from "@/components/ui/ThemeToggle"

export function AuthPage() {
  const { signIn, signUp } = useAuth()
  const [mode, setMode] = useState<"login" | "register">("login")
  const [displayName, setDisplayName] = useState("")
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [error, setError] = useState<string | null>(null)
  const [info, setInfo] = useState<string | null>(null)
  const [busy, setBusy] = useState(false)

  const isRegister = mode === "register"

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    setError(null)
    setInfo(null)
    setBusy(true)
    try {
      if (isRegister) {
        const { needsConfirmation } = await signUp(email, password, displayName)
        if (needsConfirmation) {
          setInfo("Listo. Te mandamos un mail para confirmar la cuenta; después iniciá sesión.")
          setMode("login")
        }
      } else {
        await signIn(email, password)
      }
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
          {isRegister && (
            <Field label="Nombre">
              <Input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Cómo querés que te muestre"
                required
                autoComplete="name"
              />
            </Field>
          )}

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
              autoComplete={isRegister ? "new-password" : "current-password"}
            />
          </Field>

          {error && (
            <p className="rounded-lg bg-rose-500/10 px-3 py-2 text-sm text-rose-600 dark:text-rose-300">
              {error}
            </p>
          )}
          {info && (
            <p className="rounded-lg bg-aqua/10 px-3 py-2 text-sm text-aqua-ink dark:text-aqua">
              {info}
            </p>
          )}

          <Button type="submit" disabled={busy} className="mt-1">
            {busy ? "Un momento…" : isRegister ? "Crear cuenta" : "Entrar"}
          </Button>
        </form>

        <p className="mt-5 text-center text-sm text-muted">
          {isRegister ? "¿Ya tenés cuenta?" : "¿Primera vez?"}{" "}
          <button
            type="button"
            onClick={() => {
              setMode(isRegister ? "login" : "register")
              setError(null)
              setInfo(null)
            }}
            className="font-semibold text-ink underline decoration-aqua decoration-2 underline-offset-4 hover:text-aqua"
          >
            {isRegister ? "Iniciá sesión" : "Creá una cuenta"}
          </button>
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
