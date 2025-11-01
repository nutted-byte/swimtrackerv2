# Available Agents & Personas

## Swimma Product Strategist

**Agent File**: `.claude/agents/swimma-product-strategist.md`

⚠️ **IMPORTANT**: This agent uses significant tokens. **ALWAYS ASK the user before invoking it.** Never automatically use it.

### When to Use This Agent

Use the swimma-product-strategist agent for strategic product management guidance:

#### ✅ Feature Validation
When the user wants to validate a new feature idea:
```
User: "I'm thinking about adding [feature]. What do you think?"
You: Use Task tool with swimma-product-strategist agent
```

#### ✅ Roadmap Planning
When the user needs help prioritizing features or planning roadmaps:
```
User: "Help me prioritize these features: [list]"
User: "I'm planning our Q2 roadmap"
User: "I need to present our roadmap to investors"
You: Use Task tool with swimma-product-strategist agent
```

#### ✅ Data Analysis
When the user wants to analyze usage patterns or metrics:
```
User: "Can you analyze our user engagement data?"
User: "What features should we focus on based on usage?"
You: Use Task tool with swimma-product-strategist agent
```

#### ✅ Feature Ideation
When the user is brainstorming new features:
```
User: "What are some innovative features we could consider?"
User: "What would make Swimma stand out from competitors?"
You: Use Task tool with swimma-product-strategist agent
```

### Agent Capabilities

The Swimma Product Strategist specializes in:

1. **Roadmap Development**: Creating strategic, prioritized product roadmaps with clear themes, milestones, and success metrics

2. **Data Analysis**: Examining usage data, behavior patterns, engagement metrics to extract actionable insights

3. **Idea Validation**: Evaluating feature proposals using frameworks like:
   - RICE scoring (Reach, Impact, Confidence, Effort)
   - Value vs. Complexity matrices
   - User story mapping
   - Competitive analysis
   - Market fit assessment

4. **Feature Ideation**: Generating innovative, user-centered feature ideas that:
   - Solve real swimmer and coach problems
   - Differentiate Swimma in the market
   - Align with product vision and strategy
   - Are technically feasible and scalable

### Agent Approach

**Strategic Thinking**: Connects tactical decisions to broader product strategy

**User-Centric**: Considers different user segments:
- Competitive swimmers
- Recreational swimmers
- Age group swimmers
- Masters swimmers
- Coaches
- Team administrators

**Data-Informed**: Makes data-driven recommendations with explicit assumptions

**Structured Analysis**: Provides clear recommendations with:
- Problem/opportunity clarification
- Key assumptions and constraints
- Multi-perspective analysis
- Success metrics
- Risk mitigation strategies

### Roadmap Framework Used

The agent organizes roadmaps into:
- **Now** (0-3 months): High-impact, well-defined initiatives
- **Next** (3-6 months): Important features requiring validation
- **Later** (6-12 months): Strategic bets and exploratory initiatives
- **Backlog**: Ideas worth tracking but not yet prioritized

### Example Usage

```
User: "I want to add a social sharing feature where users can share their swim workouts on social media."

You: This sounds like a strategic product decision. Would you like me to use the swimma-product-strategist agent to analyze this feature? (Note: It uses significant tokens)

User: "Yes, please"

[Then use Task tool with swimma-product-strategist]
```

### When NOT to Use This Agent

❌ Technical implementation questions → Handle directly
❌ Bug fixes or code debugging → Handle directly
❌ Simple feature additions without strategic discussion → Handle directly
❌ UI/UX design details → Handle directly (or suggest separate design discussion)

Use this agent specifically for **strategic product decisions**, **feature validation**, **roadmap planning**, and **data-driven insights**.

## Adding More Agents

To add new agents/personas:

1. Create agent file: `.claude/agents/your-agent-name.md`
2. Follow the agent file format:
   ```markdown
   ---
   name: your-agent-name
   description: When to use this agent...
   model: sonnet
   ---

   [Agent persona and instructions]
   ```
3. Update this rule file to document the new agent
4. Test the agent with example prompts

## Agent Best Practices

- **ALWAYS ASK FIRST** - Never automatically invoke agents (they use significant tokens)
- **Suggest, don't assume** - Offer to use the agent and explain the cost
- **Be specific** about when to invoke agents
- **Include context** in agent prompts when approved
- **Wait for agent completion** before continuing
- **Summarize agent output** for the user
- **Don't overuse agents** for simple tasks
- **Handle directly when possible** - Only use agents for truly strategic/complex decisions
