'use client';

import { useEffect, useState } from 'react';
import { SUBJECTS } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const COLORS: Record<string, string> = {
  politics: '#ef4444',
  english: '#3b82f6',
  math: '#22c55e',
  major: '#f59e0b',
};

interface TodayData {
  date: string;
  politicsMinutes: number;
  englishMinutes: number;
  mathMinutes: number;
  majorMinutes: number;
  totalMinutes: number;
  mood: number | null;
  efficiency: number | null;
}

function formatMinutes(m: number): string {
  if (m < 60) return `${m}分钟`;
  const h = Math.floor(m / 60);
  const r = m % 60;
  return r > 0 ? `${h}小时${r}分钟` : `${h}小时`;
}

export function TodaySummary() {
  const [data, setData] = useState<TodayData | null>(null);

  useEffect(() => {
    fetch('/api/progress?date=today')
      .then((res) => res.json())
      .then(setData)
      .catch(console.error);
  }, []);

  const subjectMinutes = data
    ? [
        { id: 'politics', minutes: data.politicsMinutes },
        { id: 'english', minutes: data.englishMinutes },
        { id: 'math', minutes: data.mathMinutes },
        { id: 'major', minutes: data.majorMinutes },
      ]
    : [];

  const maxMinutes = Math.max(1, ...subjectMinutes.map((s) => s.minutes));

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">今日概览</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div>
          <span className="text-3xl font-bold tabular-nums">
            {data ? formatMinutes(data.totalMinutes) : '--'}
          </span>
          <p className="text-sm text-muted-foreground">今日总学习时间</p>
        </div>

        <div className="space-y-3">
          {SUBJECTS.map((subject) => {
            const item = subjectMinutes.find((s) => s.id === subject.id);
            const minutes = item?.minutes || 0;
            const width = maxMinutes > 0 ? (minutes / maxMinutes) * 100 : 0;

            return (
              <div key={subject.id} className="space-y-1">
                <div className="flex items-center justify-between text-sm">
                  <span>{subject.name}</span>
                  <span className="text-muted-foreground">{minutes}分钟</span>
                </div>
                <div className="h-2 w-full rounded-full bg-muted">
                  <div
                    className="h-full rounded-full transition-all"
                    style={{
                      width: `${width}%`,
                      backgroundColor: COLORS[subject.id],
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {data && (data.mood || data.efficiency) && (
          <div className="flex gap-4 text-sm">
            {data.mood && (
              <span>
                心情: {'*'.repeat(data.mood)}{' '}
                <span className="text-muted-foreground">/ 5</span>
              </span>
            )}
            {data.efficiency && (
              <span>
                效率: {'*'.repeat(data.efficiency)}{' '}
                <span className="text-muted-foreground">/ 5</span>
              </span>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
}
