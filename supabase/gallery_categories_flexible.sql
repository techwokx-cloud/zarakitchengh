-- Zara Kitchen: Allow custom Gallery categories
-- Run this in Supabase SQL Editor

alter table gallery_images drop constraint if exists gallery_images_category_check;
