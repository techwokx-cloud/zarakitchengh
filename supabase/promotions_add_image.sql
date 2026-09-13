-- Zara Kitchen: Add image support to promotions
-- Run this in Supabase SQL Editor

alter table promotions add column if not exists image_url text;
