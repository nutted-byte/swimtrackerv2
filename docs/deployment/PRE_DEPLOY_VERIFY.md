# Pre-Deployment Verification Script

Run this checklist **before every production deployment** to catch configuration issues.

## Quick Verification Commands

Copy and run these commands to verify your setup:

### 1. Verify Environment Variables Locally

```bash
# Check .env file exists and has required vars
if [ -f .env ]; then
  echo "✅ .env file exists"
  grep -q "VITE_SUPABASE_URL" .env && echo "✅ VITE_SUPABASE_URL found" || echo "❌ VITE_SUPABASE_URL missing"
  grep -q "VITE_SUPABASE_ANON_KEY" .env && echo "✅ VITE_SUPABASE_ANON_KEY found" || echo "❌ VITE_SUPABASE_ANON_KEY missing"
else
  echo "❌ .env file not found!"
fi
```

### 2. Verify Build Success

```bash
# Test production build
npm run build

# If successful, check output
if [ -d "dist" ]; then
  echo "✅ Build successful - dist/ directory created"
  echo "📦 Bundle size:"
  du -sh dist/
else
  echo "❌ Build failed - no dist/ directory"
fi
```

### 3. Check Git Status

```bash
# Verify no uncommitted changes
git status --short

# If output is empty, you're good
# If output shows files, commit them first
```

### 4. Verify Netlify CLI Connection (Optional)

```bash
# Check Netlify site link
npx netlify-cli status
```

## Manual Verification Checklist

Print this out or keep it open while deploying:

```
☐ 1. SUPABASE AUTH URLs
   ☐ Open: https://supabase.com/dashboard/project/wfifvskrqesbihwyhpkk/auth/url-configuration
   ☐ Site URL = https://swimma.netlify.app
   ☐ Redirect URLs include swimma.netlify.app

☐ 2. GOOGLE OAUTH
   ☐ Open: https://console.cloud.google.com/apis/credentials
   ☐ Authorized origins include swimma.netlify.app
   ☐ Authorized redirects include supabase callback

☐ 3. NETLIFY ENV VARS
   ☐ Open: https://app.netlify.com/sites/swimma/settings/deploys#environment
   ☐ VITE_SUPABASE_URL exists
   ☐ VITE_SUPABASE_ANON_KEY exists
   ☐ OPENAI_API_KEY exists in Supabase Edge Function secrets (for AI features)

☐ 4. BUILD TEST
   ☐ Run: npm run build
   ☐ No errors
   ☐ dist/ folder created

☐ 5. GIT READY
   ☐ All changes committed
   ☐ On main branch
   ☐ Ready to push
```

## Automated Pre-Deploy Check Script

Save this as `scripts/pre-deploy-check.sh`:

```bash
#!/bin/bash

echo "🔍 Running pre-deployment checks..."
echo ""

# Color codes
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

errors=0

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
fi

# Check 3: Git status
echo ""
echo "3️⃣  Checking git status..."
if [ -z "$(git status --porcelain)" ]; then
  echo -e "${GREEN}✅ No uncommitted changes${NC}"
else
  echo -e "${YELLOW}⚠️  Uncommitted changes found:${NC}"
  git status --short
fi

# Check 4: Current branch
echo ""
echo "4️⃣  Checking git branch..."
branch=$(git branch --show-current)
if [ "$branch" = "main" ]; then
  echo -e "${GREEN}✅ On main branch${NC}"
else
  echo -e "${YELLOW}⚠️  On branch: $branch (should be main for production)${NC}"
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
  echo -e "${RED}❌ Build failed${NC}"
  errors=$((errors+1))
fi

# Summary
echo ""
echo "━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━"
if [ $errors -eq 0 ]; then
  echo -e "${GREEN}✅ All checks passed! Ready to deploy.${NC}"
  echo ""
  echo "Next steps:"
  echo "1. Verify Supabase Auth URLs manually"
  echo "2. Verify Google OAuth settings manually"
  echo "3. Verify Netlify env vars manually"
  echo "4. Run: git push origin main"
else
  echo -e "${RED}❌ $errors error(s) found. Fix them before deploying.${NC}"
  exit 1
fi
```

## Usage

```bash
# Make script executable
chmod +x scripts/pre-deploy-check.sh

# Run before every deployment
./scripts/pre-deploy-check.sh

# If all checks pass, deploy:
git push origin main
```

## Post-Deployment Verification

After Netlify deployment completes (check https://app.netlify.com/sites/swimma/deploys):

```bash
# Test production site is up
curl -I https://swimma.netlify.app

# Should return: HTTP/2 200
```

Then manually test:
1. Open https://swimma.netlify.app in private/incognito window
2. Try to sign in with Google
3. Upload a swim session
4. Verify data loads correctly

---

**Remember:** These checks catch code issues, but Supabase/Google OAuth must be verified manually!
