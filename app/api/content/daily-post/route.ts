// app/api/content/daily-post/route.ts
//
// Generates one social post per day automatically using a REAL menu
// photo (not AI-generated) as the base image, with a poster-style text
// overlay composited on top. This replaced AI image generation
// entirely -- it's free, doesn't depend on any external image API's
// uptime/billing (FAL.ai/OpenAI/Pollinations all had real reliability
// issues), and the photos are already professional, on-brand shots of
// actual dishes.
//
// Rotates through the three agreed focus areas (Corporate Catering,
// Order Now, Follow & Engage) AND rotates through all available menu
// items by day-of-year, so the specific dish featured changes daily
// too -- with 98 items, that's about 3 months before repeating.
//
// Meant to run daily via cron: GET /api/content/daily-post?secret=YOUR_CRON_SECRET
//
// Honest limitation: captions still need ANTHROPIC_API_KEY (confirmed
// working). If that's ever missing, a template caption is used instead
// so the post still gets created with a real photo either way.

import { NextRequest, NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase/server'
import { generatePostCaption, generateHashtags } from '@/lib/ai-services'
import { composePosterImage } from '@/lib/image-compose'
import { sendWhatsAppMessage, getManagerWhatsAppNumber } from '@/lib/whatsapp'

const FOCUS_ROTATION: { theme: string; angle: string; category: string }[] = [
  {
    theme: 'Corporate Catering',
    angle: 'how great this dish would be for a corporate lunch or office catering order',
    category: 'promotion',
  },
  {
    theme: 'Order Now',
    angle: 'making this dish sound irresistible and encouraging an immediate order',
    category: 'engagement',
  },
  {
    theme: 'Follow & Engage',
    angle: 'inviting people to follow and engage with Zara Kitchen on social media, using this dish as the hook',
    category: 'engagement',
  },
]

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

  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  )
  const focus = FOCUS_ROTATION[dayOfYear % FOCUS_ROTATION.length]

  // Pick today's dish -- rotates through every available menu item
  // (stable order by id), so the featured photo changes daily
  const { data: menuItems, error: menuError } = await supabase
    .from('menu_items')
    .select('id, name, description, image_url, category')
    .eq('is_available', true)
    .not('image_url', 'is', null)
    .order('id', { ascending: true })

  if (menuError) {
    return NextResponse.json({ error: menuError.message }, { status: 500 })
  }
  if (!menuItems || menuItems.length === 0) {
    return NextResponse.json({ error: 'No available menu items with photos found.' }, { status: 500 })
  }

  const dish = menuItems[dayOfYear % menuItems.length]

  const captionPrompt = `Write a short, punchy social media caption about "${dish.name}" (${dish.description || dish.category}), focused on ${focus.angle}.`
  const caption = await generatePostCaption(captionPrompt)
  const hashtags = await generateHashtags(focus.category)

  // menu_items.image_url is a relative path (e.g. /images/menu/...) --
  // fine for a browser <img> tag, but Node's server-side fetch() can't
  // resolve a relative URL without a domain. Make it absolute before
  // compositing.
  const SITE_URL = 'https://zarakitchen.online'
  const absoluteImageUrl = dish.image_url
    ? (dish.image_url.startsWith('http') ? dish.image_url : `${SITE_URL}${dish.image_url}`)
    : null

  // Composite the poster: real dish photo + headline banner + caption
  let finalImageUrl: string | null = absoluteImageUrl
  let posterComposited = false
  let posterError: string | undefined
  if (absoluteImageUrl) {
    const posterResult = await composePosterImage({
      imageUrl: absoluteImageUrl,
      headline: focus.theme,
      subtext: dish.name,
    })
    if (posterResult.url) {
      finalImageUrl = posterResult.url
      posterComposited = true
    } else {
      posterError = posterResult.error
    }
  }

  const { data: post, error } = await supabase.from('posts').insert([{
    title: `${focus.theme}: ${dish.name} - ${new Date().toLocaleDateString()}`,
    content: caption || `Try our ${dish.name} today! ${focus.theme}`,
    image_url: finalImageUrl,
    post_type: 'image',
    status: 'pending_approval',
    scheduled_date: new Date().toISOString(),
  }]).select().single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const managerNumber = await getManagerWhatsAppNumber()
  let notification: { sent: boolean; reason?: string } = { sent: false, reason: 'No manager number configured' }
  if (managerNumber) {
    notification = await sendWhatsAppMessage(
      managerNumber,
      `🔔 Today's auto-generated post (${focus.theme}: ${dish.name}) is ready for your review.\n\nzarakitchen.online/manager/content-approval`
    )
  }

  return NextResponse.json({
    focus: focus.theme,
    dish: dish.name,
    post,
    captionGenerated: !!caption,
    posterComposited,
    posterError,
    hashtags,
    whatsappNotification: notification,
  })
}
