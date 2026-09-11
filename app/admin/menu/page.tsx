// app/admin/menu/page.tsx
// This was an earlier, non-functional menu-editing UI (no backend
// connection). Superseded by the real /manager/menu (Supabase-backed
// CRUD). Redirecting here to avoid confusion between the two.

import { redirect } from 'next/navigation'

export default function LegacyAdminMenuRedirect() {
  redirect('/dashboard/login')
}
