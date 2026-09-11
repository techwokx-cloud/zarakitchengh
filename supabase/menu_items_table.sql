-- Zara Kitchen: Menu Items table
-- Run this FIRST in Supabase SQL Editor, then run seed_menu_items.sql
--
-- Self-contained (doesn't reference the old admin_users table from
-- schema.sql), so it works whether or not that legacy schema was ever run.

create table if not exists menu_items (
  id uuid primary key default gen_random_uuid(),
  category text not null,
  name text not null,
  description text,
  price numeric(10,2) not null,
  currency text not null default 'GHS',
  image_url text,
  is_available boolean not null default true,
  is_spicy boolean not null default false,
  is_vegetarian boolean not null default false,
  is_featured_hero boolean not null default false, -- shown in homepage hero slideshow
  display_order int not null default 0,
  created_by uuid references profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_menu_items_category on menu_items(category);
create index if not exists idx_menu_items_hero on menu_items(is_featured_hero) where is_featured_hero = true;

alter table menu_items enable row level security;

-- The public menu page needs to read available items without logging in
create policy "Anyone can view available menu items"
  on menu_items for select
  using (is_available = true);

-- Staff need to see everything, including unavailable items, to manage them
create policy "Staff can view all menu items"
  on menu_items for select
  using (auth.role() = 'authenticated');

create policy "Staff can manage menu items"
  on menu_items for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
