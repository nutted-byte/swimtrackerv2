# Design System Rules

## MANDATORY: Import and Use Tokens

```jsx
import { tokens } from '../design/tokens';
```

**NEVER hardcode: `mb-8`, `p-6`, `gap-3`, `text-xl`, `font-bold`, `rounded-lg`, `w-6 h-6`**

## Token Cheatsheet (Copy/Paste Ready)

### Spacing & Layout
```jsx
${tokens.spacing.xs}        // 8px
${tokens.spacing.sm}        // 12px
${tokens.spacing.md}        // 16px
${tokens.spacing.lg}        // 24px
${tokens.spacing.xl}        // 32px

${tokens.gap.tight}         // gap-2 (8px)
${tokens.gap.compact}       // gap-3 (12px)
${tokens.gap.default}       // gap-4 (16px)
${tokens.gap.loose}         // gap-6 (24px)

${tokens.margin.element}    // mb-2 (between related elements)
${tokens.margin.group}      // mb-4 (between groups)
${tokens.margin.section}    // mb-8 (between sections)

${tokens.padding.tight}     // p-3
${tokens.padding.default}   // p-4
${tokens.padding.section}   // p-6
```

### Typography
```jsx
${tokens.typography.sizes.xs}      // text-xs (12px) - labels, captions
${tokens.typography.sizes.sm}      // text-sm (14px) - secondary text
${tokens.typography.sizes.base}    // text-base (16px) - body
${tokens.typography.sizes.lg}      // text-lg (18px) - large body
${tokens.typography.sizes.xl}      // text-xl (20px) - small headings
${tokens.typography.sizes['2xl']}  // text-2xl (24px) - card metrics
${tokens.typography.sizes['3xl']}  // text-3xl (30px) - stat values
${tokens.typography.sizes['4xl']}  // text-4xl (36px) - page heroes

${tokens.typography.weights.normal}   // font-normal
${tokens.typography.weights.medium}   // font-medium
${tokens.typography.weights.semibold} // font-semibold
${tokens.typography.weights.bold}     // font-bold

${tokens.typography.families.sans}    // font-sans (Inter)
${tokens.typography.families.display} // font-display (Space Grotesk)

${tokens.typography.semantic.success} // text-green-400 (improvements)
${tokens.typography.semantic.danger}  // text-red-400 (declines)
${tokens.typography.semantic.warning} // text-yellow-400 (caution)
${tokens.typography.semantic.info}    // text-purple-400 (AI features)
```

### Icons & Visual
```jsx
${tokens.icons.xs}    // w-3 h-3 (12px)
${tokens.icons.sm}    // w-4 h-4 (16px)
${tokens.icons.md}    // w-5 h-5 (20px)
${tokens.icons.lg}    // w-6 h-6 (24px)
${tokens.icons.xl}    // w-8 h-8 (32px)
${tokens.icons['2xl']} // w-10 h-10 (40px)

${tokens.radius.sm}   // rounded-lg
${tokens.radius.md}   // rounded-xl
${tokens.radius.lg}   // rounded-2xl
${tokens.radius.full} // rounded-full

${tokens.animation.fast}    // 100ms
${tokens.animation.default} // 200ms
${tokens.animation.slow}    // 300ms
```

## Color Patterns (Use These Exact Values)

```jsx
// Brand colors
text-primary-400           // Teal (dark mode default)
text-accent-blue          // Blue accent
bg-primary-500/10         // Subtle backgrounds

// Gradients (established patterns)
bg-gradient-to-r from-primary-400 to-accent-blue    // Standard
bg-gradient-to-br from-primary-500/10 to-accent-blue/10  // Subtle
bg-gradient-to-r from-yellow-500/30 to-amber-500/30      // Achievement
```

## Reusable Primitives (Use Before Creating New)

```jsx
import { Card } from '../components/Card';
import { Button } from '../components/Button';
import { StatGrid, MetricDisplay, ComparisonBadge, Separator } from '../components/primitives';
```

## Enforcement

❌ Hardcoded values = Technical debt + wasted refactoring work
✅ Using tokens = Fast development + consistency + maintainability
