# Swim Tracker Project Overview

## Project Structure

This is a React-based swim tracking application with training plan features.

### Key Directories
- `src/pages/` - Main page components (Training.jsx, Dashboard.jsx, Sessions.jsx, etc.)
- `src/components/` - Reusable UI components
- `src/context/` - React Context providers (TrainingPlanContext.jsx, AuthContext.jsx)
- `src/utils/` - Utility functions (planGenerator.js, ai/llmQuery.js)
- `src/data/` - Static data and sample content
- `docs/` - Documentation including test cases and bug tracking
- `supabase/` - Database schema and setup instructions

### Tech Stack
- **Frontend**: React + Vite
- **Styling**: Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **AI**: Claude API via Supabase Edge Functions
- **Animation**: Framer Motion
- **Charts**: Recharts

## Training Plan Feature

### Data Flow
1. **Wizard** (`PlanCreationWizard.jsx`) → User inputs
2. **Context** (`TrainingPlanContext.jsx`) → Maps and validates params
3. **Generator** (`planGenerator.js`) → Calls AI or uses fallback
4. **AI** (`llmQuery.js`) → Generates plan structure
5. **Storage** (`Supabase`) → Persists plan with RLS
6. **Display** (`Training.jsx`) → Shows plan and workouts

### Critical Parameters
- `timeline`: Number of weeks (4, 6, 8, 10, 12)
- `poolLength`: Pool size in meters (25 or 50)
- `goalType`: 'distance' or 'pace'
- `experienceLevel`: 'beginner', 'intermediate', 'advanced'
- `daysPerWeek`: 1-6 sessions per week
- `minutesPerSession`: 30, 45, 60, or 90 minutes

### Important Implementation Details

**Distance Rounding**: All workout distances MUST be multiples of pool length
```javascript
const roundToPoolLength = (distance, poolLength = 25) => {
  return Math.round(distance / poolLength) * poolLength;
};
```

**Recovery Weeks**: Dynamically placed based on timeline
- 4-6 weeks: Mid-point only
- 8+ weeks: Mid-point + near end

**Parameter Flow**: Always verify parameters flow through:
1. Wizard form state
2. Context `planParams` object
3. Generator function destructuring
4. AI prompt template
5. Algorithmic fallback

## Database Schema

### `training_plans` table (Supabase)
```sql
- id: TEXT (primary key)
- user_id: UUID (references auth.users)
- goal: JSONB (type, target, current)
- experience_level: TEXT
- availability: JSONB (days_per_week, minutes_per_session, pool_length)
- weeks: JSONB (array of week objects)
- progress: JSONB (current_week, completed_workouts, etc.)
- status: TEXT (active, paused, completed, abandoned)
- ai_generated: BOOLEAN
- created_at: TIMESTAMPTZ
- updated_at: TIMESTAMPTZ
```

### Field Naming Convention
- **Database/Supabase**: snake_case (e.g., `pool_length`, `days_per_week`)
- **React/JavaScript**: camelCase for local vars, snake_case for DB objects

## Common Issues & Solutions

### Issue: Timeline not respected
**Fix**: Verify `timeline` parameter passed through entire stack

### Issue: Pool length ignored
**Fix**: Apply `roundToPoolLength()` to all distance calculations

### Issue: Plans don't persist
**Fix**: Check Supabase RLS policies and user authentication

## Testing Strategy

1. **Smoke Test**: Create 4-week plan with 25m pool
2. **Integration Test**: Full wizard flow → plan display → persistence
3. **Regression Test**: Verify bug fixes still work (see docs/BUG_FIXES.md)
4. **Edge Cases**: Min/max values for all parameters

## Development Workflow

1. Make changes to feature code
2. Run quick smoke test (see docs/TEST_CASES_QUICK_REF.md)
3. Check console for parameter flow
4. Verify distances are pool-aligned
5. Test plan persistence (refresh page)
6. Update docs if fixing bugs

## API Endpoints

### Supabase Edge Functions
- `POST /functions/v1/ask-ai` - AI plan generation
  - Body: `{ systemPrompt, userPrompt, model, maxTokens }`
  - Returns: `{ content, model, usage }`

### Supabase REST API
- `POST /rest/v1/training_plans` - Create plan
- `GET /rest/v1/training_plans` - Load user's plans
- `PATCH /rest/v1/training_plans` - Update plan

## Environment Variables
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key
- Backend has `ANTHROPIC_API_KEY` for AI features
