#!/bin/bash

set -e

if ! command -v supabase >/dev/null 2>&1; then
    echo "Install the Supabase CLI before deploying."
    exit 1
fi

secrets=$(supabase secrets list --output json)
if ! grep -Eiq '"name"[[:space:]]*:[[:space:]]*"OPENAI_API_KEY"' <<< "$secrets"; then
    echo "Set OPENAI_API_KEY in the linked project's Supabase Edge Function secrets before deploying."
    exit 1
fi

supabase functions deploy ask-ai --no-verify-jwt
