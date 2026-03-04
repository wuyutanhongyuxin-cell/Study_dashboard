'use client';

import { useEffect } from 'react';
import { useAppStore } from '@/lib/store';
import { SUBJECTS, type SubjectId } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Play, Square } from 'lucide-react';

function formatTime(seconds: number): string {
  const h = Math.floor(seconds / 3600);
  const m = Math.floor((seconds % 3600) / 60);
  const s = seconds % 60;
  return [h, m, s].map((v) => String(v).padStart(2, '0')).join(':');
}

export function StudyTimer() {
  const timer = useAppStore((s) => s.timer);
  const startTimer = useAppStore((s) => s.startTimer);
  const stopTimer = useAppStore((s) => s.stopTimer);
  const tickTimer = useAppStore((s) => s.tickTimer);

  useEffect(() => {
    if (!timer.isRunning) return;
    const interval = setInterval(tickTimer, 1000);
    return () => clearInterval(interval);
  }, [timer.isRunning, tickTimer]);

  const handleStart = (subjectId: SubjectId) => {
    startTimer(subjectId);
  };

  const handleStop = () => {
    stopTimer();
  };

  return (
    <Card>
      <CardHeader className="pb-2">
        <CardTitle className="text-sm font-medium">学习计时器</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Select
          value={timer.subject || undefined}
          onValueChange={(v) => {
            if (!timer.isRunning) {
              // Just store the selected subject for when they press start
              useAppStore.setState({
                timer: { ...timer, subject: v as SubjectId },
              });
            }
          }}
          disabled={timer.isRunning}
        >
          <SelectTrigger>
            <SelectValue placeholder="选择科目" />
          </SelectTrigger>
          <SelectContent>
            {SUBJECTS.map((s) => (
              <SelectItem key={s.id} value={s.id}>
                {s.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <div className="text-center">
          <span className="font-mono text-4xl font-bold tabular-nums tracking-wider">
            {formatTime(timer.elapsed)}
          </span>
        </div>

        <div className="flex gap-2">
          {!timer.isRunning ? (
            <Button
              className="flex-1"
              onClick={() => {
                if (timer.subject) {
                  handleStart(timer.subject);
                }
              }}
              disabled={!timer.subject}
            >
              <Play className="mr-1 h-4 w-4" />
              开始
            </Button>
          ) : (
            <Button
              className="flex-1"
              variant="destructive"
              onClick={handleStop}
            >
              <Square className="mr-1 h-4 w-4" />
              停止
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
