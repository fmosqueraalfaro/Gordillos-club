import { useMemo } from "react"
import { RatingStrip } from "@/components/ratings/DualRating"
import { StarIcon } from "@/components/ui/icons"
import type { ExperienceEntry } from "@/features/experiences/useExperiences"

/**
 * Resumen del diario: unos números lindos arriba del timeline. Se calcula de la
 * misma data ya cargada (sin consultas extra).
 */
export function DiaryStats({ experiences }: { experiences: ExperienceEntry[] }) {
  const stats = useMemo(() => {
    const placeIds = new Set<string>()
    const neighborhoods = new Map<string, number>()
    const perUser = new Map<string, { name: string; sum: number; count: number }>()
    const perPlace = new Map<string, { name: string; sum: number; count: number }>()

    for (const exp of experiences) {
      placeIds.add(exp.restaurant.id)
      if (exp.restaurant.neighborhood) {
        neighborhoods.set(
          exp.restaurant.neighborhood,
          (neighborhoods.get(exp.restaurant.neighborhood) ?? 0) + 1,
        )
      }
      for (const r of exp.ratings) {
        const u = perUser.get(r.userId) ?? { name: r.name, sum: 0, count: 0 }
        u.sum += r.rating
        u.count += 1
        perUser.set(r.userId, u)

        const p = perPlace.get(exp.restaurant.id) ?? {
          name: exp.restaurant.name,
          sum: 0,
          count: 0,
        }
        p.sum += r.rating
        p.count += 1
        perPlace.set(exp.restaurant.id, p)
      }
    }

    const favNeighborhood =
      [...neighborhoods.entries()].sort((a, b) => b[1] - a[1])[0]?.[0] ?? null
    const perPerson = [...perUser.values()].map((u) => ({
      name: u.name,
      score: u.sum / u.count,
    }))
    const best =
      [...perPlace.values()]
        .map((p) => ({ name: p.name, score: p.sum / p.count }))
        .sort((a, b) => b.score - a.score)[0] ?? null

    return {
      places: placeIds.size,
      visits: experiences.length,
      favNeighborhood,
      perPerson,
      best,
    }
  }, [experiences])

  return (
    <section className="mb-6 rounded-2xl border border-border bg-surface p-4 shadow-sm">
      <div className="grid grid-cols-3 gap-3 text-center">
        <Tile value={stats.places} label={stats.places === 1 ? "lugar" : "lugares"} />
        <Tile value={stats.visits} label={stats.visits === 1 ? "visita" : "visitas"} />
        <Tile
          value={stats.favNeighborhood ?? "—"}
          label="barrio top"
          small={!!stats.favNeighborhood}
        />
      </div>

      {stats.perPerson.length > 0 && (
        <div className="mt-4 flex flex-col gap-1 border-t border-border pt-3">
          <span className="text-xs font-medium uppercase tracking-wide text-muted">
            Promedio de cada uno
          </span>
          <RatingStrip scores={stats.perPerson} />
        </div>
      )}

      {stats.best && (
        <div className="mt-3 flex items-center gap-1.5 border-t border-border pt-3 text-sm">
          <StarIcon className="size-4 text-aqua" />
          <span className="text-muted">Mejor puntuado:</span>
          <span className="font-medium text-ink">{stats.best.name}</span>
          <span className="font-display font-semibold tabular-nums text-ink">
            {stats.best.score.toFixed(1)}
          </span>
        </div>
      )}
    </section>
  )
}

function Tile({
  value,
  label,
  small = false,
}: {
  value: number | string
  label: string
  small?: boolean
}) {
  return (
    <div className="flex flex-col items-center gap-0.5">
      <span
        className={
          small
            ? "font-display text-base font-semibold leading-tight text-ink"
            : "font-display text-3xl font-semibold leading-none text-ink"
        }
      >
        {value}
      </span>
      <span className="text-[11px] uppercase tracking-wide text-muted">{label}</span>
    </div>
  )
}
