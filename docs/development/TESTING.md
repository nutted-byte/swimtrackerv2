# Training Plan Testing Guide

This document provides test cases and manual testing procedures for the training plan feature.

## Test Categories

1. [Timeline Tests](#timeline-tests) - Verify plans generate correct number of weeks
2. [Pool Length Tests](#pool-length-tests) - Verify distances align with pool length
3. [Goal Type Tests](#goal-type-tests) - Test distance, pace, and event goals
4. [Integration Tests](#integration-tests) - End-to-end workflows
5. [Edge Cases](#edge-cases) - Boundary conditions and error handling

---

## Timeline Tests

### Test Case 1.1: 4-Week Plan
**Purpose**: Verify that selecting a 4-week plan generates exactly 4 weeks

**Steps**:
1. Navigate to Training page
2. Click "New Plan" (if existing plan)
3. Fill in wizard:
   - Goal Type: Distance
   - Current: 400
   - Target: 800
   - Timeline: **4 weeks**
   - Experience: Beginner
   - Frequency: 3x/week
   - Session Length: 45 min
   - Pool Length: 25m
4. Click "Create Plan"

**Expected Results**:
- ✅ Plan generates successfully
- ✅ Exactly 4 weeks shown in plan
- ✅ Progress bar shows "Week X of 4"
- ✅ Overview text says "4-week plan"
- ✅ Week 2 should be recovery week (mid-point)

**Console Validation**:
```javascript
// Check console output
Starting plan generation with: { ..., timeline: 4 }
// After generation
Generated plan: { weeks: [Array(4)], ... }
```

---

### Test Case 1.2: 6-Week Plan
**Purpose**: Verify 6-week plan generation

**Steps**: Same as 1.1, but select **6 weeks**

**Expected Results**:
- ✅ Exactly 6 weeks
- ✅ Week 3 is recovery week (mid-point)
- ✅ Progressive volume increase

---

### Test Case 1.3: 8-Week Plan (Default)
**Purpose**: Verify standard 8-week plan

**Steps**: Same as 1.1, but select **8 weeks**

**Expected Results**:
- ✅ Exactly 8 weeks
- ✅ Week 4 is recovery week (mid-point)
- ✅ Week 7 is recovery week (near end)

---

### Test Case 1.4: 10-Week Plan
**Purpose**: Verify extended 10-week plan

**Steps**: Same as 1.1, but select **10 weeks**

**Expected Results**:
- ✅ Exactly 10 weeks
- ✅ Week 5 is recovery week (mid-point)
- ✅ Week 9 is recovery week (near end)

---

### Test Case 1.5: 12-Week Plan
**Purpose**: Verify maximum 12-week plan

**Steps**: Same as 1.1, but select **12 weeks**

**Expected Results**:
- ✅ Exactly 12 weeks
- ✅ Week 6 is recovery week (mid-point)
- ✅ Week 11 is recovery week (near end)

---

## Pool Length Tests

### Test Case 2.1: 25m Pool Distances
**Purpose**: Verify all distances are multiples of 25m

**Steps**:
1. Create plan with **Pool Length: 25m**
2. Expand any week's workouts
3. Check warmup, main set, and cooldown distances

**Expected Results**:
- ✅ All distances end in: 0, 25, 50, 75 (e.g., 200m, 225m, 250m, 275m, 300m)
- ✅ NO distances like: 192m, 256m, 384m
- ✅ Lap counts shown correctly (e.g., "400m (16 laps)" for 25m pool)

**Examples of Valid Distances**:
```
Warmup:  200m, 250m, 300m, 400m
Main:    400m, 600m, 800m, 1000m, 1200m, 1500m
Cooldown: 100m, 150m, 200m, 250m
```

---

### Test Case 2.2: 50m Pool Distances
**Purpose**: Verify all distances are multiples of 50m

**Steps**: Same as 2.1, but select **Pool Length: 50m**

**Expected Results**:
- ✅ All distances end in: 0, 50 (e.g., 200m, 250m, 300m, 350m, 400m)
- ✅ Lap counts shown correctly (e.g., "400m (8 laps)" for 50m pool)

---

### Test Case 2.3: Interval Sets Pool Alignment
**Purpose**: Verify interval sets use pool-appropriate distances

**Steps**:
1. Create 8-week plan, 25m pool
2. Look at Week 3+ main sets (should have intervals)
3. Check interval distances like "4x200m" or "8x100m"

**Expected Results**:
- ✅ Interval distances are multiples of pool length
- ✅ Set descriptions make sense: "4x200m @ steady pace" (not "4x192m")

---

## Goal Type Tests

### Test Case 3.1: Distance Goal
**Purpose**: Test building to continuous swim distance

**Steps**:
1. Goal Type: **Distance**
2. Current: 800m
3. Target: 1500m
4. Timeline: 8 weeks
5. Create plan

**Expected Results**:
- ✅ Week 1 sessions around 900-1000m total
- ✅ Week 8 sessions around 1500m total
- ✅ Progressive increase in continuous swimming
- ✅ Goal description: "Build to 1500m continuous swim"

---

### Test Case 3.2: Pace Goal
**Purpose**: Test improving pace/100m

**Steps**:
1. Goal Type: **Pace**
2. Current: 3.0 (min/100m)
3. Target: 2.5 (min/100m)
4. Timeline: 8 weeks
5. Create plan

**Expected Results**:
- ✅ More interval-based workouts
- ✅ Focus on speed and pacing
- ✅ Goal description: "Improve pace to 2.5 min/100m"

---

## Integration Tests

### Test Case 4.1: Complete Plan Creation Flow
**Purpose**: Test entire workflow from wizard to plan display

**Steps**:
1. Start on Dashboard
2. Click "Training" in nav
3. See "No plan" state with wizard
4. Complete all 4 wizard steps:
   - Step 1: Select goal, enter current/target
   - Step 2: Select experience level
   - Step 3: Select frequency, session length, pool length
   - Step 4: Review and confirm
5. Click "Create Plan"
6. Wait for AI generation (loading screen)
7. Plan loads successfully

**Expected Results**:
- ✅ Smooth flow through all steps
- ✅ Validation on Step 1 (target > current for distance)
- ✅ Loading screen shows during generation
- ✅ Plan displays with correct parameters
- ✅ Can expand weeks and see workouts
- ✅ Lap counts shown on all workouts

---

### Test Case 4.2: Plan Persistence
**Purpose**: Verify plan survives page refresh

**Steps**:
1. Create a plan
2. Refresh the page (Cmd+R / Ctrl+R)
3. Navigate away and back to Training page

**Expected Results**:
- ✅ Plan still visible after refresh
- ✅ Progress preserved
- ✅ All workout data intact

---

### Test Case 4.3: Replace Existing Plan
**Purpose**: Test starting a new plan

**Steps**:
1. Create initial plan
2. Click "New Plan" button
3. See confirmation modal
4. Click "Start New Plan"
5. Create different plan with new parameters

**Expected Results**:
- ✅ Confirmation modal appears
- ✅ Shows current plan details
- ✅ Old plan archived (status: 'abandoned')
- ✅ New plan created successfully
- ✅ Only new plan visible

---

## Edge Cases

### Test Case 5.1: Very Short Timeline (4 weeks)
**Purpose**: Test minimum viable plan

**Steps**: Create 4-week plan with 2x/week frequency

**Expected Results**:
- ✅ Only 8 total workouts
- ✅ Still shows progression
- ✅ Recovery week at week 2

---

### Test Case 5.2: Low Frequency (1x/week)
**Purpose**: Test minimal training frequency

**Steps**: Create plan with 1 session per week

**Expected Results**:
- ✅ 1 workout per week
- ✅ Longer individual sessions
- ✅ Mix of workout types across weeks

---

### Test Case 5.3: High Frequency (6x/week)
**Purpose**: Test maximum training frequency

**Steps**: Create plan with 6 sessions per week

**Expected Results**:
- ✅ 6 workouts per week
- ✅ Variety of session types
- ✅ Shorter individual sessions
- ✅ Recovery days distributed

---

### Test Case 5.4: Short Sessions (30 min)
**Purpose**: Test time-constrained sessions

**Steps**: Create plan with 30-minute sessions

**Expected Results**:
- ✅ Total distances fit in 30 min (~1000-1200m max)
- ✅ Simplified warmup/cooldown
- ✅ Focused main sets

---

### Test Case 5.5: Long Sessions (90 min)
**Purpose**: Test extended sessions

**Steps**: Create plan with 90-minute sessions

**Expected Results**:
- ✅ Longer total distances (~3000-4000m)
- ✅ Extended warmup/cooldown
- ✅ Complex main sets with multiple parts

---

### Test Case 5.6: Validation Errors
**Purpose**: Test form validation

**Steps**:
1. Try to proceed Step 1 without filling fields
2. Try target < current for distance goal
3. Try target > current for pace goal

**Expected Results**:
- ✅ Error messages shown
- ✅ Cannot proceed to next step
- ✅ Clear error text

---

## Bug Regression Tests

### Bug Fix 1: Timeline Not Respected
**Issue**: 4-week plan created 8 weeks
**Fix**: Pass timeline parameter through full stack

**Test**:
1. Create 4-week plan
2. Verify exactly 4 weeks generated

**Pass Criteria**:
- ✅ Console shows: `timeline: 4`
- ✅ Plan has 4 weeks
- ✅ UI shows "4-week plan"

---

### Bug Fix 2: Pool Length Ignored
**Issue**: Distances like 256m, 192m generated
**Fix**: Round all distances to pool multiples

**Test**:
1. Create plan with 25m pool
2. Check all workout distances

**Pass Criteria**:
- ✅ No distances with odd endings
- ✅ All multiples of 25m
- ✅ Lap counts accurate

---

## Automated Test Script (Console)

Copy this into browser console on Training page to validate a plan:

```javascript
// Validate Training Plan
function validatePlan() {
  const plan = JSON.parse(localStorage.getItem('trainingPlan') || '{}');

  console.log('=== PLAN VALIDATION ===');
  console.log('Timeline:', plan.weeks?.length, 'weeks');
  console.log('Pool Length:', plan.availability?.pool_length, 'm');

  // Check all distances
  const poolLength = plan.availability?.pool_length || 25;
  let invalidDistances = [];

  plan.weeks?.forEach(week => {
    week.sessions?.forEach(session => {
      if (session.totalDistance % poolLength !== 0) {
        invalidDistances.push({
          week: week.weekNumber,
          session: session.title,
          distance: session.totalDistance
        });
      }
    });
  });

  if (invalidDistances.length > 0) {
    console.error('❌ Invalid distances found:', invalidDistances);
  } else {
    console.log('✅ All distances align with pool length');
  }

  return {
    weekCount: plan.weeks?.length,
    poolLength,
    invalidDistances
  };
}

validatePlan();
```

---

## Testing Checklist

Before marking feature as complete, verify:

- [ ] All 5 timeline options work (4, 6, 8, 10, 12 weeks)
- [ ] Both pool lengths work (25m, 50m)
- [ ] Both goal types work (distance, pace)
- [ ] All experience levels work (beginner, intermediate, advanced)
- [ ] All frequency options work (1-6x/week)
- [ ] All session lengths work (30, 45, 60, 90 min)
- [ ] Lap counts display correctly
- [ ] Plan persists after refresh
- [ ] New plan flow works
- [ ] No console errors
- [ ] AI generation fallback works
- [ ] Recovery weeks placed correctly based on timeline
