'use client';

import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import type { IntelItem } from '@/lib/db/schema';

const categoryConfig: Record<string, { label: string; color: string }> = {
  policy: { label: '政策', color: 'bg-purple-500/10 text-purple-500 border-purple-500/20' },
  experience: { label: '经验', color: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
  resource: { label: '资源', color: 'bg-green-500/10 text-green-500 border-green-500/20' },
  news: { label: '新闻', color: 'bg-orange-500/10 text-orange-500 border-orange-500/20' },
};

interface IntelDetailDialogProps {
  item: IntelItem | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function IntelDetailDialog({ item, open, onOpenChange }: IntelDetailDialogProps) {
  if (!item) return null;

  const config = categoryConfig[item.category] || { label: item.category, color: '' };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <div className="flex items-start gap-2">
            <Badge className={config.color}>{config.label}</Badge>
            {item.relevance !== null && (
              <Badge variant="outline" className="text-xs">
                相关度 {Math.round(item.relevance * 100)}%
              </Badge>
            )}
          </div>
          <DialogTitle className="text-lg leading-snug pt-2">
            {item.title}
          </DialogTitle>
        </DialogHeader>
        <div className="space-y-4">
          <p className="text-sm leading-relaxed text-muted-foreground">
            {item.summary}
          </p>
          <div className="flex items-center justify-between text-xs text-muted-foreground border-t pt-3">
            <span>来源：{item.source}</span>
            <span>{item.date}</span>
          </div>
          {item.url && (
            <a
              href={item.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-block text-sm text-primary hover:underline"
            >
              查看原文
            </a>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
