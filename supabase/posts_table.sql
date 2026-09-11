-- Zara Kitchen: Posts (social content) table
-- Run this in Supabase SQL Editor instead of the legacy schema.sql
--
-- Self-contained -- deliberately does NOT reuse the old schema.sql's
-- 'posts' table definition, which references an 'admin_users' table
-- that doesn't exist in our new auth setup, and would conflict with
-- the already-created 'menu_items'/'menu_categories' tables if that
-- whole legacy file were run. This is a fresh, minimal table with
-- just the columns the app actually uses right now.

create table if not exists posts (
  id uuid primary key default gen_random_uuid(),
  title text,
  content text,
  image_url text,
  video_url text,
  post_type text default 'text', -- text, image, video, carousel
  status text not null default 'draft', -- draft, pending_approval, approved, rejected, scheduled, published
  ai_model text,
  scheduled_date timestamptz,
  published_date timestamptz,

  -- Social platform post IDs, once actually published
  facebook_post_id text,
  instagram_post_id text,
  tiktok_post_id text,
  twitter_post_id text,
  whatsapp_message_id text,

  -- Basic engagement tracking (manually updated for now, no analytics
  -- integration yet)
  views int default 0,
  likes int default 0,
  shares int default 0,
  comments int default 0,

  created_by uuid references profiles(id),
  created_at timestamptz default now(),
  updated_at timestamptz default now()
);

create index if not exists idx_posts_status on posts(status);
create index if not exists idx_posts_scheduled_date on posts(scheduled_date);

alter table posts enable row level security;

-- Only logged-in staff can see or manage posts (nothing here is
-- public-facing, unlike menu_items/promotions)
create policy "Staff can manage posts"
  on posts for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');
