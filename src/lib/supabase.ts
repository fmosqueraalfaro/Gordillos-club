import { createClient } from "@supabase/supabase-js"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error(
    "Faltan variables de entorno de Supabase. Copiá .env.example a .env y completá " +
      "VITE_SUPABASE_URL y VITE_SUPABASE_ANON_KEY (ver supabase/README.md).",
  )
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey)
