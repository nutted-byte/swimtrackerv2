# Dashboard Redesign: Detailed Specification

## Current State Analysis

### What's Working
- **LastSwimHero** provides good visual hierarchy for most recent swim
- **TechniqueCard** surfaces personalized recommendations intelligently
- **Recent Sessions** shows historical context
- Strong use of motion/animation for engagement
- Good information architecture (hero → recommendation → history)

### What's Missing
- **No visual entry points** - everything is text-driven
- **No "at-a-glance" insights** - users must read to understand status
- **Hidden features** - Insights and Ask pages have low discovery
- **No progress visualization** - users don't see goals or trends immediately
- **No motivational elements** - missing streak, achievement, or momentum indicators
- **Static feel** - lacks dynamic, personalized visual content beyond text

---

## Proposed Dashboard Architecture

### New Information Hierarchy

```
┌─────────────────────────────────────────┐
│  HEADER (existing - keep as is)        │
│  - Dashboard title                      │
│  - View Sessions / Upload buttons      │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  1. LAST SWIM HERO (enhanced)           │
│  - Add efficiency badge                 │
│  - Add pace comparison indicator        │
│  - Visual rating enhancement            │
│  [Most prominent - fold 1]              │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  2. QUICK INSIGHTS GRID (NEW)           │
│  ┌─────────┬─────────┬─────────┬────────┐
│  │Progress │ Streak  │  Pace   │   AI   │
│  │  Ring   │Calendar │ Trend   │Assist  │
│  └─────────┴─────────┴─────────┴────────┘
│  [Scannable visual cards - fold 2]      │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  3. SWIM RANKING CARD (existing)        │
│  - Keep current implementation          │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  4. TECHNIQUE CARD (enhanced)           │
│  - Add category illustration            │
│  - Add diagram preview                  │
│  - Visual priority badge                │
└─────────────────────────────────────────┘

┌─────────────────────────────────────────┐
│  5. RECENT SESSIONS (existing)          │
│  - Add visual PR indicators             │
│  - Add pace trend micro-charts          │
└─────────────────────────────────────────┘
```

---

## Component 2: Quick Insights Grid (NEW)

This is the **key dashboard innovation** - a visual command center that surfaces insights and drives feature discovery.

### Layout

**Desktop (4 columns):**
```
┌──────────┬──────────┬──────────┬──────────┐
│ Progress │  Streak  │   Pace   │    AI    │
│   Card   │   Card   │  Trend   │ Assistant│
└──────────┴──────────┴──────────┴──────────┘
```

**Tablet (2x2 grid):**
```
┌──────────┬──────────┐
│ Progress │  Streak  │
├──────────┼──────────┤
│   Pace   │    AI    │
└──────────┴──────────┘
```

**Mobile (1 column, scrollable):**
```
┌──────────┐
│ Progress │
├──────────┤
│  Streak  │
├──────────┤
│   Pace   │
├──────────┤
│    AI    │
└──────────┘
```

---

### Card 1: Weekly Progress Card

**Purpose:** Show progress toward weekly/monthly distance goal with visual satisfaction

**Visual Design:**
```
┌─────────────────────────┐
│  📊 This Week           │
│                         │
│      ╱───────╲          │
│    ╱  72%      ╲        │
│   │   Complete │        │
│    ╲           ╱        │
│      ╲───────╱          │
│                         │
│  5.4 / 7.5 km          │
│  2.1 km to goal        │
│                         │
│  [View Full Progress →] │
└─────────────────────────┘
```

**Implementation Details:**

```jsx
// src/components/dashboard/ProgressCard.jsx

export const ProgressCard = ({ sessions }) => {
  const weeklyGoal = 7500; // 7.5km - could be user-configurable
  const weekStart = getStartOfWeek(new Date());

  const weeklyDistance = sessions
    .filter(s => new Date(s.date) >= weekStart)
    .reduce((sum, s) => sum + s.distance, 0);

  const percentage = Math.min((weeklyDistance / weeklyGoal) * 100, 100);
  const remaining = Math.max(weeklyGoal - weeklyDistance, 0);

  return (
    <Card className="bg-gradient-to-br from-primary-500/20 to-primary-500/5 border-primary-500/30">
      <div className="flex items-center gap-2 mb-3">
        <BarChart3 className="w-4 h-4 text-primary-400" />
        <span className="text-sm font-medium text-content-secondary">This Week</span>
      </div>

      <div className="flex justify-center mb-4">
        <CircularProgress
          percentage={percentage}
          size={120}
          strokeWidth={12}
          color="primary"
        />
      </div>

      <div className="text-center mb-3">
        <p className="text-2xl font-bold">
          {(weeklyDistance / 1000).toFixed(1)} / {(weeklyGoal / 1000).toFixed(1)} km
        </p>
        {remaining > 0 ? (
          <p className="text-sm text-content-tertiary">
            {(remaining / 1000).toFixed(1)} km to goal
          </p>
        ) : (
          <p className="text-sm text-green-400 flex items-center justify-center gap-1">
            <CheckCircle className="w-4 h-4" />
            Goal achieved!
          </p>
        )}
      </div>

      <Link
        to="/insights"
        className="text-xs text-primary-400 hover:text-primary-300 flex items-center justify-center gap-1 group"
      >
        View Full Progress
        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
      </Link>
    </Card>
  );
};
```

