-- Hardening RLS and fixing SECURITY DEFINER vulnerabilities

-- 1. Fix Finding #1 & #4: Restrict DELETE and UPDATE on public.members
-- First remove the overly permissive old policies
DROP POLICY IF EXISTS "Allow delete for authenticated users" ON public.members;
DROP POLICY IF EXISTS "Anyone can update members" ON public.members;

-- Ensure users can only update their own profile
CREATE POLICY "Users can update own profile" 
ON public.members FOR UPDATE 
USING (auth.uid() = user_id) 
WITH CHECK (auth.uid() = user_id);

-- Restrict delete to ONLY the specific admin user email by relying on Supabase auth.users function
CREATE OR REPLACE FUNCTION public.is_admin()
RETURNS BOOLEAN AS $$
BEGIN
  RETURN (SELECT auth.jwt() ->> 'email' = 'chnikhil137@gmail.com');
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE POLICY "Only admin can delete members" 
ON public.members FOR DELETE 
USING (public.is_admin());

-- 2. Fix Finding #3: Drop insecure upvote_member function
-- (The app uses toggle_upvote correctly which checks auth.uid())
DROP FUNCTION IF EXISTS public.upvote_member(UUID);

-- 3. Lock down leads table
DROP POLICY IF EXISTS "Allow delete for leads" ON public.leads;
CREATE POLICY "Only admin can delete leads" 
ON public.leads FOR DELETE 
USING (public.is_admin());

-- Also ensure members table is RLS enforced
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.member_upvotes ENABLE ROW LEVEL SECURITY;
