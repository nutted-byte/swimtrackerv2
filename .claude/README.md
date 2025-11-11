# Claude Code Configuration

This directory contains rules and commands that Claude Code automatically loads in every conversation.

## How Rules Work

Files in `.claude/rules/` are automatically included in Claude's context at the start of every conversation. This means I'll always know about:
- Your project structure
- Testing documentation locations
- Common patterns and conventions
- Important implementation details

## Current Rules

### `rules/testing.md`
- Points to test documentation in `docs/`
- Testing workflow and best practices
- Quick validation commands
- Common test scenarios

### `rules/project-overview.md`
- Project structure and tech stack
- Training plan feature architecture
- Data flow and critical parameters
- Common issues and solutions
- Database schema

### `rules/agents.md`
- Available agents and personas
- When to use each agent
- Agent capabilities and approach
- Example usage patterns
- Best practices for agent invocation

### `rules/personas.md`
- 5 user personas (Claire, David, Maria, Chris, Casey)
- Who each persona is and what they need
- Feature priority matrix by persona
- How to test features for each persona
- When to reference full persona docs

### `rules/deployment.md` ⚠️ CRITICAL
- **REQUIRED checks before ANY production deployment**
- **MUST ask user to verify Supabase Auth URLs manually**
- Deployment procedures and methods
- Post-deployment verification steps
- Common deployment scenarios
- Why this rule exists: Prevent production login failures

### `rules/documentation.md` 🚨 IMPORTANT
- **PREVENTS random markdown files from being created everywhere**
- **Only README.md allowed in project root**
- Decision tree for placing documentation
- Enforcement examples and automated checks
- Where to put setup, feature, testing, and design docs
- Why this rule exists: Keep documentation organized and findable

## Adding New Rules

To add a new rule, create a markdown file in `.claude/rules/`:

```bash
# Create a new rule file
touch .claude/rules/your-rule-name.md
```

Example rule structure:
```markdown
# Feature Name

## Overview
Brief description of what this rule covers

## Key Information
- Important detail 1
- Important detail 2

## Code Patterns
```javascript
// Example code pattern
```

## When to Use
Describe when to reference this information
```

## Best Practices for Rules

### ✅ DO:
- Keep rules focused on specific topics
- Include concrete examples
- Reference actual file paths
- Update rules when patterns change
- Use markdown formatting for clarity

### ❌ DON'T:
- Duplicate information across multiple rules
- Include sensitive information (API keys, credentials)
- Make rules too verbose (keep them scannable)
- Forget to update rules when code changes

## Custom Commands

You can also create custom slash commands in `.claude/commands/`. These are one-off prompts you can trigger with `/command-name`.

Example:
```bash
# Create a test command
echo "Run the smoke test for training plans" > .claude/commands/test-plan.md
```

Then use it:
```
/test-plan
```

## Tips

1. **Keep rules updated**: When you make significant changes, update the relevant rule file
2. **Be specific**: Include actual file paths and function names
3. **Use examples**: Code examples are more helpful than descriptions
4. **Test references**: Make sure file paths in rules are correct

## How This Helps

With these rules, I'll automatically know:
- Where to find test documentation
- How parameters flow through your app
- Common bugs and their fixes
- Project conventions and patterns
- What agents are available and when to use them
- Strategic product management capabilities
- Your 5 user personas and their needs
- How to test features for different user types
- **⚠️ CRITICAL: To always ask about Supabase Auth URLs before deploying**
- **🚨 IMPORTANT: Where to place documentation (never in root except README.md)**

This means you don't need to explain the same context in every conversation!

## Most Important Rules

### 1. Deployment (deployment.md) ⚠️
**The `deployment.md` rule is critical** because:
1. Forgetting to verify Supabase Auth URLs causes production login failures
2. This has happened before and must never happen again
3. The automated script cannot check this - only you (the user) can
4. I (Claude) will always ask you to verify before deploying
5. Even if it seems repetitive - I'll always ask!

### 2. Documentation Organization (documentation.md) 🚨
**The `documentation.md` rule prevents chaos** because:
1. Random markdown files scattered everywhere make docs impossible to find
2. Only `README.md` belongs in the root directory
3. All other docs must go in appropriate `docs/` subdirectories
4. I (Claude) will always check the decision tree before creating docs
5. I'll flag any markdown files in the wrong location!
