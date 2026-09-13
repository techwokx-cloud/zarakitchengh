-- Zara Kitchen: Ghana Holidays table
-- Run this in Supabase SQL Editor
--
-- Moves the holiday calendar out of hardcoded code and into the
-- database, so dates can be added/edited/removed directly (via the
-- Admin dashboard's Holidays page, or Supabase's Table Editor) without
-- needing a code deploy every time.

create table if not exists ghana_holidays (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  holiday_date date not null,
  notes text,
  created_at timestamptz default now()
);

create index if not exists idx_ghana_holidays_date on ghana_holidays(holiday_date);

alter table ghana_holidays enable row level security;

create policy "Anyone can view holidays"
  on ghana_holidays for select
  using (true);

create policy "Staff can manage holidays"
  on ghana_holidays for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Seed with the 2026 calendar (the same dates that were previously
-- hardoded in app/api/content/holiday-promo/route.ts)
insert into ghana_holidays (name, holiday_date) values
  ('New Year''s Day', '2026-01-01'),
  ('Independence Day', '2026-03-06'),
  ('Good Friday', '2026-04-03'),
  ('Easter Monday', '2026-04-06'),
  ('Labour Day', '2026-05-01'),
  ('Homowo Festival (Ga)', '2026-08-01'),
  ('Founders'' Day', '2026-08-04'),
  ('Kwame Nkrumah Memorial Day', '2026-09-21'),
  ('Farmers Day', '2026-12-01'),
  ('Christmas Day', '2026-12-25'),
  ('Boxing Day', '2026-12-26')
on conflict do nothing;
