'use client';

import { Download } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { getFileFormatConfig, VIP_USERS } from '@/lib/constants';
import type { Resource } from '@/lib/db/schema';
import { formatFileSize } from '@/lib/utils';

interface PreviewDialogProps {
  item: Resource | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const PREVIEWABLE_IMAGE = new Set(['png', 'jpg', 'jpeg', 'gif', 'webp']);

export function PreviewDialog({ item, open, onOpenChange }: PreviewDialogProps) {
  if (!item) return null;

  const format = getFileFormatConfig(item.fileExt);
  const vip = VIP_USERS.find((user) => user.nickname === item.uploader);
  const previewUrl = `/api/resources/${item.id}/preview`;
  const isImage = PREVIEWABLE_IMAGE.has(item.fileExt);
  const isPdf = item.fileExt === 'pdf';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="flex max-h-[85vh] flex-col sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <span>{format.icon}</span>
            <span className="truncate">{item.title}</span>
          </DialogTitle>
        </DialogHeader>

        <div className="min-h-0 flex-1 overflow-auto">
          {isPdf ? (
            <iframe src={previewUrl} className="h-[60vh] w-full rounded border" title={item.title} />
          ) : isImage ? (
            <div className="flex items-center justify-center p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img src={previewUrl} alt={item.title} className="max-h-[55vh] max-w-full rounded object-contain" />
            </div>
          ) : (
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <span className="mb-4 text-5xl">{format.icon}</span>
              <p className="text-sm">此格式暂不支持在线预览</p>
              <p className="mt-1 text-xs">请下载后使用对应软件打开</p>
            </div>
          )}
        </div>

        <div className="flex items-center justify-between border-t pt-3 text-sm">
          <div className="flex items-center gap-3 text-xs text-muted-foreground">
            <span>{item.originalName}</span>
            <span>{formatFileSize(item.fileSize)}</span>
            <span>{vip ? `${vip.emoji}${vip.nickname}` : item.uploader}</span>
            <span>{item.downloadCount}次下载</span>
          </div>
          <Button size="sm" onClick={() => window.open(`/api/resources/${item.id}/download`, '_blank')}>
            <Download className="mr-1.5 h-3.5 w-3.5" />
            下载
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
