import Anthropic from '@anthropic-ai/sdk';
import { getConfiguredProvider } from './config';
import { getAIErrorMessage } from './errors';

declare global {
  // eslint-disable-next-line no-var
  var __validatedProviderKeys: Map<string, number> | undefined;
}

const VALIDATION_TTL_MS = 10 * 60 * 1000;

function getValidationCache(): Map<string, number> {
  if (!globalThis.__validatedProviderKeys) {
    globalThis.__validatedProviderKeys = new Map<string, number>();
  }
  return globalThis.__validatedProviderKeys;
}

async function validateDeepseekKey(baseUrl: string, apiKey: string): Promise<void> {
  const url = `${baseUrl.replace(/\/+$/, '')}/v1/models`;
  const resp = await fetch(url, {
    method: 'GET',
    headers: {
      Authorization: `Bearer ${apiKey}`,
    },
  });

  if (!resp.ok) {
    const body = await resp.text();
    throw new Error(`DeepSeek key validation failed (${resp.status}): ${body}`);
  }
}

export async function validateConfiguredProvider(): Promise<void> {
  const config = getConfiguredProvider();
  const cache = getValidationCache();
  const cacheKey = `${config.provider}:${config.apiKey}`;
  const now = Date.now();
  const expiresAt = cache.get(cacheKey) ?? 0;
  if (expiresAt > now) {
    return;
  }

  if (config.provider === 'anthropic') {
    const client = new Anthropic({ apiKey: config.apiKey });
    await client.models.list({ limit: 1 });
    cache.set(cacheKey, now + VALIDATION_TTL_MS);
    return;
  }

  const baseUrl = config.deepseekBaseUrl;
  if (!baseUrl) {
    throw new Error('DeepSeek base URL is missing');
  }

  await validateDeepseekKey(baseUrl, config.apiKey);
  cache.set(cacheKey, now + VALIDATION_TTL_MS);
}

export function getProviderValidationErrorMessage(error: unknown): string {
  return getAIErrorMessage(error);
}
