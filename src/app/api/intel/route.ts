import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { intelItems } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const category = searchParams.get('category');

  if (category && category !== 'all') {
    const items = await db
      .select()
      .from(intelItems)
      .where(eq(intelItems.category, category as 'policy' | 'experience' | 'resource' | 'news'))
      .orderBy(desc(intelItems.createdAt))
      .limit(50);
    return NextResponse.json(items);
  }

  const items = await db
    .select()
    .from(intelItems)
    .orderBy(desc(intelItems.createdAt))
    .limit(50);

  return NextResponse.json(items);
}
