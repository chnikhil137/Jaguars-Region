-- ===========================================
-- Jaguars Region - Delete Policy Migration
-- Run this in Supabase Dashboard > SQL Editor
-- ===========================================

-- Allow authenticated users to delete members
-- This is required for admin deletion to work
CREATE POLICY "Allow delete for authenticated users"
  ON public.members FOR DELETE
  USING (true);
