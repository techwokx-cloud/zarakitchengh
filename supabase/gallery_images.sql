-- Zara Kitchen: Gallery images (Ambiance, Events, Drinks, Happy Customers)
-- Run this in Supabase SQL Editor
--
-- "Our Food" category on the Gallery page already pulls automatically
-- from menu_items -- this table is for the other categories, which
-- need real uploaded photos.

create table if not exists gallery_images (
  id uuid primary key default gen_random_uuid(),
  category text not null check (category in ('ambiance', 'events', 'drinks', 'customers')),
  title text,
  description text,
  image_url text not null,
  display_order int not null default 0,
  created_at timestamptz default now()
);

create index if not exists idx_gallery_images_category on gallery_images(category);

alter table gallery_images enable row level security;

create policy "Anyone can view gallery images"
  on gallery_images for select
  using (true);

create policy "Staff can manage gallery images"
  on gallery_images for all
  using (auth.role() = 'authenticated')
  with check (auth.role() = 'authenticated');

-- Storage bucket for the actual uploaded image files
insert into storage.buckets (id, name, public)
values ('gallery', 'gallery', true)
on conflict (id) do nothing;

create policy "Public read access for gallery bucket"
  on storage.objects for select
  using (bucket_id = 'gallery');

create policy "Staff can upload to gallery bucket"
  on storage.objects for insert
  with check (bucket_id = 'gallery' and auth.role() = 'authenticated');

create policy "Staff can delete from gallery bucket"
  on storage.objects for delete
  using (bucket_id = 'gallery' and auth.role() = 'authenticated');

-- Preserve the two Ambiance photos that were previously hardcoded in
-- code, so they don't disappear now that Gallery reads from this
-- table instead
insert into gallery_images (category, title, description, image_url, display_order)
values
  ('ambiance', 'Zara Kitchen Dining Room', 'Our warm, welcoming dining space', '/images/about/restaurant-interior.png', 0),
  ('ambiance', 'Brunch Buffet Spread', 'Our well-curated brunch buffet, laid out fresh', '/images/about/buffet-spread.png', 1)
on conflict do nothing;
