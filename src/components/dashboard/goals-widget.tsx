'use client';

import { useEffect, useState } from 'react';
import { SUBJECTS } from '@/lib/constants';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Progress } from '@/components/ui/progress';
import { Plus } from 'lucide-react';

interface Goal {
  id: number;
  title: string;
  type: string;
  subject: string | null;
  targetValue: number | null;
  currentValue: number;
  unit: string | null;
  completed: boolean;
  dueDate: string | null;
}

export function GoalsWidget() {
  const [goals, setGoals] = useState<Goal[]>([]);
  const [showForm, setShowForm] = useState(false);
  const [title, setTitle] = useState('');
  const [type, setType] = useState('daily');
  const [subject, setSubject] = useState('');
  const [targetValue, setTargetValue] = useState('');

  const fetchGoals = () => {
    fetch('/api/goals')
      .then((res) => res.json())
      .then(setGoals)
      .catch(console.error);
  };

  useEffect(() => {
    fetchGoals();
  }, []);

  const handleSubmit = async () => {
    if (!title) return;

    await fetch('/api/goals', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        title,
        type,
        subject: subject || null,
        targetValue: targetValue ? parseInt(targetValue) : null,
        unit: '分钟',
      }),
    });

    setTitle('');
    setType('daily');
    setSubject('');
    setTargetValue('');
    setShowForm(false);
    fetchGoals();
  };

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium">学习目标</CardTitle>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8"
          onClick={() => setShowForm(!showForm)}
        >
          <Plus className="h-4 w-4" />
        </Button>
      </CardHeader>
      <CardContent className="space-y-4">
        {showForm && (
          <div className="space-y-2 rounded-lg border p-3">
            <Input
              placeholder="目标标题"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <div className="flex gap-2">
              <Select value={type} onValueChange={setType}>
                <SelectTrigger className="flex-1">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="daily">每日</SelectItem>
                  <SelectItem value="weekly">每周</SelectItem>
                  <SelectItem value="monthly">每月</SelectItem>
                  <SelectItem value="phase">阶段</SelectItem>
                </SelectContent>
              </Select>
              <Select value={subject} onValueChange={setSubject}>
                <SelectTrigger className="flex-1">
                  <SelectValue placeholder="科目(可选)" />
                </SelectTrigger>
                <SelectContent>
                  {SUBJECTS.map((s) => (
                    <SelectItem key={s.id} value={s.id}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex gap-2">
              <Input
                type="number"
                placeholder="目标值(分钟)"
                value={targetValue}
                onChange={(e) => setTargetValue(e.target.value)}
                className="flex-1"
              />
              <Button onClick={handleSubmit} disabled={!title}>
                添加
              </Button>
            </div>
          </div>
        )}

        {goals.length === 0 && !showForm && (
          <p className="text-center text-sm text-muted-foreground py-4">
            暂无学习目标，点击 + 添加
          </p>
        )}

        {goals.map((goal) => {
          const progress =
            goal.targetValue && goal.targetValue > 0
              ? Math.min(100, Math.round((goal.currentValue / goal.targetValue) * 100))
              : 0;

          const subjectInfo = SUBJECTS.find((s) => s.id === goal.subject);

          return (
            <div key={goal.id} className="space-y-1">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium">{goal.title}</span>
                <span className="text-muted-foreground">
                  {goal.currentValue}/{goal.targetValue || '?'} {goal.unit}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {subjectInfo && (
                  <span className="text-xs text-muted-foreground">
                    {subjectInfo.name}
                  </span>
                )}
                <Progress value={progress} className="flex-1" />
                <span className="text-xs text-muted-foreground w-10 text-right">
                  {progress}%
                </span>
              </div>
            </div>
          );
        })}
      </CardContent>
    </Card>
  );
}
