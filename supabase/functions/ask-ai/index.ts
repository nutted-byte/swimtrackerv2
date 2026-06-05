// Supabase Edge Function to proxy requests to Anthropic API
// This avoids CORS issues and keeps API key secure on the server

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

serve(async (req) => {
  // Handle CORS preflight
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  try {
    // Verify authentication
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      throw new Error('No authorization header');
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const {
      data: { user },
    } = await supabaseClient.auth.getUser();

    if (!user) {
      throw new Error('Unauthorized');
    }

    // Get request body. `models` is an ordered preference list (new clients);
    // `model` is the legacy single-model field (older clients).
    const { systemPrompt, userPrompt, model, models, maxTokens, temperature } = await req.json();

    // Get Anthropic API key from environment
    const anthropicApiKey = Deno.env.get('ANTHROPIC_API_KEY');
    if (!anthropicApiKey) {
      throw new Error('Anthropic API key not configured');
    }

    // Build the ordered candidate list: caller's preference(s) first, then a
    // hardcoded safety net. De-duped. Use rolling aliases here, never dated
    // snapshots — snapshots get retired and would reintroduce the original bug.
    const DEFAULT_FALLBACKS = ['claude-haiku-4-5', 'claude-sonnet-4-6'];
    const preferred = Array.isArray(models) && models.length > 0
      ? models
      : (model ? [model] : []);
    const candidates = [...new Set([...preferred, ...DEFAULT_FALLBACKS])];

    // Try each candidate. Fall through to the next ONLY when the model itself is
    // gone (404 / not_found_error — i.e. retired or misspelled). For any other
    // error (rate limit, auth, overload, server error) we stop and surface it:
    // switching models there would mask a real problem and waste tokens.
    let lastError = 'No model candidates available';
    for (const candidate of candidates) {
      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': anthropicApiKey,
          'anthropic-version': '2023-06-01',
        },
        body: JSON.stringify({
          model: candidate,
          max_tokens: maxTokens || 4000,
          temperature: temperature ?? 0.3,
          system: systemPrompt,
          messages: [
            {
              role: 'user',
              content: userPrompt,
            },
          ],
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (candidate !== candidates[0]) {
          console.warn(`ask-ai: served by fallback model "${candidate}" (primary "${candidates[0]}" unavailable)`);
        }
        return new Response(
          JSON.stringify({
            content: data.content[0].text,
            model: data.model,
            fellBack: candidate !== candidates[0],
            usage: {
              inputTokens: data.usage.input_tokens,
              outputTokens: data.usage.output_tokens,
            },
          }),
          {
            headers: { ...corsHeaders, 'Content-Type': 'application/json' },
            status: 200,
          }
        );
      }

      const error = await response.json().catch(() => ({}));
      const modelGone = response.status === 404 || error?.error?.type === 'not_found_error';
      if (modelGone) {
        console.warn(`ask-ai: model "${candidate}" unavailable (${error?.error?.type || response.status}) — trying next candidate`);
        lastError = error?.error?.message || `Model ${candidate} not found`;
        continue;
      }

      // Real error — don't burn through the fallback list.
      throw new Error(error?.error?.message || 'Anthropic API request failed');
    }

    // Every candidate was retired/unknown — this should be extremely rare and
    // means the fallback list itself needs updating.
    throw new Error(`All model candidates unavailable. Last error: ${lastError}`);
  } catch (error) {
    return new Response(
      JSON.stringify({
        error: error.message,
      }),
      {
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 400,
      }
    );
  }
});
