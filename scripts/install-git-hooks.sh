#!/bin/bash

# Install git hooks for Swimma
# Run this after cloning the repo: ./scripts/install-git-hooks.sh

echo "Installing git hooks..."

# Create pre-push hook
cat > .git/hooks/pre-push << 'EOF'
#!/bin/bash

# Pre-push hook to remind about Supabase Auth URL verification
# This prevents accidental production deployments without checking Supabase config

# Get the remote and URL
remote="$1"
url="$2"

# Only run for pushes to main branch
current_branch=$(git symbolic-ref HEAD | sed -e 's,.*/\(.*\),\1,')

if [ "$current_branch" = "main" ]; then
  echo ""
  echo "════════════════════════════════════════════════════════════════"
  echo "🚨 PRODUCTION DEPLOYMENT REMINDER 🚨"
  echo "════════════════════════════════════════════════════════════════"
  echo ""
  echo "You are pushing to 'main' which triggers a production deployment."
  echo ""
  echo "Have you verified Supabase Auth URL Configuration?"
  echo ""
  echo "🔗 https://supabase.com/dashboard/project/wfifvskrqesbihwyhpkk/auth/url-configuration"
  echo ""
  echo "Required settings:"
  echo "  ✅ Site URL = https://swimma.netlify.app"
  echo "  ✅ Redirect URLs include https://swimma.netlify.app/**"
  echo ""
  echo "This is ESPECIALLY important if you've been testing on your phone"
  echo "with a local IP address!"
  echo ""
  echo "════════════════════════════════════════════════════════════════"
  echo ""
  read -p "Have you verified the Supabase Auth URLs? (y/n) " -n 1 -r
  echo ""

  if [[ ! $REPLY =~ ^[Yy]$ ]]; then
    echo ""
    echo "❌ Push cancelled. Please verify Supabase Auth URLs first."
    echo ""
    echo "See: docs/deployment/DEPLOYMENT_CHECKLIST.md"
    echo ""
    exit 1
  fi

  echo ""
  echo "✅ Proceeding with deployment to production..."
  echo ""
fi

exit 0
EOF

# Make hook executable
chmod +x .git/hooks/pre-push

echo "✅ Git hooks installed successfully!"
echo ""
echo "The pre-push hook will now remind you to verify Supabase Auth URLs"
echo "before every deployment to production (main branch)."
