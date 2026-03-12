-- ===========================================
-- Jaguars Region - Upvotes Storage
-- Run this in Supabase Dashboard > SQL Editor
-- ===========================================

-- 1. Create table to track exactly who upvoted who
CREATE TABLE IF NOT EXISTS public.member_upvotes (
  voter_id UUID REFERENCES auth.users(id) ON DELETE CASCADE,
  member_id UUID REFERENCES public.members(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  PRIMARY KEY (voter_id, member_id)
);

-- 2. Enable RLS
ALTER TABLE public.member_upvotes ENABLE ROW LEVEL SECURITY;

-- 3. RLS Policies
CREATE POLICY "Users can see all upvotes"
  ON public.member_upvotes FOR SELECT USING (true);

CREATE POLICY "Authenticated users can insert their own upvote"
  ON public.member_upvotes FOR INSERT
  WITH CHECK (auth.uid() = voter_id);

CREATE POLICY "Authenticated users can delete their own upvote"
  ON public.member_upvotes FOR DELETE
  USING (auth.uid() = voter_id);

-- 4. Create function to toggle upvote (insert or delete) and update member stars
CREATE OR REPLACE FUNCTION public.toggle_upvote(target_member_id UUID)
RETURNS boolean AS $$
DECLARE
  voter UUID := auth.uid();
  has_voted boolean;
BEGIN
  -- Check if user is authenticated
  IF voter IS NULL THEN
    RAISE EXCEPTION 'Not authenticated';
  END IF;

  -- Check if vote exists
  SELECT EXISTS(
    SELECT 1 FROM public.member_upvotes 
    WHERE voter_id = voter AND member_id = target_member_id
  ) INTO has_voted;

  IF has_voted THEN
    -- Remove vote
    DELETE FROM public.member_upvotes 
    WHERE voter_id = voter AND member_id = target_member_id;
    
    -- Decrement stars
    UPDATE public.members 
    SET stars = stars - 1 
    WHERE id = target_member_id;
    
    RETURN false; -- Indicates vote was removed
  ELSE
    -- Add vote
    INSERT INTO public.member_upvotes (voter_id, member_id) 
    VALUES (voter, target_member_id);
    
    -- Increment stars
    UPDATE public.members 
    SET stars = stars + 1 
    WHERE id = target_member_id;
    
    RETURN true; -- Indicates vote was added
  END IF;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
