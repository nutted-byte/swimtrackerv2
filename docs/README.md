# 📚 Swimma Documentation

Complete documentation for the Swimma swim tracking and coaching app.

---

## 🚀 Getting Started

**New to Swimma development?** Start here:

1. **[Setup Guide](setup/SETUP.md)** - Complete setup instructions for local development
2. **[Edge Function Setup](setup/EDGE_FUNCTION_SETUP.md)** - Set up AI coaching features (optional)
3. **[Quick Start Guide](quick-start-guide.md)** - Streamlined getting started

**Building components?** See the [Design System](#-design-system) section below.

---

## 🎨 Design System

**Creating or modifying UI components?** Use the design system primitives:

### Quick Start
1. **[Primitives Guide](../src/components/primitives/README.md)** - Complete reference for all primitives
2. **[Component Showcase](http://localhost:3000/components)** - Live examples
3. **[Maintenance Guide](design-system/DESIGN_SYSTEM_MAINTENANCE.md)** - Keep the codebase clean

### Documentation
- **[Design System Overview](design-system/README.md)** - All design system docs in one place
- **[Refactor History](design-system/DESIGN_SYSTEM_REFACTOR.md)** - What was done and why
- **[Remaining Opportunities](design-system/REMAINING_REFACTOR_OPPORTUNITIES.md)** - What's left to do
- **[Component Audit](design-system/COMPONENT_AUDIT.md)** - Initial component inventory

### Tools
- **[Design System Checker](../scripts/check-design-system.sh)** - Optional enforcement script
- **[Scripts Documentation](../scripts/README.md)** - How to use the checker

**Key Rule:** If you're copy-pasting UI markup → use a primitive instead!

---

## 📦 Deployment

**Before deploying to production:**

1. **[Deployment Checklist](deployment/DEPLOYMENT_CHECKLIST.md)** ⚠️ **READ THIS FIRST**
   - Complete pre-deployment checklist
   - Supabase Auth URL configuration
   - Google OAuth settings
   - Netlify environment variables
   - Post-deployment verification

2. **[Pre-Deployment Verification](deployment/PRE_DEPLOY_VERIFY.md)**
   - Automated check script
   - Manual verification steps
   - Quick commands reference

3. **[Local Mobile Testing](deployment/LOCAL_MOBILE_TESTING.md)**
   - Testing on your phone during development
   - Managing local IP vs production URLs
   - Troubleshooting mobile auth issues

**Quick Deploy Command:**
```bash
# Run pre-deploy checks
./scripts/pre-deploy-check.sh

# If all checks pass, deploy
git push origin main
```

---

## 🛠 Development

### Testing & QA

- **[Testing Guide](development/TESTING.md)** - Comprehensive testing procedures for all features
- **[Test Cases Quick Reference](development/TEST_CASES_QUICK_REF.md)** - Quick lookup for common test scenarios
- **[Bug Fixes Log](development/BUG_FIXES.md)** - Known issues and their fixes

### Personas & User Testing

- **[Personas Overview](personas/README.md)** - User personas for testing
- **[User Testing Guide](personas/testing-guide.md)** - How to test with personas
- **[Feature Testing Log 2025](personas/feature-testing-log-2025.md)** - Latest testing results
- **[Historical Testing Log](personas/feature-testing-log.md)** - Previous test results

---

## 🗺 Product Planning

### Roadmap & Features

- **[2025 Roadmap](roadmap/2025-roadmap.md)** - Annual product roadmap
- **[Priority Backlog](roadmap/priority-backlog.md)** - Prioritized feature backlog
- **[Quick Wins](roadmap/quick-wins.md)** - Easy high-impact improvements
- **[Roadmap Overview](roadmap/README.md)** - Roadmap documentation index

### Feature Specifications

- **[Social Sharing Feature](features/SOCIAL_SHARING.md)** - Instagram-ready swim cards
- **[Swimming Technique Guide](features/swimming-technique-feature.md)** - Technique library feature spec
- **[Implementation Roadmap](roadmap/implementation-roadmap.md)** - Detailed implementation plan

---

## 📜 Archive

Completed specs and historical documents:

- **[Mobile Nav Changes](archive/MOBILE_NAV_CHANGES.md)** - Historical mobile navigation refactor
- **[Dashboard Module Spec](archive/dashboard-module-spec.md)** - Original dashboard specification
- **[Dashboard Redesign](archive/dashboard-redesign-detailed.md)** - Dashboard redesign detailed spec
- **[Visual Reference (ASCII)](archive/visual-reference-ascii.md)** - ASCII mockups for reference
- **[Visual Strategy Summary](archive/VISUAL_STRATEGY_SUMMARY.md)** - Overview of visual design approach
- **[Visual Content Strategy](archive/visual-content-strategy.md)** - Detailed visual enhancement plan

---

## 📖 Documentation Guide

### When to Use Each Doc

| Scenario | Document |
|----------|----------|
| Setting up the app locally | [Setup Guide](setup/SETUP.md) |
| Setting up AI features | [Edge Function Setup](setup/EDGE_FUNCTION_SETUP.md) |
| Creating UI components | [Design System](design-system/README.md) |
| Deploying to production | [Deployment Checklist](deployment/DEPLOYMENT_CHECKLIST.md) |
| Testing on your phone | [Local Mobile Testing](deployment/LOCAL_MOBILE_TESTING.md) |
| Running tests | [Testing Guide](development/TESTING.md) |
| Planning new features | [2025 Roadmap](roadmap/2025-roadmap.md) |
| Understanding users | [Personas](personas/README.md) |
| Fixing a bug | [Bug Fixes Log](development/BUG_FIXES.md) |

### Contributing to Docs

**🚨 CRITICAL:** Before creating any documentation, read the [Documentation Organization Rule](../.claude/rules/documentation.md)!

**Golden Rule:** Only `README.md` belongs in the root directory. All other docs go in `docs/` subdirectories.

When updating documentation:

1. **Follow the organization rule** - Use decision tree to determine correct location
2. **Keep it current** - Update docs when you change related code
3. **Link between docs** - Use relative links to connect related info
4. **Archive old content** - Move completed/outdated specs to `archive/`
5. **Update this index** - Add new docs to this README
6. **Test commands** - Verify all command examples work
7. **Check for violations** - Run: `find . -maxdepth 1 -name "*.md" ! -name "README.md"`

**See Also:**
- [Documentation Organization Rule](../.claude/rules/documentation.md) - Comprehensive rules and decision tree
- [Documentation Structure Guide](./DOCUMENTATION_STRUCTURE.md) - Visual overview

---

## 🔗 Quick Links

### External Resources

- **Production Site:** https://swimma.netlify.app
- **Netlify Dashboard:** https://app.netlify.com/sites/swimma
- **Supabase Dashboard:** https://supabase.com/dashboard/project/wfifvskrqesbihwyhpkk
- **Supabase Auth URLs:** https://supabase.com/dashboard/project/wfifvskrqesbihwyhpkk/auth/url-configuration
- **Google Cloud Console:** https://console.cloud.google.com/apis/credentials
- **GitHub Repo:** https://github.com/nutted-byte/swimtrackerv2

### Key Files

- **Root README:** [../README.md](../README.md) - Project overview
- **Setup Guide:** [setup/SETUP.md](setup/SETUP.md) - Local development setup
- **Design System:** [design-system/README.md](design-system/README.md) - Component development guide
- **Netlify Config:** [../netlify.toml](../netlify.toml) - Deployment configuration

---

## 📞 Getting Help

1. Check this documentation index first
2. Search the specific guide for your task
3. Check the archive for historical context
4. Review git history for recent changes

**Remember:** Before deploying, ALWAYS run `./scripts/pre-deploy-check.sh` and check the [Deployment Checklist](deployment/DEPLOYMENT_CHECKLIST.md)!
