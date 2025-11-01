# User Personas

## Location
Full persona documentation: `docs/personas/personas.md`

## Purpose
These 5 personas represent real swimmer archetypes. Use them to test every feature before shipping.

**Key Question:** "Would [Persona] understand/need/use this?"

---

## The 5 Personas

### 1. Comeback Claire - The Returning Swimmer
**Age 34 | Marketing Manager | Bristol**

**Background:** Swam competitively at county level, 15 years off, recently rejoined pool

**Key Needs:**
- Track if she's actually improving
- Understand what "good" looks like for her age/fitness
- Get back in shape without injury
- Technique tips based on her data

**Pain Points:**
- No idea if 2:30/100m pace is decent or rubbish
- Doesn't remember proper technique
- Compares herself to teenage self (unrealistic)

**Loves:** AI coaching insights, progress visualization, personal records, age-appropriate comparisons

**Hates:** Too many metrics without context, feeling judged, complicated UI

**Key Quote:** "I used to swim 1:05/100m at county level. Now I'm doing 2:30 and I don't know if that's pathetic or good for someone who hasn't trained in 15 years."

**Usage:** 2-3x/week, 1000-2000m sessions, Garmin Swim 2, early morning/lunchtime

---

### 2. Data-Driven David - The Analytical Optimizer
**Age 42 | Software Engineer | Manchester**

**Background:** Started 2 years ago for cross-training, loves tracking everything

**Key Needs:**
- Optimize training efficiency
- Find patterns (time of day, rest days, nutrition)
- Ask "why was my pace slower this week?" and get answers
- API access to his own data

**Pain Points:**
- Current apps show data but no actionable insights
- Too many metrics, doesn't know which matter most
- Struggles to spot trends in noisy data

**Loves:** Natural language querying (Ask AI), detailed analytics, pattern recognition, data export, custom metrics

**Hates:** Can't customize dashboard, limited exports, shallow analytics

**Key Quote:** "I want to know: do I swim faster on days when I sleep 8+ hours? After rest days? Show me the data."

**Usage:** 3-4x/week, 2500-3500m sessions, Apple Watch, experiments with timing

---

### 3. Milestone Maria - The Goal-Oriented Beginner
**Age 28 | Nurse | Leeds**

**Background:** Never swam laps until 6 months ago, training for first Olympic triathlon

