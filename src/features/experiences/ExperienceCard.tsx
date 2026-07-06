import { MapPinIcon } from "@/components/ui/icons"
import { ScoreBadge } from "@/components/ratings/DualRating"
import { formatVisitedOn } from "@/lib/date"
import { formatPrice } from "@/lib/format"
import { cn } from "@/lib/utils"
import type { ExperienceEntry } from "@/features/experiences/useExperiences"

/**
 * Una experiencia (visita) como tarjeta. En el Diario muestra el lugar arriba;
 * en el detalle de un lugar (`showPlace={false}`) el encabezado es la fecha.
 * Si se pasa `onOpen`, la tarjeta es clickeable (abre el detalle con foto grande).
 */
export function ExperienceCard({
  experience,
  showPlace = true,
  onOpen,
}: {
  experience: ExperienceEntry
  showPlace?: boolean
  onOpen?: () => void
}) {
  const { restaurant, visitedOn, starter, price, note, people, photos } = experience
  const date = formatVisitedOn(visitedOn)
  const priceLabel = formatPrice(price)
  const meta = priceLabel ? `${date} · ${priceLabel}` : date

  return (
    <article
      onClick={onOpen}
      role={onOpen ? "button" : undefined}
      tabIndex={onOpen ? 0 : undefined}
      onKeyDown={(e) => {
        if (onOpen && (e.key === "Enter" || e.key === " ")) {
          e.preventDefault()
          onOpen()
        }
      }}
      className={cn(
        "rounded-2xl border border-border bg-surface p-4 shadow-sm transition",
        onOpen && "cursor-pointer hover:shadow-md",
      )}
    >
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
          <p className="mt-1 text-xs text-muted">{meta}</p>
        </>
      ) : (
        <p className="text-xs font-medium uppercase tracking-wide text-muted">{meta}</p>
      )}

      {starter && (
        <p className="mt-2 text-sm text-muted">
          <span className="font-medium text-ink">Entrada:</span> {starter}
        </p>
      )}

      {people.length > 0 && (
        <div className="mt-3 flex flex-col gap-2 border-t border-border pt-3">
          {people.map((person) => (
            <div key={person.userId} className="flex flex-col gap-0.5">
              <div className="flex flex-wrap items-center gap-2">
                <ScoreBadge person={{ name: person.name, score: person.rating }} />
                {person.main && <span className="text-sm text-ink">{person.main}</span>}
              </div>
              {person.dessert && (
                <span className="pl-7 text-xs text-muted">Postre: {person.dessert}</span>
              )}
            </div>
          ))}
        </div>
      )}

      {note && <p className="mt-3 text-sm leading-relaxed text-muted">“{note}”</p>}

      {photos.length > 0 && (
        <div className="mt-3 flex gap-2 overflow-x-auto pb-1">
          {photos.map((photo) => (
            <img
              key={photo.id}
              src={photo.url}
              alt={photo.caption ?? `Foto de ${restaurant.name}`}
              loading="lazy"
              className="h-24 w-24 shrink-0 rounded-xl border border-border object-cover"
            />
          ))}
        </div>
      )}
    </article>
  )
}
