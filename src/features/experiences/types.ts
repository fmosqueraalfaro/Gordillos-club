export type DraftLocation = { lat: number; lng: number }

/** La estrella de una persona (1–5) sobre una experiencia. */
export type RatingInput = {
  userId: string
  rating: number
}

export type NewExperienceInput = {
  name: string
  neighborhood: string | null
  lat: number
  lng: number
  visitedOn: string // YYYY-MM-DD
  dish: string
  note: string
  ratings: RatingInput[] // la nota de cada persona
}
