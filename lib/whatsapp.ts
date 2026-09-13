// lib/whatsapp.ts
// Server-side only. Sends an outbound WhatsApp message via the Baileys
// bot server. Never import this in a client component -- the admin
// token must stay server-side.

export async function sendWhatsAppMessage(to: string, text: string) {
  const botUrl = process.env.WHATSAPP_BOT_API_URL
  const adminToken = process.env.WHATSAPP_BOT_ADMIN_TOKEN

  if (!botUrl || !adminToken) {
    console.warn('WHATSAPP_BOT_API_URL / WHATSAPP_BOT_ADMIN_TOKEN not set -- WhatsApp message not sent.')
    return { sent: false, reason: 'Bot not configured' }
  }

  // Bot expects digits only, country code first, no '+' or spaces
  const cleanTo = to.replace(/[^\d]/g, '')

  try {
    const response = await fetch(`${botUrl}/api/whatsapp/send`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-admin-token': adminToken,
      },
      body: JSON.stringify({ to: cleanTo, text }),
    })

    const data = await response.json()

    if (!response.ok) {
      return { sent: false, reason: data.error || `Bot server returned ${response.status}` }
    }

    return { sent: true, result: data }
  } catch (error) {
    return { sent: false, reason: error instanceof Error ? error.message : 'Could not reach the bot server' }
  }
}

// Looks up the Restaurant Manager's WhatsApp number from restaurant_settings,
// so notifications always go to whatever number is currently configured
// there rather than a hardcoded value.
export async function getManagerWhatsAppNumber(): Promise<string | null> {
  const { getServiceSupabase } = await import('@/lib/supabase/server')
  try {
    const supabase = getServiceSupabase()
    const { data } = await supabase
      .from('restaurant_settings')
      .select('whatsapp_number')
      .eq('id', 1)
      .single()
    return data?.whatsapp_number ?? null
  } catch {
    return null
  }
}
