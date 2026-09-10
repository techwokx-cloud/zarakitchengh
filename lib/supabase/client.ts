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

// createClient() validates its URL and throws immediately if it's missing
// or malformed -- which crashes the entire Next.js build (not just the one
// page using it) whenever these env vars aren't set on the deploy host.
// Falling back to a syntactically-valid placeholder URL means the client
// always constructs successfully; any actual Supabase call will simply
// fail at runtime (safely, inside a try/catch) if the real env vars are
// still missing, instead of taking down the whole build.
export const supabase = createClient(
  supabaseUrl || 'https://placeholder.supabase.co',
  supabasePublishableKey || 'placeholder-key'
)
