import { supabase } from "@/lib/supabase"
import type { NewExperienceInput } from "@/features/experiences/types"

/**
 * Crea un lugar + su primera experiencia + tu puntuación, en cadena.
 * (Elegir un lugar YA existente para sumar otra visita llega en la entrega 2.)
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

  const { data: experience, error: eErr } = await supabase
    .from("experiences")
    .insert({
      restaurant_id: restaurant.id,
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

  return { restaurantId: restaurant.id, experienceId: experience.id }
}
