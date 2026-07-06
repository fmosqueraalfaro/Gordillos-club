import { MapPinIcon } from "@/components/ui/icons"
import { RatingStrip } from "@/components/ratings/DualRating"
import { formatVisitedOn } from "@/lib/date"
import type { ExperienceEntry } from "@/features/experiences/useExperiences"

/**
 * Una experiencia (visita) como tarjeta. En el Diario muestra el lugar arriba;
 * en el detalle de un lugar (`showPlace={false}`) el encabezado es la fecha,
 * porque el lugar ya se sabe.
 */
export function ExperienceCard({
  experience,
  showPlace = true,
}: {
  experience: ExperienceEntry
  showPlace?: boolean
}) {
  const { restaurant, visitedOn, dish, note, ratings } = experience
  const scores = ratings.map((r) => ({ name: r.name, score: r.rating }))
  const date = formatVisitedOn(visitedOn)

  return (
    <article className="rounded-2xl border border-border bg-surface p-4 shadow-sm transition hover:shadow-md">
      {showPlace ? (
        <>
          {restaurant.neighborhood && (
            <p className="flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-muted">
              <MapPinIcon className="size-3.5 text-aqua" />
              {restaurant.neighborhood}
            </p>
          )}
          <h3 className="mt-1 font-display text-xl font-semibold leading-tight text-ink">
            {restaurant.name}
          </h3>
          <p className="mt-1 text-xs text-muted">
            {date}
            {dish && <span className="text-ink"> · {dish}</span>}
          </p>
        </>
      ) : (
        <p className="text-xs font-medium uppercase tracking-wide text-muted">
          {date}
          {dish && <span className="text-ink"> · {dish}</span>}
        </p>
      )}

      {note && <p className="mt-3 text-sm leading-relaxed text-muted">“{note}”</p>}

      <div className="mt-4 border-t border-border pt-3">
        <RatingStrip scores={scores} />
      </div>
    </article>
  )
}
