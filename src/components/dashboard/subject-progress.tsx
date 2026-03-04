'use client';

import { useEffect, useState } from 'react';
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';
import { SUBJECTS } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

const COLORS: Record<string, string> = {
  politics: '#ef4444',
  english: '#3b82f6',
  math: '#22c55e',
  major: '#f59e0b',
};

interface SubjectTotals {
  politics: number;
  english: number;
  math: number;
  major: number;
  total: number;
}

export function SubjectProgress() {
  const [totals, setTotals] = useState<SubjectTotals | null>(null);

  useEffect(() => {
    fetch('/api/progress')
      .then((res) => res.json())
      .then(setTotals)
      .catch(console.error);
  }, []);

  if (!totals) {
    return (
      <Card>
        <CardHeader className="pb-2">
          <CardTitle className="text-sm font-medium">科目进度</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
            {SUBJECTS.map((s) => (
              <div key={s.id} className="flex h-[140px] items-center justify-center">
                <div className="h-[110px] w-[110px] animate-pulse rounded-full bg-muted" />
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">科目进度</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4 md:grid-cols-4">
          {SUBJECTS.map((subject) => {
            const minutes = totals[subject.id as keyof SubjectTotals] as number;
            const targetHours = subject.totalHours;
            const percentage = Math.min(
              100,
              Math.round((minutes / 60 / targetHours) * 100)
            );

            const data = [
              { value: percentage },
              { value: 100 - percentage },
            ];

            return (
              <div key={subject.id} className="flex flex-col items-center">
                <div className="relative h-[120px] w-[120px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={data}
                        innerRadius={40}
                        outerRadius={55}
                        startAngle={90}
                        endAngle={-270}
                        dataKey="value"
                        stroke="none"
                      >
                        <Cell fill={COLORS[subject.id]} />
                        <Cell fill="hsl(var(--muted))" />
                      </Pie>
                    </PieChart>
                  </ResponsiveContainer>
                  <div className="absolute inset-0 flex items-center justify-center">
                    <span className="text-lg font-bold">{percentage}%</span>
                  </div>
                </div>
                <span className="mt-1 text-sm text-muted-foreground">
                  {subject.name}
                </span>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
}