**CircularProgress Component:**
```jsx
// src/components/ui/CircularProgress.jsx

export const CircularProgress = ({ percentage, size, strokeWidth, color }) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  const offset = circumference - (percentage / 100) * circumference;

  const colorMap = {
    primary: '#00d4ff',
    purple: '#a78bfa',
    green: '#4ade80'
  };

  return (
    <svg width={size} height={size} className="transform -rotate-90">
      {/* Background circle */}
      <circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke="currentColor"
        strokeWidth={strokeWidth}
        className="text-dark-border"
      />
      {/* Progress circle */}
      <motion.circle
        cx={size / 2}
        cy={size / 2}
        r={radius}
        fill="none"
        stroke={colorMap[color]}
        strokeWidth={strokeWidth}
        strokeDasharray={circumference}
        strokeDashoffset={offset}
        strokeLinecap="round"
        initial={{ strokeDashoffset: circumference }}
        animate={{ strokeDashoffset: offset }}
        transition={{ duration: 1, ease: "easeOut" }}
      />
      {/* Center text */}
      <text
        x={size / 2}
        y={size / 2}
        textAnchor="middle"
        dy=".3em"
        className="text-3xl font-bold fill-current transform rotate-90"
        style={{ transformOrigin: 'center' }}
      >
        {Math.round(percentage)}%
      </text>
    </svg>
  );
};
```

**Interactions:**
- Progress ring animates from 0 to percentage on mount (1s ease-out)
- Entire card is clickable → navigates to Insights page
- Hover: subtle lift, border glow

**Data Source:**
- Calculate from sessions in last 7 days
- Goal could be: user-configured (future) or smart default (7.5km = 3 swims/week at 2.5km each)

---

### Card 2: Swim Streak Card

**Purpose:** Show consistency and motivate continued engagement

**Visual Design:**
```
┌─────────────────────────┐
│  🔥 Current Streak      │
│                         │
│        ┌─────┐          │
│        │  7  │          │
│        │ days│          │
│        └─────┘          │
│                         │
│  ▓▓▓▓▓▓░ Last 7 days   │
│  M T W T F S S         │
│                         │
│  [Keep it going! →]     │
└─────────────────────────┘
```

**Implementation Details:**

```jsx
// src/components/dashboard/StreakCard.jsx

export const StreakCard = ({ sessions }) => {
  const streak = calculateStreak(sessions);
  const last7Days = getLast7DaysActivity(sessions);

  return (
    <Card className="bg-gradient-to-br from-orange-500/20 to-red-500/5 border-orange-500/30">
      <div className="flex items-center gap-2 mb-3">
        <Flame className="w-4 h-4 text-orange-400" />
        <span className="text-sm font-medium text-content-secondary">Current Streak</span>
      </div>

      <div className="text-center mb-4">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ type: "spring", stiffness: 200, damping: 15 }}
          className="inline-block"
        >
          <div className="text-5xl font-bold text-orange-400 mb-1">
            {streak}
          </div>
          <div className="text-sm text-content-tertiary">
            {streak === 1 ? 'day' : 'days'}
          </div>
        </motion.div>
      </div>

      <div className="mb-3">
        <div className="flex items-center justify-between text-xs text-content-tertiary mb-1">
          <span>Last 7 days</span>
        </div>
        <CalendarHeatmap days={last7Days} />
      </div>

      <Link
        to="/sessions"
        className="text-xs text-orange-400 hover:text-orange-300 flex items-center justify-center gap-1 group"
      >
        Keep it going!
        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
      </Link>
    </Card>
  );
};
```

