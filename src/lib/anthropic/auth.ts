import Anthropic from '@anthropic-ai/sdk';

declare global {
  // eslint-disable-next-line no-var
  var __anthropicValidatedKeys: Map<string, number> | undefined;
}

const VALIDATION_TTL_MS = 10 * 60 * 1000;

function getValidationCache(): Map<string, number> {
  if (!globalThis.__anthropicValidatedKeys) {
    globalThis.__anthropicValidatedKeys = new Map<string, number>();
  }
  return globalThis.__anthropicValidatedKeys;
}

export async function validateAnthropicApiKey(apiKey: string): Promise<void> {
  const cache = getValidationCache();
  const now = Date.now();
  const expiresAt = cache.get(apiKey) ?? 0;
  if (expiresAt > now) {
    return;
  }

  const client = new Anthropic({ apiKey });
  await client.models.list({ limit: 1 });
  cache.set(apiKey, now + VALIDATION_TTL_MS);
}
