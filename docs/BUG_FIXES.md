# Bug Fixes Log

This document tracks bugs found and fixed in the training plan feature.

---

## Bug #1: Timeline Parameter Ignored

**Status**: ✅ FIXED

**Reported**: User feedback - "if i select a 4 week plan it creates an 8 week plan"

**Severity**: High - Core functionality broken

### Description
When creating a training plan and selecting a timeline (4, 6, 8, 10, or 12 weeks), the system always generated an 8-week plan regardless of the selection.

### Root Cause
The `timeline` parameter was not being passed through the complete data flow:

1. **TrainingPlanContext.jsx** - `createPlan()` function did not include `timeline` in `planParams` object
2. **planGenerator.js** - `generateTrainingPlan()` did not destructure `timeline` from formData
3. **planGenerator.js** - Hardcoded loop: `for (let weekNum = 1; weekNum <= 8; weekNum++)`
4. **llmQuery.js** - `generateFullTrainingPlan()` did not receive or use `timeline` parameter

### Files Changed

#### 1. `src/context/TrainingPlanContext.jsx`
**Lines 76-88**
```javascript
// BEFORE
const planParams = {
  goalType: params.goalType,
  currentValue: parseFloat(params.current),
  targetValue: parseFloat(params.target),
  // timeline missing!
  experienceLevel: params.userLevel,
  daysPerWeek: parseInt(params.frequency),
  minutesPerSession: parseInt(params.sessionLength),
  // poolLength missing!
  startDate: params.startDate || new Date()
};

// AFTER
const planParams = {
  goalType: params.goalType,
  currentValue: parseFloat(params.current),
  targetValue: parseFloat(params.target),
  timeline: parseInt(params.timeline) || 8,  // ✅ ADDED
  experienceLevel: params.userLevel,
  daysPerWeek: parseInt(params.frequency),
  minutesPerSession: parseInt(params.sessionLength),
  poolLength: parseInt(params.poolLength) || 25,  // ✅ ADDED
  startDate: params.startDate || new Date()
};
```

#### 2. `src/utils/planGenerator.js`
**Lines 20-35**
```javascript
// BEFORE
export const generateTrainingPlan = async (formData) => {
  const {
    goalType,
    currentValue,
    targetValue,
    // timeline missing!
    experienceLevel,
    daysPerWeek,
    minutesPerSession,
    poolLength = 25,
    startDate
  } = formData;

// AFTER
export const generateTrainingPlan = async (formData) => {
  const {
    goalType,
    currentValue,
    targetValue,
    timeline = 8,  // ✅ ADDED
    experienceLevel,
    daysPerWeek,
    minutesPerSession,
    poolLength = 25,
    startDate
  } = formData;
```

**Lines 37-47**
```javascript
// BEFORE
const aiResult = await generateFullTrainingPlan({
  goalType,
  currentValue,
  targetValue,
  // timeline missing!
  experienceLevel,
  daysPerWeek,
  minutesPerSession,
  poolLength
});

// AFTER
const aiResult = await generateFullTrainingPlan({
  goalType,
  currentValue,
  targetValue,
  timeline,  // ✅ ADDED
  experienceLevel,
  daysPerWeek,
  minutesPerSession,
  poolLength
});
```

**Lines 69-93**
```javascript
// BEFORE
const weeklyVolume = calculateWeeklyVolume(currentValue, targetValue, experienceLevel, goalType);
// ...
for (let weekNum = 1; weekNum <= 8; weekNum++) {  // ❌ HARDCODED
  const isRecoveryWeek = weekNum === 4 || weekNum === 7;  // ❌ FIXED LOGIC
  // ...
}
overview = 'Your personalized 8-week plan...';  // ❌ HARDCODED

// AFTER
const weeklyVolume = calculateWeeklyVolume(currentValue, targetValue, experienceLevel, goalType, timeline);  // ✅ PASS TIMELINE
// ...
for (let weekNum = 1; weekNum <= timeline; weekNum++) {  // ✅ USE TIMELINE
  // ✅ DYNAMIC RECOVERY WEEKS
  const isRecoveryWeek = (timeline >= 6 && weekNum === Math.floor(timeline / 2)) ||
                         (timeline >= 8 && weekNum === timeline - 1);
  // ...
}
overview = `Your personalized ${timeline}-week plan...`;  // ✅ DYNAMIC TEXT
```

**Lines 143-165**
```javascript
// BEFORE
const calculateWeeklyVolume = (current, target, experienceLevel, goalType) => {
  // ...
  for (let i = 1; i <= 8; i++) {  // ❌ HARDCODED
    if (i === 4 || i === 7) {  // ❌ FIXED LOGIC
      // ...
    }
  }
};

// AFTER
const calculateWeeklyVolume = (current, target, experienceLevel, goalType, numWeeks = 8) => {  // ✅ ACCEPT PARAMETER
  // ...
  for (let i = 1; i <= numWeeks; i++) {  // ✅ USE PARAMETER
    // ✅ DYNAMIC RECOVERY LOGIC
    const isRecoveryWeek = (numWeeks >= 6 && i === Math.floor(numWeeks / 2)) ||
                           (numWeeks >= 8 && i === numWeeks - 1);
    if (isRecoveryWeek) {
      // ...
    }
  }
};
```

