-- Zara Kitchen: Promotions & Restaurant Settings
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor > New Query)

-- 1. Promotions/Announcements: powers the site's AnnouncementBar and
-- FirstVisitPopup. Staff create these in the Restaurant Manager
-- dashboard; the public site reads whichever ones are active.
create table if not exists promotions (
  id uuid primary key default gen_random_uuid(),
  placement text not null check (placement in ('bar', 'popup')),
  title text,                      -- only used by 'popup' placement
  message text not null,
  link_url text,
  link_text text,
  promo_code text,                 -- only used by 'popup' placement
  is_active boolean not null default true,
  starts_at timestamptz,
  ends_at timestamptz,
  created_by uuid references profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

alter table promotions enable row level security;

-- Anyone visiting the public site can read ACTIVE promotions (needed for
-- the announcement bar/popup to work for anonymous visitors)
create policy "Anyone can view active promotions"
  on promotions for select
  using (is_active = true);

-- Only logged-in staff can create/update/delete promotions
create policy "Staff can manage promotions"
  on promotions for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');


-- 2. Restaurant settings: single-row table for profile info + opening
-- hours, editable from the Restaurant Manager dashboard's Settings page.
create table if not exists restaurant_settings (
  id int primary key default 1,
  phone text,
  whatsapp_number text,
  email text,
  address text,
  opening_hours jsonb, -- e.g. [{"day":"Monday","open":"08:00","close":"18:00","closed":false}, ...]
  updated_at timestamptz default now(),
  constraint single_row check (id = 1)
);

-- Seed the one row with current values (matches what's currently
-- hardcoded across the site) so the Settings page has something to edit
insert into restaurant_settings (id, phone, whatsapp_number, email, address, opening_hours)
values (
  1,
  '+233 24 123 4567',
  '+233243637122',
  'info@zarakitchengh.com',
  '64 Patrice Lumumba St, Airport Residential Area, Accra, Ghana',
  '[
    {"day":"Monday","open":"08:00","close":"18:00","closed":false},
    {"day":"Tuesday","open":"08:00","close":"18:00","closed":false},
    {"day":"Wednesday","open":"08:00","close":"18:00","closed":false},
    {"day":"Thursday","open":"08:00","close":"18:00","closed":false},
    {"day":"Friday","open":"08:00","close":"19:00","closed":false},
    {"day":"Saturday","open":"09:00","close":"17:00","closed":false},
    {"day":"Sunday","open":null,"close":null,"closed":true}
  ]'::jsonb
)
on conflict (id) do nothing;

alter table restaurant_settings enable row level security;

create policy "Anyone can view restaurant settings"
  on restaurant_settings for select
  using (true);

create policy "Staff can update restaurant settings"
  on restaurant_settings for update
  using (auth.role() = 'authenticated');
