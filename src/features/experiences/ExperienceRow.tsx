import { useState } from "react"
import { ExperienceCard } from "@/features/experiences/ExperienceCard"
import { EditExperienceSheet } from "@/features/experiences/EditExperienceSheet"
import { deleteExperience } from "@/features/experiences/createExperience"
import type { ExperienceEntry } from "@/features/experiences/useExperiences"
import type { PersonProfile } from "@/features/profiles/useProfiles"

/**
 * Una experiencia con acciones de editar y borrar. Se usa en el Diario y en el
 * detalle de un lugar. `onChanged` refresca la lista de arriba.
 */
export function ExperienceRow({
  experience,
  profiles,
  currentUserId,
  showPlace = true,
  onChanged,
}: {
  experience: ExperienceEntry
  profiles: PersonProfile[]
  currentUserId?: string
  showPlace?: boolean
  onChanged: () => void
}) {
  const [editing, setEditing] = useState(false)
  const [confirming, setConfirming] = useState(false)
  const [busy, setBusy] = useState(false)

  async function doDelete() {
    setBusy(true)
    try {
      await deleteExperience(experience.id)
      onChanged()
    } catch (err) {
      console.warn("No se pudo borrar:", err)
      setBusy(false)
      setConfirming(false)
    }
  }

  return (
    <div className="flex flex-col gap-2">
      <ExperienceCard experience={experience} showPlace={showPlace} />

      <div className="flex items-center gap-3 px-1">
        {!confirming ? (
          <>
            <button
              type="button"
              onClick={() => setEditing(true)}
              className="text-xs font-medium text-aqua hover:underline"
            >
              Editar
            </button>
            <button
              type="button"
              onClick={() => setConfirming(true)}
              className="text-xs font-medium text-muted hover:text-rose-600 dark:hover:text-rose-300"
            >
              Borrar
            </button>
          </>
        ) : (
          <>
            <span className="text-xs text-muted">¿Borrar esta experiencia?</span>
            <button
              type="button"
              onClick={doDelete}
              disabled={busy}
              className="text-xs font-semibold text-rose-600 hover:underline disabled:opacity-50 dark:text-rose-300"
            >
              {busy ? "Borrando…" : "Sí, borrar"}
            </button>
            <button
              type="button"
              onClick={() => setConfirming(false)}
              className="text-xs text-muted hover:text-ink"
            >
              No
            </button>
          </>
        )}
      </div>

      {editing && (
        <EditExperienceSheet
          experience={experience}
          profiles={profiles}
          currentUserId={currentUserId}
          onClose={() => setEditing(false)}
          onSaved={() => {
            setEditing(false)
            onChanged()
          }}
        />
      )}
    </div>
  )
}
