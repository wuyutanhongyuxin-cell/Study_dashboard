'use client';

import type { ChangeEvent } from 'react';
import { useEffect, useRef, useState } from 'react';
import { UploadFormFields } from '@/components/resources/upload-form-fields';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { MAX_RESOURCE_FILE_SIZE_BYTES } from '@/lib/constants';

interface UploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess: () => void;
}

export function UploadDialog({ open, onOpenChange, onSuccess }: UploadDialogProps) {
  const fileRef = useRef<HTMLInputElement>(null);
  const [file, setFile] = useState<File | null>(null);
  const [title, setTitle] = useState('');
  const [subject, setSubject] = useState('general');
  const [resourceType, setResourceType] = useState('other');
  const [uploader, setUploader] = useState('');
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!open) resetForm();
  }, [open]);

  function handleFileChange(event: ChangeEvent<HTMLInputElement>) {
    const nextFile = event.target.files?.[0] ?? null;
    if (!nextFile) return;
    if (nextFile.size > MAX_RESOURCE_FILE_SIZE_BYTES) {
      setError('文件大小不能超过 200MB');
      event.target.value = '';
      return;
    }

    setFile(nextFile);
    if (!title.trim()) setTitle(nextFile.name.replace(/\.[^.]+$/, ''));
    setError('');
  }

  async function handleSubmit() {
    if (!file) return setError('请选择文件');
    if (!title.trim()) return setError('请填写资料标题');

    setUploading(true);
    setError('');

    try {
      const formData = new FormData();
      formData.append('file', file);
      formData.append('title', title.trim());
      formData.append('subject', subject);
      formData.append('resourceType', resourceType);
      formData.append('uploader', uploader.trim());

      const response = await fetch('/api/resources', { method: 'POST', body: formData });
      const data = await response.json().catch(() => null);
      if (!response.ok) return setError(data?.error || '上传失败');

      resetForm();
      onOpenChange(false);
      onSuccess();
    } catch {
      setError('网络错误，请重试');
    } finally {
      setUploading(false);
    }
  }

  function resetForm() {
    setError('');
    setFile(null);
    setTitle('');
    setSubject('general');
    setResourceType('other');
    setUploader('');
    if (fileRef.current) fileRef.current.value = '';
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader><DialogTitle>上传学习资料</DialogTitle></DialogHeader>
        <UploadFormFields
          error={error}
          file={file}
          fileRef={fileRef}
          resourceType={resourceType}
          subject={subject}
          title={title}
          uploader={uploader}
          onFileChange={handleFileChange}
          onResourceTypeChange={setResourceType}
          onSubjectChange={setSubject}
          onTitleChange={setTitle}
          onUploaderChange={setUploader}
        />
        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)} disabled={uploading}>取消</Button>
          <Button onClick={handleSubmit} disabled={uploading}>{uploading ? '上传中...' : '上传'}</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
