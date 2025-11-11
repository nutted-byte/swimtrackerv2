# Documentation Organization Rules

**Purpose:** Maintain a clean, organized documentation structure.

**Last Updated:** 2025-11-11

---

## 🚨 CRITICAL RULE: No Random Markdown Files!

**NEVER create markdown files in random locations!** All documentation must be placed in the correct location based on its purpose.

### Allowed Locations for Markdown Files

#### ✅ Root Directory (ONLY)
- `README.md` - Project overview (this is the ONLY markdown file allowed in root)

#### ✅ Documentation Directories

**docs/setup/** - Setup and configuration guides
- Initial setup instructions
- Environment configuration
- Authentication setup
- Database setup
- Edge functions/API setup
- **Examples:** `SETUP.md`, `EDGE_FUNCTION_SETUP.md`, `DATABASE_SETUP.md`

**docs/design-system/** - Component development and design system
- Primitive component guides
- Design system maintenance
- Component refactoring documentation
- Component audits
- **Examples:** `DESIGN_SYSTEM_REFACTOR.md`, `COMPONENT_AUDIT.md`, `STYLING_GUIDE.md`

**docs/deployment/** - Deployment procedures and checklists
- Deployment checklists
- Pre-deployment verification
- Production deployment guides
- Mobile testing guides
- **Examples:** `DEPLOYMENT_CHECKLIST.md`, `PRODUCTION_DEPLOY.md`, `MOBILE_TESTING.md`

**docs/development/** - Development workflows and testing
- Testing guides
- Test case references
- Bug tracking
- Development workflows
- Code review guidelines
- **Examples:** `TESTING.md`, `BUG_FIXES.md`, `CODE_REVIEW.md`

**docs/roadmap/** - Product planning and roadmaps
- Annual/quarterly roadmaps
- Feature prioritization
- Implementation plans
- Quick wins
- **Examples:** `2025-roadmap.md`, `priority-backlog.md`, `Q1-plan.md`

**docs/features/** - Feature specifications
- Detailed feature specs
- Feature proposals
- Technical designs for features
- **Examples:** `social-sharing-feature.md`, `ai-coaching-feature.md`

**docs/personas/** - User research and testing
- User personas
- Testing procedures
- User testing logs
- **Examples:** `personas.md`, `testing-guide.md`, `feature-testing-log-2025.md`

**docs/archive/** - Historical and completed documentation
- Completed feature specs
- Outdated documentation
- Historical references
- **Examples:** Old specs, superseded designs, completed refactors

#### ✅ Special Locations

**src/components/primitives/** - Component-specific documentation
- `README.md` - Primitives usage guide (ONLY markdown file allowed here)

**scripts/** - Script documentation
- `README.md` - Scripts usage guide (ONLY markdown file allowed here)

**supabase/** - Supabase-specific documentation
- `README.md` - Supabase setup (ONLY markdown file allowed here)

**.claude/** - Claude Code configuration
- Agent definitions
- Rules (like this file)
- Claude-specific configs

---

## 📋 Decision Tree: Where Should My Markdown Go?

```
1. Is this the project README?
   YES → Root: README.md
   NO  → Continue to step 2

2. What type of documentation is this?

   ├─ Setup/Configuration Guide?
   │  → docs/setup/
   │
   ├─ Component Development/Design System?
   │  → docs/design-system/
   │
   ├─ Deployment Procedure?
   │  → docs/deployment/
   │
   ├─ Testing/Development Workflow?
   │  → docs/development/
   │
   ├─ Product Planning/Roadmap?
   │  → docs/roadmap/
   │
   ├─ Feature Specification?
   │  → docs/features/
   │
   ├─ User Research/Testing?
   │  → docs/personas/
   │
   ├─ Historical/Completed Spec?
   │  → docs/archive/
   │
   ├─ Component Usage Guide?
   │  → src/components/[component-name]/README.md
   │
   ├─ Script Documentation?
   │  → scripts/README.md
   │
   └─ Supabase Setup?
      → supabase/README.md

3. Still not sure?
   → Ask yourself: "What would a developer search for to find this?"
   → Place it in the most logical category
   → Update the relevant directory's README.md
```

---

## ❌ FORBIDDEN Locations

**NEVER place markdown files in:**

- ❌ Root directory (except README.md)
- ❌ `src/` (except component READMEs)
- ❌ `public/`
- ❌ `dist/` or `build/`
- ❌ Random subdirectories without purpose
- ❌ Temporary or working directories

---

## ✅ When Creating New Documentation

### Required Steps:

1. **Determine the category** using the decision tree above

2. **Choose descriptive filename:**
   - Use lowercase-with-dashes for regular docs: `feature-name.md`
   - Use UPPERCASE for important references: `SETUP.md`, `TESTING.md`
   - Include year for time-specific docs: `2025-roadmap.md`
   - Be specific: `social-sharing-feature.md` not `feature.md`

3. **Create the file in the correct location:**
   ```bash
   # ✅ CORRECT
   touch docs/features/new-feature.md

   # ❌ WRONG
   touch NEW_FEATURE.md  # Don't put in root!
   touch src/new-feature.md  # Don't put in src!
   ```

4. **Add to directory README:**
   - Update `docs/[category]/README.md` with link to new doc
   - Add one-line description

5. **Update main docs index if significant:**
   - Add to `docs/README.md` if it's a major document
   - Update relevant sections

6. **Use proper document structure:**
   ```markdown
   # Document Title

   **Purpose:** Clear one-line purpose
   **Last Updated:** YYYY-MM-DD

   ---

   ## Overview
   [Content...]

   ## [Sections...]
   ```

---

## 🔍 Enforcement

### When Writing/Editing Files:

**Before creating ANY markdown file, ask:**
1. ❓ "Does a similar doc already exist?" → Update it instead
2. ❓ "Where would someone look for this?" → Place it there
3. ❓ "Is this the root README?" → Only then put in root
4. ❓ "Is this temporary?" → Don't create it as markdown

### When Reviewing Code:

**If you see a markdown file in the wrong location:**
1. 🚫 Stop and flag it immediately
2. 📁 Determine correct location using decision tree
3. 🔄 Move file to correct location
4. 🔗 Update all references to the file
5. 📝 Update relevant README indexes

### Automated Check:

```bash
# Check for markdown files in forbidden locations
find . -maxdepth 1 -name "*.md" ! -name "README.md" -type f

# If this returns any files → WRONG! Move them to docs/
```

---

## 📚 Examples

### ✅ CORRECT Examples:

```
# Feature specification
docs/features/ai-coaching-feature.md

# Setup guide
docs/setup/DATABASE_SETUP.md

# Testing documentation
docs/development/E2E_TESTING.md

# Deployment checklist
docs/deployment/PRE_PRODUCTION_CHECKLIST.md

# Design system maintenance
docs/design-system/COMPONENT_GUIDELINES.md

# Product roadmap
docs/roadmap/2026-q1-roadmap.md

# Historical spec
docs/archive/old-dashboard-spec.md

# Component guide
src/components/primitives/README.md
```

### ❌ WRONG Examples:

```
# ❌ Random file in root
./FEATURE_SPEC.md
→ Should be: docs/features/feature-name.md

# ❌ File in src without purpose
./src/TESTING.md
→ Should be: docs/development/TESTING.md

# ❌ File in wrong category
docs/deployment/USER_PERSONAS.md
→ Should be: docs/personas/user-personas.md

# ❌ File with bad name
docs/features/doc.md
→ Should be: docs/features/descriptive-feature-name.md

# ❌ Duplicate documentation
docs/setup/setup-guide.md (when SETUP.md already exists)
→ Should be: Update existing docs/setup/SETUP.md
```

---

## 🆘 Special Cases

### Temporary Documentation?
**Don't create it as a markdown file!**
- Use code comments
- Use PR descriptions
- Use inline documentation
- Use project management tool

### API Documentation?
**Use JSDoc comments in code, not separate markdown**
```javascript
/**
 * Calculate swim pace
 * @param {number} distance - Distance in meters
 * @param {number} duration - Duration in seconds
 * @returns {number} Pace in seconds per 100m
 */
