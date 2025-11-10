# 🚀 Deployment Documentation

Everything you need to safely deploy Swimma to production.

---

## 📋 Pre-Deployment

**Before every production deployment, complete ALL steps:**

### 0. Install Git Hooks (One-Time Setup)

```bash
./scripts/install-git-hooks.sh
```

This installs a pre-push hook that will automatically remind you to check Supabase Auth URLs before every push to main.

### 1. Run Automated Checks

```bash
./scripts/pre-deploy-check.sh
```

This checks:
- ✅ `.env` file configured
- ✅ Dependencies installed
- ✅ Build succeeds
- ✅ Git status clean
- ✅ On correct branch

### 2. Manual Configuration Verification

**⚠️ CRITICAL:** The automated script cannot check these - you must verify manually:

#### Supabase Auth URLs
- [ ] Go to: https://supabase.com/dashboard/project/wfifvskrqesbihwyhpkk/auth/url-configuration
- [ ] Site URL = `https://swimma.netlify.app`
- [ ] Redirect URLs include `https://swimma.netlify.app/**`

#### Google OAuth
- [ ] Go to: https://console.cloud.google.com/apis/credentials
- [ ] Authorized JavaScript origins include `https://swimma.netlify.app`
- [ ] Authorized redirect URIs include Supabase callback URL

#### Netlify Environment Variables
- [ ] Go to: https://app.netlify.com/sites/swimma/settings/deploys#environment
- [ ] `VITE_SUPABASE_URL` is set
- [ ] `VITE_SUPABASE_ANON_KEY` is set

---

## 📚 Documentation

### Complete Guides

1. **[DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md)** - Complete step-by-step checklist
   - Pre-deployment verification
   - Deployment methods
   - Post-deployment testing
   - Rollback procedures

2. **[PRE_DEPLOY_VERIFY.md](PRE_DEPLOY_VERIFY.md)** - Verification scripts and commands
   - Automated check script
   - Manual verification checklist
   - Quick commands reference

3. **[LOCAL_MOBILE_TESTING.md](LOCAL_MOBILE_TESTING.md)** - Testing on your phone
   - Finding your local IP
   - Configuring Supabase for mobile testing
   - Switching between local and production
   - Troubleshooting mobile auth

### Quick Reference

| Task | Document |
|------|----------|
| First time deploying? | [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md) |
| Pre-deploy verification | Run `./scripts/pre-deploy-check.sh` |
| Testing on phone | [LOCAL_MOBILE_TESTING.md](LOCAL_MOBILE_TESTING.md) |
| Deployment failed? | [DEPLOYMENT_CHECKLIST.md](DEPLOYMENT_CHECKLIST.md#rollback-procedure) |

---

## 🚀 Quick Deploy

```bash
# 1. Run checks
./scripts/pre-deploy-check.sh

# 2. Manually verify Supabase Auth URLs (see checklist above)

# 3. Deploy
git push origin main
```

---

## ⚠️ Common Mistakes

### "Redirect URL not allowed" Error

**Cause:** Production URL not in Supabase Auth configuration

**Fix:**
1. Go to Supabase Auth URL Configuration page
2. Add `https://swimma.netlify.app/**` to Redirect URLs
3. Save and wait 1-2 minutes

### "Google OAuth Error"

**Cause:** Production domain not in Google Cloud Console

**Fix:**
1. Go to Google Cloud Console Credentials
2. Add `https://swimma.netlify.app` to Authorized JavaScript origins
3. Save

### Login Works Locally But Not in Production

**Cause:** You've been testing on your phone with local IP and forgot to add production URL

**Fix:**
1. Check Supabase Redirect URLs include both:
   - `http://YOUR_LOCAL_IP:5173/**` (for local testing)
   - `https://swimma.netlify.app/**` (for production) ← **MUST HAVE**
2. Production URL must be present

---

## 🔗 External Links

- **Netlify Deploy Dashboard:** https://app.netlify.com/sites/swimma/deploys
- **Supabase Auth Config:** https://supabase.com/dashboard/project/wfifvskrqesbihwyhpkk/auth/url-configuration
- **Google Cloud Console:** https://console.cloud.google.com/apis/credentials
- **Production Site:** https://swimma.netlify.app

---

**Remember:** The #1 cause of production deployment issues is forgetting to verify Supabase Auth URLs!
