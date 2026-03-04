import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { dailyProgress } from '@/lib/db/schema';
import { eq, gte } from 'drizzle-orm';
import { format, subDays } from 'date-fns';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');
  const range = searchParams.get('range');

  // Single date query
  if (date) {
    const dateStr = date === 'today' ? format(new Date(), 'yyyy-MM-dd') : date;
    const rows = await db
      .select()
      .from(dailyProgress)
      .where(eq(dailyProgress.date, dateStr));

    if (rows.length === 0) {
      return NextResponse.json({
        date: dateStr,
        politicsMinutes: 0,
        englishMinutes: 0,
        mathMinutes: 0,
        majorMinutes: 0,
        totalMinutes: 0,
        mood: null,
        efficiency: null,
      });
    }
    return NextResponse.json(rows[0]);
  }

  // Range queries
  if (range === 'week') {
    const startDate = format(subDays(new Date(), 6), 'yyyy-MM-dd');
    const rows = await db
      .select()
      .from(dailyProgress)
      .where(gte(dailyProgress.date, startDate))
      .orderBy(dailyProgress.date);
    return NextResponse.json(rows);
  }

  if (range === 'year') {
    const startDate = format(subDays(new Date(), 364), 'yyyy-MM-dd');
    const rows = await db
      .select()
      .from(dailyProgress)
      .where(gte(dailyProgress.date, startDate))
      .orderBy(dailyProgress.date);
    return NextResponse.json(rows);
  }

  // No params: return overall subject totals
  const allRows = await db.select().from(dailyProgress);
  const totals = {
    politics: 0,
    english: 0,
    math: 0,
    major: 0,
    total: 0,
  };

  for (const row of allRows) {
    totals.politics += row.politicsMinutes;
    totals.english += row.englishMinutes;
    totals.math += row.mathMinutes;
    totals.major += row.majorMinutes;
    totals.total += row.totalMinutes;
  }

  return NextResponse.json(totals);
}
