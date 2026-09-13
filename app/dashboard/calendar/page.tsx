// app/dashboard/calendar/page.tsx
// Content Calendar removed -- posting is automated via Buffer instead
// of a manual visual calendar. Redirecting to Overview.
import { redirect } from 'next/navigation'

export default function ContentCalendarRedirect() {
  redirect('/dashboard')
}
