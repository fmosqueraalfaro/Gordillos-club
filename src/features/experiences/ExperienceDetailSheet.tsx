import { ScoreBadge } from "@/components/ratings/DualRating"
import { MapPinIcon } from "@/components/ui/icons"
import { formatVisitedOn } from "@/lib/date"
import { formatPrice } from "@/lib/format"
import type { ExperienceEntry } from "@/features/experiences/useExperiences"

/**
 * Vista abierta de una experiencia: la foto grande y todo el detalle (entrada,
 * precio, principal/postre/nota de cada uno). Se abre al tocar una tarjeta.
 */
export function ExperienceDetailSheet({
  experience,
  onClose,
  onEdit,
}: {
  experience: ExperienceEntry
  onClose: () => void
  onEdit?: () => void
}) {
  const { restaurant, visitedOn, starter, price, note, people, photos } = experience
  const priceLabel = formatPrice(price)

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        className="max-h-[92dvh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-surface shadow-xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Fotos grandes arriba */}
        {photos.length > 0 && (
          <div className="flex snap-x snap-mandatory gap-2 overflow-x-auto bg-surface-2">
            {photos.map((photo) => (
              <img
                key={photo.id}
                src={photo.url}
                alt={photo.caption ?? `Foto de ${restaurant.name}`}
                className="max-h-72 w-full shrink-0 snap-center object-contain"
              />
            ))}
          </div>
        )}

        <div className="p-6">
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
              <p className="mt-1 text-sm text-muted">
                {formatVisitedOn(visitedOn)}
                {priceLabel && <span className="text-ink"> · {priceLabel}</span>}
              </p>
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

          {starter && (
            <div className="mb-4 rounded-xl bg-surface-2 px-4 py-3 text-sm">
              <span className="font-medium text-ink">Entrada (compartida):</span>{" "}
              <span className="text-muted">{starter}</span>
            </div>
          )}

          {people.length > 0 && (
            <div className="flex flex-col gap-4">
              {people.map((person) => (
                <div key={person.userId} className="flex flex-col gap-1 border-t border-border pt-3 first:border-t-0 first:pt-0">
                  <ScoreBadge person={{ name: person.name, score: person.rating }} />
                  {person.main && (
                    <p className="text-sm text-ink">
                      <span className="text-muted">Principal:</span> {person.main}
                    </p>
                  )}
                  {person.dessert && (
                    <p className="text-sm text-ink">
                      <span className="text-muted">Postre:</span> {person.dessert}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}

          {note && (
            <p className="mt-4 text-sm leading-relaxed text-muted">“{note}”</p>
          )}

          {onEdit && (
            <button
              type="button"
              onClick={onEdit}
              className="mt-6 inline-flex w-full items-center justify-center rounded-xl border border-aqua/40 bg-aqua/10 px-4 py-2.5 text-sm font-semibold text-aqua transition hover:bg-aqua/15"
            >
              Editar
            </button>
          )}
        </div>
      </div>
    </div>
  )
}
