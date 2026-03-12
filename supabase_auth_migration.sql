-- ===========================================
-- Jaguars Region - Auth Migration
-- Run this in Supabase Dashboard > SQL Editor
-- ===========================================

-- 1. Add user_id column to link members to auth users
ALTER TABLE public.members 
  ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id) ON DELETE CASCADE;

-- 2. Create unique index so one auth user = one member profile
CREATE UNIQUE INDEX IF NOT EXISTS members_user_id_unique ON public.members(user_id);

-- 3. Drop old permissive policies
DROP POLICY IF EXISTS "Anyone can register as a member" ON public.members;
DROP POLICY IF EXISTS "Anyone can upvote members" ON public.members;

-- 4. New RLS: Authenticated users can insert their own profile
CREATE POLICY "Authenticated users can create their own profile"
  ON public.members FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- 5. New RLS: Users can only update their own profile
CREATE POLICY "Users can update their own profile"
  ON public.members FOR UPDATE
  USING (auth.uid() = user_id)
  WITH CHECK (auth.uid() = user_id);

-- 6. Allow anyone to upvote (update stars only) - via a function
CREATE OR REPLACE FUNCTION public.upvote_member(member_id UUID)
RETURNS void AS $$
BEGIN
  UPDATE public.members 
  SET stars = stars + 1 
  WHERE id = member_id;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
