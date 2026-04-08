-- Migration: Add profiles table, simulator_sessions table, and update contact_requests
-- Run this in the Supabase SQL Editor at: https://app.supabase.com/project/zgqbpxeukhmjfcscbxjc/editor

-- 1. Profiles table for non-admin users
CREATE TABLE IF NOT EXISTS profiles (
  id UUID PRIMARY KEY REFERENCES auth.users ON DELETE CASCADE,
  name TEXT NOT NULL,
  company TEXT,
  access_tier TEXT NOT NULL DEFAULT 'explorer',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE profiles ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can read own profile"
  ON profiles FOR SELECT
  USING (auth.uid() = id);

CREATE POLICY "Users can update own profile"
  ON profiles FOR UPDATE
  USING (auth.uid() = id);

-- Allow profiles to be created during signup (insert by authenticated user for own row)
CREATE POLICY "Users can insert own profile"
  ON profiles FOR INSERT
  WITH CHECK (auth.uid() = id);

-- 2. Simulator sessions table for GIS-related sim results
CREATE TABLE IF NOT EXISTS simulator_sessions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES auth.users ON DELETE CASCADE NOT NULL,
  region TEXT NOT NULL CHECK (region IN ('us', 'indonesia', 'japan')),
  lat DOUBLE PRECISION NOT NULL,
  lng DOUBLE PRECISION NOT NULL,
  site_depth_km DOUBLE PRECISION,
  reservoir_pressure_mpa DOUBLE PRECISION,
  geology_source TEXT,
  seal_caprock TEXT,
  heat_flow_mw_m2 INTEGER,
  initial_lattice_km DOUBLE PRECISION,
  total_capex_usd DOUBLE PRECISION,
  total_opex_usd DOUBLE PRECISION,
  total_volume_mm3 DOUBLE PRECISION,
  hy10_mass_tonnes DOUBLE PRECISION,
  cost_per_tonne_usd DOUBLE PRECISION,
  interventions_json JSONB DEFAULT '[]',
  created_at TIMESTAMPTZ NOT NULL DEFAULT now(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT now()
);

ALTER TABLE simulator_sessions ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Users can manage own sessions"
  ON simulator_sessions FOR ALL
  USING (auth.uid() = user_id);

-- 3. Add user_id FK to contact_requests for linking signups
ALTER TABLE contact_requests ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users ON DELETE SET NULL;

-- 4. Allow authenticated users to insert contact_requests (if not already)
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_policies
    WHERE tablename = 'contact_requests' AND policyname = 'Authenticated can insert contact requests'
  ) THEN
    CREATE POLICY "Authenticated can insert contact requests"
      ON contact_requests FOR INSERT
      TO authenticated
      WITH CHECK (true);
  END IF;
END $$;
