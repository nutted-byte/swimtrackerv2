// Authenticated proxy for the OpenAI Responses API.

import { serve } from 'https://deno.land/std@0.168.0/http/server.ts';
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2';

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const defaultModel = 'gpt-5.4-mini';

type ResponseOutput = {
  type: string;
  content?: { type: string; text?: string }[];
};

const json = (body: object, status = 200) => new Response(JSON.stringify(body), {
  status,
  headers: { ...corsHeaders, 'Content-Type': 'application/json' },
});

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response('ok', { headers: corsHeaders });
  }

  if (req.method !== 'POST') {
    return json({ error: 'Method not allowed' }, 405);
  }

  try {
    const authHeader = req.headers.get('Authorization');
    if (!authHeader) {
      return json({ error: 'Unauthorized' }, 401);
    }

    const supabaseClient = createClient(
      Deno.env.get('SUPABASE_URL') ?? '',
      Deno.env.get('SUPABASE_ANON_KEY') ?? '',
      { global: { headers: { Authorization: authHeader } } }
    );

    const { data: { user } } = await supabaseClient.auth.getUser();
    if (!user) {
      return json({ error: 'Unauthorized' }, 401);
    }

    const request = await req.json().catch(() => null);
    const { systemPrompt, userPrompt } = request ?? {};
    if (typeof systemPrompt !== 'string' || !systemPrompt.trim() ||
        typeof userPrompt !== 'string' || !userPrompt.trim()) {
      return json({ error: 'Both systemPrompt and userPrompt are required' }, 400);
    }

    const apiKey = Deno.env.get('OPENAI_API_KEY');
    if (!apiKey) {
      console.error('ask-ai: OPENAI_API_KEY is missing');
      return json({ error: 'AI coaching is temporarily unavailable' }, 503);
    }

    // Model selection stays on the server so older app versions can keep
    // sending requests and clients cannot override the configured models.
    const primaryModel = Deno.env.get('OPENAI_MODEL')?.trim() || defaultModel;
    for (const model of new Set([primaryModel, defaultModel])) {
      const response = await fetch('https://api.openai.com/v1/responses', {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${apiKey}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          instructions: systemPrompt,
          input: userPrompt,
          max_output_tokens: 4000,
          store: false,
        }),
      });

      if (!response.ok) {
        const error = await response.json().catch(() => null);
        console.error('ask-ai: OpenAI request failed', {
          model,
          status: response.status,
          code: error?.error?.code,
          requestId: response.headers.get('x-request-id'),
        });

        if (response.status === 404 || error?.error?.code === 'model_not_found') {
          continue;
        }
        if (response.status === 429) {
          return json({ error: 'AI coaching is busy. Please try again shortly.' }, 429);
        }
        return json({ error: 'AI coaching is temporarily unavailable' }, 502);
      }

      const data = await response.json();
      if (data.status !== 'completed') {
        console.error('ask-ai: OpenAI response did not complete', data.status, data.incomplete_details?.reason);
        return json({ error: 'AI coaching could not complete the response. Please try again.' }, 502);
      }

      const output: ResponseOutput[] = data.output ?? [];
      const content = output
        .filter(item => item.type === 'message')
        .flatMap(item => item.content ?? [])
        .filter(part => part.type === 'output_text')
        .map(part => part.text)
        .join('\n')
        .trim();

      if (!content) {
        return json({ error: 'AI coaching did not return an answer for this request.' }, 502);
      }

      return json({
        content,
        model: data.model,
        fellBack: model !== primaryModel,
        usage: {
          inputTokens: data.usage.input_tokens,
          outputTokens: data.usage.output_tokens,
        },
      });
    }

    return json({ error: 'AI coaching is temporarily unavailable' }, 503);
  } catch (error) {
    console.error('ask-ai: unable to process request', error);
    return json({ error: 'AI coaching is temporarily unavailable' }, 502);
  }
});
