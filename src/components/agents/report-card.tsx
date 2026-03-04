'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { AgentReport } from '@/lib/db/schema';

const agentLabels: Record<string, { label: string; color: string }> = {
  analyst: { label: '分析师', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
  strategist: { label: '策略师', color: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
  coach: { label: '教练', color: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
};

function renderAnalystContent(content: string) {
  try {
    const data = JSON.parse(content);
    if (data.error) return <pre className="text-sm whitespace-pre-wrap">{data.raw || content}</pre>;

    return (
      <div className="space-y-4">
        <div>
          <h4 className="text-sm font-medium mb-2">各科学习时长</h4>
          <div className="grid grid-cols-2 gap-2">
            {data.totalHoursPerSubject && Object.entries(data.totalHoursPerSubject).map(([subject, hours]) => (
              <div key={subject} className="flex justify-between text-sm bg-muted/50 rounded-md px-3 py-1.5">
                <span className="text-muted-foreground">
                  {subject === 'politics' ? '政治' : subject === 'english' ? '英语' : subject === 'math' ? '数学' : '专业课'}
                </span>
                <span className="font-medium">{String(hours)}h</span>
              </div>
            ))}
          </div>
        </div>
        {data.consistencyScore !== undefined && (
          <div className="flex items-center gap-2 text-sm">
            <span className="text-muted-foreground">一致性得分：</span>
            <span className="font-medium">{data.consistencyScore}/100</span>
          </div>
        )}
        {data.weakAreas && data.weakAreas.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-1">薄弱环节</h4>
            <div className="flex flex-wrap gap-1">
              {data.weakAreas.map((area: string, i: number) => (
                <Badge key={i} variant="outline" className="text-xs">{area}</Badge>
              ))}
            </div>
          </div>
        )}
        {data.insights && data.insights.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-1">分析洞察</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              {data.insights.map((insight: string, i: number) => (
                <li key={i}>- {insight}</li>
              ))}
            </ul>
          </div>
        )}
        {data.summary && (
          <p className="text-sm text-muted-foreground border-t pt-2">{data.summary}</p>
        )}
      </div>
    );
  } catch {
    return <pre className="text-sm whitespace-pre-wrap">{content}</pre>;
  }
}

function renderStrategistContent(content: string) {
  try {
    const data = JSON.parse(content);
    if (data.error) return <pre className="text-sm whitespace-pre-wrap">{data.raw || content}</pre>;

    return (
      <div className="space-y-4">
        {data.tomorrow && (
          <div>
            <h4 className="text-sm font-medium mb-2">明日计划 {data.tomorrow.date && `(${data.tomorrow.date})`}</h4>
            {data.tomorrow.focus && (
              <p className="text-xs text-muted-foreground mb-2">重点：{data.tomorrow.focus}</p>
            )}
            <div className="space-y-1.5">
              {data.tomorrow.blocks?.map((block: Record<string, string>, i: number) => (
                <div key={i} className="flex items-center gap-2 text-sm bg-muted/50 rounded-md px-3 py-1.5">
                  <span className="text-muted-foreground font-mono text-xs">{block.time}</span>
                  <Badge variant="outline" className="text-xs">{block.subject}</Badge>
                  <span className="flex-1 truncate">{block.task}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {data.weekPlan && (
          <div>
            <h4 className="text-sm font-medium mb-2">本周规划</h4>
            {data.weekPlan.priorities && (
              <ul className="text-sm text-muted-foreground space-y-1 mb-2">
                {data.weekPlan.priorities.map((p: string, i: number) => (
                  <li key={i}>- {p}</li>
                ))}
              </ul>
            )}
            {data.weekPlan.milestones && (
              <div>
                <h5 className="text-xs font-medium text-muted-foreground mb-1">本周目标</h5>
                <ul className="text-sm space-y-1">
                  {data.weekPlan.milestones.map((m: string, i: number) => (
                    <li key={i}>- {m}</li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        )}
        {data.adjustments && data.adjustments.length > 0 && (
          <div>
            <h4 className="text-sm font-medium mb-1">调整建议</h4>
            <ul className="text-sm text-muted-foreground space-y-1">
              {data.adjustments.map((a: string, i: number) => (
                <li key={i}>- {a}</li>
              ))}
            </ul>
          </div>
        )}
      </div>
    );
  } catch {
    return <pre className="text-sm whitespace-pre-wrap">{content}</pre>;
  }
}

function renderCoachContent(content: string) {
  return (
    <div className="text-sm leading-relaxed whitespace-pre-wrap">
      {content}
    </div>
  );
}

export function ReportCard({ report }: { report: AgentReport }) {
  const agentInfo = agentLabels[report.agentType] || { label: report.agentType, color: '' };

  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base">{agentInfo.label}报告</CardTitle>
          <div className="flex items-center gap-2">
            <Badge className={agentInfo.color}>{agentInfo.label}</Badge>
            <span className="text-xs text-muted-foreground">{report.date}</span>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        {report.agentType === 'analyst' && renderAnalystContent(report.content)}
        {report.agentType === 'strategist' && renderStrategistContent(report.content)}
        {report.agentType === 'coach' && renderCoachContent(report.content)}
      </CardContent>
    </Card>
  );
}
