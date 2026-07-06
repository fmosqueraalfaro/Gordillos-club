export type DiaryFilterState = {
  barrio: string // "" = todos
  tag: string // "" = todos
  minRating: number // 0 = todas
}

// eslint-disable-next-line react-refresh/only-export-components
export const EMPTY_FILTERS: DiaryFilterState = { barrio: "", tag: "", minRating: 0 }

const SELECT_CLASS =
  "rounded-full border border-border bg-surface px-3 py-1.5 text-xs text-ink outline-none transition focus:border-aqua"

/** Barra de filtros del Diario: por barrio, tag y puntuación mínima. */
export function DiaryFilters({
  barrios,
  tags,
  value,
  onChange,
}: {
  barrios: string[]
  tags: string[]
  value: DiaryFilterState
  onChange: (next: DiaryFilterState) => void
}) {
  const active = value.barrio !== "" || value.tag !== "" || value.minRating > 0

  return (
    <div className="mb-5 flex flex-wrap items-center gap-2">
      <select
        className={SELECT_CLASS}
        value={value.barrio}
        onChange={(e) => onChange({ ...value, barrio: e.target.value })}
      >
        <option value="">Barrio: todos</option>
        {barrios.map((b) => (
          <option key={b} value={b}>
            {b}
          </option>
        ))}
      </select>

      <select
        className={SELECT_CLASS}
        value={value.tag}
        onChange={(e) => onChange({ ...value, tag: e.target.value })}
      >
        <option value="">Tag: todos</option>
        {tags.map((t) => (
          <option key={t} value={t}>
            {t}
          </option>
        ))}
      </select>

      <select
        className={SELECT_CLASS}
        value={value.minRating}
        onChange={(e) => onChange({ ...value, minRating: Number(e.target.value) })}
      >
        <option value={0}>Puntuación: todas</option>
        <option value={3}>3+</option>
        <option value={4}>4+</option>
        <option value={4.5}>4.5+</option>
      </select>

      {active && (
        <button
          type="button"
          onClick={() => onChange(EMPTY_FILTERS)}
          className="text-xs font-medium text-aqua hover:underline"
        >
          Limpiar
        </button>
      )}
    </div>
  )
}
