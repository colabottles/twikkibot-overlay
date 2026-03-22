import { createClient } from '@supabase/supabase-js'

const supabase = createClient(
  'https://gtctafjbikdrplrzzenq.supabase.co',
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imd0Y3RhZmpiaWtkcnBscnp6ZW5xIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzQxOTA5MDAsImV4cCI6MjA4OTc2NjkwMH0.2AATvK4m4UrHZMj376oscYVMpjnPpXH5syq0IdSr15w'
)

export function useSupabase() {
  return supabase
}