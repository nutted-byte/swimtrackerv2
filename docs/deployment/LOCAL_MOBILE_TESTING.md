# 📱 Local Mobile Testing Guide

Testing on your phone while developing locally requires special Supabase Auth URL configuration.

## Quick Setup for Mobile Testing

### 1. Find Your Local Network IP

```bash
# On macOS
ipconfig getifaddr en0

# Or check System Settings > Network > Wi-Fi > Details
# Example: 192.168.1.100
```

### 2. Update Supabase Auth URLs

**Go to:** https://supabase.com/dashboard/project/wfifvskrqesbihwyhpkk/auth/url-configuration

Add your local network URLs to **Redirect URLs**:
- `http://192.168.1.100:5173/**` (replace with your IP)
- `http://localhost:5173/**` (keep this)
- `https://swimma.netlify.app/**` (keep for production)

### 3. Start Dev Server

```bash
# Start Vite with network access
npm run dev -- --host
```

### 4. Access from Phone

1. Make sure your phone is on the **same Wi-Fi network**
2. Open browser on phone
3. Navigate to: `http://192.168.1.100:5173` (use your IP)

## Switching Between Local & Production

### For Local Mobile Testing

**Supabase Auth Redirect URLs should include:**
- ✅ `http://192.168.1.100:5173/**` (your local IP)
- ✅ `http://localhost:5173/**`
- ✅ `https://swimma.netlify.app/**`

### For Production Deployment

**Before deploying to production:**

⚠️ **REMINDER: Check which URLs are in Supabase!**

**Supabase Auth Redirect URLs should include:**
- ✅ `https://swimma.netlify.app/**`
- ✅ `http://localhost:5173/**` (for local dev)
- ⚠️ Remove or keep local IP URLs (optional, won't affect production)

## Common Scenarios

### Scenario 1: Testing on Phone Today
```bash
# 1. Find your IP
ipconfig getifaddr en0
# Output: 192.168.1.100

# 2. Add to Supabase: http://192.168.1.100:5173/**

# 3. Start dev server
npm run dev -- --host

# 4. Open on phone: http://192.168.1.100:5173
```

### Scenario 2: Deploying to Production Today
```bash
# 1. Check Supabase Auth URLs include:
#    ✅ https://swimma.netlify.app/**

# 2. Deploy
git push origin main

# 3. Test production: https://swimma.netlify.app
```

### Scenario 3: Your IP Changed (New Day/Network)
```bash
# 1. Find new IP
ipconfig getifaddr en0

# 2. Update Supabase with new IP

# 3. Restart dev server
npm run dev -- --host
```

## Pre-Deployment Reminder Script

Add this to your shell profile (`~/.zshrc` or `~/.bashrc`):

```bash
# Deployment reminder
deploy() {
  echo "🚨 DEPLOYMENT CHECKLIST:"
  echo ""
  echo "1️⃣  Check Supabase Auth URLs:"
  echo "   https://supabase.com/dashboard/project/wfifvskrqesbihwyhpkk/auth/url-configuration"
  echo ""
  echo "   Should include:"
  echo "   ✅ https://swimma.netlify.app/**"
  echo "   ✅ http://localhost:5173/**"
  echo ""
  echo "2️⃣  Run pre-deploy checks:"
  echo "   ./scripts/pre-deploy-check.sh"
  echo ""
  echo "3️⃣  Deploy:"
  echo "   git push origin main"
  echo ""
  read -p "Ready to deploy? (y/n) " -n 1 -r
  echo
  if [[ $REPLY =~ ^[Yy]$ ]]; then
    git push origin main
  fi
}
```

Then just run: `deploy`

## Troubleshooting Mobile Testing

### Issue: Can't access dev server from phone

**Check:**
1. Both devices on same Wi-Fi network
2. Dev server started with `--host` flag
3. Firewall isn't blocking port 5173
4. Using correct IP address (not 127.0.0.1 or localhost)

### Issue: Sign-in fails on mobile

**Check:**
1. Supabase Auth URLs include your local network IP
2. URL in browser matches what's in Supabase exactly
3. No typos in IP address

### Issue: Works on desktop, fails on mobile

**Check:**
1. Mobile using `http://192.168.1.X:5173`, not `http://localhost:5173`
2. Supabase has the mobile URL whitelisted
3. Dev server accessible: `curl http://192.168.1.X:5173` from another device

## Network IP vs Production URL Cheat Sheet

| Context | URL to Use | Supabase Needs |
|---------|-----------|----------------|
| Local desktop dev | `http://localhost:5173` | `http://localhost:5173/**` |
| Local phone testing | `http://192.168.1.X:5173` | `http://192.168.1.X:5173/**` |
| Production testing | `https://swimma.netlify.app` | `https://swimma.netlify.app/**` |

## Quick Commands Reference

```bash
# Find your IP
ipconfig getifaddr en0

# Start dev server for network access
npm run dev -- --host

# Test from command line
curl http://$(ipconfig getifaddr en0):5173

# Deploy to production
git push origin main
```

---

**Pro Tip:** Keep Supabase Auth URL Configuration page bookmarked for quick access!

**Bookmark:** https://supabase.com/dashboard/project/wfifvskrqesbihwyhpkk/auth/url-configuration
