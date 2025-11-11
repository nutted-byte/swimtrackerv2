#!/bin/bash
# Design System Compliance Checker
# This script checks for common design system violations

echo "🔍 Checking for design system violations..."

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

VIOLATIONS_FOUND=0

# Files/patterns to exclude (justified custom patterns)
EXCLUDE_FILES=(
  "src/components/primitives/"        # Primitives themselves
  "src/components/LoadingSkeletons"   # Utility component
  "src/components/WeeklySummaryCard"  # Complex business logic
  "src/components/DeepInsightCard"    # Custom circular design
  "src/components/SwimAnalysisPanel"  # Lightweight headers
  "src/components/sharing/SwimShareCard"  # Deferred refactor
  "src/components/SwimInterrogator"   # Unique Q&A interface
)

# Function to check pattern
check_pattern() {
  local pattern=$1
  local message=$2
  local files=$3

  if [ -z "$files" ]; then
    # No files specified, search all JSX files
    files=$(find src/components -name "*.jsx" -type f)
  fi

  # Filter out excluded files
  local filtered_files=""
  for file in $files; do
    local should_exclude=0
    for exclude in "${EXCLUDE_FILES[@]}"; do
      if [[ "$file" == *"$exclude"* ]]; then
        should_exclude=1
        break
      fi
    done
    if [ $should_exclude -eq 0 ]; then
      filtered_files="$filtered_files $file"
    fi
  done

  if [ -z "$filtered_files" ]; then
    return
  fi

  local matches=$(echo "$filtered_files" | xargs grep -l "$pattern" 2>/dev/null || true)

  if [ ! -z "$matches" ]; then
    echo -e "${RED}❌ $message${NC}"
    echo "$matches" | sed 's/^/   /'
    VIOLATIONS_FOUND=1
  fi
}

# Get changed files (if running as pre-commit hook)
CHANGED_FILES=$(git diff --cached --name-only --diff-filter=ACMR | grep '\.jsx$' || true)

if [ -z "$CHANGED_FILES" ]; then
  echo "ℹ️  Running full scan (no git staged changes detected)"
  CHANGED_FILES=""
else
  echo "ℹ️  Checking staged files only"
fi

# Check for manual header markup (should use CardHeader)
echo ""
echo "Checking for manual headers..."
check_pattern "flex items-center gap-[0-9] mb-[0-9]" \
  "Found manual header markup. Use CardHeader primitive instead." \
  "$CHANGED_FILES"

# Check for manual progress bars (should use ProgressBar)
echo "Checking for manual progress bars..."
check_pattern "bg-dark-border rounded-full h-[0-9]" \
  "Found manual progress bar. Use ProgressBar/CircularProgressBar primitive instead." \
  "$CHANGED_FILES"

# Check for manual stat grids (should use StatGrid)
echo "Checking for manual stat grids..."
check_pattern "grid grid-cols-[234].*gap-[0-9]" \
  "Found manual stat grid. Use StatGrid primitive instead." \
  "$CHANGED_FILES"

# Summary
echo ""
if [ $VIOLATIONS_FOUND -eq 0 ]; then
  echo -e "${GREEN}✅ Design system check passed!${NC}"
  echo ""
  exit 0
else
  echo -e "${YELLOW}⚠️  Potential design system patterns detected${NC}"
  echo ""
  echo "📖 Before proceeding, please verify:"
  echo "   1. Are these patterns already using primitives?"
  echo "   2. Are these justified custom patterns?"
  echo "   3. Should these be refactored to use primitives?"
  echo ""
  echo "📚 Documentation:"
  echo "   - Primitives Guide: src/components/primitives/README.md"
  echo "   - Examples: http://localhost:3000/components"
  echo ""
  echo "Note: This check may have false positives. Use your judgment!"
  echo "To commit anyway: git commit --no-verify"
  echo ""
  exit 1
fi
