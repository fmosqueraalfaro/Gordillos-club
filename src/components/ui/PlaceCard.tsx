import type { ReactNode } from "react"
import { MapPinIcon } from "@/components/ui/icons"
import { DualRating } from "@/components/ratings/DualRating"
import type { PersonScore } from "@/components/ratings/DualRating"

export type SamplePlace = {
  name: string
  neighborhood: string
  tags: string[]
  a: PersonScore
  b: PersonScore
  note?: string
}

export function PlaceCard({ place, badge }: { place: SamplePlace; badge?: ReactNode }) {
  return (
    <article className="relative overflow-hidden rounded-2xl border border-border bg-surface p-4 shadow-sm transition hover:shadow-md">
      {badge}
      <p className="flex items-center gap-1 text-xs font-medium uppercase tracking-wide text-muted">
        <MapPinIcon className="size-3.5 text-aqua" />
        {place.neighborhood}
      </p>
      <h3 className="mt-1 font-display text-xl font-semibold leading-tight text-ink">
        {place.name}
      </h3>

      <div className="mt-3 flex flex-wrap gap-1.5">
        {place.tags.map((t) => (
          <span
            key={t}
            className="rounded-full bg-surface-2 px-2.5 py-1 text-xs font-medium text-muted"
          >
            {t}
          </span>
        ))}
      </div>

      {place.note && (
        <p className="mt-3 text-sm leading-relaxed text-muted">“{place.note}”</p>
      )}

      <div className="mt-4 border-t border-border pt-3">
        <DualRating a={place.a} b={place.b} />
      </div>
    </article>
  )
}
