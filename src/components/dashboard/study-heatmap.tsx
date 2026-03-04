'use client';

import { useEffect, useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format, subDays, startOfWeek, differenceInWeeks } from 'date-fns';

interface DayData {
  date: string;
  totalMinutes: number;
}

const COLORS = {
  none: '#1e1e1e',
  light: '#0e4429',
  medium: '#006d32',
  high: '#26a641',
  intense: '#39d353',
};

function getColor(minutes: number): string {
  if (minutes === 0) return COLORS.none;
  if (minutes < 60) return COLORS.light;
  if (minutes < 120) return COLORS.medium;
  if (minutes < 240) return COLORS.high;
  return COLORS.intense;
}

export function StudyHeatmap() {
  const [data, setData] = useState<DayData[]>([]);

  useEffect(() => {
    fetch('/api/progress?range=year')
      .then((res) => res.json())
      .then((rows: DayData[]) => setData(rows))
      .catch(console.error);
  }, []);

  const { cells, months } = useMemo(() => {
    const today = new Date();
    const dataMap = new Map(data.map((d) => [d.date, d.totalMinutes]));

    // Build 52 weeks x 7 days grid, ending at today
    const endDate = today;
    const startDate = subDays(endDate, 364);
    const weekStart = startOfWeek(startDate, { weekStartsOn: 0 });
    const totalWeeks = differenceInWeeks(endDate, weekStart) + 1;

    const cellsArr: { x: number; y: number; date: string; minutes: number }[] = [];
    const monthLabels: { label: string; x: number }[] = [];
    let lastMonth = -1;

    for (let w = 0; w < totalWeeks && w < 53; w++) {
      for (let d = 0; d < 7; d++) {
        const cellDate = new Date(weekStart);
        cellDate.setDate(cellDate.getDate() + w * 7 + d);
        if (cellDate > today) continue;

        const dateStr = format(cellDate, 'yyyy-MM-dd');
        const minutes = dataMap.get(dateStr) || 0;
        cellsArr.push({ x: w, y: d, date: dateStr, minutes });

        const month = cellDate.getMonth();
        if (month !== lastMonth && d === 0) {
          lastMonth = month;
          monthLabels.push({
            label: format(cellDate, 'M月'),
            x: w,
          });
        }
      }
    }

    return { cells: cellsArr, months: monthLabels };
  }, [data]);

  const cellSize = 12;
  const gap = 2;
  const totalWidth = 53 * (cellSize + gap) + 30;
  const totalHeight = 7 * (cellSize + gap) + 20;

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">学习热力图</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <svg width={totalWidth} height={totalHeight} className="block">
            {/* Month labels */}
            {months.map((m, i) => (
              <text
                key={i}
                x={m.x * (cellSize + gap) + 30}
                y={10}
                className="fill-muted-foreground"
                fontSize={10}
              >
                {m.label}
              </text>
            ))}
            {/* Day cells */}
            {cells.map((cell, i) => (
              <rect
                key={i}
                x={cell.x * (cellSize + gap) + 30}
                y={cell.y * (cellSize + gap) + 16}
                width={cellSize}
                height={cellSize}
                rx={2}
                fill={getColor(cell.minutes)}
              >
                <title>
                  {cell.date}: {cell.minutes}分钟
                </title>
              </rect>
            ))}
          </svg>
        </div>
        <div className="mt-2 flex items-center gap-1 text-xs text-muted-foreground">
          <span>少</span>
          {[COLORS.none, COLORS.light, COLORS.medium, COLORS.high, COLORS.intense].map(
            (color) => (
              <span
                key={color}
                className="inline-block h-3 w-3 rounded-sm"
                style={{ backgroundColor: color }}
              />
            )
          )}
          <span>多</span>
        </div>
      </CardContent>
    </Card>
  );
}
