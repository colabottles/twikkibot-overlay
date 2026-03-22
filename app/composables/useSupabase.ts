import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://gtctafjbikdrplrzzenq.supabase.co',
  'sb_publishable_oO9FxHGHg_lpBUKK0zuKIA_bmcw8l5j'
)

export function useSupabase() {
  return supabase
}