**CalendarHeatmap Component:**
```jsx
// src/components/ui/CalendarHeatmap.jsx

export const CalendarHeatmap = ({ days }) => {
  // days = array of 7 objects: { date, hasActivity, intensity }

  return (
    <div className="flex gap-1 justify-center">
      {days.map((day, index) => (
        <motion.div
          key={day.date}
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: index * 0.05 }}
          className="flex flex-col items-center gap-1"
        >
          <div
            className={`w-8 h-8 rounded-md transition-colors ${
              day.hasActivity
                ? day.intensity > 2 ? 'bg-orange-500' :
                  day.intensity > 1 ? 'bg-orange-400' :
                  'bg-orange-300'
                : 'bg-dark-border'
            }`}
            title={`${day.date}: ${day.hasActivity ? 'Swam' : 'Rest day'}`}
          />
          <span className="text-[9px] text-content-tertiary uppercase">
            {day.dayLetter}
          </span>
        </motion.div>
      ))}
    </div>
  );
};
```

**Streak Calculation Logic:**
```javascript
// src/utils/streakCalculation.js

export const calculateStreak = (sessions) => {
  if (sessions.length === 0) return 0;

  const sortedDates = sessions
    .map(s => new Date(s.date).toDateString())
    .sort((a, b) => new Date(b) - new Date(a));

  const uniqueDates = [...new Set(sortedDates)];

  let streak = 0;
  let currentDate = new Date();

  for (let i = 0; i < uniqueDates.length; i++) {
    const sessionDate = new Date(uniqueDates[i]);
    const dayDiff = Math.floor((currentDate - sessionDate) / (1000 * 60 * 60 * 24));

    if (dayDiff === streak) {
      streak++;
    } else if (dayDiff > streak) {
      break;
    }
  }

  return streak;
};

export const getLast7DaysActivity = (sessions) => {
  const days = [];
  const today = new Date();

  for (let i = 6; i >= 0; i--) {
    const date = new Date(today);
    date.setDate(date.getDate() - i);
    const dateStr = date.toDateString();

    const daySessions = sessions.filter(s =>
      new Date(s.date).toDateString() === dateStr
    );

    const hasActivity = daySessions.length > 0;
    const intensity = hasActivity
      ? Math.min(daySessions.reduce((sum, s) => sum + s.distance, 0) / 1000, 3)
      : 0;

    days.push({
      date: dateStr,
      dayLetter: date.toLocaleDateString('en-US', { weekday: 'narrow' }),
      hasActivity,
      intensity
    });
  }

  return days;
};
```

**Interactions:**
- Flame icon pulses if streak > 0
- Heatmap cells animate in sequentially (stagger 50ms)
- Hover on heatmap cell shows tooltip with date and activity
- Entire card clickable → Sessions page

---

### Card 3: Pace Trend Card

**Purpose:** Show recent performance trend at a glance

**Visual Design:**
```
┌─────────────────────────┐
│  ⚡ Pace Trend          │
│                         │
│      ╱╲_╱╲_            │
│     ╱      ╲           │
│    ╱         ╲_        │
│                         │
│  Your pace is improving │
│  ↑ 5% faster this week  │
│                         │
│  [Analyze Trend →]      │
└─────────────────────────┘
```

**Implementation Details:**