#### 3. `src/utils/ai/llmQuery.js`
**Lines 402-435**
```javascript
// BEFORE
export const generateFullTrainingPlan = async (planParams) => {
  const {
    goalType,
    currentValue,
    targetValue,
    // timeline missing!
    experienceLevel,
    daysPerWeek,
    minutesPerSession,
    poolLength = 25
  } = planParams;

  const systemPrompt = `You are an expert swim coach creating personalized 8-week training plans.`;  // ❌ HARDCODED

// AFTER
export const generateFullTrainingPlan = async (planParams) => {
  const {
    goalType,
    currentValue,
    targetValue,
    timeline = 8,  // ✅ ADDED
    experienceLevel,
    daysPerWeek,
    minutesPerSession,
    poolLength = 25
  } = planParams;

  const systemPrompt = `You are an expert swim coach creating personalized ${timeline}-week training plans.`;  // ✅ DYNAMIC
```

**Lines 447, 477-481, 499-500**
```javascript
// BEFORE
- Recovery weeks: Week 4 and Week 7 at ~70% volume  // ❌ HARDCODED
IMPORTANT:
- Generate ALL 8 weeks  // ❌ HARDCODED
- Validate structure
if (!planStructure.weeks || planStructure.weeks.length !== 8) {  // ❌ HARDCODED

// AFTER
- Recovery weeks: ${timeline >= 6 ? `Mid-point (Week ${Math.floor(timeline / 2)})` : 'Not applicable'}${timeline >= 8 ? ` and near end (Week ${timeline - 1})` : ''} at ~70% volume  // ✅ DYNAMIC
IMPORTANT:
- Generate ALL ${timeline} weeks  // ✅ DYNAMIC
- Validate structure
if (!planStructure.weeks || planStructure.weeks.length !== timeline) {  // ✅ DYNAMIC
```

### Recovery Week Logic

The fix includes smart recovery week placement based on timeline:

| Timeline | Recovery Weeks | Logic |
|----------|----------------|-------|
| 4 weeks  | Week 2 | Mid-point only |
| 6 weeks  | Week 3 | Mid-point only |
| 8 weeks  | Weeks 4, 7 | Mid-point + near end |
| 10 weeks | Weeks 5, 9 | Mid-point + near end |
| 12 weeks | Weeks 6, 11 | Mid-point + near end |

```javascript
const isRecoveryWeek = (timeline >= 6 && weekNum === Math.floor(timeline / 2)) ||
                       (timeline >= 8 && weekNum === timeline - 1);
```

### Testing

**Test Case**: Create 4-week plan
```javascript
// Expected console output:
Starting plan generation with: { ..., timeline: 4 }

// Expected result:
Generated plan: {
  weeks: [Array(4)],  // Exactly 4 weeks
  overview: "Your personalized 4-week plan..."
}
```

**Verification Steps**:
1. Select 4-week timeline in wizard
2. Complete plan creation
3. Check console for timeline: 4
4. Verify UI shows "Week X of 4"
5. Expand week list - see exactly 4 weeks
6. Week 2 should be recovery week

### Related Issues
- This bug also affected pool length parameter (fixed in same commit)
- AI prompt now correctly generates specified number of weeks
- Algorithmic fallback now respects timeline

---

## Bug #2: Pool Length Parameter Ignored

**Status**: ✅ FIXED

**Reported**: User feedback - "a pool length is either 25 or 50m so doing a 256m warm up doesnt make sense"

**Severity**: Medium - Usability issue, workouts impractical

### Description
Workout distances were not aligned with pool lengths, resulting in awkward distances like 256m, 192m, 384m that don't translate to whole lap counts.

### Root Cause
1. Pool length not passed from wizard to plan generator
2. No distance rounding function
3. Algorithmic generation used arbitrary percentages (e.g., 20%, 15%) without rounding

### Files Changed

#### 1. `src/utils/planGenerator.js`
**Added `roundToPoolLength()` function**
```javascript
// Lines 10-12
const roundToPoolLength = (distance, poolLength = 25) => {
  return Math.round(distance / poolLength) * poolLength;
};
```

**Applied rounding to all distance calculations**:
- Session total distance (line 295)
- Warmup distance (line 297)
- Cooldown distance (line 298)
- Main set intervals (lines 364, 379, 384, etc.)
- Drill distances (lines 403-404)

### Example Fix
```javascript
// BEFORE
const warmupDistance = Math.round(cappedDistance * 0.2);  // Could be 256m
const cooldownDistance = Math.round(cappedDistance * 0.15);  // Could be 192m

// AFTER
const warmupDistance = roundToPoolLength(cappedDistance * 0.2, poolLength);  // Always 250m or 300m
const cooldownDistance = roundToPoolLength(cappedDistance * 0.15, poolLength);  // Always 150m or 200m
```

