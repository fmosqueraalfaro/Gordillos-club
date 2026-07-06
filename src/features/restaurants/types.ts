export type Restaurant = {
  id: string
  name: string
  lat: number
  lng: number
  neighborhood: string | null
  city: string | null
  tags: string[]
  google_place_id: string | null
  created_by: string | null
  created_at: string
}
