// lib/whatsapp.ts
// Server-side only. Sends an outbound WhatsApp message via the Baileys
// bot server. Never import this in a client component -- the admin
// token must stay server-side.

// Converts a Ghana phone number to the international format the bot
// requires (digits only, country code first, no leading 0). Customers
// naturally type local format (0264375628); WhatsApp IDs need
// 233264375628. Without this, messages to customer-entered numbers
// silently fail even though hardcoded/already-correct numbers (like
// the Manager's) work fine.
function normalizeGhanaPhone(raw: string): string {
  const digits = raw.replace(/[^\d]/g, '')

  if (digits.startsWith('0') && digits.length === 10) {
    return '233' + digits.slice(1)
  }
  if (digits.startsWith('233')) {
    return digits
  }
  // Already missing both the 0 and the 233 prefix (e.g. someone typed
  // just the 9-digit subscriber number) -- assume Ghana and prepend it.
  if (digits.length === 9) {
    return '233' + digits
  }
  return digits
}

export async function sendWhatsAppMessage(to: string, text: string) {
  const botUrl = process.env.WHATSAPP_BOT_API_URL
  const adminToken = process.env.WHATSAPP_BOT_ADMIN_TOKEN

  if (!botUrl || !adminToken) {
    console.warn('WHATSAPP_BOT_API_URL / WHATSAPP_BOT_ADMIN_TOKEN not set -- WhatsApp message not sent.')
    return { sent: false, reason: 'Bot not configured' }
  }

  const cleanTo = normalizeGhanaPhone(to)

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
