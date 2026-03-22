import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://gtctafjbikdrplrzzenq.supabase.co',
  'your_anon_key_here',
  {
    realtime: {
      params: {
        vsn: '1.0.0'
      }
    }
  }
)

export function useSupabase() {
  return supabase
}