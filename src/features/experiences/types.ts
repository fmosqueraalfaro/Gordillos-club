export type DraftLocation = { lat: number; lng: number }

/** Lo de cada persona en una experiencia: su principal, su postre y su nota. */
export type PersonEntry = {
  userId: string
  rating: number // 1–5 (0 = sin nota → no se guarda esa fila)
  main: string // principal (de cada uno)
  dessert: string // postre (de cada uno, opcional)
}

export type NewExperienceInput = {
  name: string
  neighborhood: string | null
  lat: number
  lng: number
  visitedOn: string // YYYY-MM-DD
  starter: string // entrada (compartida)
  price: number | null // la cuenta (total)
  note: string
  people: PersonEntry[]
}
