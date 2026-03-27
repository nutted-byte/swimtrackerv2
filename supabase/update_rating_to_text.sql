-- Update rating column from boolean to text for 3-level rating system
-- Converts existing boolean ratings to new text format:
-- true -> 'good'
-- false -> 'bad'
-- null -> null

-- First, add a temporary column
ALTER TABLE swim_sessions ADD COLUMN rating_new TEXT;

-- Migrate existing data
UPDATE swim_sessions
SET rating_new = CASE
  WHEN rating = true THEN 'good'
  WHEN rating = false THEN 'bad'
  ELSE NULL
END;

-- Drop the old column and rename the new one
ALTER TABLE swim_sessions DROP COLUMN rating;
ALTER TABLE swim_sessions RENAME COLUMN rating_new TO rating;

-- Add a check constraint to ensure only valid values
ALTER TABLE swim_sessions
ADD CONSTRAINT rating_check
CHECK (rating IS NULL OR rating IN ('good', 'average', 'bad'));

-- Add comment for documentation
COMMENT ON COLUMN swim_sessions.rating IS 'User''s manual rating of swim session: good, average, or bad';
