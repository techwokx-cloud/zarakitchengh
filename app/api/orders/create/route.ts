// app/api/orders/create/route.ts
//
// Server-side order creation. Saves the order AND sends both WhatsApp
// notifications (customer confirmation if opted in, Manager alert
// always) in one place -- this has to be server-side since sending
// WhatsApp messages requires the bot's admin token, which can never
// reach the browser.

import { NextRequest, NextResponse } from 'next/server'
import { getServiceSupabase } from '@/lib/supabase/server'
import { sendWhatsAppMessage, getManagerWhatsAppNumber } from '@/lib/whatsapp'

interface OrderItem {
  name: string
  price: number
  quantity: number
}

export async function POST(request: NextRequest) {
  const body = await request.json()
  const {
    customer_name,
    phone,
    items,
    total,
    delivery_type,
    delivery_address,
    ghana_post_gps,
    payment_method,
    whatsapp_opt_in,
  }: {
    customer_name: string
    phone: string
    items: OrderItem[]
    total: number
    delivery_type: 'delivery' | 'pickup'
    delivery_address: string | null
    ghana_post_gps: string | null
    payment_method: 'momo' | 'card' | 'cash'
    whatsapp_opt_in: boolean
  } = body

  if (!customer_name || !phone || !items || !total) {
    return NextResponse.json({ error: "'customer_name', 'phone', 'items', and 'total' are required." }, { status: 400 })
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

  const { data: order, error } = await supabase
    .from('orders')
    .insert([{
      customer_name,
      phone,
      items,
      total,
      delivery_type,
      delivery_address: delivery_type === 'delivery' ? delivery_address : null,
      ghana_post_gps: delivery_type === 'delivery' ? ghana_post_gps : null,
      payment_method,
      whatsapp_opt_in,
      status: 'pending',
    }])
    .select()
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 500 })
  }

  const itemsSummary = items.map((i) => `${i.quantity} x ${i.name}`).join(', ')

  // Confirm to the customer, only if they opted in
  let customerNotification: { sent: boolean; reason?: string } = { sent: false, reason: 'Customer did not opt in' }
  if (whatsapp_opt_in) {
    customerNotification = await sendWhatsAppMessage(
      phone,
      `Hi ${customer_name}! 👋 Your order has been received:\n\n${itemsSummary}\nTotal: GHS ${total.toFixed(0)}\n\n` +
      `We'll confirm shortly. Thanks for ordering from Zara Kitchen! 🍽️`
    )
  }

  // Always alert the Manager about the new order
  const managerNumber = await getManagerWhatsAppNumber()
  let managerNotification: { sent: boolean; reason?: string } = { sent: false, reason: 'No manager number configured' }
  if (managerNumber) {
    managerNotification = await sendWhatsAppMessage(
      managerNumber,
      `🛎️ New order from ${customer_name} (${phone})\n\n${itemsSummary}\nTotal: GHS ${total.toFixed(0)}\n` +
      `${delivery_type === 'delivery' ? `Delivery to: ${delivery_address}${ghana_post_gps ? ` (GPS: ${ghana_post_gps})` : ''}` : 'Pickup'}\n` +
      `Payment: ${payment_method === 'momo' ? 'Mobile Money' : payment_method === 'card' ? 'Bank Card' : 'Cash'}\n\n` +
      `zarakitchen.online/manager/orders`
    )
  }

  return NextResponse.json({
    order,
    customerNotification,
    managerNotification,
  })
}
