import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { morningBriefs } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export const runtime = 'nodejs';

export async function GET(
  req: NextRequest,
  { params }: { params: { date: string } }
) {
  const brief = db
    .select()
    .from(morningBriefs)
    .where(eq(morningBriefs.date, params.date))
    .get();

  if (!brief) {
    return NextResponse.json({ error: 'Brief not found' }, { status: 404 });
  }

  return NextResponse.json(brief);
}
