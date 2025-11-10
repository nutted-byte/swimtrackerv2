# Deployment Rules & Procedures

## 🚨 CRITICAL: Before ANY Production Deployment

**You MUST follow these steps EVERY TIME before deploying to production:**

### 1. Run Pre-Deploy Script
```bash
./scripts/pre-deploy-check.sh
```

### 2. ASK USER: Verify Supabase Auth URLs

**ALWAYS ask the user this question before deploying:**

> "Before deploying, have you verified the Supabase Auth URL Configuration?
>
> Please check: https://supabase.com/dashboard/project/wfifvskrqesbihwyhpkk/auth/url-configuration
>
> Confirm that:
> - Site URL = https://swimma.netlify.app
> - Redirect URLs include https://swimma.netlify.app/**
>
> This is especially important if you've been testing on your phone with a local IP address."

**WHY THIS IS CRITICAL:**
- If production URL is missing from Supabase, users cannot sign in on production
- This is the #1 cause of production deployment failures
- The user has been burned by this before
- The automated script cannot verify this - only the user can check manually

### 3. Deployment Method

**Primary Method (via GitHub):**
```bash
git push origin main
```
This triggers automatic Netlify deployment.

**DO NOT use Netlify CLI** unless explicitly requested or GitHub integration is broken.

### 4. Post-Deployment Verification

After deployment completes (~2 minutes):
1. Ask user to test login at https://swimma.netlify.app
2. Verify no console errors
3. Test core features (upload, dashboard, insights)

## Common Deployment Scenarios

### Scenario: User says "deploy to production" or "deploy to netlify"

**Your Response:**
1. "Before deploying, let me run the pre-deployment checks."
2. Run `./scripts/pre-deploy-check.sh`
3. **ASK the Supabase Auth URL verification question (see above)**
4. Wait for user confirmation
5. Only then: `git push origin main`

### Scenario: User has been testing on their phone

**Extra Warning:**
> "I see you may have been testing on your phone with a local IP. This is especially important to verify that the production URL (https://swimma.netlify.app/**) is still in the Supabase Redirect URLs, alongside any local IPs you added for testing."

Reference: `docs/deployment/LOCAL_MOBILE_TESTING.md`

### Scenario: Build or deployment fails

**Debugging Steps:**
1. Check build errors: `npm run build`
2. Review Netlify build logs
3. Check environment variables are set in Netlify
4. Verify Supabase and Google OAuth configs
5. Reference: `docs/deployment/DEPLOYMENT_CHECKLIST.md`

## Documentation References

- **Full Checklist:** `docs/deployment/DEPLOYMENT_CHECKLIST.md`
- **Mobile Testing:** `docs/deployment/LOCAL_MOBILE_TESTING.md`
- **Verification:** `docs/deployment/PRE_DEPLOY_VERIFY.md`
- **Deployment Docs Hub:** `docs/deployment/README.md`

## Git Commit Messages for Deployments

When committing deployment-related changes, use these prefixes:
- `deploy:` - Deployment configuration changes
- `fix:` - Bug fixes before deployment
- `docs:` - Documentation updates (don't require re-verification)
- `feat:` - New features (require full verification)

## Never Deploy Without

1. ✅ Running `./scripts/pre-deploy-check.sh`
2. ✅ **Explicitly asking user to verify Supabase Auth URLs**
3. ✅ Confirming user has checked the URLs
4. ✅ All tests passing (if applicable)
5. ✅ Build succeeds locally

## Remember

**The user has set up this rule because forgetting to check Supabase Auth URLs has caused production issues before. Take this seriously and always ask, even if it seems repetitive.**
