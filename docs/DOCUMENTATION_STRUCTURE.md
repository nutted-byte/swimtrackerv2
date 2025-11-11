# Documentation Structure

**Last Updated:** 2025-11-11

This document provides a visual overview of the documentation organization.

---

## 📁 Directory Structure

```
docs/
├── README.md                          # Main documentation index (START HERE!)
│
├── setup/                             # Setup & Configuration
│   ├── README.md                      # Setup documentation index
│   ├── SETUP.md                       # Complete setup guide
│   └── EDGE_FUNCTION_SETUP.md         # AI features setup
│
├── design-system/                     # Component Development
│   ├── README.md                      # Design system index
│   ├── DESIGN_SYSTEM_MAINTENANCE.md   # How to keep it clean
│   ├── DESIGN_SYSTEM_REFACTOR.md      # Refactor history
│   ├── REMAINING_REFACTOR_OPPORTUNITIES.md  # What's left
│   └── COMPONENT_AUDIT.md             # Initial component inventory
│
├── deployment/                        # Deployment Guides
│   ├── README.md                      # Deployment index
│   ├── DEPLOYMENT_CHECKLIST.md        # Pre-deploy checklist
│   ├── LOCAL_MOBILE_TESTING.md        # Mobile testing guide
│   └── PRE_DEPLOY_VERIFY.md           # Verification script docs
│
├── development/                       # Development & Testing
│   ├── TESTING.md                     # Complete testing guide
│   ├── TEST_CASES_QUICK_REF.md        # Quick test reference
│   └── BUG_FIXES.md                   # Known issues & fixes
│
├── roadmap/                           # Product Planning
│   ├── README.md                      # Roadmap index
│   ├── 2025-roadmap.md                # Annual roadmap
│   ├── priority-backlog.md            # Feature backlog
│   ├── quick-wins.md                  # Quick improvements
│   └── implementation-roadmap.md      # Implementation plan
│
├── features/                          # Feature Specifications
│   ├── SOCIAL_SHARING.md              # Social sharing feature
│   └── swimming-technique-feature.md  # Technique library spec
│
├── personas/                          # User Testing
│   ├── README.md                      # Personas index
│   ├── personas.md                    # User personas
│   ├── testing-guide.md               # Testing guide
│   ├── feature-testing-log-2025.md    # 2025 test results
│   └── feature-testing-log.md         # Historical tests
│
├── archive/                           # Historical Documents
│   ├── dashboard-module-spec.md       # Original dashboard spec
│   ├── dashboard-redesign-detailed.md # Dashboard redesign
│   ├── MOBILE_NAV_CHANGES.md          # Mobile nav refactor
│   ├── visual-reference-ascii.md      # ASCII mockups
│   ├── VISUAL_STRATEGY_SUMMARY.md     # Visual design overview
│   └── visual-content-strategy.md     # Visual enhancement plan
│
└── quick-start-guide.md               # Quick start reference

Other Locations:
├── README.md (root)                   # Project overview
├── src/components/primitives/README.md # Primitives complete guide
├── scripts/README.md                  # Scripts documentation
└── supabase/README.md                 # Supabase setup
```

---

## 🎯 Quick Navigation

### For New Developers
1. [Project README](../README.md) - Start here
2. [Setup Guide](setup/SETUP.md) - Get up and running
3. [Quick Start Guide](quick-start-guide.md) - Streamlined intro
4. [Design System](design-system/README.md) - Component development

### For Contributors
1. [Development Testing](development/TESTING.md) - Testing procedures
2. [Design System Maintenance](design-system/DESIGN_SYSTEM_MAINTENANCE.md) - Keep code clean
3. [Bug Fixes Log](development/BUG_FIXES.md) - Known issues

### For Product/Planning
1. [2025 Roadmap](roadmap/2025-roadmap.md) - Annual plan
2. [Priority Backlog](roadmap/priority-backlog.md) - Feature backlog
3. [Personas](personas/README.md) - User testing

### For Deployment
1. [Deployment Checklist](deployment/DEPLOYMENT_CHECKLIST.md) - Before deploying
2. [Pre-Deploy Verification](deployment/PRE_DEPLOY_VERIFY.md) - Automated checks
3. [Mobile Testing](deployment/LOCAL_MOBILE_TESTING.md) - Test on phone

---

## 📊 Documentation Categories

### Setup & Configuration (docs/setup/)
Everything needed to get the app running locally and configure features.

### Design System (docs/design-system/)
Component development, primitives usage, and maintaining code quality.

### Deployment (docs/deployment/)
Production deployment procedures, checklists, and verification.

### Development (docs/development/)
Testing guides, test cases, and bug tracking.

### Roadmap (docs/roadmap/)
Product planning, feature prioritization, and implementation plans.

### Features (docs/features/)
Detailed specifications for major features.

### Personas (docs/personas/)
User personas and testing procedures.

### Archive (docs/archive/)
Completed specifications and historical documents.

---

## 🔄 Documentation Updates

**🚨 IMPORTANT:** Follow the [Documentation Organization Rule](../.claude/rules/documentation.md) - NO random markdown files allowed!

When you create or update documentation:

1. **Choose the right location:**
   - Setup/config → `docs/setup/`
   - Component development → `docs/design-system/`
   - Deployment → `docs/deployment/`
   - Testing → `docs/development/`
   - Product planning → `docs/roadmap/`
   - Feature specs → `docs/features/`
   - **See decision tree in [documentation rule](../.claude/rules/documentation.md)**

2. **Update indexes:**
   - Add to relevant directory README
   - Update `docs/README.md` if significant
   - Update root `README.md` if top-level

3. **Use relative links:**
   ```markdown
   # From docs/README.md to docs/setup/SETUP.md
   [Setup Guide](setup/SETUP.md)

   # From docs/setup/README.md to docs/design-system/
   [Design System](../design-system/README.md)

   # From anywhere to root README
   [Project README](../README.md)  # or ../../README.md
   ```

4. **Archive when complete:**
   - Move completed/outdated specs to `docs/archive/`
   - Update links in other docs
   - Add to archive section in `docs/README.md`

5. **Check for violations:**
   ```bash
   # Find markdown files in wrong locations
   find . -maxdepth 1 -name "*.md" ! -name "README.md" -type f
   # Should return nothing!
   ```

---

## 📝 File Naming Conventions

- **README.md** - Directory index/overview
- **UPPERCASE.md** - Important reference docs
- **lowercase-with-dashes.md** - Regular documentation
- **feature-name-feature.md** - Feature specifications
- **YYYY-something.md** - Year-specific docs

---

## 🚫 What NOT to Put in docs/

- Code files → belongs in `src/`
- Build artifacts → belongs in `dist/`
- Environment configs → belongs in root (`.env`, `netlify.toml`)
- Git configs → belongs in root (`.gitignore`, `.github/`)
- Package configs → belongs in root (`package.json`, `vite.config.js`)

---

## ✅ Documentation Quality Checklist

- [ ] Clear, descriptive title
- [ ] Date or version info if time-sensitive
- [ ] Table of contents for long docs
- [ ] Links to related documentation
- [ ] Code examples where applicable
- [ ] Tested commands (verify they work!)
- [ ] Updated cross-references
- [ ] Added to appropriate index/README

---

**Last Major Reorganization:** 2025-11-11
- Created `docs/design-system/` directory
- Created `docs/setup/` directory
- Moved scattered root docs into organized structure
- Updated all cross-references
- Created navigation READMEs
