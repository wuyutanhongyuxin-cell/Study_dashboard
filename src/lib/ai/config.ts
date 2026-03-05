import type { AIProvider } from './types';

export interface ResolvedProviderConfig {
  provider: AIProvider;
  apiKey: string;
  model: string;
  deepseekBaseUrl?: string;
}

function normalizeProvider(raw: string | undefined): AIProvider | null {
  if (!raw) {
    return null;
  }

  const value = raw.trim().toLowerCase();
  if (value === 'anthropic') {
    return 'anthropic';
  }
  if (value === 'deepseek') {
    return 'deepseek';
  }
  return null;
}

export function getConfiguredProvider(): ResolvedProviderConfig {
  const envProvider = normalizeProvider(process.env.AI_PROVIDER);
  const anthropicKey = process.env.ANTHROPIC_API_KEY?.trim();
  const deepseekKey = process.env.DEEPSEEK_API_KEY?.trim();

  const provider: AIProvider =
    envProvider ??
    (deepseekKey && !anthropicKey ? 'deepseek' : 'anthropic');

  if (provider === 'anthropic') {
    if (!anthropicKey) {
      throw new Error(
        'AI provider credentials are not configured. Set ANTHROPIC_API_KEY or switch AI_PROVIDER to deepseek with DEEPSEEK_API_KEY.'
      );
    }

    return {
      provider,
      apiKey: anthropicKey,
      model: process.env.ANTHROPIC_MODEL?.trim() || 'claude-sonnet-4-20250514',
    };
  }

  if (!deepseekKey) {
    throw new Error(
      'AI provider credentials are not configured. Set DEEPSEEK_API_KEY for AI_PROVIDER=deepseek.'
    );
  }

  return {
    provider,
    apiKey: deepseekKey,
    model: process.env.DEEPSEEK_MODEL?.trim() || 'deepseek-chat',
    deepseekBaseUrl:
      process.env.DEEPSEEK_BASE_URL?.trim() || 'https://api.deepseek.com',
  };
}
