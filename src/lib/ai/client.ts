import Anthropic from '@anthropic-ai/sdk';
import { getConfiguredProvider } from './config';
import { getAIErrorMessage } from './errors';
import type { AIMessage } from './types';

interface GenerateTextParams {
  messages: AIMessage[];
  maxTokens: number;
}

interface StreamTextParams {
  messages: AIMessage[];
  maxTokens: number;
  onToken: (token: string) => void;
  onError: (error: unknown) => Promise<void> | void;
  onComplete: () => Promise<void> | void;
}

interface DeepseekChoiceDelta {
  content?: string;
}

interface DeepseekStreamChunk {
  choices?: Array<{ delta?: DeepseekChoiceDelta }>;
}

function splitSystemMessage(messages: AIMessage[]): {
  system: string | undefined;
  userAssistantMessages: Array<{ role: 'user' | 'assistant'; content: string }>;
} {
  const system = messages.find((m) => m.role === 'system')?.content;
  const userAssistantMessages = messages
    .filter((m) => m.role !== 'system')
    .map((m) => ({ role: m.role as 'user' | 'assistant', content: m.content }));
  return { system, userAssistantMessages };
}

async function generateWithAnthropic(
  apiKey: string,
  model: string,
  params: GenerateTextParams
): Promise<string> {
  const client = new Anthropic({ apiKey });
  const { system, userAssistantMessages } = splitSystemMessage(params.messages);
  const response = await client.messages.create({
    model,
    max_tokens: params.maxTokens,
    ...(system ? { system } : {}),
    messages: userAssistantMessages,
  });

  const textParts = response.content
    .filter((item) => item.type === 'text')
    .map((item) => item.text);
  return textParts.join('');
}

async function generateWithDeepseek(
  apiKey: string,
  model: string,
  baseUrl: string,
  params: GenerateTextParams
): Promise<string> {
  const response = await fetch(`${baseUrl.replace(/\/+$/, '')}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: params.messages,
      max_tokens: params.maxTokens,
      stream: false,
    }),
  });

  const bodyText = await response.text();
  if (!response.ok) {
    throw new Error(`DeepSeek API error (${response.status}): ${bodyText}`);
  }

  const parsed = JSON.parse(bodyText) as {
    choices?: Array<{ message?: { content?: string } }>;
  };
  return parsed.choices?.[0]?.message?.content ?? '';
}

async function streamWithAnthropic(
  apiKey: string,
  model: string,
  params: StreamTextParams
): Promise<void> {
  const client = new Anthropic({ apiKey });
  const { system, userAssistantMessages } = splitSystemMessage(params.messages);
  const stream = client.messages.stream({
    model,
    max_tokens: params.maxTokens,
    ...(system ? { system } : {}),
    messages: userAssistantMessages,
  });

  stream.on('text', (text) => {
    params.onToken(text);
  });

  stream.on('error', async (error) => {
    await params.onError(error);
  });

  stream.on('end', async () => {
    await params.onComplete();
  });
}

async function streamWithDeepseek(
  apiKey: string,
  model: string,
  baseUrl: string,
  params: StreamTextParams
): Promise<void> {
  const response = await fetch(`${baseUrl.replace(/\/+$/, '')}/v1/chat/completions`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: params.messages,
      max_tokens: params.maxTokens,
      stream: true,
    }),
  });

  if (!response.ok) {
    const bodyText = await response.text();
    throw new Error(`DeepSeek API error (${response.status}): ${bodyText}`);
  }

  const reader = response.body?.getReader();
  if (!reader) {
    throw new Error('DeepSeek stream body is empty');
  }

  const decoder = new TextDecoder();
  let buffer = '';

  while (true) {
    const { value, done } = await reader.read();
    if (done) {
      buffer += decoder.decode();
    } else {
      buffer += decoder.decode(value, { stream: true });
    }

    let boundaryIndex = buffer.indexOf('\n\n');
    while (boundaryIndex !== -1) {
      const rawEvent = buffer.slice(0, boundaryIndex);
      buffer = buffer.slice(boundaryIndex + 2);
      boundaryIndex = buffer.indexOf('\n\n');

      const dataLines = rawEvent
        .split('\n')
        .filter((line) => line.startsWith('data:'))
        .map((line) => line.slice(5).trimStart());

      if (dataLines.length === 0) {
        continue;
      }

      const payload = dataLines.join('\n');
      if (payload === '[DONE]') {
        await params.onComplete();
        return;
      }

      try {
        const chunk = JSON.parse(payload) as DeepseekStreamChunk;
        const token = chunk.choices?.[0]?.delta?.content;
        if (token) {
          params.onToken(token);
        }
      } catch {
        // Ignore malformed chunks from upstream.
      }
    }

    if (done) {
      await params.onComplete();
      return;
    }
  }
}

export async function generateText(params: GenerateTextParams): Promise<string> {
  const config = getConfiguredProvider();

  if (config.provider === 'anthropic') {
    return generateWithAnthropic(config.apiKey, config.model, params);
  }

  if (!config.deepseekBaseUrl) {
    throw new Error('DeepSeek base URL is missing');
  }

  return generateWithDeepseek(
    config.apiKey,
    config.model,
    config.deepseekBaseUrl,
    params
  );
}

export async function streamText(params: StreamTextParams): Promise<void> {
  const config = getConfiguredProvider();

  try {
    if (config.provider === 'anthropic') {
      await streamWithAnthropic(config.apiKey, config.model, params);
      return;
    }

    if (!config.deepseekBaseUrl) {
      throw new Error('DeepSeek base URL is missing');
    }

    await streamWithDeepseek(
      config.apiKey,
      config.model,
      config.deepseekBaseUrl,
      params
    );
  } catch (error) {
    await params.onError(error);
  }
}

export function formatAIError(error: unknown): string {
  return getAIErrorMessage(error);
}
