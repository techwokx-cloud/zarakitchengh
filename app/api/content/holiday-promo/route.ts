// app/api/content/holiday-promo/route.ts
//
// Checks for an upcoming Ghana public holiday within the next 7 days.
// If one is found (and a draft hasn't already been created for it),
// creates a draft promotional post in the 'posts' table with status
// 'pending_approval' -- it then shows up in the Restaurant Manager's
// existing Content Approval page, same as any other draft.
//
// Honest limitation: this generates a template-based message, not a
// genuinely AI-written one. True AI generation needs ANTHROPIC_API_KEY
// (or similar) configured -- once that exists, this route is the right
// place to call the AI instead of using the template below.
//
// Meant to run daily via cron: GET /api/content/holiday-promo?secret=YOUR_CRON_SECRET

import { NextRequest, NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase/server'

// Ghana public holidays -- factual, doesn't change year to year for most
// of these (a few, like Eid, shift and aren't included here since they
// depend on the lunar calendar).
const GHANA_HOLIDAYS_2026 = [
  { date: '2026-01-01', name: "New Year's Day" },
  { date: '2026-03-06', name: 'Independence Day' },
  { date: '2026-04-03', name: 'Good Friday' },
  { date: '2026-04-06', name: 'Easter Monday' },
  { date: '2026-05-01', name: 'Labour Day' },
  { date: '2026-08-04', name: "Founders' Day" },
  { date: '2026-08-01', name: 'Homowo Festival (Ga)' },
  { date: '2026-09-21', name: "Kwame Nkrumah Memorial Day" },
  { date: '2026-12-01', name: 'Farmers Day' },
  { date: '2026-12-25', name: 'Christmas Day' },
  { date: '2026-12-26', name: 'Boxing Day' },
]

export async function GET(request: NextRequest) {
  const secret = request.nextUrl.searchParams.get('secret')
  if (!process.env.CRON_SECRET || secret !== process.env.CRON_SECRET) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  }

  const today = new Date()
  const sevenDaysOut = new Date(today.getTime() + 7 * 24 * 60 * 60 * 1000)

  const upcoming = GHANA_HOLIDAYS_2026.find((h) => {
    const d = new Date(h.date)
    return d >= today && d <= sevenDaysOut
  })

  if (!upcoming) {
    return NextResponse.json({ message: 'No holiday in the next 7 days -- nothing drafted.' })
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

  // Don't create a duplicate draft if one already exists for this holiday
  const { data: existing } = await supabase
    .from('posts')
    .select('id')
    .ilike('title', `%${upcoming.name}%`)
    .gte('created_at', new Date(today.getFullYear(), 0, 1).toISOString())
    .limit(1)

  if (existing && existing.length > 0) {
    return NextResponse.json({ message: `Draft already exists for ${upcoming.name}.` })
  }

  // Template-based draft -- replace with a real AI call once an API key is configured
  const title = `${upcoming.name} Special`
  const content =
    `🎉 ${upcoming.name} is coming up on ${upcoming.date}!\n\n` +
    `Celebrate with authentic Ghanaian & Continental cuisine at Zara Kitchen. ` +
    `[Add your specific offer/menu items here before approving]\n\n` +
    `📍 64 Patrice Lumumba St, Accra | 📞 +233 59 159 9629`

  const { error } = await supabase.from('posts').insert([{
    title,
    content,
    post_type: 'text',
    status: 'pending_approval',
    scheduled_date: upcoming.date,
  }])

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  return NextResponse.json({ message: `Draft created for ${upcoming.name}, awaiting Manager approval.` })
}
