'use client';

import { useState, useRef } from 'react';
import {
  Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { RESOURCE_SUBJECTS, RESOURCE_TYPES } from '@/lib/constants';
import { formatFileSize } from '@/lib/utils';
import { Upload } from 'lucide-react';

interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function UploadDialog({ open, onOpenChange, onSuccess }: UploadDialogProps) {
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('general');
  const [resourceType, setResourceType] = useState('other');
  const [uploader, setUploader] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  // 选择文件后自动填充标题
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const f = e.target.files?.[0];
    if (f) {
      setFile(f);
      if (!title) {
        // 去掉扩展名作为默认标题
        const name = f.name.replace(/\.[^.]+$/, '');
        setTitle(name);
      }
      setError('');
    }
  }

  async function handleSubmit() {
    if (!file) { setError('请选择文件'); return; }
    if (!title.trim()) { setError('请填写标题'); return; }

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title.trim());
      formData.append('subject', subject);
      formData.append('resourceType', resourceType);
      formData.append('uploader', uploader.trim() || '匿名');

      const res = await fetch('/api/resources', { method: 'POST', body: formData });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error || '上传失败');
        return;
      }

      // 重置表单 & 关闭
      setFile(null);
      setTitle('');
      setSubject('general');
      setResourceType('other');
      setUploader('');
      if (fileRef.current) fileRef.current.value = '';
      onOpenChange(false);
      onSuccess();
    } catch {
      setError('网络错误，请重试');
    } finally {
      setUploading(false);
    }
  }

  // 过滤掉 'all' 选项
  const subjectOptions = RESOURCE_SUBJECTS.filter((s) => s.id !== 'all');
  const typeOptions = RESOURCE_TYPES.filter((t) => t.id !== 'all');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>上传学习资料</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* 文件选择 */}
          <div>
            <label className="text-sm font-medium">选择文件</label>
            <div
              className="mt-1.5 border-2 border-dashed rounded-lg p-4 text-center cursor-pointer hover:border-primary/50 transition-colors"
              onClick={() => fileRef.current?.click()}
            >
              {file ? (
                <div className="text-sm">
                  <p className="font-medium truncate">{file.name}</p>
                  <p className="text-muted-foreground">{formatFileSize(file.size)}</p>
                </div>
              ) : (
                <div className="text-muted-foreground text-sm">
                  <Upload className="h-6 w-6 mx-auto mb-1" />
                  <p>点击选择文件（最大 50MB）</p>
                </div>
              )}
            </div>
            <input ref={fileRef} type="file" className="hidden" onChange={handleFileChange} />
          </div>

          {/* 标题 */}
          <div>
            <label className="text-sm font-medium">资料标题</label>
            <Input className="mt-1.5" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="如：线性代数笔记第三章" />
          </div>

          {/* 科目 + 类型 */}
          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-sm font-medium">学科</label>
              <select
                className="mt-1.5 w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                value={subject}
                onChange={(e) => setSubject(e.target.value)}
              >
                {subjectOptions.map((s) => (
                  <option key={s.id} value={s.id}>{s.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-sm font-medium">类型</label>
              <select
                className="mt-1.5 w-full h-9 rounded-md border border-input bg-background px-3 text-sm"
                value={resourceType}
                onChange={(e) => setResourceType(e.target.value)}
              >
                {typeOptions.map((t) => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
          </div>

          {/* 昵称 */}
          <div>
            <label className="text-sm font-medium">你的昵称</label>
            <Input className="mt-1.5" value={uploader} onChange={(e) => setUploader(e.target.value)} placeholder="留空则显示「匿名」" />
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={uploading}>取消</Button>
          <Button onClick={handleSubmit} disabled={uploading}>
            {uploading ? '上传中...' : '上传'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
