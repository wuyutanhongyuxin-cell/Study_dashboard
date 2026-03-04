import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { morningBriefs } from '@/lib/db/schema';
import { desc, eq } from 'drizzle-orm';
import { generateBrief } from '@/lib/briefs/generator';

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
    await generateBrief(date);
    const brief = db
      .select()
      .from(morningBriefs)
      .where(eq(morningBriefs.date, date))
      .get();

    return NextResponse.json(brief);
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : 'Unknown error';
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
