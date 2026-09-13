// app/api/content/daily-post/route.ts
//
// Generates one social post per day automatically (image + caption),
// landing as 'pending_approval' -- same review queue as everything
// else. Rotates through the three agreed focus areas: corporate
// catering, customer orders, and social media growth (followers/likes).
//
// Meant to run daily via cron: GET /api/content/daily-post?secret=YOUR_CRON_SECRET
//
// Honest limitation: this needs ANTHROPIC_API_KEY (for captions) and
// OPENAI_API_KEY or FAL_AI_KEY (for images) to actually produce
// content. Without those, it will create a post with empty/failed
// image and caption fields -- check the response for real errors
// once those keys are added, rather than assuming this "just works."

import { NextRequest, NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase/server'
import { generatePostCaption, generateImage, generateHashtags } from '@/lib/ai-services'
import { sendWhatsAppMessage, getManagerWhatsAppNumber } from '@/lib/whatsapp'

// Rotates daily through the three agreed focus areas
const FOCUS_ROTATION: { theme: string; prompt: string; category: string }[] = [
  {
    theme: 'Corporate Catering',
    prompt: 'An inviting spread of Zara Kitchen catering food, styled for a corporate lunch event, showing variety and abundance',
    category: 'promotion',
  },
  {
    theme: 'Order Now',
    prompt: 'A mouth-watering close-up of a popular Zara Kitchen dish, designed to make viewers want to order immediately',
    category: 'engagement',
  },
  {
    theme: 'Follow & Engage',
    prompt: 'A fun, shareable graphic encouraging people to follow Zara Kitchen on social media, featuring the restaurant\'s branding',
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

  // Pick today's focus based on day-of-year, so it rotates predictably
  // through all three rather than randomly repeating
  const dayOfYear = Math.floor(
    (Date.now() - new Date(new Date().getFullYear(), 0, 0).getTime()) / 86400000
  )
  const focus = FOCUS_ROTATION[dayOfYear % FOCUS_ROTATION.length]

  const caption = await generatePostCaption(focus.prompt)
  // Try FAL.ai first (cheaper), fall back to OpenAI's DALL-E 3 if that fails
  let imageResult = await generateImage(focus.prompt, 'stable-diffusion', focus.category)
  let imageProvider = 'fal.ai'
  if (!imageResult.url) {
    const falError = imageResult.error
    imageResult = await generateImage(focus.prompt, 'dalle3', focus.category)
    imageProvider = 'openai-dalle3'
    if (!imageResult.url) {
      imageResult.error = `fal.ai: ${falError} | openai: ${imageResult.error}`
    }
  }
  const imageUrl = imageResult.url
  const hashtags = await generateHashtags(focus.category)

  const { data: post, error } = await supabase.from('posts').insert([{
    title: `${focus.theme} - ${new Date().toLocaleDateString()}`,
    content: caption || `[Caption generation failed -- check ANTHROPIC_API_KEY] ${focus.theme}`,
    image_url: imageUrl || null,
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
      `🔔 Today's auto-generated post (${focus.theme}) is ready for your review.\n\nzarakitchen.online/manager/content-approval`
    )
  }

  return NextResponse.json({
    focus: focus.theme,
    post,
    captionGenerated: !!caption,
    imageGenerated: !!imageUrl,
    imageProvider: imageUrl ? imageProvider : null,
    imageError: imageUrl ? undefined : imageResult.error,
    hashtags,
    whatsappNotification: notification,
  })
}
