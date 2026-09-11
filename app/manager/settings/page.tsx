// app/manager/settings/page.tsx
// Restaurant profile + opening hours (shown on the public website)
// moved to the Website Admin dashboard -- this is website content.
import { redirect } from 'next/navigation'

export default function ManagerSettingsRedirect() {
  redirect('/dashboard/settings')
}
