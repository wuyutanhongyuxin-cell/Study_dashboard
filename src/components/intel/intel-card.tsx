'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import type { IntelItem } from '@/lib/db/schema';

const categoryConfig: Record<string, { label: string; color: string }> = {
  policy: { label: '政策', color: 'bg-purple-500/10 text-purple-500 border-purple-500/20' },
  experience: { label: '经验', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
  resource: { label: '资源', color: 'bg-green-500/10 text-green-500 border-green-500/20' },
  news: { label: '新闻', color: 'bg-orange-500/10 text-orange-500 border-orange-500/20' },
};

interface IntelCardProps {
  item: IntelItem;
  onClick?: () => void;
}

export function IntelCard({ item, onClick }: IntelCardProps) {
  const config = categoryConfig[item.category] || { label: item.category, color: '' };

  return (
    <Card
      className="cursor-pointer transition-colors hover:bg-accent/50"
      onClick={onClick}
    >
      <CardHeader className="pb-2">
        <div className="flex items-start justify-between gap-2">
          <CardTitle className="text-sm font-medium leading-snug line-clamp-2">
            {item.title}
          </CardTitle>
          <Badge className={`shrink-0 ${config.color}`}>{config.label}</Badge>
        </div>
      </CardHeader>
      <CardContent>
        <p className="text-sm text-muted-foreground line-clamp-3">{item.summary}</p>
        <div className="flex items-center justify-between mt-3">
          <span className="text-xs text-muted-foreground">{item.source}</span>
          {item.relevance !== null && (
            <div className="flex items-center gap-1">
              <span className="text-xs text-muted-foreground">相关度</span>
              <span className="text-xs font-medium">
                {Math.round(item.relevance * 100)}%
              </span>
            </div>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
