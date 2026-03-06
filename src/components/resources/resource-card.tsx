'use client';

import type { MouseEvent } from 'react';
import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { getFileFormatConfig, VIP_USERS } from '@/lib/constants';
import type { Resource } from '@/lib/db/schema';
import { formatFileSize } from '@/lib/utils';

interface ResourceCardProps {
  item: Resource;
  onPreview: () => void;
}

export function ResourceCard({ item, onPreview }: ResourceCardProps) {
  const format = getFileFormatConfig(item.fileExt);
  const vip = VIP_USERS.find((user) => user.nickname === item.uploader);

  function handleDownload(event: MouseEvent<HTMLButtonElement>) {
    event.stopPropagation();
    window.open(`/api/resources/${item.id}/download`, '_blank');
  }

  return (
    <Card className="group cursor-pointer transition-colors hover:bg-accent/50" onClick={onPreview}>
      <CardContent className="p-4">
        <div className="flex items-start gap-3">
          <span className="shrink-0 text-2xl">{format.icon}</span>
          <div className="min-w-0 flex-1">
            <h3 className="line-clamp-2 text-sm font-medium leading-snug">{item.title}</h3>
            <p className="mt-1 truncate text-xs text-muted-foreground">{item.originalName}</p>
          </div>
        </div>

        <div className="mt-3 flex items-center justify-between border-t pt-2">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>{vip ? `${vip.emoji}${vip.nickname}` : item.uploader}</span>
            <span>·</span>
            <span>{formatFileSize(item.fileSize)}</span>
            {item.downloadCount > 0 ? <><span>·</span><span>{item.downloadCount}次下载</span></> : null}
          </div>
          <Button variant="ghost" size="icon" className="h-7 w-7 opacity-0 transition-opacity group-hover:opacity-100" onClick={handleDownload} title="下载">
            <Download className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
