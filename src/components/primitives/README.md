# Design System Primitives

**Purpose:** Composable building blocks for consistent UI components

These primitives eliminate code duplication and ensure design consistency across the entire app. **Always use these primitives when building new components.**

---

## 🚨 Quick Rule: Before Writing ANY New Component

**ASK YOURSELF:**
1. Does this need a card header with icon? → Use `CardHeader`
2. Does this display metrics/stats? → Use `StatGrid` + `MetricDisplay`
3. Does this show progress? → Use `ProgressBar` or `CircularProgressBar`
4. Does this compare performance? → Use `ComparisonBadge`

**If you're writing this markup manually, you're doing it wrong!**

---

## Available Primitives

### 1. CardHeader
**Use for:** Card/section headers with icon, title, subtitle

```jsx
import { CardHeader } from './primitives';

// ✅ CORRECT
<Card>
  <CardHeader
    icon={Activity}
    title="Weekly Stats"
    subtitle="Last 7 days"
    iconColor="text-blue-400"
    iconBgColor="bg-blue-500/20"
  />
</Card>

// ❌ WRONG - Don't write this manually!
<div className="flex items-center gap-3 mb-6">
  <div className="p-3 bg-blue-500/20 rounded-lg">
    <Activity className="w-6 h-6 text-blue-400" />
  </div>
  <div>
    <h2 className="font-display text-2xl font-bold">Weekly Stats</h2>
    <p className="text-sm text-content-tertiary">Last 7 days</p>
  </div>
</div>
```

**Props:**
- `icon` - Lucide icon component
- `title` - Header text
- `subtitle` - Optional description
- `iconColor` - Icon color class (e.g., "text-blue-400")
- `iconBgColor` - Icon background (e.g., "bg-blue-500/20")
- `iconSize` - Icon size (default: "w-6 h-6")
- `actionText` + `actionTo` - Optional action link
- `badge` - Optional badge component
- `className` - Additional classes

---

### 2. StatGrid + MetricDisplay
**Use for:** Displaying multiple metrics in a grid

```jsx
import { StatGrid } from './primitives';

// ✅ CORRECT
<StatGrid
  stats={[
    { icon: Activity, label: 'Distance', value: '5.2', unit: 'km', variant: 'blue' },
    { icon: Clock, label: 'Duration', value: '45:00', unit: 'min', variant: 'primary' },
    { icon: Zap, label: 'SWOLF', value: '35', unit: 'score', variant: 'purple' }
  ]}
  columns={3}
/>

// ❌ WRONG - Don't duplicate grid markup!
<div className="grid grid-cols-3 gap-4">
  {/* Manual metric cards... */}
</div>
```

**StatGrid Props:**
- `stats` - Array of stat objects
- `columns` - Number of columns (1-4)
- `animate` - Enable stagger animation (default: true)

**MetricDisplay Props (via stats array):**
- `icon` - Lucide icon
- `label` - Metric name
- `value` - Main value
- `unit` - Unit text
- `variant` - Color: 'blue', 'primary', 'orange', 'red', 'purple', 'green', 'yellow'
- `badge` - Optional ComparisonBadge

---

### 3. ProgressBar
**Use for:** Linear progress indicators

```jsx
import { ProgressBar } from './primitives';

// ✅ CORRECT
<ProgressBar
  value={75}
  label="Weekly Goal"
  valueDisplay="15/20 km"
  color="primary"
  size="md"
/>

// ❌ WRONG - Don't duplicate progress markup!
<div className="mb-2">
  <span className="text-sm">Weekly Goal</span>
  <span className="float-right">15/20 km</span>
</div>
<div className="h-2 bg-dark-border rounded-full">
  <div className="h-full bg-primary-500" style={{ width: '75%' }} />
</div>
```

**Props:**
- `value` - Percentage (0-100)
- `label` - Optional label
- `valueDisplay` - Optional value text (e.g., "3/4")
- `showPercentage` - Show "75%" text
- `color` - Color variant
- `size` - 'sm', 'md', 'lg'
- `animationDelay` - Delay in seconds

---

### 4. CircularProgressBar
**Use for:** Circular/radial progress indicators

```jsx
import { CircularProgressBar } from './primitives';

// ✅ CORRECT
<CircularProgressBar
  value={65}
  size="md"
  color="primary"
  label="Monthly Goal"
/>

// With custom content
<CircularProgressBar
  value={65}
  size="lg"
  color="blue"
>
  <div className="text-center">
    <div className="text-3xl font-bold">13</div>
    <div className="text-xs">out of 20</div>
  </div>
</CircularProgressBar>
```

**Props:**
- `value` - Percentage (0-100)
- `size` - 'sm' (80px), 'md' (120px), 'lg' (160px)
- `color` - Color variant
- `label` - Optional label above circle
- `children` - Custom content inside circle (overrides percentage)
- `animationDelay` - Delay in seconds

---

### 5. ComparisonBadge
**Use for:** Performance comparison indicators

```jsx
import { ComparisonBadge } from './primitives';

// ✅ CORRECT
<ComparisonBadge comparison="fast" />
<ComparisonBadge comparison="better" value="+15%" />
<ComparisonBadge comparison="improved" size="sm" />

// ❌ WRONG - Don't duplicate badge markup!
<span className="inline-flex items-center gap-1 px-2 py-1 bg-green-500/20 rounded-full">
  <TrendingUp className="w-3 h-3" />
  <span className="text-xs">Faster</span>
</span>
```

