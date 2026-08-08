-- ========================================================
-- NexBattles BGMI - Complete Supabase Database Schema
-- Run this script in your Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql
-- ========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Tournaments Table
CREATE TABLE IF NOT EXISTS public.tournaments (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    mode TEXT NOT NULL DEFAULT 'Squad',
    status TEXT NOT NULL DEFAULT 'REGISTRATION_OPEN',
    prize_pool NUMERIC NOT NULL DEFAULT 50000,
    entry_fee NUMERIC NOT NULL DEFAULT 100,
    max_teams INTEGER NOT NULL DEFAULT 24,
    registered_teams INTEGER NOT NULL DEFAULT 0,
    starts_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '7 days'),
    registration_deadline TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '5 days'),
    maps TEXT[] DEFAULT ARRAY['Erangel', 'Miramar', 'Sanhok'],
    phase TEXT DEFAULT 'Registration',
    accent TEXT DEFAULT 'from-orange-400 to-green-300',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 2. Teams Leaderboard Table
CREATE TABLE IF NOT EXISTS public.teams (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    name TEXT NOT NULL,
    short_name TEXT NOT NULL,
    region TEXT NOT NULL DEFAULT 'IN',
    captain TEXT NOT NULL,
    matches_played INTEGER DEFAULT 0,
    wwcd INTEGER DEFAULT 0,
    placement_points INTEGER DEFAULT 0,
    finishes INTEGER DEFAULT 0,
    penalty_points INTEGER DEFAULT 0,
    recent_form TEXT[] DEFAULT ARRAY['W', 'L', 'W'],
    preferred_drop TEXT DEFAULT 'Pochinki',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Matches Schedule Table
CREATE TABLE IF NOT EXISTS public.matches (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    tournament_id TEXT REFERENCES public.tournaments(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    starts_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '2 days'),
    map TEXT DEFAULT 'Erangel',
    status TEXT DEFAULT 'UPCOMING',
    group_name TEXT DEFAULT 'Group A',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 4. Announcements Table
CREATE TABLE IF NOT EXISTS public.announcements (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    tournament_id TEXT REFERENCES public.tournaments(id) ON DELETE SET NULL,
    category TEXT DEFAULT 'Admin',
    title TEXT NOT NULL,
    body TEXT,
    pinned BOOLEAN DEFAULT FALSE,
    publish_at TIMESTAMPTZ DEFAULT NOW(),
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Registration Submissions Table
CREATE TABLE IF NOT EXISTS public.registration_submissions (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    tournament_id TEXT REFERENCES public.tournaments(id) ON DELETE SET NULL,
    team_name TEXT NOT NULL,
    logo_file_name TEXT,
    captain_name TEXT NOT NULL,
    captain_email TEXT NOT NULL,
    bgmi_uid TEXT NOT NULL,
    players TEXT[] NOT NULL,
    whatsapp TEXT,
    discord TEXT,
    payment_file_name TEXT,
    status TEXT NOT NULL DEFAULT 'SUBMITTED',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Enable Row Level Security (RLS)
ALTER TABLE public.tournaments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.teams ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.matches ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.announcements ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.registration_submissions ENABLE ROW LEVEL SECURITY;

-- Create Public Read Policies
CREATE POLICY "Public Read Tournaments" ON public.tournaments FOR SELECT USING (true);
CREATE POLICY "Public Read Teams" ON public.teams FOR SELECT USING (true);
CREATE POLICY "Public Read Matches" ON public.matches FOR SELECT USING (true);
CREATE POLICY "Public Read Announcements" ON public.announcements FOR SELECT USING (true);

-- Allow Public Insert for Squad Registration Submissions
CREATE POLICY "Public Insert Registration Submissions" ON public.registration_submissions FOR INSERT WITH CHECK (true);

-- Allow Service Role / Anon Admin Writes
CREATE POLICY "Admin All Tournaments" ON public.tournaments FOR ALL USING (true);
CREATE POLICY "Admin All Teams" ON public.teams FOR ALL USING (true);
CREATE POLICY "Admin All Matches" ON public.matches FOR ALL USING (true);
CREATE POLICY "Admin All Announcements" ON public.announcements FOR ALL USING (true);
CREATE POLICY "Admin All Registration Submissions" ON public.registration_submissions FOR ALL USING (true);

-- Seed Initial Tournaments Data
INSERT INTO public.tournaments (id, name, mode, status, prize_pool, entry_fee, max_teams, registered_teams, phase)
VALUES 
('tour-01', 'Weekend War Championship (Season 4)', 'Squad', 'REGISTRATION_OPEN', 50000, 100, 24, 18, 'Registration'),
('tour-02', 'Daily Grind - Slot 1 (02:00 PM)', 'Squad', 'REGISTRATION_OPEN', 5000, 50, 24, 12, 'Lobby Active'),
('tour-03', 'Daily Grind - Slot 2 (05:00 PM)', 'Squad', 'REGISTRATION_OPEN', 5000, 50, 24, 8, 'Registration'),
('tour-04', 'Elite Series Qualifiers', 'Squad', 'REGISTRATION_OPEN', 100000, 250, 48, 34, 'Group Stage')
ON CONFLICT (id) DO NOTHING;

-- Seed Initial Teams Data
INSERT INTO public.teams (id, name, short_name, region, captain, matches_played, wwcd, placement_points, finishes)
VALUES
('team-01', 'Soul Ember', 'SOUL', 'IN', 'Demon OP', 12, 4, 142, 88),
('team-02', 'GodLike Ops', 'GODL', 'IN', 'Jonathan', 12, 3, 130, 94),
('team-03', 'Hydra Blitz', 'HYD', 'IN', 'Mavi', 12, 2, 110, 72),
('team-04', 'Revenant X', 'RVT', 'IN', 'Sensei', 12, 2, 98, 65)
ON CONFLICT (id) DO NOTHING;
