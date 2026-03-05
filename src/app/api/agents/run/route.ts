import { NextResponse } from 'next/server';
import { runOrchestrator } from '@/lib/agents/orchestrator';

export const runtime = 'nodejs';

export async function POST() {
  if (!process.env.ANTHROPIC_API_KEY) {
    return NextResponse.json(
      { error: 'ANTHROPIC_API_KEY is not configured' },
      { status: 503 }
    );
  }

  try {
    const results = await runOrchestrator();
    return NextResponse.json(results);
  } catch (error) {
    console.error('Agent orchestrator error:', error);
    return NextResponse.json(
      { error: 'Failed to run agents', details: String(error) },
      { status: 500 }
    );
  }
}
