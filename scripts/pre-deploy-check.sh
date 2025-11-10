#!/bin/bash

echo "🔍 Running pre-deployment checks..."
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

errors=0
warnings=0

# Check 1: .env file
echo "1️⃣  Checking .env file..."
if [ -f .env ]; then
  if grep -q "VITE_SUPABASE_URL" .env && grep -q "VITE_SUPABASE_ANON_KEY" .env; then
    echo -e "${GREEN}✅ .env file configured${NC}"
  else
    echo -e "${RED}❌ .env file missing required variables${NC}"
    errors=$((errors+1))
  fi
else
  echo -e "${RED}❌ .env file not found${NC}"
  errors=$((errors+1))
fi

# Check 2: Node modules
echo ""
echo "2️⃣  Checking node_modules..."
if [ -d "node_modules" ]; then
  echo -e "${GREEN}✅ Dependencies installed${NC}"
else
  echo -e "${YELLOW}⚠️  node_modules not found, run: npm install${NC}"
  warnings=$((warnings+1))
fi

# Check 3: Git status
echo ""
echo "3️⃣  Checking git status..."
if [ -z "$(git status --porcelain)" ]; then
  echo -e "${GREEN}✅ No uncommitted changes${NC}"
else
  echo -e "${YELLOW}⚠️  Uncommitted changes found:${NC}"
  git status --short
  warnings=$((warnings+1))
fi

# Check 4: Current branch
echo ""
echo "4️⃣  Checking git branch..."
branch=$(git branch --show-current)
if [ "$branch" = "main" ]; then
  echo -e "${GREEN}✅ On main branch${NC}"
else
  echo -e "${YELLOW}⚠️  On branch: $branch (should be main for production)${NC}"
  warnings=$((warnings+1))
fi

# Check 5: Build test
echo ""
echo "5️⃣  Testing build..."
if npm run build > /dev/null 2>&1; then
  echo -e "${GREEN}✅ Build successful${NC}"
  if [ -d "dist" ]; then
    size=$(du -sh dist/ | cut -f1)
    echo -e "${GREEN}   Bundle size: $size${NC}"
  fi
else
  echo -e "${RED}❌ Build failed - check npm run build for errors${NC}"
  errors=$((errors+1))
fi

# Summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

# Critical reminder
echo -e "${BLUE}🚨 CRITICAL: Manual checks required!${NC}"
echo ""
echo "📍 Check Supabase Auth URLs:"
echo "   https://supabase.com/dashboard/project/wfifvskrqesbihwyhpkk/auth/url-configuration"
echo ""
echo "   Must include:"
echo "   ✅ Site URL: https://swimma.netlify.app"
echo "   ✅ Redirect URLs: https://swimma.netlify.app/**"
echo ""
echo -e "${YELLOW}⚠️  If you've been testing on your phone with local IP,${NC}"
echo -e "${YELLOW}   verify production URLs are still in Supabase!${NC}"
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
echo ""

if [ $errors -eq 0 ]; then
  echo -e "${GREEN}✅ All automated checks passed!${NC}"
  if [ $warnings -gt 0 ]; then
    echo -e "${YELLOW}⚠️  $warnings warning(s) - review above${NC}"
  fi
  echo ""
  echo "Next steps:"
  echo "1. ✅ Manually verify Supabase Auth URLs (link above)"
  echo "2. ✅ Verify Google OAuth settings"
  echo "3. ✅ Verify Netlify env vars"
  echo "4. 🚀 Deploy: git push origin main"
  echo ""
  exit 0
else
  echo -e "${RED}❌ $errors error(s) found. Fix them before deploying.${NC}"
  echo ""
  exit 1
fi
