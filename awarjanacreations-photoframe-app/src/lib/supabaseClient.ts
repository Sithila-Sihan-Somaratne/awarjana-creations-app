// src/lib/supabaseClient.ts

import { createClient } from '@supabase/supabase-js';

// Ensure these environment variables are defined in your .env file
// VITE_SUPABASE_URL="https://your-project-ref.supabase.co"
// VITE_SUPABASE_ANON_KEY="your-anon-key"

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL;
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Supabase URL and Anon Key must be provided in environment variables.');
}

/**
 * Global Supabase client instance.
 * @type {import('@supabase/supabase-js').SupabaseClient}
 */
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Optional: Type definition for your DB schema (recommended)
// export const supabase = createClient<Database>(supabaseUrl, supabaseAnonKey);