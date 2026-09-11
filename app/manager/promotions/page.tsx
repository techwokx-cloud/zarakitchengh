// app/manager/promotions/page.tsx
// Promotions (site announcement bar/popup) moved to the Website Admin
// dashboard -- this is website content, not restaurant operations.
import { redirect } from 'next/navigation'

export default function ManagerPromotionsRedirect() {
  redirect('/dashboard/promotions')
}
