'use client';

import { differenceInDays, format } from 'date-fns';
import { EXAM_DATE } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

export function CountdownCard() {
  const today = new Date();
  const daysLeft = differenceInDays(EXAM_DATE, today);

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          距考研倒计时
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline gap-1">
          <span className="text-5xl font-bold tabular-nums tracking-tight">
            {daysLeft}
          </span>
          <span className="text-2xl font-semibold text-muted-foreground">天</span>
        </div>
        <p className="mt-2 text-sm text-muted-foreground">
          考试日期: {format(EXAM_DATE, 'yyyy年MM月dd日')}
        </p>
      </CardContent>
    </Card>
  );
}
