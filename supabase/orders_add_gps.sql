-- Zara Kitchen: Add Ghana Post GPS address to orders
-- Run this in Supabase SQL Editor

alter table orders add column if not exists ghana_post_gps text;
