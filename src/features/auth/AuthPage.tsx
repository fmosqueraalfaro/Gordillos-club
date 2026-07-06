import { useState } from "react"
import type { FormEvent } from "react"
import { useAuth } from "@/features/auth/AuthProvider"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"

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
          setInfo("¡Cuenta creada! Revisá tu email para confirmarla y después iniciá sesión.")
          setMode("login")
        }
      } else {
        await signIn(email, password)
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Algo salió mal. Probá de nuevo.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <main className="grid min-h-dvh place-items-center px-6">
      <div className="w-full max-w-sm">
        <div className="mb-8 flex flex-col items-center gap-3 text-center">
          <div className="grid size-16 place-items-center rounded-3xl bg-aqua text-3xl shadow-sm">
            🍽️
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-brand-ink dark:text-brand">
            Restaurant Judge
          </h1>
          <p className="text-sm text-teal-800/60 dark:text-teal-100/60">
            Nuestro mapa de restaurantes por barrio.
          </p>
        </div>

        <form
          onSubmit={handleSubmit}
          className="flex flex-col gap-3 rounded-2xl border border-teal-200/50 bg-white/70 p-6 shadow-sm backdrop-blur dark:border-teal-800/30 dark:bg-white/5"
        >
          {isRegister && (
            <label className="flex flex-col gap-1.5 text-sm font-medium text-brand-ink dark:text-teal-100">
              Nombre
              <Input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                placeholder="Cómo querés que te muestre"
                required
                autoComplete="name"
              />
            </label>
          )}

          <label className="flex flex-col gap-1.5 text-sm font-medium text-brand-ink dark:text-teal-100">
            Email
            <Input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="vos@email.com"
              required
              autoComplete="email"
            />
          </label>

          <label className="flex flex-col gap-1.5 text-sm font-medium text-brand-ink dark:text-teal-100">
            Contraseña
            <Input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
              autoComplete={isRegister ? "new-password" : "current-password"}
            />
          </label>

          {error && (
            <p className="rounded-lg bg-rose-100 px-3 py-2 text-sm text-rose-700 dark:bg-rose-500/15 dark:text-rose-300">
              {error}
            </p>
          )}
          {info && (
            <p className="rounded-lg bg-emerald-100 px-3 py-2 text-sm text-emerald-700 dark:bg-emerald-500/15 dark:text-emerald-300">
              {info}
            </p>
          )}

          <Button type="submit" disabled={busy} className="mt-1">
            {busy ? "Un momento…" : isRegister ? "Crear cuenta" : "Iniciar sesión"}
          </Button>
        </form>

        <p className="mt-4 text-center text-sm text-teal-800/70 dark:text-teal-100/60">
          {isRegister ? "¿Ya tenés cuenta?" : "¿Primera vez?"}{" "}
          <button
            type="button"
            onClick={() => {
              setMode(isRegister ? "login" : "register")
              setError(null)
              setInfo(null)
            }}
            className="font-medium text-brand-ink underline underline-offset-4 hover:opacity-80 dark:text-brand"
          >
            {isRegister ? "Iniciá sesión" : "Creá una cuenta"}
          </button>
        </p>
      </div>
    </main>
  )
}
