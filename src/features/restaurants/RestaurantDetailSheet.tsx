import { useExperiences } from "@/features/experiences/useExperiences"
import { ExperienceCard } from "@/features/experiences/ExperienceCard"
import { MapPinIcon, StarIcon } from "@/components/ui/icons"
import type { Restaurant } from "@/features/restaurants/types"

/**
 * Detalle de un lugar al tocar su pin: promedio, cantidad de visitas y el
 * historial de experiencias ahí (con la nota de cada uno).
 */
export function RestaurantDetailSheet({
  restaurant,
  onClose,
}: {
  restaurant: Restaurant
  onClose: () => void
}) {
  const { experiences, loading, error } = useExperiences(restaurant.id)

  const allRatings = experiences.flatMap((e) => e.ratings.map((r) => r.rating))
  const avg =
    allRatings.length > 0
      ? allRatings.reduce((s, r) => s + r, 0) / allRatings.length
      : null
  const visits = experiences.length

  return (
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

        {/* Resumen: promedio + cantidad de visitas */}
        <div className="mb-5 flex items-center gap-4 rounded-xl bg-surface-2 px-4 py-3">
          <span className="inline-flex items-center gap-1.5">
            <StarIcon className="size-5 text-aqua" />
            <span className="font-display text-lg font-semibold tabular-nums text-ink">
              {avg !== null ? avg.toFixed(1) : "—"}
            </span>
            <span className="text-xs text-muted">promedio</span>
          </span>
          <span className="h-6 w-px bg-border" />
          <span className="text-sm text-muted">
            <span className="font-semibold text-ink">{visits}</span>{" "}
            {visits === 1 ? "visita" : "visitas"}
          </span>
        </div>

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
              <ExperienceCard key={exp.id} experience={exp} showPlace={false} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