```jsx
// src/components/dashboard/PaceTrendCard.jsx

export const PaceTrendCard = ({ sessions }) => {
  const last5Swims = sessions.slice(0, 5);
  const sparklineData = last5Swims.reverse().map(s => ({
    date: new Date(s.date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' }),
    pace: s.pace,
    paceSeconds: s.pace * 60 // for chart scale
  }));

  // Calculate trend
  const avgRecent = last5Swims.slice(0, 3).reduce((sum, s) => sum + s.pace, 0) / 3;
  const avgOlder = last5Swims.slice(3, 5).reduce((sum, s) => sum + s.pace, 0) / 2;
  const percentChange = ((avgOlder - avgRecent) / avgOlder * 100).toFixed(1);
  const isImproving = avgRecent < avgOlder;
  const isStable = Math.abs(percentChange) < 2;

  const trendMessage = isStable
    ? 'Your pace is stable'
    : isImproving
    ? 'Your pace is improving'
    : 'Your pace is slowing';

  return (
    <Card className="bg-gradient-to-br from-accent-blue/20 to-accent-blue/5 border-accent-blue/30">
      <div className="flex items-center gap-2 mb-3">
        <TrendingUp className="w-4 h-4 text-accent-blue" />
        <span className="text-sm font-medium text-content-secondary">Pace Trend</span>
      </div>

      <div className="h-20 mb-3">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={sparklineData}>
            <defs>
              <linearGradient id="paceTrendGradient" x1="0" y1="0" x2="0" y2="1">
                <stop offset="5%" stopColor="#00d4ff" stopOpacity={0.3}/>
                <stop offset="95%" stopColor="#00d4ff" stopOpacity={0}/>
              </linearGradient>
            </defs>
            <Area
              type="monotone"
              dataKey="paceSeconds"
              stroke="#00d4ff"
              strokeWidth={2}
              fill="url(#paceTrendGradient)"
              dot={false}
              isAnimationActive
              animationDuration={800}
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>

      <div className="text-center mb-3">
        <p className="text-sm font-medium text-content mb-1">
          {trendMessage}
        </p>
        {!isStable && (
          <p className={`text-xs flex items-center justify-center gap-1 ${
            isImproving ? 'text-green-400' : 'text-orange-400'
          }`}>
            {isImproving ? <TrendingUp className="w-3 h-3" /> : <TrendingDown className="w-3 h-3" />}
            {Math.abs(percentChange)}% {isImproving ? 'faster' : 'slower'} recently
          </p>
        )}
      </div>

      <Link
        to="/insights?metric=pace"
        className="text-xs text-accent-blue hover:text-accent-blue/80 flex items-center justify-center gap-1 group"
      >
        Analyze Trend
        <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
      </Link>
    </Card>
  );
};
```

**Interactions:**
- Sparkline draws from left to right on mount (800ms)
- Trend icon animates (pulse or bounce) based on direction
- Entire card clickable → Insights page with pace metric pre-selected

---

### Card 4: AI Assistant Card

**Purpose:** Drive discovery of Ask page and engage users with AI feature

**Visual Design:**
```
┌─────────────────────────┐
│  ✨ Ask About Swimming  │
│                         │
│    [───────────]        │
│   Ask me anything...    │
│                         │
│  Popular questions:     │
│  • Why was this fast?   │
│  • How to improve SWOLF?│
│                         │
│  [Ask Question →]       │
└─────────────────────────┘
```

**Implementation Details:**

```jsx
// src/components/dashboard/AIAssistantCard.jsx

export const AIAssistantCard = () => {
  const sampleQuestions = [
    "Why was my last swim so fast?",
    "How can I improve my SWOLF?",
    "What's my pace trend?"
  ];

  return (
    <Card className="bg-gradient-to-br from-purple-500/20 via-primary-500/10 to-accent-blue/10 border-purple-500/30 relative overflow-hidden">
      {/* Animated gradient background */}
      <motion.div
        className="absolute inset-0 bg-gradient-to-r from-purple-500/10 via-primary-500/10 to-accent-blue/10"
        animate={{
          backgroundPosition: ['0% 50%', '100% 50%', '0% 50%'],
        }}
        transition={{
          duration: 10,
          repeat: Infinity,
          ease: "linear"
        }}
        style={{
          backgroundSize: '200% 200%'
        }}
      />

      <div className="relative z-10">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span className="text-sm font-medium text-content-secondary">Ask About Swimming</span>
        </div>

        <div className="mb-4 p-3 bg-dark-bg/50 rounded-lg border border-dark-border/30">
          <MessageCircle className="w-6 h-6 text-purple-400 mb-2" />
          <p className="text-xs text-content-secondary">
            Get personalized insights about your swimming
          </p>
        </div>

        <div className="mb-3">
          <p className="text-xs text-content-tertiary mb-2">Popular questions:</p>
          <div className="space-y-1">
            {sampleQuestions.map((q, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.1 }}
                className="text-xs text-content-secondary"
              >
                • {q}
              </motion.div>
            ))}
          </div>
        </div>

        <Link
          to="/ask"
          className="text-xs text-purple-400 hover:text-purple-300 flex items-center justify-center gap-1 group"
        >
          Ask Question
          <ArrowRight className="w-3 h-3 group-hover:translate-x-1 transition-transform" />
        </Link>
      </div>
    </Card>
  );
};
```

**Interactions:**
- Subtle animated gradient background (10s loop)
- Sparkles icon subtle pulse/rotate animation
- Sample questions fade in sequentially (stagger 100ms)
- Entire card clickable → Ask page

---

## Integration into Dashboard

### Updated Dashboard.jsx Structure

