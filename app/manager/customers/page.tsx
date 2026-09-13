// app/manager/customers/page.tsx
'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase/client'
import { Phone, ShoppingBag } from 'lucide-react'

interface OrderRow {
  customer_name: string
  phone: string
  total: number
  created_at: string
}

interface Customer {
  phone: string
  name: string
  orderCount: number
  totalSpent: number
  lastOrder: string
}

export default function CustomersPage() {
  const [customers, setCustomers] = useState<Customer[]>([])
  const [loading, setLoading] = useState(true)
  const [tableMissing, setTableMissing] = useState(false)

  useEffect(() => {
    const load = async () => {
      const { data, error } = await supabase
        .from('orders')
        .select('customer_name, phone, total, created_at')
        .order('created_at', { ascending: false })

      if (error) {
        setTableMissing(true)
        setLoading(false)
        return
      }

      // Aggregate real order history by phone number -- this IS the
      // customer directory, built from actual orders rather than a
      // separately maintained list
      const byPhone = new Map<string, Customer>()
      ;(data as OrderRow[]).forEach((order) => {
        const existing = byPhone.get(order.phone)
        if (existing) {
          existing.orderCount += 1
          existing.totalSpent += order.total
        } else {
          byPhone.set(order.phone, {
            phone: order.phone,
            name: order.customer_name,
            orderCount: 1,
            totalSpent: order.total,
            lastOrder: order.created_at,
          })
        }
      })

      setCustomers(Array.from(byPhone.values()).sort((a, b) => b.orderCount - a.orderCount))
      setLoading(false)
    }
    load()
  }, [])

  if (tableMissing) {
    return (
      <div>
        <h1 className="text-2xl font-bold text-white mb-2">Customers</h1>
        <div className="bg-amber-500/10 border border-amber-500/30 rounded-lg p-6 text-amber-300 text-sm">
          The <code className="bg-black/30 px-1 rounded">orders</code> table doesn&apos;t exist yet. Run{' '}
          <code className="bg-black/30 px-1 rounded">supabase/orders_table.sql</code> in the Supabase SQL
          Editor, then reload this page.
        </div>
      </div>
    )
  }

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-white">Customers</h1>
        <p className="text-gray-400 text-sm">
          Built from real order history -- {customers.length} unique customer{customers.length === 1 ? '' : 's'} so far.
        </p>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading…</p>
      ) : customers.length === 0 ? (
        <div className="bg-gray-800 border border-gray-700 rounded-lg p-8 text-center text-gray-400">
          No customers yet -- this fills in automatically as orders come through /menu.
        </div>
      ) : (
        <div className="bg-gray-800 border border-gray-700 rounded-lg overflow-hidden">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-700 text-gray-400 text-left">
                <th className="p-3">Name</th>
                <th className="p-3">Phone</th>
                <th className="p-3 text-center">Orders</th>
                <th className="p-3 text-right">Total Spent</th>
                <th className="p-3 text-right">Last Order</th>
              </tr>
            </thead>
            <tbody>
              {customers.map((c) => (
                <tr key={c.phone} className="border-b border-gray-700 last:border-0 text-white">
                  <td className="p-3 font-medium">{c.name}</td>
                  <td className="p-3">
                    <a href={`tel:${c.phone}`} className="flex items-center gap-1.5 text-gray-300 hover:text-zara-gold">
                      <Phone size={14} /> {c.phone}
                    </a>
                  </td>
                  <td className="p-3 text-center">
                    <span className="inline-flex items-center gap-1 text-gray-300">
                      <ShoppingBag size={14} /> {c.orderCount}
                    </span>
                  </td>
                  <td className="p-3 text-right text-zara-gold font-bold">GHS {c.totalSpent.toFixed(0)}</td>
                  <td className="p-3 text-right text-gray-400 text-xs">
                    {new Date(c.lastOrder).toLocaleDateString()}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  )
}
