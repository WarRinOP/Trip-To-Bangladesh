// SERVER ONLY — Streaming AI Itinerary API Route
// Exception to Server Actions rule: streaming requires ReadableStream.

import { NextRequest, NextResponse } from 'next/server';
import { getAnthropicClient } from '@/lib/anthropic';
import { itineraryRequestSchema, BUDGET_OPTIONS, GROUP_TYPE_OPTIONS, DESTINATION_OPTIONS } from '@/lib/itinerary';
import { Ratelimit } from '@upstash/ratelimit';
import { Redis } from '@upstash/redis';
import { createClient } from '@supabase/supabase-js';

// ─── Rate Limiters ──────────────────────────────────────
function getIpRatelimit() {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    return new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(10, '1 d'),
      analytics: true,
      prefix: 'itinerary_ip',
    });
  }
  return null;
}

function getGlobalRatelimit() {
  if (process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN) {
    return new Ratelimit({
      redis: Redis.fromEnv(),
      limiter: Ratelimit.slidingWindow(500, '1 d'),
      analytics: true,
      prefix: 'itinerary_global',
    });
  }
  return null;
}

// ─── Supabase client (anon key, server-side) ────────────
function getSupabaseClient() {
  return createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );
}

// ─── Build Claude System Prompt ─────────────────────────
function buildSystemPrompt(toursJson: string): string {
  return `You are the AI travel planner for "Trip to Bangladesh" — a premium, Lonely Planet-recognized travel agency founded in 2000 by Mahmud Hasan Khan.

You create rich, day-by-day itineraries for international travelers visiting Bangladesh. Your tone is warm, editorial, and knowledgeable — like a National Geographic writer who has spent decades in Bangladesh.

RULES:
1. Every itinerary must be practical and realistic
2. Naturally recommend our real tours where relevant (provided below)
3. Never invent tour names or prices that don't match our offerings
4. Include accommodation type appropriate to the budget level
5. Include estimated daily cost that realistically matches the budget
6. Suggest the best travel season based on destinations
7. Include packing suggestions specific to the destinations
8. If requested duration exceeds 21 days, cap the itinerary at 21 days and note this in the summary field
9. Output ONLY valid JSON matching the schema below — no markdown, no commentary outside the JSON

OUTPUT JSON SCHEMA:
{
  "title": "string — creative itinerary title",
  "summary": "string — 2 sentence overview",
  "bestTimeToVisit": "string — recommended months",
  "totalEstimatedCost": number,
  "packingSuggestions": ["string"],
  "days": [
    {
      "day": number,
      "title": "string — day title",
      "description": "string — 2-3 sentences",
      "activities": ["string"],
      "accommodation": "string — hotel type",
      "estimatedCost": number,
      "tourRecommendation": {
        "slug": "string — our tour slug or null",
        "reason": "string — why this tour fits"
      } | null
    }
  ]
}

OUR AVAILABLE TOURS:
${toursJson}`;
}

// ─── Build User Message ─────────────────────────────────
function buildUserMessage(
  duration: number,
  budget: string,
  groupType: string,
  destinations: string[]
): string {
  const budgetOption = BUDGET_OPTIONS.find((b) => b.value === budget);
  const groupOption = GROUP_TYPE_OPTIONS.find((g) => g.value === groupType);
  const destLabels = destinations.map(
    (d) => DESTINATION_OPTIONS.find((opt) => opt.value === d)?.label ?? d
  );

  return `Create a ${duration}-day Bangladesh itinerary for:
- Budget: ${budgetOption?.label ?? budget} (${budgetOption?.range ?? 'varies'})
- Group: ${groupOption?.label ?? groupType}
- Destinations: ${destLabels.join(', ')}`;
}

// ─── POST Handler ───────────────────────────────────────
export async function POST(request: NextRequest) {
  // 0. Check Claude is available
  console.log('[Itinerary] Key present:', !!process.env.ANTHROPIC_API_KEY);
  const anthropic = getAnthropicClient();
  if (!anthropic) {
    console.error('[Itinerary] ANTHROPIC_API_KEY missing — returning 503');
    return NextResponse.json(
      { error: 'AI itinerary generator is not available. Please contact us directly.', comingSoon: true },
      { status: 503 }
    );
  }

  // 1. Parse & validate body
  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid request body' }, { status: 400 });
  }

  const parsed = itineraryRequestSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: 'Invalid input', details: parsed.error.flatten().fieldErrors },
      { status: 400 }
    );
  }

  const { duration, budget, groupType, destinations } = parsed.data;

  // 2. Rate limit — per IP
  const ip = request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ?? '127.0.0.1';
  const ipLimiter = getIpRatelimit();
  if (ipLimiter) {
    const { success } = await ipLimiter.limit(`itinerary_${ip}`);
    if (!success) {
      return NextResponse.json(
        {
          error: "You've reached the daily limit of 10 itinerary generations. Try again tomorrow, or contact us on WhatsApp.",
          whatsappUrl: `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '8801795622000'}`,
        },
        { status: 429 }
      );
    }
  }

  // 3. Rate limit — global (after IP check)
  const globalLimiter = getGlobalRatelimit();
  if (globalLimiter) {
    const { success } = await globalLimiter.limit('itinerary_global');
    if (!success) {
      return NextResponse.json(
        {
          error: 'Our AI planner is experiencing high demand. Please try again later or contact us on WhatsApp.',
          whatsappUrl: `https://wa.me/${process.env.NEXT_PUBLIC_WHATSAPP_NUMBER ?? '8801795622000'}`,
        },
        { status: 429 }
      );
    }
  }

  // 4. Fetch matching tours from Supabase
  let toursJson = '[]';
  try {
    const supabase = getSupabaseClient();
    const slugsToMatch = destinations.includes('surprise-me')
      ? ['sundarbans', 'coxs-bazar', 'dhaka', 'village-life', 'hill-tracts', 'coastal-bangladesh']
      : destinations;

    const { data: tours } = await supabase
      .from('tours')
      .select('title, slug, description, price, duration_days, inclusions')
      .eq('is_active', true)
      .in('slug', slugsToMatch);

    if (tours && tours.length > 0) {
      toursJson = JSON.stringify(tours);
    }
  } catch {
    // Tours fetch failure is non-fatal — Claude can still generate without them
  }

  // 5. Stream Claude response
  try {
    const stream = await anthropic.messages.stream({
      model: 'claude-3-5-sonnet-20241022',
      max_tokens: 4096,
      system: buildSystemPrompt(toursJson),
      messages: [
        {
          role: 'user',
          content: buildUserMessage(duration, budget, groupType, destinations),
        },
      ],
    });

    // Convert Anthropic SDK stream to a ReadableStream for the browser
    const encoder = new TextEncoder();
    const readable = new ReadableStream({
      async start(controller) {
        try {
          for await (const event of stream) {
            if (
              event.type === 'content_block_delta' &&
              event.delta.type === 'text_delta'
            ) {
              controller.enqueue(encoder.encode(event.delta.text));
            }
          }
          controller.close();
        } catch (err) {
          console.error('[Itinerary stream error]', err);
          controller.error(err);
        }
      },
    });

    return new Response(readable, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (err) {
    console.error('[Anthropic API error]', err);
    return NextResponse.json(
      { error: 'Our AI planner is taking a break. Please contact us on WhatsApp.' },
      { status: 500 }
    );
  }
}
