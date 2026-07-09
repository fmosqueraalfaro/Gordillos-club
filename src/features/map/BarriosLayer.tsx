import { useEffect, useMemo, useState } from "react"
import { useMap } from "@vis.gl/react-google-maps"
import { countByBarrio } from "@/features/map/geo"
import type { BarriosGeoJson } from "@/features/map/geo"

const AQUA = "#0FB4A3" // fuimos (verde agua, más intenso = más lugares)
const AMBER = "#EC4899" // no fuimos (rosa, para que resalte lo pendiente 💗)

// Leyenda: ámbar = 0, después la rampa verde.
const LEGEND = [
  { label: "0", color: AMBER, opacity: 0.35 },
  { label: "1", color: AQUA, opacity: 0.3 },
  { label: "2", color: AQUA, opacity: 0.45 },
  { label: "3", color: AQUA, opacity: 0.6 },
  { label: "4+", color: AQUA, opacity: 0.8 },
]

function styleForCount(count: number): google.maps.Data.StyleOptions {
  if (count <= 0) {
    return { fillColor: AMBER, fillOpacity: 0.35, strokeColor: AMBER, strokeOpacity: 0.5, strokeWeight: 1 }
  }
  const opacity = count >= 4 ? 0.8 : count === 3 ? 0.6 : count === 2 ? 0.45 : 0.3
  return { fillColor: AQUA, fillOpacity: opacity, strokeColor: AQUA, strokeOpacity: 0.6, strokeWeight: 1 }
}

/**
 * Pinta los barrios de CABA: **ámbar donde no fuimos**, verde agua donde sí
 * (más intenso = más lugares). Opcionalmente filtra por tag (ej. sólo bodegones).
 * El conteo es por punto-en-polígono con la ubicación de cada lugar.
 */
export function BarriosLayer({
  restaurants,
}: {
  restaurants: { lat: number; lng: number; tags: string[] }[]
}) {
  const map = useMap()
  const [geo, setGeo] = useState<BarriosGeoJson | null>(null)
  const [error, setError] = useState(false)
  const [info, setInfo] = useState<{ name: string; count: number } | null>(null)
  const [tag, setTag] = useState("") // "" = todos los lugares

  useEffect(() => {
    let active = true
    fetch("/caba-barrios.geojson")
      .then((r) => r.json())
      .then((data: BarriosGeoJson) => {
        if (active) setGeo(data)
      })
      .catch(() => {
        if (active) setError(true)
      })
    return () => {
      active = false
    }
  }, [])

  const availableTags = useMemo(
    () => [...new Set(restaurants.flatMap((r) => r.tags))].sort(),
    [restaurants],
  )

  const counts = useMemo(() => {
    if (!geo) return new Map<string, number>()
    const pts = tag ? restaurants.filter((r) => r.tags.includes(tag)) : restaurants
    return countByBarrio(pts, geo.features)
  }, [geo, restaurants, tag])

  useEffect(() => {
    if (!map || !geo) return
    const added = map.data.addGeoJson(geo)
    map.data.setStyle((feature) => {
      const name = feature.getProperty("nombre") as string
      return styleForCount(counts.get(name) ?? 0)
    })
    const listener = map.data.addListener("click", (e: google.maps.Data.MouseEvent) => {
      const name = e.feature.getProperty("nombre") as string
      setInfo({ name, count: counts.get(name) ?? 0 })
    })
    return () => {
      listener.remove()
      added.forEach((f) => map.data.remove(f))
      map.data.setStyle({})
      setInfo(null)
    }
  }, [map, geo, counts])

  return (
    <div className="absolute left-4 top-4 z-30 w-fit max-w-[78%] rounded-2xl border border-border bg-surface/95 p-3 shadow-lg backdrop-blur">
      <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">
        Barrios · {tag || "todos los lugares"}
      </p>

      {availableTags.length > 0 && (
        <select
          value={tag}
          onChange={(e) => setTag(e.target.value)}
          className="mb-2 w-full rounded-lg border border-border bg-surface px-2 py-1 text-xs text-ink outline-none focus:border-aqua"
        >
          <option value="">Todos los lugares</option>
          {availableTags.map((t) => (
            <option key={t} value={t}>
              Sólo: {t}
            </option>
          ))}
        </select>
      )}

      {info && (
        <p className="mb-2 text-sm font-medium text-ink">
          {info.name} ·{" "}
          <span className={info.count > 0 ? "text-aqua" : "text-pink-500"}>
            {info.count} {info.count === 1 ? "lugar" : "lugares"}
          </span>
        </p>
      )}

      <div className="flex items-end gap-1.5">
        {LEGEND.map((step, i) => (
          <div key={step.label} className="flex flex-col items-center gap-0.5">
            <span
              className="size-4 rounded border border-border"
              style={{ backgroundColor: step.color, opacity: step.opacity }}
            />
            <span className="text-[10px] text-muted">{i === 0 ? "no fui" : step.label}</span>
          </div>
        ))}
      </div>

      {error && (
        <p className="mt-2 text-xs text-rose-600 dark:text-rose-300">
          No se pudo cargar el mapa de barrios.
        </p>
      )}
    </div>
  )
}
