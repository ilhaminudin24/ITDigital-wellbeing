-- ============================================================
-- ITDigital Wellbeing Monitor - Initial Database Schema
-- Applied via Supabase MCP on 2026-01-20
-- ============================================================

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ============================================================
-- TABLE: user_profiles
-- ============================================================
CREATE TABLE public.user_profiles (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    nik TEXT UNIQUE,  -- Nomor Induk Karyawan / Coworker ID
    name TEXT NOT NULL,
    weight DECIMAL(5,2) NOT NULL CHECK (weight > 0 AND weight < 500),
    height DECIMAL(5,2) NOT NULL CHECK (height > 0 AND height < 300),
    age INTEGER NOT NULL CHECK (age > 0 AND age < 150),
    gender TEXT NOT NULL CHECK (gender IN ('male', 'female')),
    target_calories DECIMAL(10,2) NOT NULL DEFAULT 0,
    total_calories DECIMAL(10,2) NOT NULL DEFAULT 0,
    profile_completed BOOLEAN NOT NULL DEFAULT false,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    
    CONSTRAINT unique_user_profile UNIQUE (user_id)
);

-- Indexes for user_profiles
CREATE INDEX idx_user_profiles_user_id ON public.user_profiles(user_id);
CREATE INDEX idx_user_profiles_nik ON public.user_profiles(nik);

-- Enable RLS
ALTER TABLE public.user_profiles ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own profile" 
    ON public.user_profiles FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own profile" 
    ON public.user_profiles FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own profile" 
    ON public.user_profiles FOR UPDATE 
    USING (auth.uid() = user_id);

-- ============================================================
-- TABLE: activities
-- ============================================================
CREATE TABLE public.activities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    activity_date DATE NOT NULL,
    location TEXT NOT NULL,
    distance DECIMAL(6,2) NOT NULL CHECK (distance >= 0.1 AND distance <= 50),
    calories DECIMAL(8,2) NOT NULL CHECK (calories >= 10 AND calories <= 10000),
    photo_url TEXT,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes for activities
CREATE INDEX idx_activities_user_id ON public.activities(user_id);
CREATE INDEX idx_activities_date ON public.activities(activity_date);
CREATE INDEX idx_activities_user_date ON public.activities(user_id, activity_date);

-- Enable RLS
ALTER TABLE public.activities ENABLE ROW LEVEL SECURITY;

-- RLS Policies
CREATE POLICY "Users can view own activities" 
    ON public.activities FOR SELECT 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert own activities" 
    ON public.activities FOR INSERT 
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update own activities" 
    ON public.activities FOR UPDATE 
    USING (auth.uid() = user_id);

CREATE POLICY "Users can delete own activities" 
    ON public.activities FOR DELETE 
    USING (auth.uid() = user_id);

-- ============================================================
-- FUNCTIONS & TRIGGERS
-- ============================================================

-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY INVOKER
SET search_path = public
AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$;

-- Trigger for user_profiles
CREATE TRIGGER update_user_profiles_updated_at
    BEFORE UPDATE ON public.user_profiles
    FOR EACH ROW
    EXECUTE FUNCTION update_updated_at_column();

-- Function to recalculate total calories
CREATE OR REPLACE FUNCTION recalculate_user_calories()
RETURNS TRIGGER 
LANGUAGE plpgsql
SECURITY DEFINER
SET search_path = public
AS $$
BEGIN
    UPDATE public.user_profiles
    SET total_calories = (
        SELECT COALESCE(SUM(calories), 0)
        FROM public.activities
        WHERE user_id = COALESCE(NEW.user_id, OLD.user_id)
    )
    WHERE user_id = COALESCE(NEW.user_id, OLD.user_id);
    
    RETURN COALESCE(NEW, OLD);
END;
$$;

-- Triggers for activities to update total calories
CREATE TRIGGER after_activity_insert
    AFTER INSERT ON public.activities
    FOR EACH ROW
    EXECUTE FUNCTION recalculate_user_calories();

CREATE TRIGGER after_activity_update
    AFTER UPDATE ON public.activities
    FOR EACH ROW
    EXECUTE FUNCTION recalculate_user_calories();

CREATE TRIGGER after_activity_delete
    AFTER DELETE ON public.activities
    FOR EACH ROW
    EXECUTE FUNCTION recalculate_user_calories();

-- ============================================================
-- STORAGE BUCKET
-- ============================================================
INSERT INTO storage.buckets (id, name, public)
VALUES ('activity-photos', 'activity-photos', true)
ON CONFLICT (id) DO NOTHING;

-- Storage policies
CREATE POLICY "Users can upload own photos"
ON storage.objects FOR INSERT
WITH CHECK (
    bucket_id = 'activity-photos' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);

CREATE POLICY "Public can view photos"
ON storage.objects FOR SELECT
USING (bucket_id = 'activity-photos');

CREATE POLICY "Users can delete own photos"
ON storage.objects FOR DELETE
USING (
    bucket_id = 'activity-photos' 
    AND auth.uid()::text = (storage.foldername(name))[1]
);
