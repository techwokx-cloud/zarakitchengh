// app/admin/page.tsx
// Bare /admin had no page, so it 404'd. Redirect to the real login
// entry point -- the layout guards on /dashboard and /manager send
// each role to the correct place after signing in.

import { redirect } from 'next/navigation'

export default function AdminIndexRedirect() {
  redirect('/dashboard/login')
}
