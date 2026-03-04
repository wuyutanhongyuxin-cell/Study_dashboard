import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { knowledgeNodes } from '@/lib/db/schema';
import { eq, asc } from 'drizzle-orm';
import { seedKnowledgeNodes } from '@/lib/knowledge/seed';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const subject = request.nextUrl.searchParams.get('subject');

  let nodes;
  if (subject) {
    nodes = await db
      .select()
      .from(knowledgeNodes)
      .where(eq(knowledgeNodes.subject, subject))
      .orderBy(asc(knowledgeNodes.sortOrder));
  } else {
    nodes = await db
      .select()
      .from(knowledgeNodes)
      .orderBy(asc(knowledgeNodes.sortOrder));
  }

  return NextResponse.json(nodes);
}

export async function POST() {
  const count = await seedKnowledgeNodes();
  return NextResponse.json({ success: true, count });
}
