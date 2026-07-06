import { useState } from "react"
import type { FormEvent } from "react"
import { useAuth } from "@/features/auth/AuthProvider"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { StarRatingInput } from "@/components/ui/StarRatingInput"
import { MapPinIcon } from "@/components/ui/icons"
import { createExperience, addVisitToRestaurant } from "@/features/experiences/createExperience"
import type { DraftLocation } from "@/features/experiences/types"

const TEXTAREA_CLASS =
  "w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-ink outline-none transition placeholder:text-muted/60 focus:border-aqua focus:ring-2 focus:ring-aqua/25"

type ExistingPlace = { id: string; name: string; neighborhood: string | null }

type AddExperienceSheetProps = {
  onClose: () => void
  onSaved: () => void
} & (
  | { mode?: "new"; location: DraftLocation }
  | { mode: "existing"; restaurant: ExistingPlace }
)

export function AddExperienceSheet(props: AddExperienceSheetProps) {
  const isExisting = props.mode === "existing"
  const { user } = useAuth()
  const [name, setName] = useState("")
  const [neighborhood, setNeighborhood] = useState("")
  const [visitedOn, setVisitedOn] = useState(() => new Date().toISOString().slice(0, 10))
  const [dish, setDish] = useState("")
  const [note, setNote] = useState("")
  const [rating, setRating] = useState(0)
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const today = new Date().toISOString().slice(0, 10)
  const nameOk = isExisting || name.trim().length > 0
  const canSave = nameOk && rating > 0 && !busy

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!user) return
    if (!isExisting && !name.trim()) return setError("Ponele un nombre al lugar.")
    if (rating < 1) return setError("Elegí tu puntuación (1 a 5 estrellas).")
    setBusy(true)
    setError(null)
    try {
      const visit = { visitedOn, dish: dish.trim(), note: note.trim(), rating }
      if (props.mode === "existing") {
        await addVisitToRestaurant(props.restaurant.id, visit, user.id)
      } else {
        await createExperience(
          {
            name: name.trim(),
            neighborhood: neighborhood.trim() || null,
            lat: props.location.lat,
            lng: props.location.lng,
            ...visit,
          },
          user.id,
        )
      }
      props.onSaved()
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar. Probá de nuevo.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center sm:p-6"
      onClick={props.onClose}
    >
      <div
        className="max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-surface p-6 shadow-xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-ink">
            {isExisting ? "Sumar visita" : "Nueva experiencia"}
          </h2>
          <button
            type="button"
            onClick={props.onClose}
            aria-label="Cerrar"
            className="text-lg text-muted hover:text-ink"
          >
            ✕
          </button>
        </div>

        <p className="mb-4 flex items-center gap-1.5 rounded-xl bg-surface-2 px-3 py-2 text-xs text-muted">
          <MapPinIcon className="size-4 text-aqua" />
          {props.mode === "existing"
            ? `Otra visita a ${props.restaurant.name}`
            : "Ubicación marcada en el mapa"}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          {!isExisting && (
            <>
              <label className="flex flex-col gap-1.5 text-sm font-medium text-ink">
                Nombre del lugar
                <Input value={name} onChange={(e) => setName(e.target.value)} placeholder="Don Julio, La Mezzetta…" autoFocus />
              </label>

              <label className="flex flex-col gap-1.5 text-sm font-medium text-ink">
                Barrio <span className="font-normal text-muted">(opcional)</span>
                <Input value={neighborhood} onChange={(e) => setNeighborhood(e.target.value)} placeholder="Palermo, Villa Crespo…" />
              </label>
            </>
          )}

          <label className="flex flex-col gap-1.5 text-sm font-medium text-ink">
            Fecha
            <Input type="date" value={visitedOn} max={today} onChange={(e) => setVisitedOn(e.target.value)} />
          </label>

          <label className="flex flex-col gap-1.5 text-sm font-medium text-ink">
            ¿Qué comieron? <span className="font-normal text-muted">(opcional)</span>
            <Input value={dish} onChange={(e) => setDish(e.target.value)} placeholder="Milanesa napo, fugazzeta…" />
          </label>

          <label className="flex flex-col gap-1.5 text-sm font-medium text-ink">
            Tu nota <span className="font-normal text-muted">(opcional)</span>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              placeholder="Cómo estuvo, con qué lo acompañaron…"
              className={TEXTAREA_CLASS}
            />
          </label>

          <div className="flex flex-col gap-1.5 text-sm font-medium text-ink">
            Tu puntuación
            <StarRatingInput value={rating} onChange={setRating} />
          </div>

          {error && (
            <p className="rounded-lg bg-rose-500/10 px-3 py-2 text-sm text-rose-600 dark:text-rose-300">
              {error}
            </p>
          )}

          <Button type="submit" disabled={!canSave}>
            {busy ? "Guardando…" : isExisting ? "Guardar visita" : "Guardar experiencia"}
          </Button>
        </form>
      </div>
    </div>
  )
}
