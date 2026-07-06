import { Fragment } from "react"
import { StarIcon } from "@/components/ui/icons"
import { cn } from "@/lib/utils"

export type PersonScore = { name: string; score: number }

/**
 * La firma de Gordillos Club: la puntuación de dos personas, lado a lado.
 * Ninguna app de restaurantes muestra esto — es lo propio de una pareja.
 */
export function DualRating({
  a,
  b,
  className,
}: {
  a: PersonScore
  b: PersonScore
  className?: string
}) {
  return <RatingStrip scores={[a, b]} className={className} />
}

/**
 * Tira de puntuaciones dinámica: sirve para 1 o 2 personas (o más a futuro).
 * Mantiene la firma visual del `DualRating` con separadores entre cada nota.
 */
export function RatingStrip({
  scores,
  className,
}: {
  scores: PersonScore[]
  className?: string
}) {
  if (scores.length === 0) {
    return <span className={cn("text-xs text-muted", className)}>Sin puntuar todavía</span>
  }
  return (
    <div className={cn("flex flex-wrap items-center gap-3", className)}>
      {scores.map((person, i) => (
        <Fragment key={`${person.name}-${i}`}>
          {i > 0 && <span className="h-4 w-px bg-border" />}
          <ScoreBadge person={person} />
        </Fragment>
      ))}
    </div>
  )
}

export function ScoreBadge({ person }: { person: PersonScore }) {
  const initial = person.name.trim().charAt(0).toUpperCase() || "?"
  return (
    <span
      className="inline-flex items-center gap-1.5"
      title={`${person.name}: ${person.score.toFixed(1)}`}
    >
      <span className="grid size-5 place-items-center rounded-full bg-petrol text-[10px] font-semibold text-white">
        {initial}
      </span>
      <StarIcon className="size-3.5 text-aqua" />
      <span className="font-display text-sm font-semibold tabular-nums text-ink">
        {person.score.toFixed(1)}
      </span>
    </span>
  )
}
