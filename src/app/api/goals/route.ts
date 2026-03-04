import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { goals } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

export const runtime = 'nodejs';

export async function GET() {
  const activeGoals = await db
    .select()
    .from(goals)
    .where(eq(goals.completed, false));

  return NextResponse.json(activeGoals);
}

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { title, type, subject, targetValue, unit, dueDate } = body;

  if (!title || !type) {
    return NextResponse.json({ error: 'title and type are required' }, { status: 400 });
  }

  const result = await db.insert(goals).values({
    title,
    type,
    subject: subject || null,
    targetValue: targetValue || null,
    unit: unit || '分钟',
    dueDate: dueDate || null,
  });

  return NextResponse.json({ success: true, id: result.lastInsertRowid });
}

export async function PATCH(request: NextRequest) {
  const body = await request.json();
  const { id, currentValue, completed } = body;

  if (!id) {
    return NextResponse.json({ error: 'id is required' }, { status: 400 });
  }

  const updateData: Record<string, unknown> = {};
  if (currentValue !== undefined) updateData.currentValue = currentValue;
  if (completed !== undefined) updateData.completed = completed;

  await db
    .update(goals)
    .set(updateData)
    .where(eq(goals.id, id));

  return NextResponse.json({ success: true });
}
