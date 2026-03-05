import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { morningBriefs } from '@/lib/db/schema';
import { desc, eq } from 'drizzle-orm';
import { generateBrief } from '@/lib/briefs/generator';
import { validateAnthropicApiKey } from '@/lib/anthropic/auth';
import { isAnthropicAuthError } from '@/lib/anthropic/errors';

export const runtime = 'nodejs';

export async function GET() {
  const briefs = db
    .select()
    .from(morningBriefs)
    .orderBy(desc(morningBriefs.date))
    .all();

  return NextResponse.json(briefs);
}

export async function POST(req: NextRequest) {
  const { date } = await req.json();

  if (!date) {
    return NextResponse.json({ error: 'date is required' }, { status: 400 });
  }

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    return NextResponse.json(
      { error: 'ANTHROPIC_API_KEY is not configured' },
      { status: 503 }
    );
  }

  try {
    await validateAnthropicApiKey(apiKey);
    await generateBrief(date);
    const brief = db
      .select()
      .from(morningBriefs)
      .where(eq(morningBriefs.date, date))
      .get();

    return NextResponse.json(brief);
  } catch (error: unknown) {
    if (isAnthropicAuthError(error)) {
      return NextResponse.json(
        { error: 'ANTHROPIC_API_KEY is invalid' },
        { status: 503 }
      );
    }

    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
