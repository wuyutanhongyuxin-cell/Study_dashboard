import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { knowledgeNodes } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export const runtime = 'nodejs';

export async function PATCH(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const { id } = await params;
  const body = await request.json();
  const { status } = body;

  const validStatuses = ['not_started', 'learning', 'reviewing', 'mastered'];
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  await db
    .update(knowledgeNodes)
    .set({ status })
    .where(eq(knowledgeNodes.id, parseInt(id)));

  const [updated] = await db
    .select()
    .from(knowledgeNodes)
    .where(eq(knowledgeNodes.id, parseInt(id)));

  return NextResponse.json(updated);
}
