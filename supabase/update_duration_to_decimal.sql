-- Update duration column to support decimal values (minutes with seconds precision)
-- This allows storing values like 25.5 minutes (25 minutes 30 seconds)

ALTER TABLE swim_sessions
ALTER COLUMN duration TYPE NUMERIC(8,4);

-- Optional: Add a comment to document the column
COMMENT ON COLUMN swim_sessions.duration IS 'Duration in decimal minutes (e.g., 25.5 = 25 minutes 30 seconds)';
