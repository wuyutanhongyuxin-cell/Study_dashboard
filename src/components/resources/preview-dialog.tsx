'use client';

import {
  Dialog, DialogContent, DialogHeader, DialogTitle,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Download } from 'lucide-react';
import { FILE_FORMAT_CONFIG, VIP_USERS } from '@/lib/constants';
import { formatFileSize } from '@/lib/utils';
import type { Resource } from '@/lib/db/schema';

interface PreviewDialogProps {
  item: Resource | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

// 可内嵌预览的格式
const PREVIEWABLE_IMAGE = new Set(['png', 'jpg', 'jpeg', 'gif', 'webp', 'svg']);
const PREVIEWABLE_PDF = new Set(['pdf']);

export function PreviewDialog({ item, open, onOpenChange }: PreviewDialogProps) {
  if (!item) return null;

  const format = FILE_FORMAT_CONFIG[item.fileExt] || { icon: '📎', label: item.fileExt.toUpperCase() };
  const vip = VIP_USERS.find((u) => u.nickname === item.uploader);
  const previewUrl = `/api/resources/${item.id}/preview`;
  const isImage = PREVIEWABLE_IMAGE.has(item.fileExt);
  const isPdf = PREVIEWABLE_PDF.has(item.fileExt);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl max-h-[85vh] flex flex-col">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-base">
            <span>{format.icon}</span>
            <span className="truncate">{item.title}</span>
          </DialogTitle>
        </DialogHeader>

        {/* 预览区域 */}
        <div className="flex-1 min-h-0 overflow-auto">
          {isPdf ? (
            <iframe
              src={previewUrl}
              className="w-full h-[60vh] rounded border"
              title={item.title}
            />
          ) : isImage ? (
            <div className="flex items-center justify-center p-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={previewUrl}
                alt={item.title}
                className="max-w-full max-h-[55vh] object-contain rounded"
              />
            </div>
          ) : (
            // 非预览格式：显示文件信息
            <div className="flex flex-col items-center justify-center py-12 text-muted-foreground">
              <span className="text-5xl mb-4">{format.icon}</span>
              <p className="text-sm">此格式暂不支持在线预览</p>
              <p className="text-xs mt-1">请下载后使用对应软件打开</p>
            </div>
          )}
        </div>

        {/* 文件信息 + 下载按钮 */}
        <div className="flex items-center justify-between pt-3 border-t text-sm">
          <div className="flex items-center gap-3 text-muted-foreground text-xs">
            <span>{item.originalName}</span>
            <span>{formatFileSize(item.fileSize)}</span>
            <span>{vip ? `${vip.emoji}${vip.nickname}` : item.uploader}</span>
            <span>{item.downloadCount}次下载</span>
          </div>
          <Button size="sm" onClick={() => window.open(`/api/resources/${item.id}/download`, '_blank')}>
            <Download className="h-3.5 w-3.5 mr-1.5" />
            下载
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
