# Priority Backlog - Swimma Feature Development

> **Last Updated:** January 16, 2025
> **Based on:** Comprehensive 5-persona testing (see `feature-testing-log-2025.md`)

---

## How to Read This Document

### Priority Levels
- **P0 (Critical)** - Blocks major persona, must fix within 2 weeks
- **P1 (High)** - Significantly improves experience, ship within 1 month
- **P2 (Medium)** - Nice to have, enhances experience, ship within 2-3 months
- **P3 (Low)** - Future enhancement, add to backlog

### Persona Impact Score
How many personas benefit? (Max: 5/5)
- **5/5** - Benefits all personas
- **4/5** - Benefits 4 personas
- **3/5** - Benefits 3 personas
- **2/5** - Benefits 2 personas
- **1/5** - Benefits 1 persona (but may be critical for them!)

### Effort Estimate
- **🟢 Small** - < 1 day
- **🟡 Medium** - 1-3 days
- **🔴 Large** - 4-7 days
- **🔴🔴 XLarge** - 1-2 weeks

---

## P0: Critical Features (Ship Within 2 Weeks)

### 1. Lap Data Viewer
**Persona Impact:** 2/5 (Chris ✅✅, David ✅)
**Effort:** 🔴 Large (5 days)
**Current Status:** ❌ Blocking Competitive Chris

**Description:**
Create a Session Detail page that displays lap-by-lap breakdown:
- Table view: Lap #, Distance, Time, Pace, Stroke Count
- Visual lap comparison chart
- Highlight fastest/slowest laps
- Calculate split times (50m, 100m)
- Show negative/positive split analysis

**User Story:**
> "As Chris, I want to see my lap times for each 100m interval so I can analyze my pacing strategy and improve my race performance."

**Success Criteria:**
- ✅ Click session card → see lap breakdown table
- ✅ Visual chart showing lap times
- ✅ Fastest/slowest lap highlighted
- ✅ Ask AI can answer lap-specific questions

**Dependencies:** None

**Files to Create/Modify:**
- `src/pages/SessionDetail.jsx` (new detailed view)
- `src/components/LapBreakdownTable.jsx` (new)
- `src/components/LapChart.jsx` (new)

---

### 2. Wellness Mode
**Persona Impact:** 2/5 (Casey ✅✅, Maria ⚠️)
**Effort:** 🟡 Medium (2 days)
**Current Status:** ❌ Blocking Casual Casey

**Description:**
Add a toggle that switches app focus from performance to wellness:
- **Wellness Mode ON:**
  - Hide pace metrics (or make them subtle)
  - Hide ranking card (or change to "Swims this week: X")
  - Replace "Fast/Easy" badges with neutral "Completed"
  - Show consistency metrics (streak, frequency)
  - Gentler, more encouraging tone
  - Insights page shows frequency chart, not pace trends

**User Story:**
> "As Casey, I want to hide performance metrics so I can celebrate showing up without feeling judged about being 'slow'."

**Success Criteria:**
- ✅ Toggle in settings/profile
- ✅ Dashboard hides/softens pace metrics
- ✅ Ranking card replaced with "X swims this week/month"
- ✅ Session cards show simplified view
- ✅ Insights page shows consistency, not pace

**Dependencies:** None

**Files to Create/Modify:**
- `src/context/UserPreferencesContext.jsx` (new - store wellness mode state)
- `src/components/SessionCard.jsx` (add wellness mode variant)
- `src/components/SwimRankingCard.jsx` (add wellness variant)
- `src/pages/Dashboard.jsx` (conditional rendering)
- `src/pages/Insights.jsx` (add consistency chart)

---

### 3. Goal Tracking System
**Persona Impact:** 3/5 (Maria ✅✅, Casey ✅, Claire ⚠️)
**Effort:** 🔴 Large (5 days)
**Current Status:** ❌ Blocking Milestone Maria

**Description:**
Allow users to set distance/frequency goals and track progress:
- **Goal Types:**
  - Distance goal: "Swim 1500m continuously"
  - Total distance: "Swim 50km this year"
  - Frequency goal: "Swim 3x per week"
  - Event preparation: "Ready for Olympic Tri by June 1"

- **Features:**
  - Create goal form (distance, target date)
  - Progress bar on Dashboard: "840m / 1500m (56%)"
  - Milestone celebrations when goals hit
  - Ask AI can reference goals: "You're 56% to your 1500m goal!"

**User Story:**
> "As Maria, I want to set a goal to swim 1500m continuously so I can track my progress toward my triathlon race."

