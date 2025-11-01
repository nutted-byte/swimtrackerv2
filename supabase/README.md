# Supabase Setup for Training Plans

Training plans are now stored in Supabase (same as your swim sessions) instead of localStorage.

## Setup Instructions

1. Go to your Supabase dashboard: https://app.supabase.com
2. Select your project
3. Navigate to **SQL Editor** in the left sidebar
4. Create a new query
5. Copy and paste the contents of `create_training_plans_table.sql`
6. Click **Run** to execute the SQL

This will create:
- `training_plans` table with proper schema
- Indexes for performance
- Row Level Security (RLS) policies so users can only see their own plans
- Automatic `updated_at` timestamp trigger

## What's Stored

Each training plan includes:
- Goal information (type, target, current)
- User settings (experience level, availability)
- 8 weeks of workout data
- Progress tracking (current week, completed workouts, streak)
- Status (active, paused, completed, abandoned)
- AI generation flag

## Benefits

✅ Plans persist across devices
✅ Plans survive page refreshes
✅ Automatic backup to Supabase
✅ Secure - only you can see your plans (RLS)
✅ Same storage as your swim sessions
