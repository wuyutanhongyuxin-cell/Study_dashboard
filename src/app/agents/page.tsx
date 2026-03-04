'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ReportCard } from '@/components/agents/report-card';
import type { AgentReport } from '@/lib/db/schema';

export default function AgentsPage() {
  const [reports, setReports] = useState<AgentReport[]>([]);
  const [loading, setLoading] = useState(false);
  const [running, setRunning] = useState(false);
  const [activeTab, setActiveTab] = useState('all');

  useEffect(() => {
    fetchReports();
  }, []);

  async function fetchReports() {
    setLoading(true);
    try {
      const res = await fetch('/api/agents/reports');
      const data = await res.json();
      setReports(data);
    } catch (err) {
      console.error('Failed to fetch reports:', err);
    } finally {
      setLoading(false);
    }
  }

  async function handleRun() {
    setRunning(true);
    try {
      const res = await fetch('/api/agents/run', { method: 'POST' });
      if (!res.ok) throw new Error('Failed to run agents');
      await fetchReports();
    } catch (err) {
      console.error('Failed to run agents:', err);
    } finally {
      setRunning(false);
    }
  }

  const filteredReports = activeTab === 'all'
    ? reports
    : reports.filter((r) => r.agentType === activeTab);

  // Group reports by date
  const groupedReports = filteredReports.reduce<Record<string, AgentReport[]>>((acc, report) => {
    if (!acc[report.date]) acc[report.date] = [];
    acc[report.date].push(report);
    return acc;
  }, {});

  const sortedDates = Object.keys(groupedReports).sort((a, b) => b.localeCompare(a));

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">Agent 报告</h1>
          <p className="text-sm text-muted-foreground mt-1">
            AI 分析师、策略师和教练的智能分析报告
          </p>
        </div>
        <Button onClick={handleRun} disabled={running}>
          {running ? '运行中...' : '运行 Agent'}
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">全部</TabsTrigger>
          <TabsTrigger value="analyst">分析师</TabsTrigger>
          <TabsTrigger value="strategist">策略师</TabsTrigger>
          <TabsTrigger value="coach">教练</TabsTrigger>
        </TabsList>

        <TabsContent value={activeTab} className="mt-4">
          {loading ? (
            <div className="text-center py-12 text-muted-foreground">加载中...</div>
          ) : sortedDates.length === 0 ? (
            <div className="text-center py-12 text-muted-foreground">
              <p>暂无报告</p>
              <p className="text-sm mt-1">点击&ldquo;运行 Agent&rdquo;生成第一份报告</p>
            </div>
          ) : (
            <div className="space-y-8">
              {sortedDates.map((date) => (
                <div key={date}>
                  <h2 className="text-lg font-semibold mb-3">{date}</h2>
                  <div className="grid gap-4">
                    {groupedReports[date].map((report) => (
                      <ReportCard key={report.id} report={report} />
                    ))}
                  </div>
                </div>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