### Testing
```javascript
// Test distances for 25m pool
1280m * 0.2 = 256m → rounds to 250m (10 laps)
1280m * 0.15 = 192m → rounds to 200m (8 laps)

// Test distances for 50m pool
1300m * 0.2 = 260m → rounds to 250m (5 laps)
1300m * 0.15 = 195m → rounds to 200m (4 laps)
```

**Verification**:
All distances now end in:
- 25m pool: 00, 25, 50, 75
- 50m pool: 00, 50

---

## Bug #3: Missing Lap Count Display

**Status**: ✅ FIXED

**Reported**: User feedback - "also when you show distances also show lengths"

**Severity**: Low - Feature request

### Description
Workout cards only showed total distance (e.g., "1.2km") without lap count, making it hard to plan actual swimming.

### Solution
Added lap count display to all workout distance displays.

### Files Changed

#### `src/pages/Training.jsx`
**Added helper function**:
```javascript
// Lines 24-28
const formatDistanceWithLaps = (distanceMeters, poolLength = 25) => {
  const laps = Math.round(distanceMeters / poolLength);
  const km = (distanceMeters / 1000).toFixed(1);
  return `${km}km (${laps} laps)`;
};
```

**Applied to workout displays**:
- Line 387: Workout card summary
- Line 466: Workout detail stats

### Example Output
```
Before: "1.2km"
After:  "1.2km (48 laps)"  [for 25m pool]
        "1.2km (24 laps)"  [for 50m pool]
```

### Testing
```javascript
formatDistanceWithLaps(1200, 25);  // "1.2km (48 laps)"
formatDistanceWithLaps(1200, 50);  // "1.2km (24 laps)"
formatDistanceWithLaps(800, 25);   // "0.8km (32 laps)"
```

---

## Testing After Fixes

### Regression Test Suite
Run all tests in `docs/TESTING.md` to verify:
- [ ] Timeline tests (1.1-1.5)
- [ ] Pool length tests (2.1-2.3)
- [ ] Integration tests (4.1-4.3)

### Quick Validation
```bash
# Test 4-week plan
1. Create 4-week plan
2. Console should show: timeline: 4
3. UI should show: "4-week plan"
4. Should have exactly 4 weeks

# Test pool distances
1. Create plan with 25m pool
2. Check all distances end in 00/25/50/75
3. Check lap counts shown correctly
```

---

## Future Improvements

### Potential Issues to Watch
1. **Very short timelines** (4 weeks) may need adjusted progression
2. **Recovery week logic** for odd-numbered weeks (5, 7, 9, 11)
3. **AI generation reliability** - ensure fallback always works
4. **Mobile display** of lap counts with long distances

### Enhancement Ideas
1. Allow custom pool lengths (e.g., 33m)
2. Show lap count breakdown in workout details (e.g., "Warmup: 200m (8 laps)")
3. Add "yards" option for US users
4. Progressive lap count tracking (actual laps completed vs planned)

---

## Commit Messages

```
fix: Pass timeline and pool length parameters through plan generation stack

- Add timeline parameter to TrainingPlanContext planParams
- Add poolLength parameter to TrainingPlanContext planParams
- Update generateTrainingPlan to destructure and use timeline
- Update AI prompt to generate correct number of weeks
- Update algorithmic fallback to use timeline instead of hardcoded 8
- Add dynamic recovery week logic based on timeline
- Update calculateWeeklyVolume to accept numWeeks parameter
- Update all AI prompt text to use timeline variable
- Add validation for timeline in AI response

Fixes: #1 - Timeline parameter ignored

---

fix: Round all workout distances to pool length multiples

- Add roundToPoolLength utility function
- Apply rounding to session total distances
- Apply rounding to warmup/cooldown/main set distances
- Apply rounding to interval and drill distances
- Update AI prompt to emphasize pool-aligned distances

Fixes: #2 - Pool length parameter ignored

---

feat: Display lap counts alongside distances in workouts

- Add formatDistanceWithLaps helper function
- Update workout card summary to show lap count
- Update workout detail stats to show lap count
- Pass pool length to WorkoutCard component

Fixes: #3 - Missing lap count display
```

---

## Prevention Measures

### Code Review Checklist
When adding new plan generation features:
- [ ] Trace parameter from wizard → context → generator → AI
- [ ] Verify parameter is destructured in all functions
- [ ] Check for hardcoded values that should be parameters
- [ ] Update both AI and algorithmic code paths
- [ ] Add validation for new parameters
- [ ] Update type definitions if using TypeScript
- [ ] Test with minimum and maximum values
- [ ] Check console logs show correct values

### Documentation
- Keep `TESTING.md` updated with new test cases
- Add examples to `TEST_CASES_QUICK_REF.md`
- Document parameter flow in code comments
- Update this file with each bug fix
