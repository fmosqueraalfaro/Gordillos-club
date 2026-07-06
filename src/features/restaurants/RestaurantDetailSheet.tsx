import { useMemo, useState } from "react"
import { useAuth } from "@/features/auth/AuthProvider"
import { useProfiles } from "@/features/profiles/useProfiles"
import { useExperiences } from "@/features/experiences/useExperiences"
import { ExperienceRow } from "@/features/experiences/ExperienceRow"
import { AddExperienceSheet } from "@/features/experiences/AddExperienceSheet"
import { RatingStrip } from "@/components/ratings/DualRating"
import { MapPinIcon, PlusIcon } from "@/components/ui/icons"
import type { Restaurant } from "@/features/restaurants/types"

/**
 * Detalle de un lugar al tocar su pin: la puntuación de cada uno (no un promedio
 * mezclado), la cantidad de visitas y el historial de experiencias ahí. Permite
 * sumar otra visita y editar las notas de cada visita.
 */
export function RestaurantDetailSheet({
  restaurant,
  onClose,
  onChanged,
}: {
  restaurant: Restaurant
  onClose: () => void
  onChanged?: () => void
}) {
  const { user } = useAuth()
  const { profiles } = useProfiles(user?.id)
  const { experiences, loading, error, reload } = useExperiences(restaurant.id)
  const [adding, setAdding] = useState(false)

  const visits = experiences.length

  // Puntuación promedio de CADA persona en este lugar (a lo largo de sus visitas).
  const perPerson = useMemo(() => {
    const map = new Map<string, { name: string; sum: number; count: number }>()
    for (const exp of experiences) {
      for (const r of exp.ratings) {
        const cur = map.get(r.userId) ?? { name: r.name, sum: 0, count: 0 }
        cur.sum += r.rating
        cur.count += 1
        map.set(r.userId, cur)
      }
    }
    return [...map.values()].map((u) => ({ name: u.name, score: u.sum / u.count }))
  }, [experiences])

  function handleChanged() {
    reload()
    onChanged?.()
  }

  return (
    <>
      <div
        className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center sm:p-6"
        onClick={onClose}
      >
        <div
          className="max-h-[85dvh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-surface p-6 shadow-xl sm:rounded-3xl"
          onClick={(e) => e.stopPropagation()}
        >
          <div className="mb-4 flex items-start justify-between gap-3">
            <div>
              {restaurant.neighborhood && (
                <p className="flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-muted">
                  <MapPinIcon className="size-3.5 text-aqua" />
                  {restaurant.neighborhood}
                </p>
              )}
              <h2 className="mt-1 font-display text-2xl font-semibold leading-tight text-ink">
                {restaurant.name}
              </h2>
            </div>
            <button
              type="button"
              onClick={onClose}
              aria-label="Cerrar"
              className="text-lg text-muted hover:text-ink"
            >
              ✕
            </button>
          </div>

          {/* Resumen: la nota de cada uno + cantidad de visitas */}
          <div className="mb-5 flex flex-col gap-2 rounded-xl bg-surface-2 px-4 py-3">
            <span className="text-xs font-medium uppercase tracking-wide text-muted">
              Cómo lo puntúa cada uno
            </span>
            {perPerson.length > 0 ? (
              <RatingStrip scores={perPerson} />
            ) : (
              <span className="text-sm text-muted">Sin puntuar todavía</span>
            )}
            <span className="mt-1 text-xs text-muted">
              <span className="font-semibold text-ink">{visits}</span>{" "}
              {visits === 1 ? "visita" : "visitas"}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setAdding(true)}
            className="mb-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-aqua/40 bg-aqua/10 px-4 py-2.5 text-sm font-semibold text-aqua transition hover:bg-aqua/15 active:brightness-95"
          >
            <PlusIcon className="size-4" />
            Sumar visita acá
          </button>

          {loading && (
            <div className="flex flex-col gap-4">
              {[0, 1].map((i) => (
                <div
                  key={i}
                  className="h-28 animate-pulse rounded-2xl border border-border bg-surface-2/60"
                />
              ))}
            </div>
          )}

          {error && (
            <p className="rounded-xl bg-rose-500/10 px-4 py-3 text-sm text-rose-600 dark:text-rose-300">
              No se pudo cargar el historial: {error}
            </p>
          )}

          {!loading && !error && experiences.length === 0 && (
            <p className="rounded-xl bg-surface-2 px-4 py-6 text-center text-sm text-muted">
              Este lugar todavía no tiene experiencias cargadas.
            </p>
          )}

          {!loading && experiences.length > 0 && (
            <div className="flex flex-col gap-3">
              <p className="text-xs font-semibold uppercase tracking-wide text-muted">
                Historial
              </p>
              {experiences.map((exp) => (
                <ExperienceRow
                  key={exp.id}
                  experience={exp}
                  profiles={profiles}
                  currentUserId={user?.id}
                  showPlace={false}
                  onChanged={handleChanged}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {adding && (
        <AddExperienceSheet
          mode="existing"
          restaurant={restaurant}
          onClose={() => setAdding(false)}
          onSaved={() => {
            setAdding(false)
            handleChanged()
          }}
        />
      )}
    </>
  )
}