**Props:**
- `comparison` - Type: 'fast', 'better', 'improved', 'slow', 'worse', 'declined', 'average', 'stable', 'same'
- `value` - Optional value (e.g., "+15%")
- `size` - 'xs', 'sm', 'md'
- `tooltip` - Optional tooltip text

---

## Color Variants

All primitives support consistent color variants:

- **blue** - Default blue accent
- **primary** - Teal/primary brand color
- **orange** - Warning/attention
- **red** - Danger/negative
- **purple** - Accent/special
- **green** - Success/positive
- **yellow** - Highlight/achievement

---

## Component Development Checklist

When creating a new component, follow this checklist:

### Before You Start
- [ ] Check if similar component already exists
- [ ] Review this README for applicable primitives
- [ ] Look at ComponentShowcase (http://localhost:3000/components) for examples

### During Development
- [ ] Use `CardHeader` instead of manual header markup
- [ ] Use `StatGrid`/`MetricDisplay` for metrics
- [ ] Use `ProgressBar`/`CircularProgressBar` for progress
- [ ] Use `ComparisonBadge` for performance indicators
- [ ] Import from `./primitives` (or `../primitives` depending on location)

### After Development
- [ ] Review code - any duplicated patterns that should be primitives?
- [ ] Test component at http://localhost:3000/components if public-facing
- [ ] Update ComponentShowcase if component is significant

---

## Common Patterns

### Pattern: Card with Header and Stats
```jsx
import { Card } from './Card';
import { CardHeader, StatGrid } from './primitives';
import { Activity, Clock, Zap } from 'lucide-react';

export const MyStatsCard = ({ stats }) => (
  <Card>
    <CardHeader
      icon={Activity}
      title="Your Stats"
      subtitle="Last 30 days"
      iconColor="text-blue-400"
      iconBgColor="bg-blue-500/20"
    />
    <StatGrid
      stats={[
        { icon: Activity, label: 'Distance', value: stats.distance, unit: 'km', variant: 'blue' },
        { icon: Clock, label: 'Time', value: stats.time, unit: 'hrs', variant: 'primary' },
        { icon: Zap, label: 'Intensity', value: stats.intensity, unit: 'score', variant: 'purple' }
      ]}
      columns={3}
    />
  </Card>
);
```

### Pattern: Card with Header and Progress
```jsx
import { Card } from './Card';
import { CardHeader, ProgressBar } from './primitives';
import { Target } from 'lucide-react';

export const GoalCard = ({ progress, current, target }) => (
  <Card>
    <CardHeader
      icon={Target}
      title="Weekly Goal"
      subtitle="Keep it up!"
      iconColor="text-primary-400"
      iconBgColor="bg-primary-500/20"
    />
    <ProgressBar
      value={progress}
      label="Progress"
      valueDisplay={`${current}/${target} km`}
      color="primary"
      size="lg"
    />
  </Card>
);
```

### Pattern: Metric with Comparison
```jsx
import { MetricDisplay, ComparisonBadge } from './primitives';
import { Activity } from 'lucide-react';

export const PaceMetric = ({ pace, comparison }) => (
  <MetricDisplay
    icon={Activity}
    label="Pace"
    value={pace}
    unit="min/100m"
    variant="blue"
    badge={<ComparisonBadge comparison={comparison} />}
  />
);
```

---

## When NOT to Use Primitives

Some components have justified custom patterns:

1. **Complex business logic** - WeeklySummaryCard has complex trend calculations that are domain-specific
2. **Unique visual design** - DeepInsightCard has custom circular icon design that's intentionally different
3. **Specialized interactions** - SwimInterrogator has unique Q&A interface patterns
4. **Third-party integration** - Chart components using Recharts library

**Rule of thumb:** If it's **presentation** duplication, use primitives. If it's **business logic**, custom is fine.

---

## Migration Guide

If you find existing code without primitives:

### Before (Manual):
```jsx
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

### After (Primitive):
```jsx
import { CardHeader } from './primitives';

<CardHeader
  icon={Icon}
  title="Title"
  subtitle="Subtitle"
  iconColor="text-blue-400"
  iconBgColor="bg-blue-500/20"
/>
```

---

## Import Shortcuts

```jsx
// Import all primitives at once
import {
  CardHeader,
  MetricDisplay,
  StatGrid,
  ProgressBar,
  CircularProgressBar,
  ComparisonBadge
} from './primitives';

// Or import individually
import { CardHeader } from './primitives/CardHeader';
```

---

## Need Help?

1. **See live examples:** http://localhost:3000/components (Primitives tab)
2. **Read the docs:** `DESIGN_SYSTEM_REFACTOR.md` in project root
3. **Check refactored components:**
   - `SessionCard.jsx` - Full primitive usage example
   - `StreakCard.jsx` - CardHeader example
   - `ProgressCard.jsx` - CircularProgressBar example
   - `PaceTrendCard.jsx` - Simple CardHeader example

---

## Benefits

✅ **Consistency** - Same visual patterns everywhere
✅ **Maintainability** - Update once, change everywhere
✅ **Speed** - Build new components faster
✅ **Quality** - Less code = fewer bugs
✅ **DRY** - Don't Repeat Yourself

---

**Remember: If you're copy-pasting UI code, you should probably be using a primitive!**
