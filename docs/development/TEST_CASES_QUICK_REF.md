# Quick Test Reference

Fast reference for common test scenarios. Use this for quick validation.

## Quick Smoke Tests (5 minutes)

### ✅ Test 1: Basic 4-Week Plan
```
Goal: Distance, 400m → 800m
Timeline: 4 weeks
Experience: Beginner
Frequency: 3x/week
Session: 45 min
Pool: 25m

Expected: 4 weeks, distances end in 00/25/50/75
```

### ✅ Test 2: Basic 8-Week Plan
```
Goal: Distance, 800m → 1500m
Timeline: 8 weeks
Experience: Intermediate
Frequency: 4x/week
Session: 60 min
Pool: 50m

Expected: 8 weeks, distances end in 00/50
```

### ✅ Test 3: Pace Goal
```
Goal: Pace, 3.0 → 2.5 min/100m
Timeline: 6 weeks
Experience: Advanced
Frequency: 5x/week
Session: 60 min
Pool: 25m

Expected: 6 weeks, interval-focused workouts
```

---

## Console Checks

### Check Timeline
```javascript
// After plan creation, should see:
Starting plan generation with: { ..., timeline: 4 }
Generated plan: { weeks: [Array(4)] }
```

### Check Pool Distances
```javascript
// Quick validation
const plan = /* your plan object */;
const poolLength = plan.availability.pool_length;

plan.weeks.forEach(w => {
  w.sessions.forEach(s => {
    const isValid = s.totalDistance % poolLength === 0;
    console.log(`W${w.weekNumber} ${s.title}: ${s.totalDistance}m - ${isValid ? '✅' : '❌'}`);
  });
});
```

---

## Known Issues to Watch For

### ❌ Timeline Ignored (FIXED)
- **Symptom**: Select 4 weeks, get 8 weeks
- **Check**: Console should show correct timeline
- **Fix Location**: `TrainingPlanContext.jsx` and `planGenerator.js`

### ❌ Pool Length Ignored (FIXED)
- **Symptom**: Distances like 256m, 192m, 384m
- **Check**: All distances should be pool multiples
- **Fix Location**: `planGenerator.js` roundToPoolLength function

### ❌ Recovery Weeks Wrong
- **Symptom**: Recovery weeks at wrong positions
- **Expected**:
  - 4-week: Week 2
  - 6-week: Week 3
  - 8-week: Weeks 4, 7
  - 10-week: Weeks 5, 9
  - 12-week: Weeks 6, 11

---

## Visual Checks

### UI Elements to Verify
- [ ] Progress bar shows "Week X of {timeline}"
- [ ] Overview says "{timeline}-week plan"
- [ ] Week list shows exactly {timeline} weeks
- [ ] Lap counts display: "1.2km (48 laps)" for 25m or "(24 laps)" for 50m
- [ ] Pool length shown in wizard: "25m pool" or "50m pool"

### Workout Card Format
```
Endurance Builder
Monday • 1.0km (40 laps) • ~35 min

[Expanded view]
Warm-up
• 200m easy swim
• 4x50m kick

Main Set
• 4x150m @ steady pace
• Rest 30s between

Cool-down
• 200m easy swim

Total: 1.0km (40 laps) • ~35 minutes
```

---

## Parameter Combinations to Test

### Critical Combinations
1. **Short + Frequent**: 4 weeks, 5x/week, 30 min
2. **Long + Sparse**: 12 weeks, 2x/week, 90 min
3. **Mid + Balanced**: 8 weeks, 3x/week, 60 min
4. **50m Pool + Long**: 10 weeks, 4x/week, 90 min, 50m pool

### Edge Cases
1. **Minimum**: 4 weeks, 1x/week, 30 min, 25m pool
2. **Maximum**: 12 weeks, 6x/week, 90 min, 50m pool
3. **Beginner + Aggressive**: Beginner, 6x/week, 90 min
4. **Advanced + Minimal**: Advanced, 1x/week, 30 min

---

## Quick Validation Script

Paste this in console for instant validation:

