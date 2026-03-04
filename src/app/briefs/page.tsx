'use client';

import { useState, useEffect } from 'react';
import { format } from 'date-fns';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { BriefDisplay } from '@/components/briefs/brief-display';
import { MetricsBanner } from '@/components/briefs/metrics-banner';
import { BriefCalendar } from '@/components/briefs/brief-calendar';
import { Loader2, RefreshCw } from 'lucide-react';

interface Brief {
  id: number;
  date: string;
  content: string;
  metrics: string | null;
}

export default function BriefsPage() {
  const [selectedDate, setSelectedDate] = useState(format(new Date(), 'yyyy-MM-dd'));
  const [brief, setBrief] = useState<Brief | null>(null);
  const [briefDates, setBriefDates] = useState<string[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  useEffect(() => {
    fetchBriefDates();
  }, []);

  useEffect(() => {
    fetchBrief(selectedDate);
  }, [selectedDate]);

  async function fetchBriefDates() {
    const res = await fetch('/api/briefs');
    if (res.ok) {
      const data = await res.json();
      setBriefDates(data.map((b: Brief) => b.date));
    }
  }

  async function fetchBrief(date: string) {
    setLoading(true);
    const res = await fetch(`/api/briefs/${date}`);
    if (res.ok) {
      const data = await res.json();
      setBrief(data);
    } else {
      setBrief(null);
    }
    setLoading(false);
  }

  async function generateBrief() {
    setGenerating(true);
    const res = await fetch('/api/briefs', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ date: selectedDate }),
    });
    if (res.ok) {
      const data = await res.json();
      setBrief(data);
      fetchBriefDates();
    }
    setGenerating(false);
  }

  const metrics = brief?.metrics ? JSON.parse(brief.metrics) : null;

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-bold">每日晨报</h1>
        <Button onClick={generateBrief} disabled={generating}>
          {generating ? (
            <Loader2 className="h-4 w-4 mr-2 animate-spin" />
          ) : (
            <RefreshCw className="h-4 w-4 mr-2" />
          )}
          生成晨报
        </Button>
      </div>

      {metrics && <MetricsBanner metrics={metrics} />}

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        <div className="lg:col-span-3">
          {loading ? (
            <Card>
              <CardContent className="flex items-center justify-center py-20">
                <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
              </CardContent>
            </Card>
          ) : brief ? (
            <BriefDisplay content={brief.content} date={brief.date} />
          ) : (
            <Card>
              <CardContent className="flex flex-col items-center justify-center py-20 text-muted-foreground">
                <p className="mb-4">{selectedDate} 暂无晨报</p>
                <Button variant="outline" onClick={generateBrief} disabled={generating}>
                  生成今日晨报
                </Button>
              </CardContent>
            </Card>
          )}
        </div>

        <div>
          <BriefCalendar
            selectedDate={selectedDate}
            briefDates={briefDates}
            onSelect={setSelectedDate}
          />
        </div>
      </div>
    </div>
  );
}
