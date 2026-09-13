// app/api/reports/monthly/route.ts
//
// Generates the monthly report (reservations -- the only real data
// source right now) and emails it to the Restaurant Manager. Meant to
// be triggered on a schedule (e.g. a DirectAdmin cron job hitting this
// URL once a month), not by a logged-in user -- so it's protected by
// a secret token in the query string instead of a user session.
//
// Call as: GET /api/reports/monthly?secret=YOUR_CRON_SECRET

import { NextRequest, NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase/server'
import { sendEmail } from '@/lib/email'

const RESTAURANT_MANAGER_EMAIL = 'restaurantmanager@zarakitchen.online'
const REPORT_FROM_EMAIL = 'orders@zarakitchen.online' // your real, working mailbox

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')
  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  let supabase
  try {
    supabase = getServiceSupabase()
  } catch (error) {
    return NextResponse.json(
      { error: error instanceof Error ? error.message : 'Supabase service key not configured' },
      { status: 500 }
    )
  }

  // Last calendar month's date range
  const now = new Date()
  const firstOfThisMonth = new Date(now.getFullYear(), now.getMonth(), 1)
  const firstOfLastMonth = new Date(now.getFullYear(), now.getMonth() - 1, 1)
  const monthLabel = firstOfLastMonth.toLocaleDateString('en-US', { month: 'long', year: 'numeric' })

  const { data: reservations, error } = await supabase
    .from('reservations')
    .select('status, guests, created_at')
    .gte('created_at', firstOfLastMonth.toISOString())
    .lt('created_at', firstOfThisMonth.toISOString())

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const total = reservations?.length ?? 0
  const byStatus = {
    pending: reservations?.filter((r) => r.status === 'pending').length ?? 0,
    confirmed: reservations?.filter((r) => r.status === 'confirmed').length ?? 0,
    cancelled: reservations?.filter((r) => r.status === 'cancelled').length ?? 0,
    completed: reservations?.filter((r) => r.status === 'completed').length ?? 0,
  }
  const totalGuests = reservations?.reduce((sum, r) => sum + (r.guests || 0), 0) ?? 0
  const avgPartySize = total > 0 ? (totalGuests / total).toFixed(1) : '0'

  // Real sales data, now that the Orders system exists
  const { data: orders, error: ordersError } = await supabase
    .from('orders')
    .select('status, total, delivery_type, payment_method, created_at')
    .gte('created_at', firstOfLastMonth.toISOString())
    .lt('created_at', firstOfThisMonth.toISOString())

  if (ordersError) {
    return NextResponse.json({ error: ordersError.message }, { status: 500 })
  }

  const totalOrders = orders?.length ?? 0
  const completedOrders = orders?.filter((o) => o.status === 'completed') ?? []
  const cancelledOrders = orders?.filter((o) => o.status === 'cancelled').length ?? 0
  const totalRevenue = completedOrders.reduce((sum, o) => sum + (o.total || 0), 0)
  const avgOrderValue = completedOrders.length > 0 ? (totalRevenue / completedOrders.length).toFixed(0) : '0'
  const deliveryCount = orders?.filter((o) => o.delivery_type === 'delivery').length ?? 0
  const pickupCount = orders?.filter((o) => o.delivery_type === 'pickup').length ?? 0

  const html = `
    <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto;">
      <h1 style="color: #F5A623;">Zara Kitchen -- Monthly Report</h1>
      <h2>${monthLabel}</h2>

      <h3>Reservations</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 8px 0;">Total reservations</td><td style="text-align: right; font-weight: bold;">${total}</td></tr>
        <tr><td style="padding: 8px 0;">Pending</td><td style="text-align: right;">${byStatus.pending}</td></tr>
        <tr><td style="padding: 8px 0;">Confirmed</td><td style="text-align: right;">${byStatus.confirmed}</td></tr>
        <tr><td style="padding: 8px 0;">Completed</td><td style="text-align: right;">${byStatus.completed}</td></tr>
        <tr><td style="padding: 8px 0;">Cancelled</td><td style="text-align: right;">${byStatus.cancelled}</td></tr>
        <tr><td style="padding: 8px 0;">Average party size</td><td style="text-align: right;">${avgPartySize}</td></tr>
      </table>

      <h3>Orders &amp; Sales</h3>
      <table style="width: 100%; border-collapse: collapse;">
        <tr><td style="padding: 8px 0;">Total orders placed</td><td style="text-align: right; font-weight: bold;">${totalOrders}</td></tr>
        <tr><td style="padding: 8px 0;">Completed</td><td style="text-align: right;">${completedOrders.length}</td></tr>
        <tr><td style="padding: 8px 0;">Cancelled</td><td style="text-align: right;">${cancelledOrders}</td></tr>
        <tr><td style="padding: 8px 0;">Revenue (completed orders)</td><td style="text-align: right; font-weight: bold;">GHS ${totalRevenue.toFixed(0)}</td></tr>
        <tr><td style="padding: 8px 0;">Average order value</td><td style="text-align: right;">GHS ${avgOrderValue}</td></tr>
        <tr><td style="padding: 8px 0;">Delivery vs Pickup</td><td style="text-align: right;">${deliveryCount} / ${pickupCount}</td></tr>
      </table>

      <h3>Marketing &amp; Content Performance</h3>
      <p style="color: #999; font-size: 14px;">
        Not included yet -- content/post engagement isn't being tracked automatically,
        so there's no real marketing performance data to report on this month.
      </p>

      <p style="color: #999; font-size: 12px; margin-top: 32px;">
        Generated automatically by Zara Kitchen's dashboard system.
      </p>
    </div>
  `

  const emailResult = await sendEmail({
    to: RESTAURANT_MANAGER_EMAIL,
    from: REPORT_FROM_EMAIL,
    subject: `Zara Kitchen Monthly Report -- ${monthLabel}`,
    html,
  })

  return NextResponse.json({
    month: monthLabel,
    stats: {
      total,
      byStatus,
      avgPartySize,
      orders: { totalOrders, completed: completedOrders.length, cancelled: cancelledOrders, totalRevenue, avgOrderValue, deliveryCount, pickupCount },
    },
    email: emailResult,
  })
}
