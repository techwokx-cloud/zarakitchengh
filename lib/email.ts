// lib/email.ts
// Email sending via your existing cPanel/DirectAdmin mailbox (SMTP),
// not a third-party service. Server-side only -- never import this
// from a client component (the SMTP password must stay secret).

import nodemailer from 'nodemailer'

const SMTP_HOST = process.env.SMTP_HOST // e.g. mail.zarakitchen.online
const SMTP_PORT = process.env.SMTP_PORT // e.g. 587
const SMTP_USER = process.env.SMTP_USER // e.g. orders@zarakitchen.online
const SMTP_PASSWORD = process.env.SMTP_PASSWORD

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
  if (!SMTP_HOST || !SMTP_PORT || !SMTP_USER || !SMTP_PASSWORD) {
    console.warn(
      'SMTP env vars are not fully set (SMTP_HOST, SMTP_PORT, SMTP_USER, ' +
      'SMTP_PASSWORD) -- email not sent.'
    )
    return { sent: false, reason: 'SMTP not configured' }
  }

  const transporter = nodemailer.createTransport({
    host: SMTP_HOST,
    port: parseInt(SMTP_PORT, 10),
    secure: parseInt(SMTP_PORT, 10) === 465, // true for port 465, false for 587/25 (STARTTLS)
    auth: {
      user: SMTP_USER,
      pass: SMTP_PASSWORD,
    },
  })

  try {
    const result = await transporter.sendMail({ to, from, subject, html })
    return { sent: true, result: { messageId: result.messageId } }
  } catch (error) {
    console.error('Failed to send email:', error)
    return { sent: false, reason: error instanceof Error ? error.message : 'Unknown error' }
  }
}
