// app/api/leads/email-sequence/route.ts
//
// Automated 3-step follow-up email sequence for leads (catering
// inquiries now; Facebook Ads leads once that integration exists --
// they'll land in the same 'leads' table regardless of source, so
// this works for both without changes).
//
// Step 0 -> 1: Welcome email, sent immediately (next time this runs
//              after a lead is created)
// Step 1 -> 2: Nudge, sent 2 days after the welcome email
// Step 2 -> 3: Final nudge + human handoff notice, sent 3 days after
//              that (day 5 total) -- then the lead exits the
//              automated sequence (in_sequence = false) so Admin/
//              Manager knows to personally take over from here.
//
// Meant to run daily via cron: GET /api/leads/email-sequence?secret=YOUR_CRON_SECRET

import { NextRequest, NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase/server'
import { sendEmail } from '@/lib/email'
import { sendWhatsAppMessage, getManagerWhatsAppNumber } from '@/lib/whatsapp'

const FROM_EMAIL = 'orders@zarakitchen.online'

// Days to wait AFTER the previous step before sending the next one
const DELAY_DAYS_BETWEEN_STEPS = [0, 2, 3] // step 0->1, step 1->2, step 2->3

function emailForStep(step: number, name: string) {
  if (step === 0) {
    return {
      subject: 'Your Free Corporate Catering Consultation -- Zara Kitchen',
      html: `
        <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto;">
          <h2 style="color: #F5A623;">Hi ${name}, thanks for your interest!</h2>
          <p>We'd love to cater your next corporate event. As a thank-you for reaching out, here's what's included:</p>
          <ul>
            <li>Free consultation &amp; custom quote</li>
            <li>Free menu tasting before you book</li>
            <li><strong>10% off your first order</strong> with code <strong>CATER10</strong></li>
            <li>Free delivery + a complimentary drinks upgrade</li>
          </ul>
          <p>Reply to this email or call <strong>+233 59 159 9629</strong> to book your free consultation -- no obligation.</p>
          <p style="color: #999; font-size: 12px; margin-top: 24px;">Zara Kitchen -- 64 Patrice Lumumba St, Airport Residential Area, Accra</p>
        </div>
      `,
    }
  }
  if (step === 1) {
    return {
      subject: 'Still thinking about your corporate event? -- Zara Kitchen',
      html: `
        <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto;">
          <h2 style="color: #F5A623;">Hi ${name},</h2>
          <p>Just following up on your catering inquiry -- your <strong>10% off (code CATER10)</strong>, free tasting, and free delivery offer is still available.</p>
          <p>Happy to answer any questions about menu options, guest counts, or timing. Just reply to this email or call <strong>+233 59 159 9629</strong>.</p>
          <p style="color: #999; font-size: 12px; margin-top: 24px;">Zara Kitchen -- 64 Patrice Lumumba St, Airport Residential Area, Accra</p>
        </div>
      `,
    }
  }
  return {
    subject: "Let's get your event sorted -- Zara Kitchen",
    html: `
      <div style="font-family: sans-serif; max-width: 560px; margin: 0 auto;">
        <h2 style="color: #F5A623;">Hi ${name},</h2>
        <p>We don't want you to miss out on your free tasting and 10% off offer -- a member of our team will be reaching out personally to help finalize the details for your event.</p>
        <p>If you'd rather connect now, call us directly at <strong>+233 59 159 9629</strong> or reply to this email any time.</p>
        <p style="color: #999; font-size: 12px; margin-top: 24px;">Zara Kitchen -- 64 Patrice Lumumba St, Airport Residential Area, Accra</p>
      </div>
    `,
  }
}

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

  const { data: leads, error } = await supabase
    .from('leads')
    .select('id, name, email, sequence_step, last_sequence_sent_at, created_at, in_sequence')
    .eq('in_sequence', true)
    .lt('sequence_step', 3)
    .not('email', 'is', null)

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const now = Date.now()
  const results: Record<string, unknown>[] = []

  for (const lead of leads ?? []) {
    const step = lead.sequence_step
    const anchorTime = lead.last_sequence_sent_at
      ? new Date(lead.last_sequence_sent_at).getTime()
      : new Date(lead.created_at).getTime()
    const dueAfterMs = DELAY_DAYS_BETWEEN_STEPS[step] * 24 * 60 * 60 * 1000
    const isDue = now - anchorTime >= dueAfterMs

    if (!isDue) continue

    const { subject, html } = emailForStep(step, lead.name)
    const emailResult = await sendEmail({ to: lead.email, from: FROM_EMAIL, subject, html })

    const nextStep = step + 1
    const completingSequence = nextStep >= 3

    await supabase
      .from('leads')
      .update({
        sequence_step: nextStep,
        last_sequence_sent_at: new Date().toISOString(),
        in_sequence: !completingSequence,
      })
      .eq('id', lead.id)

    // When the automated sequence finishes, ping the Manager so a
    // human actually follows up -- this is the "human takes over" step
    let handoffNotification: { sent: boolean; reason?: string } | undefined
    if (completingSequence) {
      const managerNumber = await getManagerWhatsAppNumber()
      if (managerNumber) {
        handoffNotification = await sendWhatsAppMessage(
          managerNumber,
          `👋 ${lead.name}'s automated follow-up sequence is complete -- time for a personal follow-up.\n\nzarakitchen.online/dashboard/leads`
        )
      }
    }

    results.push({
      leadId: lead.id,
      name: lead.name,
      stepSent: step,
      emailResult,
      sequenceComplete: completingSequence,
      handoffNotification,
    })
  }

  return NextResponse.json({ processed: results.length, results })
}
