import { supabase } from "@/lib/supabase"

/** Actualiza los tags de un lugar (los dos pueden editar — RLS compartida). */
export async function updateRestaurantTags(restaurantId: string, tags: string[]) {
  const { error } = await supabase
    .from("restaurants")
    .update({ tags })
    .eq("id", restaurantId)
  if (error) throw error
}
