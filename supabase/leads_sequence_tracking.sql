-- Zara Kitchen: Lead follow-up sequence tracking
-- Run this in Supabase SQL Editor

alter table leads add column if not exists sequence_step int not null default 0;
alter table leads add column if not exists last_sequence_sent_at timestamptz;
alter table leads add column if not exists in_sequence boolean not null default true;
