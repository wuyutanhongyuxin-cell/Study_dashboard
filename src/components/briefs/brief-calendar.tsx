'use client';

import { Calendar } from '@/components/ui/calendar';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';

interface BriefCalendarProps {
  selectedDate: string;
  briefDates: string[];
  onSelect: (date: string) => void;
}

export function BriefCalendar({ selectedDate, briefDates, onSelect }: BriefCalendarProps) {
  const selected = new Date(selectedDate + 'T00:00:00');

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-sm">选择日期</CardTitle>
      </CardHeader>
      <CardContent className="p-2">
        <Calendar
          mode="single"
          selected={selected}
          onSelect={(date) => {
            if (date) {
              onSelect(format(date, 'yyyy-MM-dd'));
            }
          }}
          modifiers={{
            hasBrief: briefDates.map(d => new Date(d + 'T00:00:00')),
          }}
          modifiersStyles={{
            hasBrief: {
              backgroundColor: 'hsl(var(--primary) / 0.2)',
              borderRadius: '50%',
            },
          }}
          className="rounded-md"
        />
      </CardContent>
    </Card>
  );
}
