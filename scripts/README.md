# Scripts

This directory contains helper scripts for the Swim Tracker project.

## Design System Compliance Checker

**File:** `check-design-system.sh`

This script checks your code for common design system violations and helps maintain code quality.

### What it checks:
- ✅ Manual header markup (should use `CardHeader` primitive)
- ✅ Manual progress bars (should use `ProgressBar`/`CircularProgressBar`)
- ✅ Manual stat grids (should use `StatGrid`)

### Usage:

#### Option 1: Run Manually
```bash
# Check all component files
./scripts/check-design-system.sh

# Check specific files
./scripts/check-design-system.sh src/components/MyComponent.jsx
```

#### Option 2: Enable as Pre-commit Hook (Automated)

**Using Husky (if you have it installed):**
```bash
# Install husky if not already installed
npm install --save-dev husky
npx husky install

# Add pre-commit hook
npx husky add .husky/pre-commit "bash ./scripts/check-design-system.sh"
```

**Manual hook setup (without Husky):**
```bash
# Create git hooks directory if needed
mkdir -p .git/hooks

# Copy the hook
cat > .git/hooks/pre-commit << 'EOF'
#!/bin/bash
bash ./scripts/check-design-system.sh
EOF

# Make it executable
chmod +x .git/hooks/pre-commit
```

#### Option 3: Run Before Push
Add to your workflow:
```bash
# In package.json scripts
{
  "scripts": {
    "check-design": "bash ./scripts/check-design-system.sh",
    "prepush": "npm run check-design"
  }
}
```

### Bypassing the Check

If you need to commit code that legitimately doesn't follow the patterns (rare!):
```bash
git commit --no-verify
```

**⚠️ Note:** Only bypass if you have a good reason (custom patterns, third-party code, etc.)

### Output Examples

**Success:**
```
🔍 Checking for design system violations...
ℹ️  Checking staged files only

Checking for manual headers...
Checking for manual progress bars...
Checking for manual stat grids...

✅ Design system check passed!
```

**Violations Found:**
```
🔍 Checking for design system violations...

❌ Found manual header markup. Use CardHeader primitive instead.
   src/components/MyNewCard.jsx

⚠️  Design system violations found!

📖 Please use design system primitives:
   - See: src/components/primitives/README.md
   - Examples: http://localhost:3000/components
```

## Other Scripts

More scripts may be added here in the future for tasks like:
- Bundle size analysis
- Component testing
- Performance profiling
