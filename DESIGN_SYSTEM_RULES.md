# Design System Rules

**CRITICAL: These rules must be followed for ALL new components and modifications.**

## Golden Rule
**NEVER hardcode styling values. ALWAYS use design tokens from `src/design/tokens.js`.**

## Before Writing Any Component
1. ✅ Read `src/design/tokens.js` to understand available tokens
2. ✅ Check existing components in `src/components/` for patterns
3. ✅ Reference the component showcase at `http://localhost:3000/components`
4. ✅ Use primitives from `src/components/primitives/` when available

## Token Usage (MANDATORY)

### Spacing
```jsx
// ❌ WRONG
className="mb-8 p-6 gap-3"

// ✅ CORRECT
className={`${tokens.margin.section} ${tokens.padding.section} ${tokens.gap.default}`}
```

**Available tokens:**
- `tokens.spacing.*` - xs, sm, md, lg, xl, 2xl, 3xl
- `tokens.gap.*` - tight, compact, default, loose
- `tokens.margin.*` - element, group, section
- `tokens.padding.*` - tight, default, section

### Typography
```jsx
// ❌ WRONG
className="text-xl font-bold font-display"

// ✅ CORRECT
className={`${tokens.typography.sizes.xl} ${tokens.typography.weights.bold} ${tokens.typography.families.display}`}
```

**Available tokens:**
- `tokens.typography.sizes.*` - xs, sm, base, lg, xl, 2xl, 3xl, 4xl, 5xl, 6xl
- `tokens.typography.weights.*` - normal, medium, semibold, bold
- `tokens.typography.families.*` - sans (Inter), display (Space Grotesk)
- `tokens.typography.semantic.*` - success, danger, warning, warningAlt, info

### Icons
```jsx
// ❌ WRONG
<Icon className="w-6 h-6" />

// ✅ CORRECT
<Icon className={tokens.icons.lg} />
```

**Available tokens:**
- `tokens.icons.*` - xs, sm, md, lg, xl, 2xl, 3xl

### Border Radius
```jsx
// ❌ WRONG
className="rounded-lg"

// ✅ CORRECT
className={tokens.radius.sm}
```

**Available tokens:**
- `tokens.radius.*` - sm, md, lg, full

### Animation
```jsx
// ❌ WRONG
className="transition-all duration-200"

// ✅ CORRECT
className={tokens.animation.default}
```

**Available tokens:**
- `tokens.animation.*` - fast, default, slow

## Color Usage

### Primary Colors (Teal/Blue Brand)
- `text-primary-400` - Default for dark mode (icons, accents, interactive)
- `text-primary-500` - Standard for light mode, main brand color
- `text-primary-600` - Darker shade for light mode hover states
- `bg-primary-500/10` - Subtle backgrounds with opacity

### Accent Colors
- `text-accent-blue` - Blue accent (used in gradients)
- `text-accent-coral` - Coral accent (warnings, secondary)

### Semantic Colors (Use tokens!)
```jsx
// ✅ CORRECT - Use semantic tokens
<span className={tokens.typography.semantic.success}>Improving</span>
<span className={tokens.typography.semantic.danger}>Declining</span>
<span className={tokens.typography.semantic.warning}>Caution</span>
<span className={tokens.typography.semantic.info}>AI Feature</span>
```

### Gradients (Established Patterns)
```jsx
// Standard brand gradient
bg-gradient-to-r from-primary-400 to-accent-blue

// Large feature gradient
bg-gradient-to-br from-primary-500/10 to-accent-blue/10

// Achievement/success
bg-gradient-to-r from-yellow-500/30 to-amber-500/30
```

## Component Patterns

### Cards
Use `<Card>` or `<CardVariant>` from `src/components/Card.jsx`
```jsx
import { Card } from '../components/Card';
<Card className={tokens.padding.section}>...</Card>
```

### Buttons
Use `<Button>` from `src/components/Button.jsx`
```jsx
import { Button } from '../components/Button';
<Button variant="primary" size="md">Click me</Button>
```

### Primitives
Check `src/components/primitives/` first:
- `StatGrid` - Grid of statistics
- `MetricDisplay` - Single metric display
- `ComparisonBadge` - Fast/slow/average badges
- `ProgressBar` - Progress indicators
- `Separator` - Horizontal dividers
- `IconContainer` - Icon wrapper with background

## Common Violations to Avoid

### ❌ Hardcoded spacing
```jsx
className="mb-8 mt-4 gap-3"
```

### ✅ Token-based spacing
```jsx
className={`${tokens.margin.section} ${tokens.margin.group} ${tokens.gap.default}`}
```

### ❌ Hardcoded typography
```jsx
className="text-2xl font-bold"
```

### ✅ Token-based typography
```jsx
className={`${tokens.typography.sizes['2xl']} ${tokens.typography.weights.bold}`}
```

### ❌ Hardcoded colors outside patterns
```jsx
className="text-purple-400 bg-purple-500/20"
```

### ✅ Use established brand colors
```jsx
className="text-primary-400 bg-primary-500/20"
// OR for AI/info features:
className={tokens.typography.semantic.info}
```

## Enforcement

**Every new component MUST:**
1. Import tokens: `import { tokens } from '../design/tokens'`
2. Use tokens for ALL spacing, typography, icons, radius
3. Follow established color patterns (primary/accent)
4. Use primitives when available
5. Be reviewed against this document before completion

## Reference Files
- Token definitions: `src/design/tokens.js`
- Component showcase: `src/pages/ComponentShowcase.jsx`
- Primitives: `src/components/primitives/`
- Example implementations: `src/components/SessionCard.jsx`, `src/components/LastSwimHero.jsx`

---

**Remember: We refactored 55+ files last week. Don't waste that effort. Use the design system.**
