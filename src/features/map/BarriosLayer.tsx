import { useEffect, useMemo, useState } from "react"
import { useMap } from "@vis.gl/react-google-maps"
import { countByBarrio } from "@/features/map/geo"
import type { BarriosGeoJson } from "@/features/map/geo"

const AQUA = "#0FB4A3"

// Rampa secuencial (un solo tono): más lugares visitados = más intenso.
const STEPS = [
  { label: "0", opacity: 0.05 },
  { label: "1", opacity: 0.28 },
  { label: "2", opacity: 0.45 },
  { label: "3", opacity: 0.62 },
  { label: "4+", opacity: 0.82 },
]

function opacityFor(count: number): number {
  if (count >= 4) return 0.82
  if (count === 3) return 0.62
  if (count === 2) return 0.45
  if (count === 1) return 0.28
  return 0.05
}

/**
 * Pinta los barrios de CABA según cuántos lugares visitamos en cada uno
 * (choropleth). El GeoJSON se carga solo al activar la capa. El conteo es por
 * punto-en-polígono con la ubicación de cada lugar (no por texto del barrio).
 */
export function BarriosLayer({
  restaurants,
}: {
  restaurants: { lat: number; lng: number }[]
}) {
  const map = useMap()
  const [geo, setGeo] = useState<BarriosGeoJson | null>(null)
  const [error, setError] = useState(false)
  const [info, setInfo] = useState<{ name: string; count: number } | null>(null)

  // Cargar el GeoJSON de barrios (una vez).
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

  const counts = useMemo(
    () => (geo ? countByBarrio(restaurants, geo.features) : new Map<string, number>()),
    [geo, restaurants],
  )

  // Dibujar los polígonos y estilarlos por cantidad.
  useEffect(() => {
    if (!map || !geo) return
    const added = map.data.addGeoJson(geo)
    map.data.setStyle((feature) => {
      const name = feature.getProperty("nombre") as string
      const count = counts.get(name) ?? 0
      return {
        fillColor: AQUA,
        fillOpacity: opacityFor(count),
        strokeColor: AQUA,
        strokeOpacity: 0.6,
        strokeWeight: 1,
      }
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
    <div className="absolute left-4 top-4 z-30 w-fit max-w-[75%] rounded-2xl border border-border bg-surface/95 p-3 shadow-lg backdrop-blur">
      {info ? (
        <p className="mb-2 text-sm font-medium text-ink">
          {info.name} ·{" "}
          <span className="text-aqua">
            {info.count} {info.count === 1 ? "lugar" : "lugares"}
          </span>
        </p>
      ) : (
        <p className="mb-2 text-xs font-medium uppercase tracking-wide text-muted">
          Lugares por barrio
        </p>
      )}

      <div className="flex items-end gap-1.5">
        {STEPS.map((step) => (
          <div key={step.label} className="flex flex-col items-center gap-0.5">
            <span
              className="size-4 rounded border border-border"
              style={{ backgroundColor: AQUA, opacity: step.opacity }}
            />
            <span className="text-[10px] text-muted">{step.label}</span>
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