```jsx
// src/pages/Dashboard.jsx

export const Dashboard = () => {
  const { sessions, rateSession, removeSession } = useSwimData();
  const navigate = useNavigate();

  // ... existing analysis and memoization ...

  return (
    <PageContainer>
      <PageHeader {...} />

      {/* 1. Last Swim Hero (enhanced) */}
      {lastSwim && (
        <LastSwimHero {...existingProps} />
      )}

      {/* 2. Quick Insights Grid (NEW) */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="mb-6"
      >
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <ProgressCard sessions={sessions} />
          <StreakCard sessions={sessions} />
          <PaceTrendCard sessions={sessions} />
          <AIAssistantCard />
        </div>
      </motion.div>

      {/* 3. Swim Ranking Card (existing) */}
      {ranking && <SwimRankingCard ranking={ranking} />}

      {/* 4. Technique Card (enhanced) */}
      {techniqueRecommendation && (
        <TechniqueCard recommendation={techniqueRecommendation} />
      )}

      {/* 5. Recent Sessions (existing) */}
      {recentSessions.length > 0 && (
        <RecentSessionsSection {...existingProps} />
      )}
    </PageContainer>
  );
};
```

---

## Responsive Behavior

### Mobile (< 768px)
- **Quick Insights:** Single column, full width, scrollable
- **Card height:** Slightly reduced (min-height: 140px)
- **Progress ring:** Smaller size (100px diameter)
- **Heatmap:** Smaller cells (24px instead of 32px)
- **Sparkline:** Maintains aspect ratio

### Tablet (768px - 1024px)
- **Quick Insights:** 2x2 grid
- **Cards:** Equal height in rows
- **Touch targets:** All 44px minimum

### Desktop (> 1024px)
- **Quick Insights:** 4 columns
- **Hover effects:** Enabled
- **Larger visual elements:** Full-size progress rings, expanded charts

---

## Performance Considerations

### Optimization Strategies

1. **Lazy Loading:**
   - Load Recharts dynamically only when sparkline is visible
   - Use Intersection Observer for below-fold content

2. **Memoization:**
   - Memoize streak calculation (expensive with many sessions)
   - Memoize progress percentage calculation
   - Cache last 7 days activity

3. **Animation Performance:**
   - Use CSS transforms (GPU accelerated)
   - Limit simultaneous animations
   - Respect prefers-reduced-motion

4. **Data Efficiency:**
   - Only process last 30 days of sessions for dashboard
   - Compute trends on mount, not on every render
   - Use useMemo for expensive calculations

---

## Accessibility

### Requirements

1. **Keyboard Navigation:**
   - All cards focusable and clickable with Enter
   - Skip links for screen readers
   - Logical tab order

2. **Screen Readers:**
   - Progress percentage announced
   - Trend direction described in alt text
   - Chart data available as table (hidden visually)

3. **Color Contrast:**
   - All text meets WCAG AA (4.5:1 ratio)
   - Don't rely on color alone for meaning
   - Add icons/text with color indicators

4. **Motion:**
   - Respect prefers-reduced-motion
   - Provide static alternative for animations

---

## Testing Plan

### Unit Tests
- Streak calculation logic
- Progress percentage calculation
- Trend analysis (improving/stable/declining)
- Last 7 days activity generation

### Integration Tests
- Dashboard renders all cards
- Navigation links work correctly
- Data flows from context to cards
- Animations trigger on mount

### Visual Regression Tests
- Screenshot tests for each card
- Mobile/tablet/desktop layouts
- Dark mode compatibility

### User Testing
- Can users understand insights at a glance?
- Do visual cards increase feature discovery?
- Are animations distracting or delightful?
- Time to comprehension vs. old dashboard

---

## Success Metrics

### Quantitative
- **Dashboard engagement:** Time on dashboard page (+30% target)
- **Feature discovery:** Insights page visits from dashboard (+50% target)
- **Ask page discovery:** Ask page visits from dashboard (+100% target)
- **Card interactions:** Click-through rate on cards (>40% target)

### Qualitative
- User feedback on visual appeal
- Comprehension of insights (survey)
- NPS impact from visual improvements

---

## Next Steps

1. **Review and approve** this specification
2. **Create Figma mockup** for visual reference
3. **Build CircularProgress component** (reusable)
4. **Build CalendarHeatmap component** (reusable)
5. **Build each insight card** (ProgressCard, StreakCard, etc.)
6. **Integrate QuickInsightsGrid** into Dashboard.jsx
7. **Test on mobile/tablet/desktop**
8. **Gather user feedback**
9. **Iterate based on metrics**

