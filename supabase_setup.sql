-- ===========================================
-- Jaguars Region - Supabase Database Setup
-- Run this in Supabase Dashboard > SQL Editor
-- ===========================================

-- 1. Members table (replaces jaguars_users localStorage)
CREATE TABLE IF NOT EXISTS public.members (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  role TEXT[] NOT NULL DEFAULT '{}',
  location TEXT DEFAULT 'Not Specified',
  bio TEXT DEFAULT '',
  contact_email TEXT DEFAULT '',
  contact_phone TEXT DEFAULT '',
  custom_links JSONB DEFAULT '[]'::JSONB,
  stars INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Leads table (replaces jaguars_leads localStorage)
CREATE TABLE IF NOT EXISTS public.leads (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  contact TEXT NOT NULL,
  role_interest TEXT DEFAULT 'Co-founder',
  experience TEXT DEFAULT '',
  submitted_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Enable Row Level Security
ALTER TABLE public.members ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;

-- 4. RLS Policies for members
CREATE POLICY "Members are publicly readable"
  ON public.members FOR SELECT USING (true);

CREATE POLICY "Anyone can register as a member"
  ON public.members FOR INSERT WITH CHECK (true);

CREATE POLICY "Anyone can upvote members"
  ON public.members FOR UPDATE USING (true) WITH CHECK (true);

-- 5. RLS Policies for leads
CREATE POLICY "Anyone can submit a lead"
  ON public.leads FOR INSERT WITH CHECK (true);

CREATE POLICY "Leads are readable"
  ON public.leads FOR SELECT USING (true);

-- 6. Seed demo data
INSERT INTO public.members (name, role, location, bio, contact_email, contact_phone, custom_links, stars)
VALUES
  ('Alex Mercer', ARRAY['Director', 'Cinematographer'], 'Los Angeles, CA',
   'Award-winning director with a passion for visually stunning storytelling.',
   'alex@example.com', '+1 234 567 8900',
   '[{"title": "Portfolio", "url": "https://example.com/alex-mercer"}, {"title": "Instagram", "url": "https://instagram.com/alexmercerfilm"}]'::JSONB, 12),

  ('Sarah Chen', ARRAY['Editor'], 'New York, NY',
   'Detail-oriented editor focusing on fast-paced action sequences and documentaries.',
   'sarah.cuts@example.com', '',
   '[{"title": "Portfolio", "url": "https://sarahchen.film"}]'::JSONB, 8),

  ('Desmond Miles', ARRAY['Actor'], 'London, UK',
   'Method actor with experience in both indie and major studio productions.',
   'desmond.talent@example.com', '+1 987 654 3210',
   '[{"title": "Instagram", "url": "https://instagram.com/desmondmiles_official"}]'::JSONB, 3);
