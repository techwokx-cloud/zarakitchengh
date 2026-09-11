-- Zara Kitchen: Orders table
-- Run this in Supabase SQL Editor
--
-- Real orders placed through the website. Each order is also sent to
-- the restaurant's WhatsApp as a formatted message (see the checkout
-- flow) -- this table is the persistent record, so the Restaurant
-- Manager's Orders page has real data to show, not a placeholder.

create table if not exists orders (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  phone text not null,
  items jsonb not null, -- [{ "name": "...", "price": 00.00, "quantity": 1 }]
  total numeric(10,2) not null,
  delivery_type text not null check (delivery_type in ('delivery', 'pickup')),
  delivery_address text,
  payment_method text not null check (payment_method in ('momo', 'card', 'cash')),
  whatsapp_opt_in boolean not null default false, -- consent for future promo/status updates via WhatsApp (needs Baileys to actually send)
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'preparing', 'out_for_delivery', 'completed', 'cancelled')),
  created_at timestamptz default now()
);

create index if not exists idx_orders_status on orders(status);
create index if not exists idx_orders_created_at on orders(created_at);

alter table orders enable row level security;

-- Anyone (including anonymous customers) can place an order
create policy "Anyone can create an order"
  on orders for insert
  with check (true);

-- Only logged-in staff can view/manage orders
create policy "Staff can view orders"
  on orders for select
  using (auth.role() = 'authenticated');

create policy "Staff can update orders"
  on orders for update
  using (auth.role() = 'authenticated');