```javascript
// Quick Plan Validator
(function() {
  const plan = window.__TRAINING_PLAN__ || JSON.parse(localStorage.getItem('current_plan') || '{}');

  if (!plan.weeks) {
    console.error('❌ No plan found');
    return;
  }

  const timeline = plan.weeks.length;
  const poolLength = plan.availability?.pool_length || 25;

  console.log(`📋 Plan: ${timeline} weeks, ${poolLength}m pool`);

  let errors = [];

  // Check week count
  const expectedWeeks = plan.timeline || 8;
  if (timeline !== expectedWeeks) {
    errors.push(`Week count mismatch: expected ${expectedWeeks}, got ${timeline}`);
  }

  // Check all distances
  plan.weeks.forEach(week => {
    week.sessions.forEach(session => {
      if (session.totalDistance % poolLength !== 0) {
        errors.push(`W${week.weekNumber} ${session.title}: ${session.totalDistance}m not aligned`);
      }
    });
  });

  // Check recovery weeks
  const recoveryWeeks = [];
  plan.weeks.forEach(w => {
    if (w.focus?.toLowerCase().includes('recovery')) {
      recoveryWeeks.push(w.weekNumber);
    }
  });

  console.log('Recovery weeks:', recoveryWeeks);

  if (errors.length === 0) {
    console.log('✅ All checks passed!');
  } else {
    console.error('❌ Errors found:');
    errors.forEach(e => console.error('  -', e));
  }

  return {
    timeline,
    poolLength,
    errors,
    recoveryWeeks
  };
})();
```

---

## Common Test Data Sets

### Beginner Distance Builder
```javascript
{
  goalType: 'distance',
  current: 400,
  target: 1000,
  timeline: 8,
  userLevel: 'beginner',
  frequency: 3,
  sessionLength: 45,
  poolLength: 25
}
```

### Intermediate Pace Improver
```javascript
{
  goalType: 'pace',
  current: 2.8,
  target: 2.3,
  timeline: 6,
  userLevel: 'intermediate',
  frequency: 4,
  sessionLength: 60,
  poolLength: 50
}
```

### Advanced Marathon Prep
```javascript
{
  goalType: 'distance',
  current: 1500,
  target: 3000,
  timeline: 12,
  userLevel: 'advanced',
  frequency: 5,
  sessionLength: 90,
  poolLength: 50
}
```

---

## Regression Test Checklist

After any changes to plan generation code, verify:

- [ ] 4-week plan creates 4 weeks (not 8)
- [ ] 25m pool distances end in 00/25/50/75
- [ ] 50m pool distances end in 00/50
- [ ] Lap counts match pool length
- [ ] Recovery weeks at correct positions
- [ ] AI prompt includes timeline
- [ ] Algorithmic fallback respects timeline
- [ ] Console logs show correct parameters
- [ ] Plan persists after refresh
- [ ] New plan replaces old plan

---

## Performance Checks

### AI Generation
- ⏱️ Should complete in 5-15 seconds
- 🔄 Falls back to algorithmic if timeout
- 📝 Shows loading screen with progress

### Plan Display
- 🖼️ Week expansion is instant
- 📱 Mobile UI responsive
- 🎨 Animations smooth (60fps)

---

## Accessibility Checks

- [ ] Keyboard navigation works
- [ ] Focus indicators visible
- [ ] Screen reader announces plan creation
- [ ] Color contrast meets WCAG AA
- [ ] Touch targets >= 44px

---

## API Call Validation

Check network tab for:
1. **POST to /functions/v1/ask-ai** - Plan generation
2. **POST to /rest/v1/training_plans** - Save plan
3. **GET to /rest/v1/training_plans** - Load plan

Expected response format:
```json
{
  "id": "plan_1234567890",
  "weeks": [...],
  "availability": {
    "pool_length": 25,
    "days_per_week": 3,
    "minutes_per_session": 45
  },
  "progress": {
    "current_week": 1,
    "completed_workouts": 0,
    "total_workouts": 24
  }
}
```
