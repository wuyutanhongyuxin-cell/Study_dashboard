import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { studySessions, dailyProgress } from '@/lib/db/schema';
import { eq, desc } from 'drizzle-orm';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const date = searchParams.get('date');

  if (date) {
    // startTime is stored as ISO string, filter by date prefix
    const all = await db
      .select()
      .from(studySessions)
      .orderBy(desc(studySessions.createdAt));
    const result = all.filter((s) => s.startTime.startsWith(date));
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
  const body = await request.json();
  const { subject, startTime, endTime, duration } = body;

  if (!subject || !startTime) {
    return NextResponse.json({ error: 'subject and startTime are required' }, { status: 400 });
  }

  // Insert the session
  const result = await db.insert(studySessions).values({
    subject,
    startTime,
    endTime: endTime || null,
    duration: duration || 0,
  });

  // Update daily progress
  const dateStr = startTime.slice(0, 10); // YYYY-MM-DD

  const existing = await db
    .select()
    .from(dailyProgress)
    .where(eq(dailyProgress.date, dateStr));

  if (existing.length > 0) {
    const row = existing[0];
    const subjectMinutes =
      subject === 'politics' ? row.politicsMinutes :
      subject === 'english' ? row.englishMinutes :
      subject === 'math' ? row.mathMinutes :
      row.majorMinutes;

    const newSubjectMinutes = subjectMinutes + (duration || 0);
    const newTotal = row.totalMinutes + (duration || 0);

    const updateData: Record<string, number> = { totalMinutes: newTotal };
    if (subject === 'politics') updateData.politicsMinutes = newSubjectMinutes;
    else if (subject === 'english') updateData.englishMinutes = newSubjectMinutes;
    else if (subject === 'math') updateData.mathMinutes = newSubjectMinutes;
    else updateData.majorMinutes = newSubjectMinutes;

    await db
      .update(dailyProgress)
      .set(updateData)
      .where(eq(dailyProgress.date, dateStr));
  } else {
    const insertData: Record<string, unknown> = {
      date: dateStr,
      totalMinutes: duration || 0,
      politicsMinutes: 0,
      englishMinutes: 0,
      mathMinutes: 0,
      majorMinutes: 0,
    };
    if (subject === 'politics') insertData.politicsMinutes = duration || 0;
    else if (subject === 'english') insertData.englishMinutes = duration || 0;
    else if (subject === 'math') insertData.mathMinutes = duration || 0;
    else insertData.majorMinutes = duration || 0;

    await db.insert(dailyProgress).values(insertData as typeof dailyProgress.$inferInsert);
  }

  return NextResponse.json({ success: true, id: result.lastInsertRowid });
}
