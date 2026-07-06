import { useCallback, useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import { photoPublicUrl } from "@/features/experiences/photos"

export type ExperiencePerson = {
  userId: string
  name: string
  rating: number
  main: string | null // principal
  dessert: string | null // postre
}

export type ExperiencePhoto = {
  id: string
  url: string
  storagePath: string
  caption: string | null
}

export type ExperienceEntry = {
  id: string
  visitedOn: string // YYYY-MM-DD
  starter: string | null // entrada (compartida)
  price: number | null // la cuenta (total)
  note: string | null
  createdAt: string
  restaurant: {
    id: string
    name: string
    neighborhood: string | null
    lat: number
    lng: number
  }
  people: ExperiencePerson[]
  photos: ExperiencePhoto[]
}

const SELECT = `
  id, visited_on, starter, price, note, created_at,
  restaurant:restaurants!inner ( id, name, neighborhood, lat, lng ),
  people:experience_ratings ( rating, user_id, main, dessert, user:profiles ( id, display_name ) ),
  photos ( id, storage_path, caption )
`

/* eslint-disable @typescript-eslint/no-explicit-any */
function mapRow(row: any): ExperienceEntry {
  return {
    id: row.id,
    visitedOn: row.visited_on,
    starter: row.starter,
    price: row.price != null ? Number(row.price) : null,
    note: row.note,
    createdAt: row.created_at,
    restaurant: {
      id: row.restaurant.id,
      name: row.restaurant.name,
      neighborhood: row.restaurant.neighborhood,
      lat: row.restaurant.lat,
      lng: row.restaurant.lng,
    },
    people: (row.people ?? []).map((p: any) => ({
      userId: p.user_id,
      name: p.user?.display_name ?? "Alguien",
      rating: Number(p.rating),
      main: p.main ?? null,
      dessert: p.dessert ?? null,
    })),
    photos: (row.photos ?? []).map((p: any) => ({
      id: p.id,
      url: photoPublicUrl(p.storage_path),
      storagePath: p.storage_path,
      caption: p.caption ?? null,
    })),
  }
}
/* eslint-enable @typescript-eslint/no-explicit-any */

/**
 * Trae experiencias (visitas) con su lugar, lo de cada persona y las fotos.
 * Con `restaurantId` filtra las de un solo lugar (detalle del pin); sin él,
 * trae todas ordenadas de la más nueva a la más vieja (el Diario).
 */
export function useExperiences(restaurantId?: string) {
  const [experiences, setExperiences] = useState<ExperienceEntry[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const reload = useCallback(() => {
    setLoading(true)
    setError(null)
    let query = supabase
      .from("experiences")
      .select(SELECT)
      .order("visited_on", { ascending: false })
      .order("created_at", { ascending: false })

    if (restaurantId) query = query.eq("restaurant_id", restaurantId)

    query.then(({ data, error }) => {
      if (error) setError(error.message)
      else setExperiences((data ?? []).map(mapRow))
      setLoading(false)
    })
  }, [restaurantId])

  useEffect(() => {
    reload()
  }, [reload])

  return { experiences, loading, error, reload }
}
