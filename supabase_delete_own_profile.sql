-- ===========================================
-- Jaguars Region - Delete Own Profile Function
-- Run this in Supabase Dashboard > SQL Editor
-- ===========================================

-- Create a function that allows users to delete their own profile
-- Uses SECURITY DEFINER to bypass RLS
CREATE OR REPLACE FUNCTION public.delete_own_profile()
RETURNS boolean AS $$
BEGIN
  DELETE FROM public.members WHERE user_id = auth.uid();
  RETURN true;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

-- Also ensure the DELETE policy exists for admin usage
DROP POLICY IF EXISTS "Allow delete for authenticated users" ON public.members;
CREATE POLICY "Allow delete for authenticated users"
  ON public.members FOR DELETE
  USING (auth.uid() = user_id);