**Key Needs:**
- Build endurance safely
- Track progress toward 1500m continuous swim goal
- Celebrate small wins to stay motivated
- Learn technique from data (can't afford coach)

**Pain Points:**
- Every swim feels hard, can't tell if improving
- Doesn't know if SWOLF is good or bad
- Gets discouraged comparing to others
- Often forgets to start watch

**Loves:** Achievement badges, progress bars (50% to 1500m!), encouraging AI tone, "You're doing great!" reinforcement

**Hates:** Technical jargon, overwhelming charts, unclear pace targets

**Key Quote:** "I just want to know: am I getting better? Am I on track for my triathlon? And please tell me that 3:15/100m is alright..."

**Usage:** 2x/week (wants 3x), 800-1500m sessions, Garmin watch, variable times

---

### 4. Competitive Chris - The Masters Swimmer
**Age 51 | Physiotherapist | Edinburgh**

**Background:** Masters swimmer, competes in local galas 4-6x/year

**Key Needs:**
- Shave seconds off 100m freestyle
- Analyze lap-by-lap pacing strategy
- Track taper effectiveness before galas
- Monitor fatigue and recovery
- Compete in age group (50-54)

**Pain Points:**
- Needs granular lap data, not session averages
- Current tracking lacks race simulation
- Missing structured workout logging (8x100 on 1:30)
- No periodization planning tools

**Loves:** Lap-by-lap breakdown, pacing analysis, workout builder with intervals, race tracking, age group comparisons

**Hates:** Can't log structured workouts, no split times, missing stroke rate, simplified metrics

**Key Quote:** "I need to know: was my pacing strategy effective? Did I start too fast? How does this compare to my age group at the last gala?"

**Usage:** 5-6x/week, 3000-5000m sessions, Garmin with structured workouts, 5:30am masters practice

---

### 5. Casual Casey - The Wellness Swimmer
**Age 38 | Stay-at-home Parent | Brighton**

**Background:** Recreational only, swims for stress relief and gentle exercise

**Key Needs:**
- Maintain consistent habit (proud of showing up)
- Feel accomplished without pressure
- Track streaks and frequency more than speed
- Mental health benefit (meditation in motion)

**Pain Points:**
- Most swim apps too complicated/competitive
- Doesn't care about pace, just wants recognition
- Feels judged by performance metrics
- Intimidated by athletic features

**Loves:** Streak tracking, celebratory animations for showing up, non-judgmental tone, consistency focus, calming design, option to hide metrics

**Hates:** Emphasis on speed, intimidating graphs, competitive language ("beat your best!"), complex features

**Key Quote:** "I don't care if I'm fast or slow. I just want to celebrate that I made it to the pool twice this week despite everything."

**Usage:** 1-2x/week, 500-1200m sessions, basic tracker or manual entry, mid-morning/evening

---

## Quick Feature Matrix

| Feature | Claire | David | Maria | Chris | Casey |
|---------|:------:|:-----:|:-----:|:-----:|:-----:|
| AI Insights | ✅✅ | ✅✅ | ✅ | ✅ | ❌ |
| Progress Tracking | ✅✅ | ✅✅ | ✅✅ | ✅✅ | ⚠️ |
| Lap Analysis | ⚠️ | ✅ | ❌ | ✅✅ | ❌ |
| Benchmarks | ✅✅ | ✅ | ✅ | ✅✅ | ❌ |
| Streak Tracking | ⚠️ | ❌ | ✅✅ | ❌ | ✅✅ |
| Workout Builder | ❌ | ✅ | ⚠️ | ✅✅ | ❌ |
| Educational Content | ✅✅ | ❌ | ✅✅ | ❌ | ⚠️ |
| Data Export | ❌ | ✅✅ | ❌ | ✅ | ❌ |
| Simple Mode | ⚠️ | ❌ | ✅ | ❌ | ✅✅ |
| Achievements | ✅ | ❌ | ✅✅ | ⚠️ | ✅✅ |

**Legend:** ✅✅ = Critical need | ✅ = Would use | ⚠️ = Might use | ❌ = Doesn't care

---

## Using Personas in Development

### When Building Features
Ask for each persona:
1. Would they understand this feature?
2. Would they need/use it?
3. Does it solve their pain point?
4. Does it match their tech comfort level?

### When Making Decisions
- **Training plans** → Chris needs them (✅✅), Maria would love them (✅✅), Casey doesn't care (❌)
- **AI insights** → Claire and David critical (✅✅), avoid for Casey (❌)
- **Streaks** → Maria and Casey love them (✅✅), Chris doesn't care (❌)

### When Testing UI/UX
- **Claire test:** Can she understand it without explanations?
- **David test:** Can he dig deeper if he wants?
- **Maria test:** Does it feel encouraging and celebratory?
- **Chris test:** Does it have the detail/control he needs?
- **Casey test:** Can she ignore complexity and just swim?

### When Writing Copy
- **For Claire/Maria:** Encouraging, educational, age-appropriate
- **For David/Chris:** Technical, precise, actionable
- **For Casey:** Gentle, non-judgmental, focused on showing up

---

## Persona Prioritization

**Current app likely serves best:** Claire, David, Maria (returned/analytical/beginner swimmers)

**Could serve better:** Chris (needs structured workouts, lap analysis, race features)

**Underserved:** Casey (needs simplified mode, hide metrics, wellness focus)

---

## When to Reference Full Personas

See `docs/personas/personas.md` for:
- Complete demographic details
- Full behavior patterns
- Detailed testing checklists
- Usage scenarios
- Frustration deep-dives
