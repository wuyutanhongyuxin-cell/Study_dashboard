'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Clock, Flame, BarChart3, BookOpen } from 'lucide-react';

interface Metrics {
  totalHoursWeek: number;
  studyDays: number;
  avgMinutesPerDay: number;
  subjectBalance: {
    politics: number;
    english: number;
    math: number;
    major: number;
  };
}

export function MetricsBanner({ metrics }: { metrics: Metrics }) {
  const items = [
    {
      icon: Clock,
      label: '本周学习',
      value: `${metrics.totalHoursWeek}h`,
      color: 'text-blue-500',
    },
    {
      icon: Flame,
      label: '连续学习',
      value: `${metrics.studyDays}天`,
      color: 'text-orange-500',
    },
    {
      icon: BarChart3,
      label: '日均时长',
      value: `${metrics.avgMinutesPerDay}min`,
      color: 'text-green-500',
    },
    {
      icon: BookOpen,
      label: '科目数',
      value: `${Object.values(metrics.subjectBalance).filter(v => v > 0).length}/4`,
      color: 'text-purple-500',
    },
  ];

  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
      {items.map((item) => (
        <Card key={item.label}>
          <CardContent className="flex items-center gap-3 p-4">
            <item.icon className={`h-8 w-8 ${item.color}`} />
            <div>
              <p className="text-2xl font-bold">{item.value}</p>
              <p className="text-xs text-muted-foreground">{item.label}</p>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
