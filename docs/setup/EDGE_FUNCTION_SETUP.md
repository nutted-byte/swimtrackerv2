# Edge Function Setup Guide

The Ask AI feature requires a Supabase Edge Function to proxy requests to Anthropic's API.

## Prerequisites

1. Supabase CLI installed: `npm install -g supabase`
2. Docker Desktop running (required for local development)
3. Anthropic API key from https://console.anthropic.com/

## Setup Steps

### 1. Link Your Supabase Project

```bash
# Login to Supabase
supabase login

# Link to your project
supabase link --project-ref <your-project-ref>
```

You can find your project ref in your Supabase dashboard URL:
`https://app.supabase.com/project/<your-project-ref>`

### 2. Set the Anthropic API Key as a Secret

```bash
# Set the secret (will be used by the Edge Function)
supabase secrets set ANTHROPIC_API_KEY=your_anthropic_api_key_here
```

### 3. Deploy the Edge Function

```bash
# Deploy the ask-ai function
supabase functions deploy ask-ai
```

### 4. Test the Function

The function will be available at:
`https://<your-project-ref>.supabase.co/functions/v1/ask-ai`

You can test it from your app's Ask AI page once deployed.

## Local Development (Optional)

To test the Edge Function locally:

```bash
# Start Supabase locally
supabase start

# Serve the function locally
supabase functions serve ask-ai --env-file .env
```

Then update your `.env` to point to the local function:
```
VITE_SUPABASE_URL=http://localhost:54321
```

## Troubleshooting

### "Function not found" error
- Make sure you've deployed the function: `supabase functions deploy ask-ai`
- Check your project is linked: `supabase projects list`

### "Anthropic API key not configured" error
- Verify the secret is set: `supabase secrets list`
- Make sure the secret name is exactly `ANTHROPIC_API_KEY`

### CORS errors
- The Edge Function handles CORS automatically
- If you still see CORS errors, check that the function deployed successfully

## Cost Considerations

- Edge Functions: Free tier includes 500K invocations/month
- Anthropic API: Claude 3.5 Haiku costs ~$0.25 per million input tokens
- Typical query: ~500-1000 tokens (~$0.0005 per query)

## Security Notes

- API key is stored securely as a Supabase secret (never exposed to browser)
- Function verifies user authentication before processing
- All requests are authenticated via Supabase auth tokens
