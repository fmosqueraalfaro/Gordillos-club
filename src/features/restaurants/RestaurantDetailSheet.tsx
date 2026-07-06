import { useMemo, useState } from "react"
import { useAuth } from "@/features/auth/AuthProvider"
import { useProfiles } from "@/features/profiles/useProfiles"
import type { PersonProfile } from "@/features/profiles/useProfiles"
import { useExperiences } from "@/features/experiences/useExperiences"
import type { ExperienceEntry } from "@/features/experiences/useExperiences"
import { ExperienceCard } from "@/features/experiences/ExperienceCard"
import { AddExperienceSheet } from "@/features/experiences/AddExperienceSheet"
import { upsertRatings } from "@/features/experiences/createExperience"
import { RatingStrip } from "@/components/ratings/DualRating"
import { StarRatingInput } from "@/components/ui/StarRatingInput"
import { MapPinIcon, PlusIcon } from "@/components/ui/icons"
import type { Restaurant } from "@/features/restaurants/types"

/**
 * Detalle de un lugar al tocar su pin: la puntuación de cada uno (no un promedio
 * mezclado), la cantidad de visitas y el historial de experiencias ahí. Permite
 * sumar otra visita y editar las notas de cada visita.
 */
export function RestaurantDetailSheet({
  restaurant,
  onClose,
  onChanged,
}: {
  restaurant: Restaurant
  onClose: () => void
  onChanged?: () => void
}) {
  const { user } = useAuth()
  const { profiles } = useProfiles(user?.id)
  const { experiences, loading, error, reload } = useExperiences(restaurant.id)
  const [adding, setAdding] = useState(false)

  const visits = experiences.length

  // Puntuación promedio de CADA persona en este lugar (a lo largo de sus visitas).
  const perPerson = useMemo(() => {
    const map = new Map<string, { name: string; sum: number; count: number }>()
    for (const exp of experiences) {
      for (const r of exp.ratings) {
        const cur = map.get(r.userId) ?? { name: r.name, sum: 0, count: 0 }
        cur.sum += r.rating
        cur.count += 1
        map.set(r.userId, cur)
      }
    }
    return [...map.values()].map((u) => ({ name: u.name, score: u.sum / u.count }))
  }, [experiences])

  function handleChanged() {
    reload()
    onChanged?.()
  }

  return (
    <>
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

          {/* Resumen: la nota de cada uno + cantidad de visitas */}
          <div className="mb-5 flex flex-col gap-2 rounded-xl bg-surface-2 px-4 py-3">
            <span className="text-xs font-medium uppercase tracking-wide text-muted">
              Cómo lo puntúa cada uno
            </span>
            {perPerson.length > 0 ? (
              <RatingStrip scores={perPerson} />
            ) : (
              <span className="text-sm text-muted">Sin puntuar todavía</span>
            )}
            <span className="mt-1 text-xs text-muted">
              <span className="font-semibold text-ink">{visits}</span>{" "}
              {visits === 1 ? "visita" : "visitas"}
            </span>
          </div>

          <button
            type="button"
            onClick={() => setAdding(true)}
            className="mb-5 inline-flex w-full items-center justify-center gap-2 rounded-xl border border-aqua/40 bg-aqua/10 px-4 py-2.5 text-sm font-semibold text-aqua transition hover:bg-aqua/15 active:brightness-95"
          >
            <PlusIcon className="size-4" />
            Sumar visita acá
          </button>

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
                <ExperienceItem
                  key={exp.id}
                  experience={exp}
                  profiles={profiles}
                  currentUserId={user?.id}
                  onSaved={handleChanged}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {adding && (
        <AddExperienceSheet
          mode="existing"
          restaurant={restaurant}
          onClose={() => setAdding(false)}
          onSaved={() => {
            setAdding(false)
            handleChanged()
          }}
        />
      )}
    </>
  )
}

/** Una experiencia del historial con opción de editar las puntuaciones. */
function ExperienceItem({
  experience,
  profiles,
  currentUserId,
  onSaved,
}: {
  experience: ExperienceEntry
  profiles: PersonProfile[]
  currentUserId?: string
  onSaved: () => void
}) {
  const [editing, setEditing] = useState(false)

  return (
    <div className="flex flex-col gap-2">
      <ExperienceCard experience={experience} showPlace={false} />
      {editing ? (
        <RatingsEditor
          experience={experience}
          profiles={profiles}
          currentUserId={currentUserId}
          onCancel={() => setEditing(false)}
          onSaved={() => {
            setEditing(false)
            onSaved()
          }}
        />
      ) : (
        <button
          type="button"
          onClick={() => setEditing(true)}
          className="self-start text-xs font-medium text-aqua hover:underline"
        >
          Editar puntuaciones
        </button>
      )}
    </div>
  )
}

function RatingsEditor({
  experience,
  profiles,
  currentUserId,
  onCancel,
  onSaved,
}: {
  experience: ExperienceEntry
  profiles: PersonProfile[]
  currentUserId?: string
  onCancel: () => void
  onSaved: () => void
}) {
  const [values, setValues] = useState<Record<string, number>>(() =>
    Object.fromEntries(experience.ratings.map((r) => [r.userId, r.rating])),
  )
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  async function save() {
    setBusy(true)
    setError(null)
    try {
      await upsertRatings(
        experience.id,
        profiles.map((p) => ({ userId: p.id, rating: values[p.id] ?? 0 })),
      )
      onSaved()
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div className="flex flex-col gap-3 rounded-xl border border-border bg-surface-2 p-3">
      {profiles.map((person) => (
        <div key={person.id} className="flex items-center justify-between gap-3">
          <span className="text-sm text-ink">
            {person.displayName}
            {person.id === currentUserId && <span className="text-muted"> (vos)</span>}
          </span>
          <StarRatingInput
            value={values[person.id] ?? 0}
            onChange={(v) => setValues((prev) => ({ ...prev, [person.id]: v }))}
          />
        </div>
      ))}

      {error && <p className="text-xs text-rose-600 dark:text-rose-300">{error}</p>}

      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={save}
          disabled={busy}
          className="rounded-lg bg-aqua px-3 py-1.5 text-sm font-semibold text-aqua-ink transition hover:brightness-105 disabled:opacity-50"
        >
          {busy ? "Guardando…" : "Guardar"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-lg px-3 py-1.5 text-sm font-medium text-muted hover:text-ink"
        >
          Cancelar
        </button>
      </div>
    </div>
  )
}
