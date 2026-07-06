import { useCallback, useEffect, useRef, useState } from "react"
import { APIProvider, Map, Marker, useMap } from "@vis.gl/react-google-maps"
import { useRestaurants } from "@/features/restaurants/useRestaurants"
import { AddExperienceSheet } from "@/features/experiences/AddExperienceSheet"
import { RestaurantDetailSheet } from "@/features/restaurants/RestaurantDetailSheet"
import type { DraftLocation } from "@/features/experiences/types"
import type { Restaurant } from "@/features/restaurants/types"
import { MapPinIcon, PlusIcon, LocateIcon } from "@/components/ui/icons"

const KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
const BUENOS_AIRES = { lat: -34.6037, lng: -58.3816 }

export function MapView() {
  if (!KEY) return <MissingKey />
  return <MapInner />
}

function MapInner() {
  const { restaurants, reload } = useRestaurants()
  const [placing, setPlacing] = useState(false)
  const [draft, setDraft] = useState<DraftLocation | null>(null)
  const [selected, setSelected] = useState<Restaurant | null>(null)

  return (
    <div className="relative h-full w-full">
      <APIProvider apiKey={KEY}>
        <Map
          defaultCenter={BUENOS_AIRES}
          defaultZoom={12}
          gestureHandling="greedy"
          disableDefaultUI
          className="h-full w-full"
          onClick={(ev) => {
            if (!placing) return
            const ll = ev.detail.latLng
            if (!ll) return
            setDraft({ lat: ll.lat, lng: ll.lng })
            setPlacing(false)
          }}
        >
          {restaurants.map((r) => (
            <Marker
              key={r.id}
              position={{ lat: r.lat, lng: r.lng }}
              title={r.name}
              onClick={() => {
                if (placing) return
                setSelected(r)
              }}
            />
          ))}
          {draft && <Marker position={draft} />}
        </Map>

        <MyLocation />

        {/* Banner de "elegí el punto" */}
        {placing && (
          <div className="absolute inset-x-0 top-4 z-10 mx-auto flex w-fit items-center gap-3 rounded-full border border-border bg-surface/95 px-4 py-2 text-sm text-ink shadow-lg backdrop-blur">
            <MapPinIcon className="size-4 text-aqua" />
            Tocá el mapa donde estuvieron
            <button
              type="button"
              onClick={() => setPlacing(false)}
              className="font-medium text-muted hover:text-ink"
            >
              Cancelar
            </button>
          </div>
        )}

        {/* Botón flotante para agregar (por encima de la barra de navegación) */}
        {!placing && !draft && (
          <button
            type="button"
            onClick={() => setPlacing(true)}
            className="absolute bottom-20 right-5 z-20 inline-flex items-center gap-2 rounded-full bg-aqua px-5 py-3 font-semibold text-aqua-ink shadow-lg transition hover:brightness-105 active:brightness-95"
          >
            <PlusIcon className="size-5" />
            Agregar
          </button>
        )}

        {draft && (
          <AddExperienceSheet
            location={draft}
            onClose={() => setDraft(null)}
            onSaved={() => {
              setDraft(null)
              reload()
            }}
          />
        )}

        {selected && (
          <RestaurantDetailSheet
            restaurant={selected}
            onClose={() => setSelected(null)}
            onChanged={reload}
          />
        )}
      </APIProvider>
    </div>
  )
}

/**
 * Centra el mapa en tu ubicación al abrir (una sola vez) y ofrece un botón
 * para volver a centrar. Gratis: geolocalización del navegador (requiere HTTPS
 * o localhost). Si el usuario no da permiso, el mapa se queda en Buenos Aires.
 */
function MyLocation() {
  const map = useMap()
  const didInit = useRef(false)

  const locate = useCallback(
    (zoom: number) => {
      if (!map || !("geolocation" in navigator)) return
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          map.panTo({ lat: pos.coords.latitude, lng: pos.coords.longitude })
          map.setZoom(zoom)
        },
        () => {
          /* permiso denegado o sin señal: se queda donde estaba */
        },
        { enableHighAccuracy: true, timeout: 8000, maximumAge: 60000 },
      )
    },
    [map],
  )

  // Centrado inicial, una sola vez, cuando el mapa está listo.
  useEffect(() => {
    if (!map || didInit.current) return
    didInit.current = true
    locate(15)
  }, [map, locate])

  return (
    <button
      type="button"
      onClick={() => locate(16)}
      aria-label="Centrar en mi ubicación"
      className="absolute bottom-20 left-5 z-20 grid size-11 place-items-center rounded-full border border-border bg-surface/95 text-ink shadow-lg backdrop-blur transition hover:text-aqua active:brightness-95"
    >
      <LocateIcon className="size-5" />
    </button>
  )
}

function MissingKey() {
  return (
    <div className="grid h-full place-items-center p-6">
      <div className="max-w-md rounded-2xl border border-dashed border-border bg-surface p-6 text-center shadow-sm">
        <div className="mx-auto grid size-12 place-items-center rounded-full bg-aqua/15 text-aqua">
          <MapPinIcon className="size-6" />
        </div>
        <h2 className="mt-3 font-display text-xl font-semibold text-ink">
          Falta conectar Google Maps
        </h2>
        <p className="mt-2 text-sm leading-relaxed text-muted">
          Seguí los pasos de <code className="rounded bg-surface-2 px-1 py-0.5 text-xs">docs/setup-google-maps.md</code>,
          pegá tu API key en <code className="rounded bg-surface-2 px-1 py-0.5 text-xs">.env</code> como{" "}
          <code className="rounded bg-surface-2 px-1 py-0.5 text-xs">VITE_GOOGLE_MAPS_API_KEY</code> y recargá.
        </p>
      </div>
    </div>
  )
}
