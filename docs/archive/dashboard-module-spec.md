# Dashboard Module Specification: Visual Entry Points

## Module: Quick Insights Grid

### Purpose
Create scannable visual cards that serve as entry points to deeper features while providing immediate value.

### Layout
3-column grid (responsive: 1 column mobile, 2 column tablet, 3 column desktop)

### Card Types

#### 1. Progress Card
**Visual Element:** Circular progress indicator with gradient fill
**Data Display:**
- Current week/month distance vs. goal
- Percentage complete
- Days remaining in period
**Action:** "View Full Progress" → Insights page
**Icon/Illustration:** Circular progress ring with swimmer silhouette in center

#### 2. Technique Tip Card (Enhanced)
**Visual Element:** Animated technique diagram or illustration
**Data Display:**
- One-line tip based on last swim analysis
- Visual diagram showing the technique (e.g., streamline position)
**Action:** "Learn More" → Specific technique article
**Icon/Illustration:** Simple line drawing of swimmer demonstrating technique

#### 3. Streak & Momentum Card
**Visual Element:** Calendar heatmap (last 7-14 days)
**Data Display:**
- Current swim streak
- Visual representation of consistency
- Motivational message
**Action:** "Keep Going" → Sessions page
**Icon/Illustration:** Flame icon with intensity based on streak length

#### 4. Pace Trend Card
**Visual Element:** Mini sparkline chart
**Data Display:**
- Last 5 swims pace trend
- Up/down arrow with percentage change
- "Your pace is improving/stable/declining"
**Action:** "Analyze Trend" → Insights page (pace view)
**Icon/Illustration:** Line graph with trend arrow

#### 5. Next Milestone Card
**Visual Element:** Trophy/target illustration with progress bar
**Data Display:**
- Next achievement (e.g., "50km total distance" or "Sub-2:00 pace")
- Distance to milestone
- Visual progress bar
**Action:** "Track Milestone" → Sessions/achievements view
**Icon/Illustration:** Trophy or target icon with percentage fill

#### 6. AI Assistant Card
**Visual Element:** Chat bubble with sparkle effect
**Data Display:**
- "Ask me about your swimming"
- Sample questions as pills
**Action:** "Ask Question" → Ask page
**Icon/Illustration:** Sparkles/AI icon with animated gradient

### Design Specifications

**Card Dimensions:**
- Min height: 120px
- Padding: 16px
- Border radius: 12px
- Gradient backgrounds based on card type

**Visual Hierarchy:**
- Large icon/illustration: 48x48px or larger for visual focus
- Primary metric: 32px bold font
- Secondary text: 14px regular
- CTA button: Subtle, bottom-right or full-width

**Color Coding:**
- Progress: Primary blue gradient
- Technique: Purple/indigo gradient
- Streak: Orange/red gradient (flame theme)
- Pace: Accent blue gradient
- Milestone: Gold/amber gradient
- AI: Multi-color sparkle gradient

### Animation & Interaction

**On Load:**
- Stagger animation (each card appears 50ms after previous)
- Fade up + scale from 0.95 to 1

**On Hover:**
- Subtle lift (translateY: -4px)
- Shadow increase
- Icon subtle pulse or rotation

**Interactive Elements:**
- Progress rings animate to percentage on load
- Sparklines draw from left to right
- Heatmap cells fade in sequentially

### Technical Implementation Notes

**Component Structure:**
```
<QuickInsightsGrid>
  <ProgressCard data={weeklyProgress} />
  <TechniqueVisualCard recommendation={techniqueRec} />
  <StreakCard sessions={recentSessions} />
  <PaceTrendCard sessions={last5Swims} />
  <MilestoneCard nextMilestone={milestone} />
  <AIAssistantCard />
</QuickInsightsGrid>
```

**Data Requirements:**
- Weekly/monthly distance aggregation
- Last 14 days session dates for heatmap
- Last 5 swims for pace trend
- Next milestone calculation based on current stats
- Technique recommendation (already exists)

**Asset Requirements:**
- Swimmer silhouette SVG
- Technique diagram SVGs (streamline, body rotation, breathing, etc.)
- Trophy/medal icons
- Flame icon (animated states)
- Sparkle/AI icon
