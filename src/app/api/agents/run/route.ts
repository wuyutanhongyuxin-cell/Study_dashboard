import { NextResponse } from 'next/server';
import { runOrchestrator } from '@/lib/agents/orchestrator';
import { validateAnthropicApiKey } from '@/lib/anthropic/auth';
import { getAnthropicErrorMessage, isAnthropicAuthError } from '@/lib/anthropic/errors';

export const runtime = 'nodejs';

export async function POST() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'ANTHROPIC_API_KEY is not configured' },
      { status: 503 }
    );
  }

  try {
    await validateAnthropicApiKey(apiKey);
    const results = await runOrchestrator();
    return NextResponse.json(results);
  } catch (error) {
    console.error('Agent orchestrator error:', error);

    if (isAnthropicAuthError(error)) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY is invalid' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to run agents', details: getAnthropicErrorMessage(error) },
      { status: 500 }
    );
  }
}
