'use client';

import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { FILE_FORMAT_CONFIG, VIP_USERS } from '@/lib/constants';
import { formatFileSize } from '@/lib/utils';
import type { Resource } from '@/lib/db/schema';

interface ResourceCardProps {
  item: Resource;
  onPreview: () => void;
}

export function ResourceCard({ item, onPreview }: ResourceCardProps) {
  const format = FILE_FORMAT_CONFIG[item.fileExt] || { icon: '📎', color: 'text-gray-500', label: item.fileExt.toUpperCase() };
  const vip = VIP_USERS.find((u) => u.nickname === item.uploader);

  function handleDownload(e: React.MouseEvent) {
    e.stopPropagation();
    window.open(`/api/resources/${item.id}/download`, '_blank');
  }

  return (
    <Card
      className="cursor-pointer transition-colors hover:bg-accent/50 group"
      onClick={onPreview}
    >
      <CardContent className="p-4">
        {/* 格式图标 + 标题 */}
        <div className="flex items-start gap-3">
          <span className="text-2xl shrink-0">{format.icon}</span>
          <div className="flex-1 min-w-0">
            <h3 className="font-medium text-sm leading-snug line-clamp-2">{item.title}</h3>
            <p className="text-xs text-muted-foreground mt-1 truncate">{item.originalName}</p>
          </div>
        </div>

        {/* 底部信息栏 */}
        <div className="flex items-center justify-between mt-3 pt-2 border-t">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <span>
              {vip ? `${vip.emoji}${vip.nickname}` : item.uploader}
            </span>
            <span>·</span>
            <span>{formatFileSize(item.fileSize)}</span>
            {item.downloadCount > 0 && (
              <>
                <span>·</span>
                <span>{item.downloadCount}次下载</span>
              </>
            )}
          </div>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7 opacity-0 group-hover:opacity-100 transition-opacity"
            onClick={handleDownload}
            title="下载"
          >
            <Download className="h-3.5 w-3.5" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}
