# Feature Testing Guide

> **When to use:** Test EVERY feature before shipping with at least 2 relevant personas. This takes 15-30 min and prevents major UX issues.

---

## Quick Start: 3-Step Process

### Step 1: Pick Personas (2 min)
Look at your feature and check `personas.md` - which 2-3 personas would care about this?

**Example:** You're adding "Streak Tracking"
- ✅ Milestone Maria (loves milestones)
- ✅ Casual Casey (consistency > performance)
- ⚠️ Comeback Claire (might use it)
- ❌ Data-Driven David (doesn't care about streaks)
- ❌ Competitive Chris (focused on performance)

Pick: **Maria** and **Casey** (primary users), maybe **Claire** if you have time.

---

### Step 2: Role-Play Test (10-20 min per persona)
Pretend to BE that persona. Use the app exactly as they would.

**Testing Script:**
1. **Discovery:** Can they find the feature in < 30 seconds?
2. **First Impression:** What do they think it does?
3. **Usage:** Try to use it (think aloud, note confusions)
4. **Value:** Would they use this regularly? Why/why not?

**Take Notes:**
- ✅ What worked well
- ❌ What confused them
- 💡 Ideas for improvement
- 🗣️ Key quotes (what would they say?)

---

### Step 3: Document & Iterate (5 min)
Write findings in `feature-testing-log.md`, make quick fixes, re-test if needed.

---

## Detailed Testing Protocol

### Before Testing: Setup
1. Open `personas.md` and read the relevant persona profile
2. Get in character: think about their goals, frustrations, tech level
3. Clear your mind of "how it's supposed to work" - be a real user

### During Testing: Think Aloud
As the persona, narrate what you're thinking:
- "Okay, I want to see my streak... where would that be?"
- "What does this button do? Not clear..."
- "Oh cool! I like how this shows my progress!"
- "This is confusing, I don't know what SWOLF means"

### Questions to Ask (Per Persona)

**Discovery:**
- Can I find this feature without instructions?
- Is it where I expected it to be?
- Is the entry point obvious?

**Understanding:**
- Do I understand what this does?
- Is the language clear and appropriate for my tech level?
- Are there confusing terms or jargon?

**Usage:**
- Can I complete the task without getting stuck?
- Am I confident I'm doing it right?
- What happens if I make a mistake?

**Value:**
- Does this solve a problem I have?
- Would I use this regularly?
- Does it fit my goals and motivations?

**Emotion:**
- How do I feel using this? (excited, confused, frustrated, proud)
- Does the tone match my expectations?
- Do I feel judged or supported?

---

## Testing Checklists by Persona Type

### For Comeback Claire (Returning Swimmer)
- [ ] Is technical terminology explained?
- [ ] Are there age-appropriate benchmarks?
- [ ] Is the tone encouraging, not judgmental?
- [ ] Does it acknowledge she used to swim competitively?
- [ ] Can she understand her progress quickly?

### For Data-Driven David (Analytical)
- [ ] Can he access detailed data?
- [ ] Are advanced features discoverable?
- [ ] Can he export/query this data?
- [ ] Does it reveal patterns automatically?
- [ ] Is there depth beyond the surface UI?

### For Milestone Maria (Beginner)
- [ ] Are metrics explained in simple terms?
- [ ] Does she feel celebrated for showing up?
- [ ] Can she find her "next milestone" easily?
- [ ] Is progress visualized clearly?
- [ ] Is the tone encouraging for beginners?

### For Competitive Chris (Masters Swimmer)
- [ ] Can he see granular/detailed data?
- [ ] Does it support structured workouts?
- [ ] Are competitive features available?
- [ ] Can he track performance over time?
- [ ] Does it meet his precision needs?

### For Casual Casey (Wellness)
- [ ] Can she use it without feeling judged?
- [ ] Are performance metrics optional/hideable?
- [ ] Does it celebrate consistency over speed?
- [ ] Is the interface simple and calming?
- [ ] Is the tone gentle and supportive?

---

## Common Red Flags to Watch For

### ⚠️ Usability Issues
- Persona can't find the feature in 30 seconds
- Persona doesn't understand what a button does
- Persona gets stuck and doesn't know how to proceed
- Persona misunderstands what the feature is for

### ⚠️ Value Misalignment
- Persona says "I wouldn't use this" or "I don't care about this"
- Feature solves a problem they don't have
- Feature adds complexity without benefit (for that persona)

### ⚠️ Tone/Language Issues
- Too technical for beginner personas (Maria, Casey)
- Too simplified for advanced personas (David, Chris)
- Judgmental language (makes Casey feel bad)
- Missing context (Claire doesn't know if her pace is good)

### ⚠️ Emotional Response
- Persona feels frustrated, stupid, or judged
- Persona feels overwhelmed by complexity
- Persona feels like the app isn't "for them"

---

## Example: Testing "Streak Tracking" Feature

### Testing with Milestone Maria (10 minutes)

**Setup:** Maria is a 28-year-old beginner training for a triathlon. She swims 2x/week and needs motivation.

**Test Scenario:** Maria logs into the app after her swim.

**Testing Notes:**

**Discovery (2 min):**
- ✅ Spotted "5 Day Streak!" immediately on dashboard (big colorful card)
- ✅ Understood what it meant right away
- 🗣️ *"Oh cool, I'm on a streak! That's motivating!"*

**Understanding (3 min):**
- ✅ Understood the streak concept
- ❌ Confused when streak reset after missing 3 days
- 💡 *Clicked on card, expected explanation of rules, found nothing*
- ❌ Doesn't know: Do weekends count? What if I swim every other day?

**Usage (3 min):**
- ✅ Loves seeing "Longest Streak: 12 days" for comparison
- ✅ Likes the "Don't break the chain!" message
- ⚠️ Wants to share streak on Instagram, no option to do that

**Value (2 min):**
- ✅✅ "This would definitely motivate me to swim more!"
- ✅ Would check this after every swim
- 💡 Suggests: notification when streak is at risk

**Emotion:**
- Felt proud and motivated
- Slightly confused by reset (needed explanation)
- Overall: Very positive experience

**Action Items:**
1. Add tooltip explaining streak rules
2. Show "Streak at risk!" if not swum in 2 days
3. Consider: share streak achievement
4. Consider: show "days until next milestone" (10 day streak, 20 day, etc.)

---

### Testing with Casual Casey (8 minutes)

**Setup:** Casey is a 38-year-old parent who swims 1-2x/week for wellness, not performance.

**Test Scenario:** Casey opens app 3 days after last swim.

**Testing Notes:**

**Discovery (1 min):**
- ✅ Saw streak immediately: "3 days ago - streak ended"
- 😟 *"Oh no, I broke my streak... I feel bad now"*

**Understanding (2 min):**
- ✅ Understood the feature
- ❌ **Major issue:** Feature made her feel guilty/judged for not swimming
- 🗣️ *"I already feel bad about not swimming enough, I don't need an app telling me I failed"*

**Usage (2 min):**
- ❌ Wanted to hide this feature, couldn't find setting
- ⚠️ Wished it said "Swam 3 days ago, great job!" instead of "streak ended"

**Value (3 min):**
- ❌ Would NOT use this feature as designed
- 💡 Might like it IF the tone changed
- Suggests: "Total swims this month: 6" instead of streak pressure

**Emotion:**
- Felt judged and guilty
- **Red flag:** Feature has opposite effect for this persona
- Would possibly stop using app if pressured by streak

**Action Items:**
1. **Critical:** Add "Wellness Mode" that hides streak pressure
2. Reframe: "Last swim: 3 days ago" (neutral) vs. "Streak ended" (negative)
3. For Casey persona: show "Total swims" not "streak"
4. Make streak feature opt-in, not default

---

### Summary: Streak Feature Learnings

**What Worked:**
- Highly motivating for goal-oriented users (Maria)
- Clear visual design
- Celebrates consistency

**What Needs Work:**
- Too judgmental for wellness users (Casey)
- Missing explanation of rules
- Need mode that focuses on total activity, not streaks

**Shipping Decision:**
- ✅ Ship for Maria (with rule explanation)
- ❌ Do NOT force on Casey (add wellness mode first)
- Make it **optional/customizable**

---

## Testing Template (Copy This!)

```markdown
## Feature: [Feature Name]
**Date Tested:** [Date]
**Tested By:** [Your Name]

### Tested With:
- [ ] Comeback Claire
- [ ] Data-Driven David
- [ ] Milestone Maria
- [ ] Competitive Chris
- [ ] Casual Casey

---

### [Persona Name]'s Test ([time] minutes)

**Discovery:**
- [ ] Found feature in < 30 seconds?
- Notes:

**Understanding:**
- [ ] Understood what it does?
- Notes:

**Usage:**
- [ ] Completed task without confusion?
- Notes:

**Value:**
- [ ] Would use regularly?
- Notes:

**Emotion:**
- How did they feel?
- Notes:

**Action Items:**
1.
2.
3.

---

### Shipping Decision
- [ ] Ship as-is
- [ ] Ship with changes
- [ ] Do not ship yet
- [ ] Needs mode/toggle for certain personas

**Changes Made:**
1.
2.
```

---

## Quick Tips

**Do:**
- ✅ Test with at least 2 personas before shipping
- ✅ Think aloud during testing
- ✅ Document both successes and failures
- ✅ Look for emotional responses (frustration, delight)
- ✅ Be honest if a feature doesn't work for a persona

**Don't:**
- ❌ Skip testing because "it's a small feature"
- ❌ Test only with personas who would love it
- ❌ Ignore negative feedback
- ❌ Assume you know what users want
- ❌ Test features in isolation (check overall app flow)

---

## When to Test

**Always test:**
- New features (even small ones)
- UI changes to existing features
- Changes to tone/messaging
- Navigation updates

**Optional testing:**
- Bug fixes (unless they change UX)
- Performance improvements (backend)
- Visual polish (colors, spacing)

**Re-test after:**
- Major changes based on first test
- Combining multiple features
- Significant user feedback

---

## Next Steps

Once comfortable with this process:
1. Create test scenarios for each persona (saved test scripts)
2. Record video walk-throughs as personas
3. Share findings with teammates (if applicable)
4. Track patterns in feedback over time
