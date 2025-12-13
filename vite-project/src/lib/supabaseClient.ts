// src/lib/supabaseClient.ts
import { createClient } from "@supabase/supabase-js";

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

console.log("VITE_SUPABASE_URL:", import.meta.env.VITE_SUPABASE_URL);

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error("Supabase env vars missing in frontend");
}

export const supabase = createClient(
  supabaseUrl,
  supabaseAnonKey
);
