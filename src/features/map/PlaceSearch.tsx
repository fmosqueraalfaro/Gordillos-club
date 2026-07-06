import { useEffect, useRef, useState } from "react"
import { useMap, useMapsLibrary } from "@vis.gl/react-google-maps"
import { MapPinIcon } from "@/components/ui/icons"

export type PickedPlace = {
  name: string
  neighborhood: string | null
  lat: number
  lng: number
}

// Prioridad para deducir el "barrio" desde los componentes de la dirección.
const NEIGHBORHOOD_TYPES = ["sublocality_level_1", "sublocality", "neighborhood"]

function extractNeighborhood(
  components?: google.maps.places.AddressComponent[],
): string | null {
  if (!components) return null
  for (const type of NEIGHBORHOOD_TYPES) {
    const match = components.find((c) => c.types.includes(type))
    if (match?.longText) return match.longText
  }
  return null
}

/**
 * Búsqueda de restaurantes con Google Places (API nueva). Usa session tokens
 * para abaratar el costo (una sesión = varias teclas + un fetchFields).
 * Requiere habilitar "Places API (New)" en Google Cloud.
 */
export function PlaceSearch({ onPick }: { onPick: (place: PickedPlace) => void }) {
  const placesLib = useMapsLibrary("places")
  const map = useMap()
  const [input, setInput] = useState("")
  const [suggestions, setSuggestions] = useState<
    google.maps.places.AutocompleteSuggestion[]
  >([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const tokenRef = useRef<google.maps.places.AutocompleteSessionToken | null>(null)

  // Autocomplete con debounce mientras se escribe.
  useEffect(() => {
    if (!placesLib) return
    const q = input.trim()
    if (q.length < 3) {
      setSuggestions([])
      setError(null)
      return
    }
    let active = true
    const timer = setTimeout(async () => {
      try {
        setBusy(true)
        setError(null)
        if (!tokenRef.current) {
          tokenRef.current = new placesLib.AutocompleteSessionToken()
        }
        const { suggestions } =
          await placesLib.AutocompleteSuggestion.fetchAutocompleteSuggestions({
            input: q,
            sessionToken: tokenRef.current,
            language: "es",
            region: "AR",
            locationBias: map?.getBounds() ?? undefined,
          })
        if (active) setSuggestions(suggestions)
      } catch (err) {
        if (active) {
          setSuggestions([])
          setError("No se pudo buscar. ¿Habilitaste 'Places API (New)' en Google Cloud?")
          console.warn(err)
        }
      } finally {
        if (active) setBusy(false)
      }
    }, 300)
    return () => {
      active = false
      clearTimeout(timer)
    }
  }, [input, placesLib, map])

  async function handlePick(suggestion: google.maps.places.AutocompleteSuggestion) {
    const prediction = suggestion.placePrediction
    if (!prediction) return
    try {
      const place = prediction.toPlace()
      await place.fetchFields({
        fields: ["location", "displayName", "addressComponents"],
      })
      const loc = place.location
      if (!loc) return
      const lat = loc.lat()
      const lng = loc.lng()
      map?.panTo({ lat, lng })
      map?.setZoom(16)
      tokenRef.current = null // la sesión termina en el fetchFields
      setInput("")
      setSuggestions([])
      onPick({
        name: place.displayName ?? prediction.text.text,
        neighborhood: extractNeighborhood(place.addressComponents),
        lat,
        lng,
      })
    } catch (err) {
      setError("No se pudieron traer los datos del lugar.")
      console.warn(err)
    }
  }

  return (
    <div className="absolute inset-x-4 top-4 z-30 mx-auto max-w-md">
      <div className="flex items-center gap-2 rounded-full border border-border bg-surface/95 px-4 py-2.5 shadow-lg backdrop-blur">
        <MapPinIcon className="size-4 shrink-0 text-aqua" />
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Buscar un restaurante…"
          className="w-full bg-transparent text-sm text-ink outline-none placeholder:text-muted/70"
        />
        {input && (
          <button
            type="button"
            onClick={() => {
              setInput("")
              setSuggestions([])
            }}
            aria-label="Limpiar búsqueda"
            className="shrink-0 text-muted hover:text-ink"
          >
            ✕
          </button>
        )}
      </div>

      {(busy || error || suggestions.length > 0) && (
        <ul className="mt-2 overflow-hidden rounded-2xl border border-border bg-surface shadow-xl">
          {busy && <li className="px-4 py-3 text-sm text-muted">Buscando…</li>}
          {error && (
            <li className="px-4 py-3 text-sm text-rose-600 dark:text-rose-300">{error}</li>
          )}
          {suggestions.map((suggestion) => {
            const prediction = suggestion.placePrediction
            if (!prediction) return null
            return (
              <li key={prediction.placeId}>
                <button
                  type="button"
                  onClick={() => handlePick(suggestion)}
                  className="flex w-full flex-col items-start gap-0.5 px-4 py-2.5 text-left transition hover:bg-surface-2"
                >
                  <span className="text-sm font-medium text-ink">
                    {prediction.mainText?.text ?? prediction.text.text}
                  </span>
                  {prediction.secondaryText?.text && (
                    <span className="text-xs text-muted">
                      {prediction.secondaryText.text}
                    </span>
                  )}
                </button>
              </li>
            )
          })}
        </ul>
      )}
    </div>
  )
}
