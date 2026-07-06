import { supabase } from "@/lib/supabase"

const BUCKET = "photos"

/** URL pública de una foto a partir de su `storage_path` (el bucket es público). */
export function photoPublicUrl(storagePath: string): string {
  return supabase.storage.from(BUCKET).getPublicUrl(storagePath).data.publicUrl
}

/**
 * Sube archivos al bucket `photos` y registra cada uno en la tabla `photos`,
 * ligados a la experiencia. Path: `<userId>/<experienceId>/<uuid>.<ext>`.
 * Best-effort: si una foto falla, corta y avisa (la experiencia ya se guardó).
 */
export async function uploadExperiencePhotos(
  experienceId: string,
  files: File[],
  userId: string,
) {
  for (const file of files) {
    const ext = file.name.split(".").pop()?.toLowerCase() || "jpg"
    const path = `${userId}/${experienceId}/${crypto.randomUUID()}.${ext}`

    const { error: upErr } = await supabase.storage
      .from(BUCKET)
      .upload(path, file, { cacheControl: "3600", upsert: false })
    if (upErr) throw upErr

    const { error: rowErr } = await supabase
      .from("photos")
      .insert({ experience_id: experienceId, storage_path: path })
    if (rowErr) throw rowErr
  }
}
