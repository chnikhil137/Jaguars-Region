-- ===========================================
-- Jaguars Region - Gender Column Migration
-- Run this in Supabase Dashboard > SQL Editor
-- ===========================================

ALTER TABLE public.members
  ADD COLUMN IF NOT EXISTS gender TEXT DEFAULT '';
