'use client';

import { useEffect, useState } from 'react';
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { format, subDays } from 'date-fns';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface DayRow {
  date: string;
  politicsMinutes: number;
  englishMinutes: number;
  mathMinutes: number;
  majorMinutes: number;
}

interface ChartData {
  date: string;
  label: string;
  politics: number;
  english: number;
  math: number;
  major: number;
}

export function WeeklyTrend() {
  const [chartData, setChartData] = useState<ChartData[]>([]);

  useEffect(() => {
    fetch('/api/progress?range=week')
      .then((res) => res.json())
      .then((rows: DayRow[]) => {
        const dataMap = new Map(rows.map((r) => [r.date, r]));

        // Build 7 days
        const days: ChartData[] = [];
        for (let i = 6; i >= 0; i--) {
          const d = subDays(new Date(), i);
          const dateStr = format(d, 'yyyy-MM-dd');
          const row = dataMap.get(dateStr);
          days.push({
            date: dateStr,
            label: format(d, 'MM/dd'),
            politics: row?.politicsMinutes || 0,
            english: row?.englishMinutes || 0,
            math: row?.mathMinutes || 0,
            major: row?.majorMinutes || 0,
          });
        }
        setChartData(days);
      })
      .catch(console.error);
  }, []);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">本周学习趋势</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-[250px]">
          <ResponsiveContainer width="100%" height="100%">
            <BarChart data={chartData}>
              <XAxis
                dataKey="label"
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
              />
              <YAxis
                tick={{ fontSize: 12 }}
                tickLine={false}
                axisLine={false}
                label={{ value: '分钟', angle: -90, position: 'insideLeft', fontSize: 12 }}
              />
              <Tooltip
                contentStyle={{
                  backgroundColor: 'hsl(var(--card))',
                  border: '1px solid hsl(var(--border))',
                  borderRadius: '8px',
                  fontSize: 12,
                }}
              />
              <Legend iconSize={10} wrapperStyle={{ fontSize: 12 }} />
              <Bar dataKey="politics" name="政治" stackId="a" fill="#ef4444" radius={[0, 0, 0, 0]} />
              <Bar dataKey="english" name="英语一" stackId="a" fill="#3b82f6" />
              <Bar dataKey="math" name="数学一" stackId="a" fill="#22c55e" />
              <Bar dataKey="major" name="874" stackId="a" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  );
}
