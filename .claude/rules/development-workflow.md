# Development Workflow Rules

## 🚨 CRITICAL: After Making Code Changes

**ALWAYS check and ensure the dev server is running after making changes to the site.**

### When to Check the Dev Server

After completing ANY of these actions:
- ✅ Editing React components (`.jsx`, `.tsx` files)
- ✅ Modifying styles (CSS, Tailwind classes)
- ✅ Updating utility functions or hooks
- ✅ Changing configuration files (unless explicitly stopping the server)
- ✅ Adding new dependencies
- ✅ Modifying routing or app structure

### How to Check and Start the Dev Server

**Step 1: Check if server is running**
```bash
lsof -ti:3000
```

**Step 2: If not running, start it**
```bash
npm run dev
```
Use `run_in_background: true` parameter so work can continue while server starts.

**Step 3: Verify server started successfully**
```bash
# Check the output using BashOutput tool
# Look for: "Local: http://localhost:3000/"
```

**Step 4: Inform the user**
Tell the user the server is ready:
> "✅ Dev server is now running at **http://localhost:3000/**"

Or if it was already running:
> "✅ Dev server is already running at **http://localhost:3000/**"

### Why This Rule Exists

1. **User expects to see changes immediately** - If the server isn't running, they can't view their updates
2. **Prevents frustration** - No more "404" or "connection refused" errors when testing
3. **Smoother workflow** - Keeps the development loop tight and efficient
4. **Consistency** - Like the deployment and design-system rules, this ensures reliable behavior across sessions

### Example Workflow

```
User: "Update the header color to blue"

Claude:
1. ✅ Updates component with new color
2. ✅ Checks if dev server is running (lsof -ti:3000)
3. ✅ Starts server if needed (npm run dev)
4. ✅ Confirms: "✅ Dev server is running at http://localhost:3000/"
```

### Exceptions

**DO NOT start the dev server when:**
- User explicitly asks to stop it
- Running production build (`npm run build`)
- Running tests that conflict with dev server
- User is only asking questions (no code changes made)
- Only reading/searching files (no modifications)

### Server Management Commands

**Start server:**
```bash
npm run dev
```

**Check if running:**
```bash
lsof -ti:3000
```

**Stop server (if needed):**
```bash
lsof -ti:3000 | xargs kill
```

**View server output:**
Use the BashOutput tool with the background process ID

## Integration with Other Rules

This rule works alongside:
- **Design System Rules** (`.claude/rules/design-system.md`) - After updating styles, verify in browser
- **Deployment Rules** (`.claude/rules/deployment.md`) - Test locally before deploying
- **Testing Rules** (`.claude/rules/testing.md`) - Run dev server for manual testing

## Remember

**The user created this rule because they want a seamless development experience. Always ensure the server is running so they can immediately see their changes in the browser.**
