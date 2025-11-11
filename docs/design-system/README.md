# Design System Documentation

This directory contains all documentation related to the design system refactor and component primitives.

## Quick Start

**New to the design system?** Start here:
1. 📖 **[Primitives Guide](../../src/components/primitives/README.md)** - Complete reference for using primitives
2. 🎨 **[Component Showcase](http://localhost:3000/components)** - Live examples
3. ✅ **[Maintenance Guide](./DESIGN_SYSTEM_MAINTENANCE.md)** - How to keep it clean

## Documents

### For Developers

- **[Primitives README](../../src/components/primitives/README.md)**
  - Complete guide to all 6 primitives (CardHeader, StatGrid, ProgressBar, etc.)
  - Usage examples and common patterns
  - When to use and when NOT to use primitives

- **[Maintenance Guide](./DESIGN_SYSTEM_MAINTENANCE.md)**
  - Pre-flight checklist for new components
  - Code review guidelines
  - Enforcement strategies
  - FAQ and troubleshooting

### For Reference

- **[Design System Refactor](./DESIGN_SYSTEM_REFACTOR.md)**
  - Complete history of all 4 phases
  - What was done and why
  - How to continue refactoring
  - Success metrics and lessons learned

- **[Remaining Opportunities](./REMAINING_REFACTOR_OPPORTUNITIES.md)**
  - What was completed across all phases
  - What was deferred (SwimShareCard)
  - Components with justified custom patterns

- **[Component Audit](./COMPONENT_AUDIT.md)**
  - Initial inventory of all components
  - Pattern analysis
  - Starting point for the refactor

## Quick Reference

### Using Primitives

```jsx
import { CardHeader, StatGrid, ProgressBar } from './primitives';

// Card with header and stats
<Card>
  <CardHeader
    icon={Activity}
    title="Your Stats"
    subtitle="Last 30 days"
    iconColor="text-blue-400"
    iconBgColor="bg-blue-500/20"
  />
  <StatGrid stats={statsArray} columns={3} />
</Card>
```

### Available Primitives

1. **CardHeader** - Card/section headers with icon, title, subtitle
2. **MetricDisplay** - Individual metric displays
3. **StatGrid** - Grid layouts for metrics
4. **ProgressBar** - Linear progress indicators
5. **CircularProgressBar** - Circular progress indicators
6. **ComparisonBadge** - Performance comparison indicators

## Results

- ✅ **15 components refactored** across 4 phases
- ✅ **304 lines eliminated**
- ✅ **Code duplication: 40% → 6%**
- ✅ **6 reusable primitives created**

## Tools

- **[Design System Checker](../../scripts/check-design-system.sh)** - Optional enforcement script
- **[Scripts README](../../scripts/README.md)** - How to use the checker

---

**Need help?** See the [Maintenance Guide](./DESIGN_SYSTEM_MAINTENANCE.md) or the [Primitives Guide](../../src/components/primitives/README.md).
