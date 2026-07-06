import { cn } from "@/lib/utils"

function App() {
  return (
    <main className="min-h-dvh flex flex-col items-center justify-center gap-6 px-6 text-center">
      <div className="grid size-20 place-items-center rounded-3xl bg-aqua text-4xl shadow-sm">
        🍽️
      </div>
      <h1 className="text-3xl font-semibold tracking-tight text-brand-ink sm:text-4xl dark:text-brand">
        Restaurant Judge
      </h1>
      <p className="max-w-md text-teal-700/70 dark:text-teal-100/70">
        Nuestro mapa de restaurantes por barrio. Puntuá, comentá y descubrí
        dónde volver.
      </p>
      <span
        className={cn(
          "rounded-full bg-brand px-4 py-2 text-sm font-medium text-brand-ink",
          "shadow-sm ring-1 ring-brand-ink/10",
        )}
      >
        Scaffold funcionando ✅
      </span>
    </main>
  )
}

export default App
