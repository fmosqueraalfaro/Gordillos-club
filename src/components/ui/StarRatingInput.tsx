import { useState } from "react"
import { StarIcon } from "@/components/ui/icons"
import { cn } from "@/lib/utils"

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
        <button
          key={n}
          type="button"
          onMouseEnter={() => setHover(n)}
          onClick={() => onChange(n)}
          className="rounded p-0.5 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-aqua"
          aria-label={`${n} ${n === 1 ? "estrella" : "estrellas"}`}
        >
          <StarIcon className={cn("size-8 transition", n <= shown ? "text-aqua" : "text-border")} />
        </button>
      ))}
    </div>
  )
}