**Success Criteria:**
- ✅ Create/edit/delete goals
- ✅ Goals displayed on Dashboard with progress bar
- ✅ Milestone alert when goal achieved
- ✅ Ask AI references goals in responses
- ✅ Insights page shows progress chart

**Dependencies:** Database schema update (goals table)

**Files to Create/Modify:**
- `src/components/GoalCard.jsx` (new)
- `src/components/GoalForm.jsx` (new)
- `src/pages/Dashboard.jsx` (add goals section)
- `src/utils/goals.js` (new - goal calculations)
- Supabase: Create `goals` table

---

### 4. Data Export (CSV)
**Persona Impact:** 1/5 (David ✅✅)
**Effort:** 🟡 Medium (2 days)
**Current Status:** ❌ Frustrating David

**Description:**
Allow users to export their swim data to CSV format:
- Export all sessions or date range
- Include all metrics (distance, pace, duration, SWOLF, etc.)
- Include lap data if available
- Format: CSV with headers

**User Story:**
> "As David, I want to export my swim data to CSV so I can analyze it in Excel and create custom reports."

**Success Criteria:**
- ✅ "Export to CSV" button on Sessions page
- ✅ Select date range for export
- ✅ CSV includes all session metrics
- ✅ CSV includes lap data if available
- ✅ Filename: `swimma-export-YYYY-MM-DD.csv`

**Dependencies:** None

**Files to Create/Modify:**
- `src/utils/export.js` (new - CSV generation)
- `src/pages/Sessions.jsx` (add export button)

---

## P1: High Priority (Ship Within 1 Month)

### 5. Achievement Badges System
**Persona Impact:** 4/5 (Maria ✅✅, Casey ✅, Claire ✅, David ⚠️)
**Effort:** 🔴 Large (4 days)

**Description:**
Gamification system with milestone badges:
- **Distance Badges:** First 1km, 5km, 10km, 25km, 50km, 100km lifetime
- **Frequency Badges:** 10 swims, 25 swims, 50 swims, 100 swims
- **Streak Badges:** 3-day streak, 7-day streak, 30-day streak
- **Achievement Badges:** First open water, Longest swim, Fastest pace
- **Display:** Badge showcase on profile/dashboard
- **Celebration:** Confetti animation when badge earned

**User Story:**
> "As Maria, I want to earn badges for milestones so I feel celebrated when I hit 1km, 2km, etc."

**Success Criteria:**
- ✅ Badges appear on Dashboard when earned
- ✅ Celebration animation
- ✅ Badge showcase page
- ✅ Share badge to social media (optional)

**Dependencies:** None

**Files to Create/Modify:**
- `src/utils/achievements.js` (new - badge logic)
- `src/components/BadgeCard.jsx` (new)
- `src/components/BadgeCelebration.jsx` (new - confetti)
- `src/pages/Achievements.jsx` (new page)

---

### 6. Age Group Benchmarks
**Persona Impact:** 2/5 (Claire ✅✅, Maria ⚠️)
**Effort:** 🟡 Medium (3 days)

**Description:**
Provide age/gender-appropriate context for pace:
- User sets: age, gender, experience level (beginner/intermediate/advanced)
- Display: "Your 2:30 pace is GOOD for 30-39 year old recreational swimmers"
- Benchmark ranges:
  - **Beginner:** 3:00-4:00 min/100m
  - **Recreational:** 2:15-3:00 min/100m
  - **Competitive:** 1:30-2:15 min/100m
  - **Elite:** <1:30 min/100m

**User Story:**
> "As Claire, I want to know if my 2:30 pace is good for a 34-year-old returning swimmer so I can set realistic expectations."

**Success Criteria:**
- ✅ User profile includes age/gender/level
- ✅ Dashboard shows: "Good for your age" badge
- ✅ Swim Ranking Card includes age context
- ✅ Ask AI references age-appropriate benchmarks

**Dependencies:** User profile expansion

**Files to Create/Modify:**
- `src/utils/benchmarks.js` (new - age/gender tables)
- `src/components/BenchmarkBadge.jsx` (new)
- `src/pages/Profile.jsx` (add age/gender fields)

---

### 7. Streak Tracking
**Persona Impact:** 3/5 (Maria ✅✅, Casey ✅✅, Claire ⚠️)
**Effort:** 🟡 Medium (2 days)

**Description:**
Track consecutive swimming days to encourage consistency:
- Current streak (days)
- Longest streak
- "Don't break the chain!" messaging
- **Wellness Mode:** Emphasize streaks over pace
- **Regular Mode:** Show streaks alongside performance

