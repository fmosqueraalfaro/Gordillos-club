import { supabase } from "@/lib/supabase"
import type { NewExperienceInput } from "@/features/experiences/types"

/** Los datos de UNA visita (sin el lugar): sirven para lugar nuevo o existente. */
export type VisitInput = {
  visitedOn: string // YYYY-MM-DD
  dish: string
  note: string
  rating: number // 1–5
}

/** Inserta la experiencia (visita) + tu puntuación sobre un lugar ya conocido. */
async function insertVisit(restaurantId: string, input: VisitInput, userId: string) {
  const { data: experience, error: eErr } = await supabase
    .from("experiences")
    .insert({
      restaurant_id: restaurantId,
      visited_on: input.visitedOn,
      dish: input.dish || null,
      note: input.note || null,
      created_by: userId,
    })
    .select("id")
    .single()
  if (eErr) throw eErr

  const { error: ratErr } = await supabase
    .from("experience_ratings")
    .insert({ experience_id: experience.id, user_id: userId, rating: input.rating })
  if (ratErr) throw ratErr

  return experience.id as string
}

/**
 * Crea un lugar NUEVO + su primera experiencia + tu puntuación, en cadena.
 * (Para sumar otra visita a un lugar YA existente, usar `addVisitToRestaurant`.)
 */
export async function createExperience(input: NewExperienceInput, userId: string) {
  const { data: restaurant, error: rErr } = await supabase
    .from("restaurants")
    .insert({
      name: input.name,
      lat: input.lat,
      lng: input.lng,
      neighborhood: input.neighborhood,
      created_by: userId,
    })
    .select("id")
    .single()
  if (rErr) throw rErr

  const experienceId = await insertVisit(restaurant.id, input, userId)
  return { restaurantId: restaurant.id as string, experienceId }
}

/** Suma otra visita a un lugar YA existente (sin duplicar el pin). */
export async function addVisitToRestaurant(
  restaurantId: string,
  input: VisitInput,
  userId: string,
) {
  const experienceId = await insertVisit(restaurantId, input, userId)
  return { restaurantId, experienceId }
}
