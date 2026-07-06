import { supabase } from "@/lib/supabase"
import type { NewExperienceInput, RatingInput } from "@/features/experiences/types"

/** Los datos de UNA visita (sin el lugar): sirven para lugar nuevo o existente. */
export type VisitInput = {
  visitedOn: string // YYYY-MM-DD
  dish: string
  note: string
  ratings: RatingInput[] // la nota de cada persona
}

/** Inserta las notas (una por persona, si es > 0) de una experiencia. */
async function insertRatings(experienceId: string, ratings: RatingInput[]) {
  const rows = ratings
    .filter((r) => r.rating > 0)
    .map((r) => ({ experience_id: experienceId, user_id: r.userId, rating: r.rating }))
  if (rows.length === 0) return
  const { error } = await supabase.from("experience_ratings").insert(rows)
  if (error) throw error
}

/** Inserta la experiencia (visita) + las notas sobre un lugar ya conocido. */
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

  await insertRatings(experience.id, input.ratings)
  return experience.id as string
}

/**
 * Crea un lugar NUEVO + su primera experiencia + las notas, en cadena.
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

/** Actualiza los datos de una experiencia (fecha, plato, nota). */
export async function updateExperience(
  experienceId: string,
  fields: { visitedOn: string; dish: string; note: string },
) {
  const { error } = await supabase
    .from("experiences")
    .update({
      visited_on: fields.visitedOn,
      dish: fields.dish || null,
      note: fields.note || null,
    })
    .eq("id", experienceId)
  if (error) throw error
}

/**
 * Borra una experiencia entera (cascada: sus notas y filas de fotos). Los
 * archivos de Storage se borran best-effort después.
 */
export async function deleteExperience(experienceId: string) {
  const { data: pics } = await supabase
    .from("photos")
    .select("storage_path")
    .eq("experience_id", experienceId)

  const { error } = await supabase.from("experiences").delete().eq("id", experienceId)
  if (error) throw error

  const paths = (pics ?? []).map((p) => p.storage_path as string)
  if (paths.length > 0) {
    await supabase.storage.from("photos").remove(paths)
  }
}

/**
 * Crea/actualiza las notas de una experiencia existente (editar después).
 * Upsert por (experience_id, user_id): cada persona tiene UNA nota.
 * Una nota en 0 se interpreta como "sacarla" (se borra la fila).
 */
export async function upsertRatings(experienceId: string, ratings: RatingInput[]) {
  const toSet = ratings.filter((r) => r.rating > 0)
  const toClear = ratings.filter((r) => r.rating <= 0).map((r) => r.userId)

  if (toSet.length > 0) {
    const rows = toSet.map((r) => ({
      experience_id: experienceId,
      user_id: r.userId,
      rating: r.rating,
    }))
    const { error } = await supabase
      .from("experience_ratings")
      .upsert(rows, { onConflict: "experience_id,user_id" })
    if (error) throw error
  }

  if (toClear.length > 0) {
    const { error } = await supabase
      .from("experience_ratings")
      .delete()
      .eq("experience_id", experienceId)
      .in("user_id", toClear)
    if (error) throw error
  }
}
