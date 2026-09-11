// app/manager/menu/page.tsx
// Menu management moved to the Website Admin dashboard -- menu content,
// pricing, and hero slideshow selection are website-management
// concerns, not restaurant-operations concerns.
import { redirect } from 'next/navigation'

export default function ManagerMenuRedirect() {
  redirect('/dashboard/menu')
}
