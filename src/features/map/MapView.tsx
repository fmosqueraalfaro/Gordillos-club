import { APIProvider, Map, Marker } from "@vis.gl/react-google-maps"
import { useRestaurants } from "@/features/restaurants/useRestaurants"
import { MapPinIcon } from "@/components/ui/icons"

const KEY = import.meta.env.VITE_GOOGLE_MAPS_API_KEY
const BUENOS_AIRES = { lat: -34.6037, lng: -58.3816 }

export function MapView() {
  if (!KEY) {
    return <MissingKey />
  }

  return (
    <div className="relative h-full w-full">
      <APIProvider apiKey={KEY}>
        <Map
          defaultCenter={BUENOS_AIRES}
          defaultZoom={12}
          gestureHandling="greedy"
          disableDefaultUI
          className="h-full w-full"
        >
          <RestaurantMarkers />
        </Map>
      </APIProvider>
    </div>
  )
}

function RestaurantMarkers() {
  const { restaurants } = useRestaurants()
  return (
    <>
      {restaurants.map((r) => (
        <Marker key={r.id} position={{ lat: r.lat, lng: r.lng }} title={r.name} />
      ))}
    </>
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
