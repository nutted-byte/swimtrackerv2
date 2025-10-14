-- Add vo2max column to swim_sessions table
ALTER TABLE swim_sessions
ADD COLUMN IF NOT EXISTS vo2max DECIMAL(5,2);

-- Add comment for documentation
COMMENT ON COLUMN swim_sessions.vo2max IS 'VO2 max value in ml/kg/min';
