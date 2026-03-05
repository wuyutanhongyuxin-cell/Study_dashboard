import { NextResponse } from 'next/server';
import { runOrchestrator } from '@/lib/agents/orchestrator';
import { validateConfiguredProvider } from '@/lib/ai/auth';
import { getAIErrorMessage, isAIAuthError } from '@/lib/ai/errors';
import { getConfiguredProvider } from '@/lib/ai/config';

export const runtime = 'nodejs';

export async function POST() {
  try {
    getConfiguredProvider();
  } catch (error) {
    return NextResponse.json(
      { error: getAIErrorMessage(error) },
      { status: 503 }
    );
  }

  try {
    await validateConfiguredProvider();
    const results = await runOrchestrator();
    return NextResponse.json(results);
  } catch (error) {
    console.error('Agent orchestrator error:', error);

    if (isAIAuthError(error)) {
      return NextResponse.json(
        { error: 'AI provider credential is invalid' },
        { status: 503 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to run agents', details: getAIErrorMessage(error) },
      { status: 500 }
    );
  }
}
