# 🚀 Deployment Checklist

**IMPORTANT: Complete ALL items before deploying to production!**

## Pre-Deployment Checklist

### 1. Supabase Auth URL Configuration ⚠️ CRITICAL

**Location:** https://supabase.com/dashboard/project/wfifvskrqesbihwyhpkk/auth/url-configuration

⚠️ **ALWAYS CHECK THIS BEFORE DEPLOYING!**
- If you've been testing on mobile with local IP, you may need to verify these URLs

- [ ] **Site URL** set to: `https://swimma.netlify.app`
- [ ] **Redirect URLs** include:
  - [ ] `https://swimma.netlify.app/**` ← **MUST HAVE FOR PRODUCTION**
  - [ ] `http://localhost:5173/**` (for local dev)
  - [ ] Remove any local network IPs if not needed: `http://192.168.X.X:5173/**`
- [ ] **Additional Redirect URLs** include:
  - [ ] `https://swimma.netlify.app/auth/callback`
  - [ ] `https://swimma.netlify.app`

📱 **Note:** If you've been testing on your phone locally, see `docs/LOCAL_MOBILE_TESTING.md` for URL management.

### 2. Google Cloud Console OAuth Settings

**Location:** https://console.cloud.google.com/apis/credentials

- [ ] **Authorized JavaScript origins** include:
  - [ ] `https://swimma.netlify.app`
  - [ ] `http://localhost:5173` (for local dev)
- [ ] **Authorized redirect URIs** include:
  - [ ] `https://wfifvskrqesbihwyhpkk.supabase.co/auth/v1/callback`

### 3. Netlify Environment Variables

**Location:** https://app.netlify.com/sites/swimma/settings/deploys#environment

- [ ] `VITE_SUPABASE_URL` is set to: `https://wfifvskrqesbihwyhpkk.supabase.co`
- [ ] `VITE_SUPABASE_ANON_KEY` is set (check it's the correct anon key)
- [ ] `VITE_ANTHROPIC_API_KEY` is set (for AI features)

### 4. Supabase Edge Functions (for Ask AI feature)

- [ ] Edge function `ask-ai` is deployed
- [ ] Secret `ANTHROPIC_API_KEY` is set in Supabase
- [ ] Test the function works in production

### 5. Build & Code Quality

- [ ] `npm run build` completes successfully with no errors
- [ ] No console errors in production build
- [ ] All tests pass (if applicable)
- [ ] No hardcoded API keys or secrets in code

### 6. Git & GitHub

- [ ] All changes committed to git
- [ ] Commit message follows convention
- [ ] Push to `main` branch (triggers Netlify deploy)
- [ ] No `.env` file committed to git

## Deployment Methods

### Method 1: GitHub Integration (Recommended ✅)

This is the primary deployment method since Netlify is connected to your GitHub repo.

```bash
# 1. Commit your changes
git add -A
git commit -m "feat: your commit message"

# 2. Push to main branch (triggers automatic Netlify deploy)
git push origin main

# 3. Monitor deployment at:
# https://app.netlify.com/sites/swimma/deploys
```

### Method 2: Netlify CLI (Fallback)

Only use if GitHub integration is broken.

```bash
# 1. Build the project
npm run build

# 2. Deploy to production
npx netlify-cli deploy --prod --dir=dist
```

## Post-Deployment Verification

After deployment completes (~2 minutes):

### 1. Test Authentication
- [ ] Visit https://swimma.netlify.app
- [ ] Sign out (if signed in)
- [ ] Click "Continue with Google"
- [ ] Verify redirect back to app works
- [ ] Verify dashboard loads correctly

### 2. Test Core Features
- [ ] Upload a swim session (TCX/FIT/CSV)
- [ ] View dashboard statistics
- [ ] Navigate to Records page
- [ ] Navigate to Insights page
- [ ] Test Ask AI feature (if edge function deployed)
- [ ] Test social sharing feature

### 3. Check Console Logs
- [ ] Open browser DevTools console
- [ ] Navigate through the app
- [ ] Verify no errors in console
- [ ] Check for any warnings to fix

### 4. Mobile Testing
- [ ] Test on mobile device or responsive view
- [ ] Verify mobile navigation works
- [ ] Check touch interactions
- [ ] Verify share feature works on mobile

## Rollback Procedure

If deployment causes issues:

1. **Via Netlify Dashboard:**
   - Go to https://app.netlify.com/sites/swimma/deploys
   - Find the last working deploy
   - Click "Publish deploy" to rollback

2. **Via Git:**
   ```bash
   # Revert the last commit
   git revert HEAD
   git push origin main
   ```

## Common Issues & Solutions

### Issue: "Redirect URL not allowed"
**Solution:** Check Supabase Auth URL Configuration (Section 1 above)

### Issue: "Google OAuth error"
**Solution:** Verify Google Cloud Console settings (Section 2 above)

### Issue: Build fails in Netlify
**Solution:**
- Check build logs in Netlify dashboard
- Verify environment variables are set
- Test build locally: `npm run build`

### Issue: Edge Functions not working
**Solution:**
- Check Edge Function is deployed in Supabase
- Verify `ANTHROPIC_API_KEY` secret is set
- Check function logs in Supabase dashboard

## Critical URLs Reference

- **Production Site:** https://swimma.netlify.app
- **Netlify Dashboard:** https://app.netlify.com/sites/swimma
- **Supabase Dashboard:** https://supabase.com/dashboard/project/wfifvskrqesbihwyhpkk
- **Google Cloud Console:** https://console.cloud.google.com/apis/credentials
- **GitHub Repo:** https://github.com/nutted-byte/swimtrackerv2

---

**Remember:** Always test in a staging environment first if making major changes!
