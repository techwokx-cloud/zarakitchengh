-- Zara Kitchen: Auth & Roles
-- Run this in Supabase SQL Editor (Dashboard > SQL Editor > New Query)
--
-- Replaces the old admin_users.password_hash approach from schema.sql with
-- real Supabase Auth. Supabase already provides a secure, managed
-- auth.users table (handles password hashing, sessions, password resets,
-- etc.) -- we just need a `profiles` table to store the role for each
-- authenticated user, since auth.users itself has no concept of roles.

-- 1. Profiles table: one row per staff member, linked to their Supabase Auth account
create table if not exists profiles (
  id uuid primary key references auth.users(id) on delete cascade,
  email text not null,
  full_name text,
  role text not null check (role in ('website_admin', 'restaurant_manager')),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

-- 2. Row Level Security: staff can read their own profile; nothing else
-- is exposed by default. (Admin-side data tables get their own policies
-- separately, checking against this table's `role` column.)
alter table profiles enable row level security;

create policy "Users can view their own profile"
  on profiles for select
  using (auth.uid() = id);

create policy "Users can update their own profile"
  on profiles for update
  using (auth.uid() = id);

-- 3. Auto-create a profile row whenever a new user signs up via Supabase Auth.
-- Without this, you'd have to manually insert a profiles row every time
-- you create a staff account.
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, role)
  values (
    new.id,
    new.email,
    coalesce(new.raw_user_meta_data->>'role', 'restaurant_manager')
  );
  return new;
end;
$$ language plpgsql security definer;

drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute function public.handle_new_user();

-- 4. Reservations table (for the /book-a-table form -- this is the
-- 'reservations' table that page already tries to write to)
create table if not exists reservations (
  id uuid primary key default gen_random_uuid(),
  customer_name text not null,
  phone text not null,
  email text,
  reservation_date date not null,
  reservation_time time not null,
  guests int not null default 2,
  notes text,
  status text not null default 'pending' check (status in ('pending', 'confirmed', 'cancelled', 'completed')),
  created_at timestamptz default now()
);

alter table reservations enable row level security;

-- Anyone (including anonymous website visitors) can create a reservation request
create policy "Anyone can create a reservation"
  on reservations for insert
  with check (true);

-- Only logged-in staff can view/manage reservations (both roles need this --
-- Restaurant Manager runs the floor, Admin may need visibility too)
create policy "Staff can view reservations"
  on reservations for select
  using (auth.role() = 'authenticated');

create policy "Staff can update reservations"
  on reservations for update
  using (auth.role() = 'authenticated');