**User Story:**
> "As Casey, I want to see my swim streak so I'm motivated to keep showing up, regardless of how fast I swim."

**Success Criteria:**
- ✅ Streak card on Dashboard
- ✅ "Longest streak: X days" displayed
- ✅ "Streak at risk!" notification (optional)
- ✅ Wellness Mode emphasizes streaks

**Dependencies:** None

**Files to Create/Modify:**
- `src/utils/streaks.js` (new - streak calculation)
- `src/components/StreakCard.jsx` (new)
- `src/pages/Dashboard.jsx` (add streak section)

---

### 8. Ask AI Tone Modes
**Persona Impact:** 4/5 (All except Chris)
**Effort:** 🟢 Small (1 day)

**Description:**
Adjust AI tone based on user persona/preferences:
- **Beginner Mode (Maria):** Encouraging, simple language, celebrates progress
- **Analytical Mode (David):** Data-driven, technical, detailed stats
- **Wellness Mode (Casey):** Gentle, supportive, focuses on consistency not speed
- **Default Mode (Claire):** Balanced, contextual, motivating

**User Story:**
> "As Maria, I want the AI coach to be encouraging and explain things simply, not bombard me with technical stats."

**Success Criteria:**
- ✅ User selects tone preference in settings
- ✅ AI adjusts language based on mode
- ✅ Beginner mode uses simple language
- ✅ Wellness mode avoids performance pressure

**Dependencies:** None

**Files to Create/Modify:**
- `src/utils/ai/llmQuery.js` (add system prompt variations)
- `src/pages/Ask.jsx` (pass tone mode to AI)
- User preferences context

---

### 9. Structured Workout Logger
**Persona Impact:** 1/5 (Chris ✅✅)
**Effort:** 🔴🔴 XLarge (7 days)

**Description:**
Allow manual logging of structured workouts:
- **Format:** "8x100m on 1:30 rest"
- **Sets:** Warm-up, Main set, Cool-down
- **Tracking:** Target pace vs. actual pace
- **Templates:** Save common workouts
- **Analysis:** Set performance comparison

**User Story:**
> "As Chris, I want to log my structured interval workout (8x100m on 1:30) so I can track my performance across sets."

**Success Criteria:**
- ✅ Create workout from template or custom
- ✅ Log sets with target and actual times
- ✅ Compare sets: "Set 3 was 2s slower than Set 1"
- ✅ Save workout templates

**Dependencies:** Database schema update

**Files to Create/Modify:**
- `src/pages/WorkoutLogger.jsx` (new)
- `src/components/WorkoutForm.jsx` (new)
- `src/utils/workouts.js` (new)
- Supabase: Create `workouts` and `workout_sets` tables

---

## P2: Medium Priority (Ship Within 2-3 Months)

### 10. Customizable Dashboard
**Persona Impact:** 2/5 (David ✅✅, Claire ⚠️)
**Effort:** 🔴 Large (5 days)

**Description:**
Let users choose which widgets appear on their Dashboard:
- Widget library: Last Swim, Ranking, Goals, Streaks, Records, Ask AI
- Drag-and-drop reordering
- Hide/show widgets
- Save layout preference

**Success Criteria:**
- ✅ "Customize Dashboard" button
- ✅ Select which widgets to display
- ✅ Reorder widgets
- ✅ Save preference

---

### 11. Correlation Analysis (Insights)
**Persona Impact:** 1/5 (David ✅✅)
**Effort:** 🔴 Large (5 days)

**Description:**
Automatically detect patterns and correlations:
- Pace vs. time-of-day
- Pace vs. day-of-week
- Distance vs. rest days
- Performance vs. consistency

**Success Criteria:**
- ✅ "Patterns" section in Insights
- ✅ Show top 3 correlations automatically
- ✅ Ask AI can query correlations

---

### 12. Simplified Insights View
**Persona Impact:** 2/5 (Maria ✅, Casey ✅)
**Effort:** 🟡 Medium (2 days)

**Description:**
Add "Simple" vs "Advanced" toggle on Insights page:
- **Simple:** Default line chart, no controls, clear labels
- **Advanced:** All current customization (chart type, rolling avg, etc.)

**Success Criteria:**
- ✅ "Simple/Advanced" toggle
- ✅ Simple mode hides overwhelming controls
- ✅ Default to Simple for new users

---

### 13. Progress Visualizations
**Persona Impact:** 3/5 (Maria ✅✅, Claire ✅, Casey ⚠️)
**Effort:** 🟡 Medium (3 days)

