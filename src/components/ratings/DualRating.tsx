import { StarIcon } from "@/components/ui/icons"
import { cn } from "@/lib/utils"

export type PersonScore = { name: string; score: number }

/**
 * La firma de Restaurant Judge: la puntuación de dos personas, lado a lado.
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
  return (
    <div className={cn("flex items-center gap-3", className)}>
      <Score person={a} />
      <span className="h-4 w-px bg-border" />
      <Score person={b} />
    </div>
  )
}

function Score({ person }: { person: PersonScore }) {
  const initial = person.name.trim().charAt(0).toUpperCase() || "?"
  return (
    <span className="inline-flex items-center gap-1.5" title={`${person.name}: ${person.score.toFixed(1)}`}>
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
