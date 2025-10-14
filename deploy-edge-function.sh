#!/bin/bash

# Deployment script for Ask AI Edge Function
# Run this script to deploy the Supabase Edge Function

set -e

echo "🚀 Deploying Ask AI Edge Function to Supabase"
echo ""

# Check if Supabase CLI is installed
if ! command -v supabase &> /dev/null; then
    echo "❌ Supabase CLI not found"
    echo "Install with: brew install supabase/tap/supabase"
    echo "Or: npm install -g supabase"
    exit 1
fi

echo "✅ Supabase CLI installed"
echo ""

# Check if logged in
if ! supabase projects list &> /dev/null; then
    echo "📝 You need to login to Supabase first"
    echo "Run: supabase login"
    echo ""
    echo "After logging in, run this script again."
    exit 1
fi

echo "✅ Logged in to Supabase"
echo ""

# Check if project is linked
if [ ! -f ".supabase/config.toml" ]; then
    echo "❌ Project not linked"
    echo ""
    echo "Link your project with:"
    echo "  supabase link --project-ref <your-project-ref>"
    echo ""
    echo "Find your project ref at: https://app.supabase.com/project/_/settings/general"
    exit 1
fi

echo "✅ Project linked"
echo ""

# Prompt for API key
echo "🔑 Setting up Anthropic API key"
read -p "Enter your Anthropic API key: " API_KEY

if [ -z "$API_KEY" ]; then
    echo "❌ API key is required"
    exit 1
fi

echo ""
echo "Setting Anthropic API key as Supabase secret..."
supabase secrets set ANTHROPIC_API_KEY="$API_KEY"

echo ""
echo "✅ API key configured"
echo ""

# Deploy the function
echo "📦 Deploying ask-ai Edge Function..."
supabase functions deploy ask-ai --no-verify-jwt

echo ""
echo "✅ Edge Function deployed successfully!"
echo ""
echo "🎉 Ask AI feature is now ready to use!"
echo "   Navigate to http://localhost:3000/ask to try it out"
echo ""
