'use client';

import { CountdownCard } from '@/components/dashboard/countdown-card';
import { SubjectProgress } from '@/components/dashboard/subject-progress';
import { StudyHeatmap } from '@/components/dashboard/study-heatmap';
import { StudyTimer } from '@/components/dashboard/study-timer';
import { TodaySummary } from '@/components/dashboard/today-summary';
import { WeeklyTrend } from '@/components/dashboard/weekly-trend';
import { GoalsWidget } from '@/components/dashboard/goals-widget';

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-bold">学习看板</h1>

      {/* Top row: countdown + timer + today summary */}
      <div className="grid gap-4 md:grid-cols-3">
        <CountdownCard />
        <StudyTimer />
        <TodaySummary />
      </div>

      {/* Subject progress rings */}
      <SubjectProgress />

      {/* Middle row: weekly trend + goals */}
      <div className="grid gap-4 md:grid-cols-2">
        <WeeklyTrend />
        <GoalsWidget />
      </div>

      {/* Full width heatmap */}
      <StudyHeatmap />
    </div>
  );
}
