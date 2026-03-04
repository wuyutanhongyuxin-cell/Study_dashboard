import { NextResponse } from 'next/server';
import { runOrchestrator } from '@/lib/agents/orchestrator';

export const runtime = 'nodejs';

export async function POST() {
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
