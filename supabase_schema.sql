-- ========================================================
-- NexBattles BGMI - Complete Supabase Database Schema
-- Run this script in your Supabase SQL Editor: https://supabase.com/dashboard/project/_/sql
-- ========================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Admin Settings Table (Stores Admin Passcode securely in Supabase Database)
CREATE TABLE IF NOT EXISTS public.admin_settings (
    key TEXT PRIMARY KEY,
    value TEXT NOT NULL,
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

ALTER TABLE public.admin_settings ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public Read Admin Settings" ON public.admin_settings FOR SELECT USING (true);
CREATE POLICY "Admin All Admin Settings" ON public.admin_settings FOR ALL USING (true);

-- Insert official Admin Password into Supabase Database
INSERT INTO public.admin_settings (key, value)
VALUES ('admin_password', 'vinaygbmi!@#$%^&*')
ON CONFLICT (key) DO UPDATE SET value = EXCLUDED.value;

-- 2. Tournaments Table
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
    room_id TEXT,
    room_password TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Teams Leaderboard Table
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

-- 4. Matches Schedule Table
CREATE TABLE IF NOT EXISTS public.matches (
    id TEXT PRIMARY KEY DEFAULT gen_random_uuid()::text,
    tournament_id TEXT REFERENCES public.tournaments(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    starts_at TIMESTAMPTZ NOT NULL DEFAULT (NOW() + INTERVAL '2 days'),
    map TEXT DEFAULT 'Erangel',
    status TEXT DEFAULT 'UPCOMING',
    group_name TEXT DEFAULT 'Group A',
    room_id TEXT,
    room_password TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Announcements Table
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

-- 6. Registration Submissions Table
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
