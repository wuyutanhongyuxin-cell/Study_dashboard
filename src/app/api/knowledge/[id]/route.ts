import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { knowledgeNodes } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export const runtime = 'nodejs';

export async function PATCH(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const body = await request.json();
  const { status } = body;
  const nodeId = Number.parseInt(id, 10);

  if (!Number.isInteger(nodeId) || nodeId <= 0) {
    return NextResponse.json({ error: 'Invalid node id' }, { status: 400 });
  }

  const validStatuses = ['not_started', 'learning', 'reviewing', 'mastered'];
  if (!validStatuses.includes(status)) {
    return NextResponse.json({ error: 'Invalid status' }, { status: 400 });
  }

  await db
    .update(knowledgeNodes)
    .set({ status })
    .where(eq(knowledgeNodes.id, nodeId));

  const [updated] = await db
    .select()
    .from(knowledgeNodes)
    .where(eq(knowledgeNodes.id, nodeId));

  return NextResponse.json(updated);
}
