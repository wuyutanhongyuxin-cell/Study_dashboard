import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { studySessions, dailyProgress } from '@/lib/db/schema';
import { desc, like, sql } from 'drizzle-orm';

export const runtime = 'nodejs';

const VALID_SUBJECTS = ['politics', 'english', 'math', 'major'] as const;
type ValidSubject = typeof VALID_SUBJECTS[number];

function isValidSubject(value: unknown): value is ValidSubject {
  return typeof value === 'string' && VALID_SUBJECTS.includes(value as ValidSubject);
}

function isValidDatePrefix(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}$/.test(value);
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');

  if (date) {
    if (!isValidDatePrefix(date)) {
      return NextResponse.json({ error: 'invalid date format, expected YYYY-MM-DD' }, { status: 400 });
    }

    const result = await db
      .select()
      .from(studySessions)
      .where(like(studySessions.startTime, `${date}%`))
      .orderBy(desc(studySessions.createdAt))
      .limit(500);

    return NextResponse.json(result);
  }

  const sessions = await db
    .select()
    .from(studySessions)
    .orderBy(desc(studySessions.createdAt))
    .limit(100);

  return NextResponse.json(sessions);
}

export async function POST(request: NextRequest) {
  const body = await request.json().catch(() => null);
  if (!body || typeof body !== 'object') {
    return NextResponse.json({ error: 'invalid request body' }, { status: 400 });
  }

  const { subject, startTime, endTime, duration } = body as {
    subject?: unknown;
    startTime?: unknown;
    endTime?: unknown;
    duration?: unknown;
  };

  if (!isValidSubject(subject) || typeof startTime !== 'string') {
    return NextResponse.json({ error: 'subject and startTime are required' }, { status: 400 });
  }

  const start = new Date(startTime);
  if (Number.isNaN(start.getTime())) {
    return NextResponse.json({ error: 'invalid startTime' }, { status: 400 });
  }

  if (endTime !== undefined && endTime !== null) {
    if (typeof endTime !== 'string' || Number.isNaN(new Date(endTime).getTime())) {
      return NextResponse.json({ error: 'invalid endTime' }, { status: 400 });
    }
  }

  const parsedDuration = Number(duration ?? 0);
  if (!Number.isFinite(parsedDuration) || parsedDuration < 0) {
    return NextResponse.json({ error: 'invalid duration' }, { status: 400 });
  }

  const durationMinutes = Math.floor(parsedDuration);
  const dateStr = startTime.slice(0, 10); // YYYY-MM-DD

  const result = await db.transaction(async (tx) => {
    const sessionInsert = await tx.insert(studySessions).values({
      subject,
      startTime,
      endTime: endTime ?? null,
      duration: durationMinutes,
    });

    await tx
      .insert(dailyProgress)
      .values({
        date: dateStr,
        totalMinutes: durationMinutes,
        politicsMinutes: subject === 'politics' ? durationMinutes : 0,
        englishMinutes: subject === 'english' ? durationMinutes : 0,
        mathMinutes: subject === 'math' ? durationMinutes : 0,
        majorMinutes: subject === 'major' ? durationMinutes : 0,
      })
      .onConflictDoUpdate({
        target: dailyProgress.date,
        set: {
          totalMinutes: sql`${dailyProgress.totalMinutes} + ${durationMinutes}`,
          politicsMinutes: sql`${dailyProgress.politicsMinutes} + ${subject === 'politics' ? durationMinutes : 0}`,
          englishMinutes: sql`${dailyProgress.englishMinutes} + ${subject === 'english' ? durationMinutes : 0}`,
          mathMinutes: sql`${dailyProgress.mathMinutes} + ${subject === 'math' ? durationMinutes : 0}`,
          majorMinutes: sql`${dailyProgress.majorMinutes} + ${subject === 'major' ? durationMinutes : 0}`,
        },
      });

    return sessionInsert;
  });

  return NextResponse.json({ success: true, id: result.lastInsertRowid });
}
