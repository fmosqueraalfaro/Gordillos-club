import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"
import type { Restaurant } from "@/features/restaurants/types"

const COLUMNS =
  "id, name, lat, lng, neighborhood, city, tags, google_place_id, created_by, created_at"

export function useRestaurants() {
  const [restaurants, setRestaurants] = useState<Restaurant[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let active = true
    supabase
      .from("restaurants")
      .select(COLUMNS)
      .order("created_at", { ascending: false })
      .then(({ data, error }) => {
        if (!active) return
        if (error) setError(error.message)
        else setRestaurants((data ?? []) as Restaurant[])
        setLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  return { restaurants, loading, error }
}