```

### Component Documentation?
**Two options:**
1. Component usage → `src/components/[component]/README.md`
2. Design system → `docs/design-system/[topic].md`

### Meeting Notes or Decisions?
**Wrong tool!** Use:
- GitHub Issues for decisions
- PR descriptions for changes
- Project management tool for notes

---

## 📊 Maintenance

### Weekly Check:
```bash
# Find markdown files in wrong locations
find . -maxdepth 1 -name "*.md" ! -name "README.md"
find src -name "*.md" ! -path "*/components/*/README.md"

# Should return nothing!
```

### Monthly Audit:
1. Review `docs/` structure
2. Check for outdated documentation → move to archive
3. Verify README indexes are up to date
4. Ensure all links work

### When Restructuring:
1. Create migration plan
2. Move files
3. Update ALL cross-references
4. Update ALL README indexes
5. Test all links
6. Document the change in `docs/DOCUMENTATION_STRUCTURE.md`

---

## 🎯 Summary

### The Golden Rules:

1. **Only ONE markdown file in root:** `README.md`
2. **All other docs → `docs/` subdirectories**
3. **Use decision tree to determine location**
4. **Update README indexes when adding docs**
5. **Use descriptive, specific filenames**
6. **Archive old docs instead of deleting**
7. **When in doubt, ask: "Where would someone search for this?"**

### Quick Checklist:

Before committing any markdown file:
- [ ] Is this README.md in root? (If no, move to docs/)
- [ ] Have I placed it in the correct docs/ subdirectory?
- [ ] Have I updated the directory's README.md?
- [ ] Have I used a descriptive filename?
- [ ] Are all links using relative paths?
- [ ] Did I check for duplicate/similar docs?

---

## 🚨 Violation Examples & Fixes

### Violation 1: File in Root
```bash
# ❌ WRONG
./DEPLOYMENT_GUIDE.md

# ✅ FIX
mv DEPLOYMENT_GUIDE.md docs/deployment/
# Update docs/deployment/README.md
# Update links in docs/README.md
```

### Violation 2: Wrong Category
```bash
# ❌ WRONG
docs/development/feature-spec.md

# ✅ FIX
mv docs/development/feature-spec.md docs/features/
# Update docs/features/README.md
# Update any references
```

### Violation 3: Bad Filename
```bash
# ❌ WRONG
docs/features/doc.md

# ✅ FIX
mv docs/features/doc.md docs/features/social-sharing-feature.md
# Update any references
```

---

**Remember:** A well-organized documentation structure makes it easy for developers to find information quickly. When in doubt, follow the decision tree!

**See also:**
- [Documentation Structure Guide](../docs/DOCUMENTATION_STRUCTURE.md)
- [Main Docs Index](../docs/README.md)
