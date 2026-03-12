// SERVER ONLY — Claude AI client wrapper
// ANTHROPIC_API_KEY must never be exposed to the client bundle.

import Anthropic from '@anthropic-ai/sdk';

let client: Anthropic | null = null;

/**
 * Returns a singleton Anthropic client, or null if the API key is not configured.
 * Safe to call from API routes and server components only.
 */
export function getAnthropicClient(): Anthropic | null {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) return null;

  if (!client) {
    client = new Anthropic({ apiKey });
  }
  return client;
}
