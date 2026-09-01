import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL as string
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY as string

if (!supabaseUrl || !supabaseAnonKey) {
  // Fails loudly in dev rather than silently breaking auth/edge-function calls.
  console.error(
    'Missing VITE_SUPABASE_URL or VITE_SUPABASE_ANON_KEY. Copy .env.example to .env and fill in your project values.',
  )
}

// This client only ever holds the public anon key. RLS on `orders` blocks all
// direct public reads/writes — every customer-facing order operation goes
// through the create-order Edge Function instead. Admin reads/writes are
// gated by Supabase Auth + RLS admin policy, not by this key.
export const supabase = createClient(supabaseUrl, supabaseAnonKey)

export const EDGE_FUNCTIONS_URL = `${supabaseUrl}/functions/v1`
