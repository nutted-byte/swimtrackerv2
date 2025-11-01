-- Create training_plans table
CREATE TABLE IF NOT EXISTS training_plans (
  id TEXT PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,

  -- Goal information
  goal JSONB NOT NULL,

  -- User settings
  experience_level TEXT NOT NULL,
  availability JSONB NOT NULL,

  -- Plan data
  start_date TIMESTAMPTZ NOT NULL,
  weeks JSONB NOT NULL,
  status TEXT NOT NULL DEFAULT 'active',
  overview TEXT,
  ai_generated BOOLEAN DEFAULT false,

  -- Progress tracking
  progress JSONB NOT NULL,

  -- Timestamps
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  CONSTRAINT training_plans_status_check CHECK (status IN ('active', 'paused', 'completed', 'abandoned'))
);

-- Create index on user_id for faster queries
CREATE INDEX IF NOT EXISTS idx_training_plans_user_id ON training_plans(user_id);

-- Create index on status for filtering active plans
CREATE INDEX IF NOT EXISTS idx_training_plans_status ON training_plans(status);

-- Enable Row Level Security
ALTER TABLE training_plans ENABLE ROW LEVEL SECURITY;

-- Create policies for RLS
CREATE POLICY "Users can view their own training plans"
  ON training_plans FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own training plans"
  ON training_plans FOR INSERT
  WITH CHECK (auth.uid() = user_id);

CREATE POLICY "Users can update their own training plans"
  ON training_plans FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can delete their own training plans"
  ON training_plans FOR DELETE
  USING (auth.uid() = user_id);

-- Create function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_training_plan_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

-- Create trigger to automatically update updated_at
CREATE TRIGGER update_training_plans_updated_at
  BEFORE UPDATE ON training_plans
  FOR EACH ROW
  EXECUTE FUNCTION update_training_plan_updated_at();
