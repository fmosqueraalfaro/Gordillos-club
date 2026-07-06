import { useAuth } from "@/features/auth/AuthProvider"
import { Button } from "@/components/ui/Button"
import { PlaceCard } from "@/components/ui/PlaceCard"
import type { SamplePlace } from "@/components/ui/PlaceCard"
import { PlusIcon } from "@/components/ui/icons"

// Ejemplos para mostrar la identidad visual mientras armamos el mapa real.
const SAMPLES: SamplePlace[] = [
  {
    name: "El Preferido de Palermo",
    neighborhood: "Palermo",
    tags: ["Bodegón", "Vinos"],
    a: { name: "Fran", score: 4.5 },
    b: { name: "Caro", score: 5.0 },
    note: "La tortilla babé, un golazo. Volvemos seguro.",
  },
  {
    name: "Sifón",
    neighborhood: "Villa Crespo",
    tags: ["Pizza", "Fugazzeta"],
    a: { name: "Fran", score: 4.0 },
    b: { name: "Caro", score: 4.5 },
    note: "Fugazzeta rellena imbatible.",
  },
]

export function HomeView() {
  const { profile, user } = useAuth()
  const name = profile?.display_name ?? user?.email ?? "che"

  return (
    <div className="flex flex-col gap-8">
      <section>
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-aqua">
          Hola de nuevo
        </p>
        <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-ink">
          {name}, ¿a dónde fuimos?
        </h1>
        <p className="mt-2 max-w-md text-sm text-muted">
          Acá van a vivir todos los lugares que visitamos, sobre el mapa y por barrio. El
          mapa lo enchufamos en el próximo paso.
        </p>
      </section>

      <section>
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-display text-lg font-semibold text-ink">Así se van a ver</h2>
          <span className="text-xs text-muted">Ejemplos</span>
        </div>
        <div className="grid gap-4 sm:grid-cols-2">
          {SAMPLES.map((place) => (
            <PlaceCard
              key={place.name}
              place={place}
              badge={
                <span className="absolute right-3 top-3 rounded-full bg-aqua/15 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-aqua">
                  Ejemplo
                </span>
              }
            />
          ))}
        </div>
      </section>

      <section className="rounded-2xl border border-dashed border-border bg-surface-2/50 px-6 py-10 text-center">
        <h2 className="font-display text-xl font-semibold text-ink">
          Todavía no cargaron ningún lugar
        </h2>
        <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
          Cuando sumemos el mapa vas a poder marcar un restaurante, ponerle tu puntuación y
          dejar un comentario. Recién ahí empieza lo bueno.
        </p>
        <Button className="mt-5" disabled>
          <PlusIcon className="size-4" />
          Agregar restaurante
        </Button>
        <p className="mt-2 text-xs text-muted">Disponible en el próximo paso</p>
      </section>
    </div>
  )
}
