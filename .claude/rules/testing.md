# Testing & Documentation Rules

## Available Test Documentation

When working on training plan features, refer to these test documents:

### 1. Full Test Suite: `docs/TESTING.md`
- Comprehensive test cases for all features
- Timeline tests (4, 6, 8, 10, 12 weeks)
- Pool length validation tests
- Goal type tests (distance, pace)
- Integration & edge case tests
- Bug regression tests
- Automated validation scripts

**Use when**: Doing comprehensive testing, validating fixes, or adding new features

### 2. Quick Reference: `docs/TEST_CASES_QUICK_REF.md`
- Fast 5-minute smoke tests
- Console validation snippets
- Common parameter combinations
- Visual UI checks
- Performance benchmarks

**Use when**: Quick validation, smoke testing, or checking specific scenarios

### 3. Bug Tracking: `docs/BUG_FIXES.md`
- Documented bugs with root cause analysis
- Code changes (before/after)
- Testing procedures for each fix
- Prevention measures

**Use when**: Investigating issues, understanding past bugs, or preventing regressions

## Testing Workflow

When making changes to training plan features:

1. **Before Changes**: Review relevant test cases in `docs/TESTING.md`
2. **During Development**: Use `docs/TEST_CASES_QUICK_REF.md` for quick checks
3. **After Changes**: Run regression tests, update `docs/BUG_FIXES.md` if fixing bugs
4. **Always**: Check console for parameter flow (timeline, poolLength, etc.)

## Key Parameters to Verify

When testing plan generation, always verify:
- `timeline` parameter flows through entire stack
- `poolLength` parameter used in distance calculations
- All distances are multiples of pool length
- Recovery weeks placed correctly based on timeline
- Console logs show correct parameters

## Quick Validation Command

Paste in browser console after plan creation:
```javascript
// Validate plan structure
const plan = window.__TRAINING_PLAN__;
console.log('Timeline:', plan.weeks?.length);
console.log('Pool:', plan.availability?.pool_length);
plan.weeks?.forEach(w => {
  w.sessions?.forEach(s => {
    const valid = s.totalDistance % plan.availability.pool_length === 0;
    console.log(`W${w.weekNumber}: ${s.totalDistance}m ${valid ? '✅' : '❌'}`);
  });
});
```

## Common Test Scenarios

### Quick Smoke Test
- Goal: Distance, 400m → 800m
- Timeline: 4 weeks
- Pool: 25m
- Expected: 4 weeks, all distances end in 00/25/50/75

### Regression Test
- Timeline bug: Select 4 weeks → verify exactly 4 weeks created
- Pool length bug: 25m pool → verify no distances like 256m, 192m

## When to Update Docs

- **New bug found**: Add to `docs/BUG_FIXES.md` with root cause
- **New test case**: Add to `docs/TESTING.md` under appropriate category
- **New quick test**: Add to `docs/TEST_CASES_QUICK_REF.md`