**Description:**
Visual indicators of improvement:
- Month-over-month comparison cards
- "You're X% faster than last month!"
- Progress bars for goals
- Animated improvement charts

**Success Criteria:**
- ✅ Dashboard shows month-over-month stats
- ✅ Visual improvement indicators
- ✅ Celebrate positive trends

---

### 14. Bulk Upload
**Persona Impact:** 1/5 (David ✅)
**Effort:** 🟡 Medium (2 days)

**Description:**
Upload multiple .FIT files at once:
- Drag-and-drop folder
- Upload up to 50 files
- Progress indicator
- Handle duplicates

**Success Criteria:**
- ✅ Bulk upload works for 50+ files
- ✅ Progress shown during upload
- ✅ Duplicate detection

---

## P3: Low Priority (Backlog)

### 15. API Access
**Persona Impact:** 1/5 (David ✅)
**Effort:** 🔴🔴 XLarge (10 days)

**Description:**
Public API for programmatic access:
- REST endpoints for sessions, laps, goals
- API key authentication
- Rate limiting
- Documentation

---

### 16. Custom Calculated Metrics
**Persona Impact:** 1/5 (David ✅)
**Effort:** 🔴 Large (5 days)

**Description:**
Let users create custom formulas:
- Distance per stroke
- Efficiency score (custom formula)
- Power output estimate

---

### 17. Gala/Meet Tracking
**Persona Impact:** 1/5 (Chris ✅)
**Effort:** 🔴 Large (5 days)

**Description:**
Track race performances separately:
- Log gala results
- Compare to training swims
- Track PBs by event

---

### 18. Social Features
**Persona Impact:** 2/5 (Maria ✅, Casey ⚠️)
**Effort:** 🔴🔴 XLarge (14 days)

**Description:**
Share achievements and connect with friends:
- Share badges to social media
- Follow friends
- Leaderboards (optional)

---

### 19. Mobile Native App
**Persona Impact:** 5/5 (All)
**Effort:** 🔴🔴 XLarge (30+ days)

**Description:**
iOS and Android native apps:
- React Native build
- Push notifications
- Offline support

---

## Priority Matrix

| Priority | # Features | Total Effort | Personas Unblocked |
|----------|------------|--------------|---------------------|
| **P0** | 4 | 14 days | Chris, Casey, Maria, David |
| **P1** | 5 | 16 days | +Gamification for all |
| **P2** | 5 | 17 days | +Polish and depth |
| **P3** | 5 | 64+ days | +Advanced/niche features |

---

## Recommended Sprint Plan

### Sprint 1 (Week 1-2): P0 Critical Features
- Lap Data Viewer (5 days)
- Wellness Mode (2 days)
- Goal Tracking (5 days)
- Data Export CSV (2 days)

**Outcome:** All 5 personas can use the app (7-8/10 satisfaction)

---

### Sprint 2 (Week 3-4): P1 High Value
- Achievement Badges (4 days)
- Age Group Benchmarks (3 days)
- Streak Tracking (2 days)
- Ask AI Tone Modes (1 day)

**Outcome:** Significant satisfaction boost (8-9/10 for target personas)

---

### Sprint 3 (Week 5-6): P1 Competitive Features
- Structured Workout Logger (7 days)

**Outcome:** Chris persona fully served

---

### Sprint 4 (Week 7-8): P2 Polish
- Simplified Insights View (2 days)
- Progress Visualizations (3 days)
- Customizable Dashboard (5 days)

**Outcome:** 9/10 satisfaction across all personas

---

## Measuring Success

### Target Satisfaction Scores (Post-P0)
- **Comeback Claire:** 8/10 → 9/10
- **Data-Driven David:** 7/10 → 8/10
- **Milestone Maria:** 6/10 → 8/10
- **Competitive Chris:** 3/10 → 7/10
- **Casual Casey:** 3/10 → 8/10

### Key Metrics
- **Retention:** % users returning after 7/30 days
- **Feature Adoption:** % using Goals, Wellness Mode, Lap Viewer
- **Ask AI Usage:** Average queries per user
- **Badge Earnings:** Average badges earned per user
- **Export Usage:** % power users exporting data

---

## Notes

- **P0 is essential** - Without these, 60% of personas won't use the app
- **P1 boosts satisfaction** - Takes app from "usable" to "delightful"
- **P2 adds depth** - Competitive differentiation
- **P3 is nice to have** - Only ship if bandwidth allows

**Next Step:** Create detailed 2025 roadmap with quarterly milestones
