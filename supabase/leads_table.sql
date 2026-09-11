-- Zara Kitchen: Leads table
-- Run this in Supabase SQL Editor
--
-- Self-contained (doesn't depend on the old schema.sql's admin_users
-- table). Captures leads from any source (catering inquiries, contact
-- form, social media, etc.) for the Admin to work and the weekly
-- digest to summarize for the Restaurant Manager.

create table if not exists leads (
  id uuid primary key default gen_random_uuid(),
  name text not null,
  phone text,
  email text,
  source text, -- e.g. 'catering_form', 'contact_form', 'instagram', 'referral'
  interest text, -- e.g. 'Corporate Catering', 'Private Event', 'General Inquiry'
  notes text,
  status text not null default 'new' check (status in ('new', 'contacted', 'qualified', 'converted', 'lost')),
  created_by uuid references profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_leads_status on leads(status);
create index if not exists idx_leads_created_at on leads(created_at);

alter table leads enable row level security;

-- Anyone can submit a lead (e.g. via a public form)
create policy "Anyone can create a lead"
  on leads for insert
  with check (true);

-- Only logged-in staff can view/manage leads
create policy "Staff can manage leads"
  on leads for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
