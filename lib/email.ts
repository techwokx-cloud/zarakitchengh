// lib/email.ts
// Email sending via Resend. Server-side only -- never import this
// from a client component (the API key must stay secret).

import { Resend } from 'resend'

const RESEND_API_KEY = process.env.RESEND_API_KEY

export async function sendEmail({
  to,
  from,
  subject,
  html,
}: {
  to: string | string[]
  from: string
  subject: string
  html: string
}) {
  if (!RESEND_API_KEY) {
    console.warn(
      'RESEND_API_KEY is not set -- email not sent. Add it to environment ' +
      'variables once your Resend account/domain is set up.'
    )
    return { sent: false, reason: 'RESEND_API_KEY not configured' }
  }

  const resend = new Resend(RESEND_API_KEY)

  try {
    const result = await resend.emails.send({ to, from, subject, html })
    return { sent: true, result }
  } catch (error) {
    console.error('Failed to send email:', error)
    return { sent: false, reason: error instanceof Error ? error.message : 'Unknown error' }
  }
}
