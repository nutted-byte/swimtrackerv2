-- Swim Tracker Database Schema
-- Run this SQL in your Supabase SQL Editor to set up the database

-- Create swim_sessions table
CREATE TABLE IF NOT EXISTS public.swim_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
    date TIMESTAMPTZ NOT NULL,
    distance INTEGER NOT NULL,
    duration INTEGER NOT NULL,
    pace DECIMAL(5,2) NOT NULL,
    strokes INTEGER,
    swolf INTEGER,
    rating BOOLEAN,
    laps JSONB,
    calories INTEGER,
    source TEXT,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create indexes for better query performance
CREATE INDEX IF NOT EXISTS idx_swim_sessions_user_id ON public.swim_sessions(user_id);
CREATE INDEX IF NOT EXISTS idx_swim_sessions_date ON public.swim_sessions(date DESC);
CREATE INDEX IF NOT EXISTS idx_swim_sessions_user_date ON public.swim_sessions(user_id, date DESC);

-- Enable Row Level Security (RLS)
ALTER TABLE public.swim_sessions ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Users can view their own swim sessions" ON public.swim_sessions;
DROP POLICY IF EXISTS "Users can insert their own swim sessions" ON public.swim_sessions;
DROP POLICY IF EXISTS "Users can update their own swim sessions" ON public.swim_sessions;
DROP POLICY IF EXISTS "Users can delete their own swim sessions" ON public.swim_sessions;

-- RLS Policies: Users can only access their own swim sessions
CREATE POLICY "Users can view their own swim sessions"
    ON public.swim_sessions
    FOR SELECT
    USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own swim sessions"
    ON public.swim_sessions
    FOR INSERT
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own swim sessions"
    ON public.swim_sessions
    FOR UPDATE
    USING (auth.uid() = user_id)
    WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can delete their own swim sessions"
    ON public.swim_sessions
    FOR DELETE
    USING (auth.uid() = user_id);

-- Create function to automatically update updated_at timestamp
CREATE OR REPLACE FUNCTION public.handle_updated_at()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = NOW();
    RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to call the function before updates
DROP TRIGGER IF EXISTS set_updated_at ON public.swim_sessions;
CREATE TRIGGER set_updated_at
    BEFORE UPDATE ON public.swim_sessions
    FOR EACH ROW
    EXECUTE FUNCTION public.handle_updated_at();

-- Grant necessary permissions
GRANT USAGE ON SCHEMA public TO anon, authenticated;
GRANT ALL ON public.swim_sessions TO authenticated;
