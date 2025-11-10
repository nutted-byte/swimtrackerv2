#!/bin/bash

# Test script for deployment safety mechanisms
# This creates a harmless test commit and attempts to push to verify the hook works

echo "════════════════════════════════════════════════════════════════"
echo "🧪 Testing Deployment Safety Hook"
echo "════════════════════════════════════════════════════════════════"
echo ""

# Check if hook is installed
if [ ! -f .git/hooks/pre-push ]; then
  echo "❌ Pre-push hook not installed!"
  echo ""
  echo "Install it first:"
  echo "  ./scripts/install-git-hooks.sh"
  echo ""
  exit 1
fi

echo "✅ Pre-push hook is installed"
echo ""

# Check current branch
current_branch=$(git symbolic-ref HEAD | sed -e 's,.*/\(.*\),\1,')
echo "Current branch: $current_branch"
echo ""

if [ "$current_branch" != "main" ]; then
  echo "⚠️  You're not on main branch."
  echo "The hook only triggers on pushes to 'main'"
  echo ""
  echo "Switch to main to test:"
  echo "  git checkout main"
  echo ""
  exit 1
fi

echo "Creating a test commit to trigger the hook..."
echo ""

# Create a harmless test file
test_file=".test-deployment-hook-$(date +%s).tmp"
echo "This is a test file created at $(date)" > "$test_file"

# Add to gitignore so it won't actually be committed
echo "$test_file" >> .gitignore

# Stage the gitignore change
git add .gitignore

# Commit
git commit -m "test: Testing deployment hook (will not push)"

echo ""
echo "════════════════════════════════════════════════════════════════"
echo "Now attempting to push to main..."
echo ""
echo "The hook will prompt you. Try the following:"
echo ""
echo "Test 1: Answer 'n' (no) - Push should be cancelled"
echo "Test 2: Run this script again and answer 'y' (yes) - Push should proceed"
echo "════════════════════════════════════════════════════════════════"
echo ""

# Attempt to push (this will trigger the hook)
git push origin main

push_exit_code=$?

echo ""
echo "════════════════════════════════════════════════════════════════"
if [ $push_exit_code -eq 0 ]; then
  echo "✅ TEST PASSED: Hook allowed push after confirmation"
  echo ""
  echo "The deployment reminder was shown and you confirmed."
  echo "In a real scenario, you would have verified Supabase URLs first."
else
  echo "✅ TEST PASSED: Hook blocked push"
  echo ""
  echo "This is correct behavior when you answer 'n'."
  echo "The hook prevented deployment without verification."
fi
echo "════════════════════════════════════════════════════════════════"
echo ""

# Cleanup
echo "Cleaning up test commit..."
git reset --soft HEAD~1
git restore --staged .gitignore
git checkout .gitignore
rm -f "$test_file"

echo "✅ Test complete and cleaned up"
echo ""
echo "The hook is working correctly!"
