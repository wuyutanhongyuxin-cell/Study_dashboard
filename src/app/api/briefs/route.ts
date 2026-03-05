import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { morningBriefs } from '@/lib/db/schema';
import { desc, eq } from 'drizzle-orm';
import { generateBrief } from '@/lib/briefs/generator';
import { validateConfiguredProvider } from '@/lib/ai/auth';
import { getConfiguredProvider } from '@/lib/ai/config';
import { getAIErrorMessage, isAIAuthError } from '@/lib/ai/errors';

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
    await generateBrief(date);
    const brief = db
      .select()
      .from(morningBriefs)
      .where(eq(morningBriefs.date, date))
      .get();

    return NextResponse.json(brief);
  } catch (error: unknown) {
    if (isAIAuthError(error)) {
      return NextResponse.json(
        { error: 'AI provider credential is invalid' },
        { status: 503 }
      );
    }

    return NextResponse.json({ error: getAIErrorMessage(error) }, { status: 500 });
  }
}
