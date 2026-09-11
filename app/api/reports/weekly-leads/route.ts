// app/api/reports/weekly-leads/route.ts
//
// Weekly digest of new leads, emailed to the Restaurant Manager for
// review. Meant to be triggered on a schedule (e.g. every Monday) via
// a cron job, same pattern as /api/reports/monthly.
//
// Call as: GET /api/reports/weekly-leads?secret=YOUR_CRON_SECRET

import { NextRequest, NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase/server'
import { sendEmail } from '@/lib/email'

const RESTAURANT_MANAGER_EMAIL = 'restaurantmanager@zarakitchen.online'
const REPORT_FROM_EMAIL = 'reports@zarakitchen.online' // update once your Resend domain is verified

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

  const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)

  const { data: leads, error } = await supabase
    .from('leads')
    .select('name, phone, email, source, interest, status, created_at')
    .gte('created_at', sevenDaysAgo.toISOString())
    .order('created_at', { ascending: false })

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const total = leads?.length ?? 0
  const byStatus = {
    new: leads?.filter((l) => l.status === 'new').length ?? 0,
    contacted: leads?.filter((l) => l.status === 'contacted').length ?? 0,
    qualified: leads?.filter((l) => l.status === 'qualified').length ?? 0,
  }

  const rows = (leads ?? [])
    .map(
      (l) => `
      <tr>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${l.name}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${l.interest || '-'}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${l.phone || l.email || '-'}</td>
        <td style="padding: 8px; border-bottom: 1px solid #eee;">${l.status}</td>
      </tr>`
    )
    .join('')

  const html = `
    <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto;">
      <h1 style="color: #F5A623;">Zara Kitchen -- Weekly Leads Digest</h1>
      <p>${total} new lead${total === 1 ? '' : 's'} in the last 7 days (${byStatus.new} new, ${byStatus.contacted} contacted, ${byStatus.qualified} qualified).</p>

      ${total > 0 ? `
        <table style="width: 100%; border-collapse: collapse; margin-top: 16px;">
          <tr style="background: #f5f5f5; text-align: left;">
            <th style="padding: 8px;">Name</th>
            <th style="padding: 8px;">Interest</th>
            <th style="padding: 8px;">Contact</th>
            <th style="padding: 8px;">Status</th>
          </tr>
          ${rows}
        </table>
      ` : '<p style="color: #999;">No new leads this week.</p>'}

      <p style="color: #999; font-size: 12px; margin-top: 32px;">
        Generated automatically by Zara Kitchen's dashboard system.
      </p>
    </div>
  `

  const emailResult = await sendEmail({
    to: RESTAURANT_MANAGER_EMAIL,
    from: REPORT_FROM_EMAIL,
    subject: `Zara Kitchen Weekly Leads Digest -- ${total} new lead${total === 1 ? '' : 's'}`,
    html,
  })

  return NextResponse.json({ total, byStatus, email: emailResult })
}
