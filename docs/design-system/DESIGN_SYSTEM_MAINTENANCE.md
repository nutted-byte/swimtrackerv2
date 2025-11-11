# Design System Maintenance Guide

**Purpose:** Keep the codebase clean and consistent by using design system primitives.

**Last Updated:** 2025-11-11

---

## 🎯 TL;DR - Quick Rules

1. **Before creating a component:** Read [src/components/primitives/README.md](./src/components/primitives/README.md)
2. **Use primitives for:**
   - Card headers → `CardHeader`
   - Metrics/stats → `StatGrid` + `MetricDisplay`
   - Progress → `ProgressBar` or `CircularProgressBar`
   - Comparisons → `ComparisonBadge`
3. **See examples:** http://localhost:3000/components
4. **If you copy-paste UI code → you should use a primitive!**

---

## 📚 Essential Documentation

### For Developers
- **[Primitives README](./src/components/primitives/README.md)** - Complete guide with examples
- **[Design System Refactor](./DESIGN_SYSTEM_REFACTOR.md)** - History and rationale
- **[Component Showcase](http://localhost:3000/components)** - Live examples

### For Code Reviewers
- See "Code Review Checklist" section below
- Check for red flag patterns (manual headers, progress bars, grids)

---

## 🔍 Pre-Flight Checklist

Use this checklist when creating ANY new component:

### Before You Start:
- [ ] Read [src/components/primitives/README.md](./src/components/primitives/README.md)
- [ ] Check if similar component already exists
- [ ] Review ComponentShowcase for applicable primitives
- [ ] Understand when NOT to use primitives (see below)

### During Development:
- [ ] Use `CardHeader` for any card/section header with icon
- [ ] Use `StatGrid`/`MetricDisplay` for displaying metrics
- [ ] Use `ProgressBar`/`CircularProgressBar` for progress indicators
- [ ] Use `ComparisonBadge` for performance comparisons
- [ ] Import from `'./primitives'` or `'../primitives'`

### After Development:
- [ ] Review your code for duplicated patterns
- [ ] Test the component visually
- [ ] Run `./scripts/check-design-system.sh` (optional but helpful)
- [ ] Ask: "Would another dev copy-paste this markup?" → If YES, make it a primitive!

---

## ✅ Code Review Checklist

When reviewing PRs, look for these patterns:

### ❌ Red Flags (Request Changes):

**Manual Header Pattern:**
```jsx
// ❌ WRONG - Should use CardHeader
<div className="flex items-center gap-3 mb-6">
  <div className="p-3 bg-blue-500/20 rounded-lg">
    <Icon className="w-6 h-6 text-blue-400" />
  </div>
  <div>
    <h2 className="font-display text-2xl font-bold">Title</h2>
    <p className="text-sm text-content-tertiary">Subtitle</p>
  </div>
</div>
```

**Manual Progress Bar:**
```jsx
// ❌ WRONG - Should use ProgressBar
<div className="h-2 bg-dark-border rounded-full overflow-hidden">
  <div
    className="h-full bg-primary-500 transition-all"
    style={{ width: `${percentage}%` }}
  />
</div>
```

**Manual Stat Grid:**
```jsx
// ❌ WRONG - Should use StatGrid
<div className="grid grid-cols-3 gap-4">
  {stats.map(stat => (
    <div className="p-4 bg-gradient-to-br from-blue-500/20 to-blue-500/5">
      {/* Repeated metric markup... */}
    </div>
  ))}
</div>
```

### ✅ Good Patterns (Approve):

```jsx
import { CardHeader, StatGrid, ProgressBar } from './primitives';

// ✅ CORRECT
<CardHeader
  icon={Icon}
  title="Title"
  subtitle="Subtitle"
  iconColor="text-blue-400"
  iconBgColor="bg-blue-500/20"
/>

<ProgressBar value={75} color="primary" label="Progress" />

<StatGrid stats={statsArray} columns={3} />
```

---

## 🚫 When NOT to Use Primitives

Some patterns should remain custom:

1. **Complex Business Logic**
   - Example: `WeeklySummaryCard` has custom trend calculations
   - Reason: Logic is domain-specific, not a UI pattern

2. **Unique Visual Design**
   - Example: `DeepInsightCard` has custom circular icons
   - Reason: Intentionally different design system

3. **Specialized Interactions**
   - Example: `SwimInterrogator` Q&A interface
   - Reason: Unique interaction pattern

4. **Third-Party Integration**
   - Example: Recharts chart components
   - Reason: Already uses external library

**Rule of Thumb:** If it's **presentation** duplication → use primitives. If it's **business logic** → custom is fine.

---

## 🛠️ Enforcement Tools

### Option 1: Automated Check (Recommended for Teams)

Run the design system checker:
```bash
# Check all files
./scripts/check-design-system.sh

# Run before commit (optional)
# See scripts/README.md for setup instructions
```

**Note:** This tool may have false positives. Use your judgment!

### Option 2: Manual Review (Recommended for Solo)

Add to your PR template or mental checklist:
- [ ] No manual header markup (uses CardHeader)
- [ ] No manual progress bars (uses ProgressBar/CircularProgressBar)
- [ ] No manual stat grids (uses StatGrid)
- [ ] No manual comparison badges (uses ComparisonBadge)

### Option 3: Periodic Audits

Run these searches monthly to find violations:
```bash
# Find manual headers
rg "flex items-center gap-[0-9] mb-[0-9]" src/components --type jsx

# Find manual progress bars
rg "bg-dark-border rounded-full h-" src/components --type jsx

# Find manual stat grids
rg "grid grid-cols-[234].*gap" src/components --type jsx
```

---

## 🆕 Creating New Primitives

If you find a pattern repeated 3+ times, create a primitive:

### Process:

1. **Identify the pattern**
   ```bash
   # Count occurrences
   rg "your-pattern" src/components --type jsx | wc -l
   ```

2. **Design the API**
   - What props does it need?
   - What variants (colors, sizes)?
   - Follow existing primitive patterns

3. **Create the primitive**
   ```bash
   # Create file
   touch src/components/primitives/YourPrimitive.jsx
   ```
   - Implement component
   - Support color variants: blue, primary, orange, red, purple, green, yellow
   - Support size variants where applicable: sm, md, lg
   - Add className prop for customization

4. **Export it**
   ```jsx
   // In src/components/primitives/index.js
   export { YourPrimitive } from './YourPrimitive';
   ```

5. **Document it**
   - Add to ComponentShowcase
   - Update src/components/primitives/README.md
   - Add example usage

6. **Refactor existing usage**
   - Find all occurrences of the pattern
   - Replace with primitive
   - Test thoroughly

---

## 📊 Success Metrics

Track these to ensure the design system is working:

### Code Duplication
```bash
# Count manual patterns vs primitive usage
echo "Manual headers: $(rg 'flex items-center gap-' src/components --type jsx | grep -v primitives | wc -l)"
echo "CardHeader imports: $(rg 'import.*CardHeader' src/components --type jsx | wc -l)"
```

**Target:** < 10% duplication (currently ~6% ✅)

### Primitive Adoption
```bash
# Percentage of components using primitives
TOTAL=$(find src/components -name "*.jsx" -type f | wc -l)
USING=$(rg "import.*from.*primitives" src/components --type jsx -l | wc -l)
echo "Adoption: $USING / $TOTAL components"
```

**Target:** > 80% adoption

### New Component Quality
**Target:** 100% of new components use primitives (if applicable)

---

## ❓ FAQ

### Q: What if CardHeader doesn't have the feature I need?
**A:** Three options:
1. Add the feature to CardHeader (if generally useful)
2. Use the `className` prop to customize
3. Write custom markup (if truly unique)

### Q: Can I customize primitive styles?
**A:** Yes! All primitives accept a `className` prop for custom styling.

### Q: Should I refactor old code to use primitives?
**A:** Only if:
- You're already modifying that component
- It's a high-traffic component
- Code duplication is causing bugs

Don't refactor for refactoring's sake.

### Q: What if I'm in a hurry?
**A:** Use primitives anyway - they're faster than writing custom markup! Just import and use.

### Q: The checker script flagged my code but I think it's fine?
**A:** Use your judgment! The script may have false positives. Commit with `--no-verify` if needed.

---

## 🎓 Learning Resources

### Examples to Study:
1. **SessionCard.jsx** - Full primitive usage (StatGrid, ComparisonBadge)
2. **StreakCard.jsx** - Simple CardHeader usage
3. **ProgressCard.jsx** - CardHeader + CircularProgressBar
4. **TrainingPlanCard.jsx** - CardHeader + ProgressBar

### Common Patterns:
See [src/components/primitives/README.md](./src/components/primitives/README.md) for full pattern library.

---

## 🚀 Quick Start for New Developers

1. **Day 1:** Read [src/components/primitives/README.md](./src/components/primitives/README.md)
2. **Day 2:** Browse http://localhost:3000/components
3. **Day 3:** Study SessionCard.jsx to see primitives in action
4. **Day 4+:** Use primitives in your components!

---

## 📝 Changelog

### 2025-11-11 - Phase 4 Complete
- All refactoring complete across 4 phases
- 15 components refactored
- 304 lines eliminated
- Code duplication: 40% → 6%
- Comprehensive documentation created

---

**Remember:** The design system exists to make your life easier. Use it!

For questions, see the documentation links at the top of this file.
