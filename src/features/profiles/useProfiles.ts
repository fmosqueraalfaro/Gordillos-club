import { useEffect, useState } from "react"
import { supabase } from "@/lib/supabase"

export type PersonProfile = {
  id: string
  displayName: string
}

/**
 * Trae los perfiles (los dos gordillos). Ordena al usuario logueado primero
 * para que su estrella aparezca arriba en el formulario.
 */
export function useProfiles(currentUserId?: string) {
  const [profiles, setProfiles] = useState<PersonProfile[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    let active = true
    supabase
      .from("profiles")
      .select("id, display_name, created_at")
      .order("created_at", { ascending: true })
      .then(({ data }) => {
        if (!active) return
        const list: PersonProfile[] = (data ?? []).map((p) => ({
          id: p.id as string,
          displayName: (p.display_name as string | null) ?? "Gordillo",
        }))
        // El usuario actual primero.
        list.sort((a, b) => {
          if (a.id === currentUserId) return -1
          if (b.id === currentUserId) return 1
          return 0
        })
        setProfiles(list)
        setLoading(false)
      })
    return () => {
      active = false
    }
  }, [currentUserId])

  return { profiles, loading }
}
