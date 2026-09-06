// lib/supabase/client.ts
// Browser-side Supabase client. Safe to use in client components --
// only ever initialized with the public URL + publishable (anon) key,
// never the DB password or any service-role/secret key.

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
const supabasePublishableKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY

if (!supabaseUrl || !supabasePublishableKey) {
  console.warn(
    'Supabase env vars are missing. Set NEXT_PUBLIC_SUPABASE_URL and ' +
    'NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY (see .env.example).'
  )
}

export const supabase = createClient(
  supabaseUrl ?? '',
  supabasePublishableKey ?? ''
)
