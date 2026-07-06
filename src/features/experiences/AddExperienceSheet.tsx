import { useEffect, useMemo, useRef, useState } from "react"
import type { FormEvent } from "react"
import { useAuth } from "@/features/auth/AuthProvider"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { StarRatingInput } from "@/components/ui/StarRatingInput"
import { MapPinIcon, PlusIcon } from "@/components/ui/icons"
import { createExperience, addVisitToRestaurant } from "@/features/experiences/createExperience"
import { uploadExperiencePhotos } from "@/features/experiences/photos"
import type { DraftLocation } from "@/features/experiences/types"

const TEXTAREA_CLASS =
  "w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-ink outline-none transition placeholder:text-muted/60 focus:border-aqua focus:ring-2 focus:ring-aqua/25"

type ExistingPlace = { id: string; name: string; neighborhood: string | null }
type Prefill = { name?: string; neighborhood?: string }

type AddExperienceSheetProps = {
  onClose: () => void
  onSaved: () => void
} & (
  | { mode?: "new"; location: DraftLocation; prefill?: Prefill }
  | { mode: "existing"; restaurant: ExistingPlace }
)

export function AddExperienceSheet(props: AddExperienceSheetProps) {
  const isExisting = props.mode === "existing"
  const prefill = props.mode === "existing" ? undefined : props.prefill
  const { user } = useAuth()
  const [name, setName] = useState(prefill?.name ?? "")
  const [neighborhood, setNeighborhood] = useState(prefill?.neighborhood ?? "")
  const [visitedOn, setVisitedOn] = useState(() => new Date().toISOString().slice(0, 10))
  const [dish, setDish] = useState("")
  const [note, setNote] = useState("")
  const [rating, setRating] = useState(0)
  const [files, setFiles] = useState<File[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Previsualización de las fotos elegidas (y limpieza de las object URLs).
  const previews = useMemo(() => files.map((f) => URL.createObjectURL(f)), [files])
  useEffect(() => () => previews.forEach(URL.revokeObjectURL), [previews])

  const today = new Date().toISOString().slice(0, 10)
  const nameOk = isExisting || name.trim().length > 0
  const canSave = nameOk && rating > 0 && !busy

  function addFiles(list: FileList | null) {
    if (!list) return
    setFiles((prev) => [...prev, ...Array.from(list)])
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  function removeFile(index: number) {
    setFiles((prev) => prev.filter((_, i) => i !== index))
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!user) return
    if (!isExisting && !name.trim()) return setError("Ponele un nombre al lugar.")
    if (rating < 1) return setError("Elegí tu puntuación (1 a 5 estrellas).")
    setBusy(true)
    setError(null)
    try {
      const visit = { visitedOn, dish: dish.trim(), note: note.trim(), rating }
      const result =
        props.mode === "existing"
          ? await addVisitToRestaurant(props.restaurant.id, visit, user.id)
          : await createExperience(
              {
                name: name.trim(),
                neighborhood: neighborhood.trim() || null,
                lat: props.location.lat,
                lng: props.location.lng,
                ...visit,
              },
              user.id,
            )

      if (files.length > 0) {
        try {
          await uploadExperiencePhotos(result.experienceId, files, user.id)
        } catch (photoErr) {
          // La visita ya se guardó; no bloqueamos por una foto que falló.
          console.warn("No se pudieron subir algunas fotos:", photoErr)
        }
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

          {/* Fotos */}
          <div className="flex flex-col gap-2 text-sm font-medium text-ink">
            Fotos <span className="font-normal text-muted">(opcional)</span>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              multiple
              className="hidden"
              onChange={(e) => addFiles(e.target.files)}
            />
            <div className="flex flex-wrap gap-2">
              {previews.map((src, i) => (
                <div key={src} className="relative size-20 overflow-hidden rounded-xl border border-border">
                  <img src={src} alt={`Foto ${i + 1}`} className="size-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeFile(i)}
                    aria-label="Quitar foto"
                    className="absolute right-1 top-1 grid size-5 place-items-center rounded-full bg-black/60 text-xs text-white"
                  >
                    ✕
                  </button>
                </div>
              ))}
              <button
                type="button"
                onClick={() => fileInputRef.current?.click()}
                className="grid size-20 place-items-center rounded-xl border border-dashed border-border text-muted transition hover:border-aqua hover:text-aqua"
                aria-label="Agregar fotos"
              >
                <PlusIcon className="size-6" />
              </button>
            </div>
          </div>

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
