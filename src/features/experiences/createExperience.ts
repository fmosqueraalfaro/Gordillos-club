import { supabase } from "@/lib/supabase"
import type { NewExperienceInput, PersonEntry } from "@/features/experiences/types"

/** Los datos de UNA visita (sin el lugar): sirven para lugar nuevo o existente. */
export type VisitInput = {
  visitedOn: string // YYYY-MM-DD
  starter: string // entrada (compartida)
  price: number | null // la cuenta (total)
  note: string
  people: PersonEntry[]
}

/** Inserta la fila de cada persona (principal/postre/nota), si tiene nota > 0. */
async function insertPeople(experienceId: string, people: PersonEntry[]) {
  const rows = people
    .filter((p) => p.rating > 0)
    .map((p) => ({
      experience_id: experienceId,
      user_id: p.userId,
      rating: p.rating,
      main: p.main || null,
      dessert: p.dessert || null,
    }))
  if (rows.length === 0) return
  const { error } = await supabase.from("experience_ratings").insert(rows)
  if (error) throw error
}

/** Inserta la experiencia (visita) + las filas de cada persona. */
async function insertVisit(restaurantId: string, input: VisitInput, userId: string) {
  const { data: experience, error: eErr } = await supabase
    .from("experiences")
    .insert({
      restaurant_id: restaurantId,
      visited_on: input.visitedOn,
      starter: input.starter || null,
      price: input.price,
      note: input.note || null,
      created_by: userId,
    })
    .select("id")
    .single()
  if (eErr) throw eErr

  await insertPeople(experience.id, input.people)
  return experience.id as string
}

/**
 * Crea un lugar NUEVO + su primera experiencia + las filas de cada persona.
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

/** Actualiza los datos compartidos de una experiencia (fecha, entrada, precio, nota). */
export async function updateExperience(
  experienceId: string,
  fields: { visitedOn: string; starter: string; price: number | null; note: string },
) {
  const { error } = await supabase
    .from("experiences")
    .update({
      visited_on: fields.visitedOn,
      starter: fields.starter || null,
      price: fields.price,
      note: fields.note || null,
    })
    .eq("id", experienceId)
  if (error) throw error
}

/**
 * Borra una experiencia entera (cascada: filas de cada persona y de fotos). Los
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
 * Crea/actualiza las filas de cada persona de una experiencia (editar después).
 * Upsert por (experience_id, user_id): una fila por persona. Nota en 0 = se borra.
 */
export async function upsertPeople(experienceId: string, people: PersonEntry[]) {
  const toSet = people.filter((p) => p.rating > 0)
  const toClear = people.filter((p) => p.rating <= 0).map((p) => p.userId)

  if (toSet.length > 0) {
    const rows = toSet.map((p) => ({
      experience_id: experienceId,
      user_id: p.userId,
      rating: p.rating,
      main: p.main || null,
      dessert: p.dessert || null,
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
