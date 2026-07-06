import { useState } from "react"
import type { KeyboardEvent } from "react"
import { Input } from "@/components/ui/Input"

const SUGGESTED = [
  "Bodegón",
  "Parrilla",
  "Pizza",
  "Café",
  "Milanesas",
  "Pastas",
  "Sushi",
  "Hamburguesas",
  "Vinos",
  "Heladería",
]

/** Editor de tags: chips (quitables) + sugeridos rápidos + agregar libre. */
export function TagsInput({
  value,
  onChange,
}: {
  value: string[]
  onChange: (tags: string[]) => void
}) {
  const [text, setText] = useState("")

  function add(raw: string) {
    const tag = raw.trim()
    if (!tag) return
    if (value.some((v) => v.toLowerCase() === tag.toLowerCase())) {
      setText("")
      return
    }
    onChange([...value, tag])
    setText("")
  }

  function remove(tag: string) {
    onChange(value.filter((v) => v !== tag))
  }

  function onKeyDown(e: KeyboardEvent<HTMLInputElement>) {
    if (e.key === "Enter" || e.key === ",") {
      e.preventDefault()
      add(text)
    }
  }

  const suggestions = SUGGESTED.filter(
    (s) => !value.some((v) => v.toLowerCase() === s.toLowerCase()),
  )

  return (
    <div className="flex flex-col gap-2">
      {value.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {value.map((tag) => (
            <span
              key={tag}
              className="inline-flex items-center gap-1 rounded-full bg-aqua/15 px-2.5 py-1 text-xs font-medium text-aqua"
            >
              {tag}
              <button
                type="button"
                onClick={() => remove(tag)}
                aria-label={`Quitar ${tag}`}
                className="text-aqua/70 hover:text-aqua"
              >
                ✕
              </button>
            </span>
          ))}
        </div>
      )}

      <Input
        value={text}
        onChange={(e) => setText(e.target.value)}
        onKeyDown={onKeyDown}
        placeholder="Agregar tag y Enter (parrilla, bodegón…)"
      />

      {suggestions.length > 0 && (
        <div className="flex flex-wrap gap-1.5">
          {suggestions.slice(0, 8).map((s) => (
            <button
              key={s}
              type="button"
              onClick={() => add(s)}
              className="rounded-full border border-border px-2.5 py-1 text-xs text-muted transition hover:border-aqua hover:text-aqua"
            >
              + {s}
            </button>
          ))}
        </div>
      )}
    </div>
  )
}
