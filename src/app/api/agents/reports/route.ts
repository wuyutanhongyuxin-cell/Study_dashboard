import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { agentReports } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');

  if (date) {
    const reports = await db
      .select()
      .from(agentReports)
      .where(eq(agentReports.date, date))
      .orderBy(desc(agentReports.createdAt));
    return NextResponse.json(reports);
  }

  const reports = await db
    .select()
    .from(agentReports)
    .orderBy(desc(agentReports.createdAt))
    .limit(50);

  return NextResponse.json(reports);
}
