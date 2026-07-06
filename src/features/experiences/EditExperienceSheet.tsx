import { useEffect, useMemo, useRef, useState } from "react"
import type { FormEvent } from "react"
import { Button } from "@/components/ui/Button"
import { Input } from "@/components/ui/Input"
import { StarRatingInput } from "@/components/ui/StarRatingInput"
import { PlusIcon } from "@/components/ui/icons"
import { updateExperience, upsertRatings } from "@/features/experiences/createExperience"
import { uploadExperiencePhotos, deletePhotos } from "@/features/experiences/photos"
import type { ExperienceEntry, ExperiencePhoto } from "@/features/experiences/useExperiences"
import type { PersonProfile } from "@/features/profiles/useProfiles"

const TEXTAREA_CLASS =
  "w-full rounded-xl border border-border bg-surface px-3.5 py-2.5 text-sm text-ink outline-none transition placeholder:text-muted/60 focus:border-aqua focus:ring-2 focus:ring-aqua/25"

/** Editar una experiencia existente: fecha, plato, nota, fotos y las notas. */
export function EditExperienceSheet({
  experience,
  profiles,
  currentUserId,
  onClose,
  onSaved,
}: {
  experience: ExperienceEntry
  profiles: PersonProfile[]
  currentUserId?: string
  onClose: () => void
  onSaved: () => void
}) {
  const [visitedOn, setVisitedOn] = useState(experience.visitedOn)
  const [dish, setDish] = useState(experience.dish ?? "")
  const [note, setNote] = useState(experience.note ?? "")
  const [ratings, setRatings] = useState<Record<string, number>>(() =>
    Object.fromEntries(experience.ratings.map((r) => [r.userId, r.rating])),
  )
  const [keptPhotos, setKeptPhotos] = useState<ExperiencePhoto[]>(experience.photos)
  const [removedPhotos, setRemovedPhotos] = useState<ExperiencePhoto[]>([])
  const [newFiles, setNewFiles] = useState<File[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const previews = useMemo(() => newFiles.map((f) => URL.createObjectURL(f)), [newFiles])
  useEffect(() => () => previews.forEach(URL.revokeObjectURL), [previews])

  const today = new Date().toISOString().slice(0, 10)
  const hasRating = Object.values(ratings).some((v) => v > 0)
  const canSave = hasRating && !busy

  function removeExisting(photo: ExperiencePhoto) {
    setKeptPhotos((prev) => prev.filter((p) => p.id !== photo.id))
    setRemovedPhotos((prev) => [...prev, photo])
  }

  function addFiles(list: FileList | null) {
    if (!list) return
    setNewFiles((prev) => [...prev, ...Array.from(list)])
    if (fileInputRef.current) fileInputRef.current.value = ""
  }

  async function handleSubmit(e: FormEvent) {
    e.preventDefault()
    if (!currentUserId) return
    if (!hasRating) return setError("Tiene que haber al menos una puntuación.")
    setBusy(true)
    setError(null)
    try {
      await updateExperience(experience.id, { visitedOn, dish: dish.trim(), note: note.trim() })
      await upsertRatings(
        experience.id,
        profiles.map((p) => ({ userId: p.id, rating: ratings[p.id] ?? 0 })),
      )
      if (removedPhotos.length > 0) await deletePhotos(removedPhotos)
      if (newFiles.length > 0) {
        try {
          await uploadExperiencePhotos(experience.id, newFiles, currentUserId)
        } catch (photoErr) {
          console.warn("No se pudieron subir algunas fotos:", photoErr)
        }
      }
      onSaved()
    } catch (err) {
      setError(err instanceof Error ? err.message : "No se pudo guardar. Probá de nuevo.")
    } finally {
      setBusy(false)
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 sm:items-center sm:p-6"
      onClick={onClose}
    >
      <div
        className="max-h-[90dvh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-surface p-6 shadow-xl sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-4 flex items-center justify-between">
          <h2 className="font-display text-xl font-semibold text-ink">Editar experiencia</h2>
          <button
            type="button"
            onClick={onClose}
            aria-label="Cerrar"
            className="text-lg text-muted hover:text-ink"
          >
            ✕
          </button>
        </div>

        <p className="mb-4 rounded-xl bg-surface-2 px-3 py-2 text-xs text-muted">
          {experience.restaurant.name}
        </p>

        <form onSubmit={handleSubmit} className="flex flex-col gap-4">
          <label className="flex flex-col gap-1.5 text-sm font-medium text-ink">
            Fecha
            <Input type="date" value={visitedOn} max={today} onChange={(e) => setVisitedOn(e.target.value)} />
          </label>

          <label className="flex flex-col gap-1.5 text-sm font-medium text-ink">
            ¿Qué comieron? <span className="font-normal text-muted">(opcional)</span>
            <Input value={dish} onChange={(e) => setDish(e.target.value)} placeholder="Milanesa napo, fugazzeta…" />
          </label>

          <label className="flex flex-col gap-1.5 text-sm font-medium text-ink">
            Nota <span className="font-normal text-muted">(opcional)</span>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={2}
              placeholder="Cómo estuvo, con qué lo acompañaron…"
              className={TEXTAREA_CLASS}
            />
          </label>

          {/* Fotos: existentes (con quitar) + nuevas */}
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
              {keptPhotos.map((photo) => (
                <div key={photo.id} className="relative size-20 overflow-hidden rounded-xl border border-border">
                  <img src={photo.url} alt={photo.caption ?? "Foto"} className="size-full object-cover" />
                  <button
                    type="button"
                    onClick={() => removeExisting(photo)}
                    aria-label="Quitar foto"
                    className="absolute right-1 top-1 grid size-5 place-items-center rounded-full bg-black/60 text-xs text-white"
                  >
                    ✕
                  </button>
                </div>
              ))}
              {previews.map((src, i) => (
                <div key={src} className="relative size-20 overflow-hidden rounded-xl border border-border">
                  <img src={src} alt={`Foto nueva ${i + 1}`} className="size-full object-cover" />
                  <button
                    type="button"
                    onClick={() => setNewFiles((prev) => prev.filter((_, j) => j !== i))}
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

          {/* Doble puntuación */}
          <div className="flex flex-col gap-3 rounded-xl bg-surface-2 p-3">
            <p className="text-sm font-medium text-ink">
              Puntuaciones <span className="font-normal text-muted">(la de cada uno)</span>
            </p>
            {profiles.map((person) => (
              <div key={person.id} className="flex items-center justify-between gap-3">
                <span className="text-sm text-ink">
                  {person.displayName}
                  {person.id === currentUserId && <span className="text-muted"> (vos)</span>}
                </span>
                <StarRatingInput
                  value={ratings[person.id] ?? 0}
                  onChange={(v) => setRatings((prev) => ({ ...prev, [person.id]: v }))}
                />
              </div>
            ))}
          </div>

          {error && (
            <p className="rounded-lg bg-rose-500/10 px-3 py-2 text-sm text-rose-600 dark:text-rose-300">
              {error}
            </p>
          )}

          <Button type="submit" disabled={!canSave}>
            {busy ? "Guardando…" : "Guardar cambios"}
          </Button>
        </form>
      </div>
    </div>
  )
}
