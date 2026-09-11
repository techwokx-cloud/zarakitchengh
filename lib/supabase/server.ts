// lib/supabase/server.ts
// Server-side only Supabase client using the SERVICE ROLE key, which
// bypasses Row Level Security entirely. Never import this in a client
// component or expose this key to the browser -- it has full database
// access. Used for things like the scheduled monthly report, which
// runs with no logged-in user session to satisfy normal RLS policies.

import { createClient } from '@supabase/supabase-js'

export function getServiceSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceKey = process.env.SUPABASE_SERVICE_KEY

  if (!url || !serviceKey) {
    throw new Error(
      'SUPABASE_SERVICE_KEY is not set. Get it from Supabase Dashboard > ' +
      'Settings > API > service_role key, and add it as an environment ' +
      'variable (server-side only, never NEXT_PUBLIC_).'
    )
  }

  return createClient(url, serviceKey)
}
