export type DraftLocation = { lat: number; lng: number }

export type NewExperienceInput = {
  name: string
  neighborhood: string | null
  lat: number
  lng: number
  visitedOn: string // YYYY-MM-DD
  dish: string
  note: string
  rating: number // 1–5
}
