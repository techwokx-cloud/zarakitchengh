// app/api/whatsapp/status/route.ts
//
// Server-side proxy to the Baileys WhatsApp bot's status endpoint.
// This exists so the admin token never reaches the browser -- the
// dashboard calls THIS route (same-origin, no secret needed from the
// client), and this route calls the actual bot server with the secret
// header attached server-side only.

import { NextResponse } from 'next/server'

export async function GET() {
  const botUrl = process.env.WHATSAPP_BOT_API_URL
  const adminToken = process.env.WHATSAPP_BOT_ADMIN_TOKEN

  if (!botUrl || !adminToken) {
    return NextResponse.json(
      {
        configured: false,
        status: 'disconnected',
        qrDataUrl: null,
        error: 'WHATSAPP_BOT_API_URL / WHATSAPP_BOT_ADMIN_TOKEN not set in environment variables yet.',
      },
      { status: 200 }
    )
  }

  try {
    const response = await fetch(`${botUrl}/api/admin/whatsapp/status`, {
      headers: { 'x-admin-token': adminToken },
      cache: 'no-store',
    })

    if (!response.ok) {
      return NextResponse.json(
        { configured: false, status: 'disconnected', qrDataUrl: null, error: `Bot server returned ${response.status}` },
        { status: 200 }
      )
    }

    const data = await response.json()
    return NextResponse.json(data)
  } catch (error) {
    return NextResponse.json(
      {
        configured: false,
        status: 'disconnected',
        qrDataUrl: null,
        error: error instanceof Error ? error.message : 'Could not reach the WhatsApp bot server',
      },
      { status: 200 }
    )
  }
}
