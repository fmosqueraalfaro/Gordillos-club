import { useAuth } from "@/features/auth/AuthProvider"
import { useProfiles } from "@/features/profiles/useProfiles"
import { useExperiences } from "@/features/experiences/useExperiences"
import { ExperienceRow } from "@/features/experiences/ExperienceRow"
import { DiaryStats } from "@/features/diary/DiaryStats"
import { MapPinIcon } from "@/components/ui/icons"

/**
 * El Diario: todas nuestras experiencias, de la más nueva a la más vieja.
 * Es el "ver a dónde fuimos".
 */
export function DiaryView({ onGoToMap }: { onGoToMap?: () => void }) {
  const { user } = useAuth()
  const { profiles } = useProfiles(user?.id)
  const { experiences, loading, error, reload } = useExperiences()

  return (
    <div className="mx-auto w-full max-w-2xl px-4 pb-28 pt-6">
      <header className="mb-5">
        <p className="text-xs font-semibold uppercase tracking-[0.16em] text-aqua">
          Nuestro diario
        </p>
        <h1 className="mt-1 font-display text-3xl font-semibold tracking-tight text-ink">
          A dónde fuimos
        </h1>
        {!loading && experiences.length > 0 && (
          <p className="mt-2 text-sm text-muted">
            {experiences.length} {experiences.length === 1 ? "experiencia" : "experiencias"},
            de la más nueva a la más vieja.
          </p>
        )}
      </header>

      {loading && <DiarySkeleton />}

      {error && (
        <p className="rounded-xl bg-rose-500/10 px-4 py-3 text-sm text-rose-600 dark:text-rose-300">
          No se pudo cargar el diario: {error}
        </p>
      )}

      {!loading && !error && experiences.length === 0 && <EmptyDiary onGoToMap={onGoToMap} />}

      {!loading && experiences.length > 0 && (
        <>
          <DiaryStats experiences={experiences} />
          <div className="flex flex-col gap-4">
            {experiences.map((exp) => (
              <ExperienceRow
                key={exp.id}
                experience={exp}
                profiles={profiles}
                currentUserId={user?.id}
                onChanged={reload}
              />
            ))}
          </div>
        </>
      )}
    </div>
  )
}

function DiarySkeleton() {
  return (
    <div className="flex flex-col gap-4">
      {[0, 1, 2].map((i) => (
        <div
          key={i}
          className="h-40 animate-pulse rounded-2xl border border-border bg-surface-2/60"
        />
      ))}
    </div>
  )
}

function EmptyDiary({ onGoToMap }: { onGoToMap?: () => void }) {
  return (
    <div className="rounded-2xl border border-dashed border-border bg-surface-2/50 px-6 py-12 text-center">
      <div className="mx-auto grid size-12 place-items-center rounded-full bg-aqua/15 text-aqua">
        <MapPinIcon className="size-6" />
      </div>
      <h2 className="mt-3 font-display text-xl font-semibold text-ink">
        Todavía no cargaron ninguna experiencia
      </h2>
      <p className="mx-auto mt-2 max-w-sm text-sm text-muted">
        Andá al mapa, tocá dónde estuvieron y sumá la primera visita. Va a aparecer acá.
      </p>
      {onGoToMap && (
        <button
          type="button"
          onClick={onGoToMap}
          className="mt-5 inline-flex items-center gap-2 rounded-full bg-aqua px-5 py-2.5 font-semibold text-aqua-ink transition hover:brightness-105 active:brightness-95"
        >
          <MapPinIcon className="size-4" />
          Ir al mapa
        </button>
      )}
    </div>
  )
}
