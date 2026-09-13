-- Zara Kitchen: Storage bucket for auto-generated poster images
-- Run this in Supabase SQL Editor

insert into storage.buckets (id, name, public)
values ('generated-posts', 'generated-posts', true)
on conflict (id) do nothing;

-- Allow public read access (needed so the images actually display on
-- the site/dashboard)
create policy "Public read access for generated posts"
  on storage.objects for select
  using (bucket_id = 'generated-posts');

-- Only the server (using the service_role key) writes to this bucket --
-- no insert/update/delete policy needed for regular users, since all
-- uploads happen via getServiceSupabase() which bypasses RLS entirely.
