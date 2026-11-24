# AI Edge Function Setup

Swimma sends AI coaching, swim analysis, and training-plan requests to the OpenAI Responses API through the authenticated Supabase `ask-ai` Edge Function.

## Configure Supabase

1. Create a key in your [OpenAI API project](https://platform.openai.com/api-keys).
2. In the target Supabase project's **Edge Functions → Secrets**, add `OPENAI_API_KEY`. The function defaults to `gpt-5.4-mini`. You can set `OPENAI_MODEL` to use another Responses API model.
3. Sign in with the Supabase CLI and link the target project.

   ```bash
   supabase login
   supabase link --project-ref <your-project-ref>
   ```

4. Deploy the Edge Function before publishing the updated frontend.

   ```bash
   ./deploy-edge-function.sh
   ```

The function validates the user's Supabase access token with `auth.getUser()` before calling OpenAI. The deployment script disables the gateway JWT check because the function handles authentication.

Sign into Swimma and try **Ask AI** and **Analyse My Swim**, including a follow-up question. Check the Supabase function logs if a request fails.

## Local development

With a local Supabase stack running, put `OPENAI_API_KEY` in a private env file outside the repo and pass its path to the Edge Function server.

```bash
supabase functions serve ask-ai --env-file /path/to/private.env --no-verify-jwt
```

Set the frontend's `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY` to the values from `supabase status`. The frontend needs only the Supabase connection values.
