import { useState } from "react"
import { StarIcon } from "@/components/ui/icons"
import { cn } from "@/lib/utils"

/**
 * Puntuación 1–5 con medias estrellas (la DB admite numeric(2,1), ej. 4.5).
 * Cada estrella se parte en dos: mitad izquierda = .5, mitad derecha = entera.
 * Mínimo 1 (el CHECK de la base exige rating >= 1), así que la primera estrella
 * no baja de 1.
 */
export function StarRatingInput({
  value,
  onChange,
}: {
  value: number
  onChange: (v: number) => void
}) {
  const [hover, setHover] = useState(0)
  const shown = hover || value

  return (
    <div className="flex items-center gap-1" onMouseLeave={() => setHover(0)}>
      {[1, 2, 3, 4, 5].map((n) => (
        <Star key={n} n={n} shown={shown} onHover={setHover} onPick={onChange} />
      ))}
    </div>
  )
}

function Star({
  n,
  shown,
  onHover,
  onPick,
}: {
  n: number
  shown: number
  onHover: (v: number) => void
  onPick: (v: number) => void
}) {
  const half = Math.max(1, n - 0.5) // la mitad izquierda (nunca por debajo de 1)
  const isFull = shown >= n
  const isHalf = !isFull && shown >= n - 0.5

  return (
    <div className="relative size-8">
      <StarIcon className="absolute inset-0 size-8 text-border" />
      {(isFull || isHalf) && (
        <div className={cn("absolute inset-y-0 left-0 overflow-hidden", isHalf ? "w-1/2" : "w-full")}>
          <StarIcon className="size-8 text-aqua" />
        </div>
      )}
      <button
        type="button"
        aria-label={`${half} ${half === 1 ? "estrella" : "estrellas"}`}
        onMouseEnter={() => onHover(half)}
        onClick={() => onPick(half)}
        className="absolute inset-y-0 left-0 w-1/2 rounded-l focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aqua"
      />
      <button
        type="button"
        aria-label={`${n} estrellas`}
        onMouseEnter={() => onHover(n)}
        onClick={() => onPick(n)}
        className="absolute inset-y-0 right-0 w-1/2 rounded-r focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aqua"
      />
    </div>
  )
}
