'use client';

import type { ChangeEvent, RefObject } from 'react';
import { Upload } from 'lucide-react';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  MAX_RESOURCE_FILE_SIZE_LABEL,
  RESOURCE_ACCEPT_ATTR,
  RESOURCE_SUBJECTS,
  RESOURCE_TYPES,
} from '@/lib/constants';
import { formatFileSize } from '@/lib/utils';

interface UploadFormFieldsProps {
  error: string;
  file: File | null;
  fileRef: RefObject<HTMLInputElement>;
  resourceType: string;
  subject: string;
  title: string;
  uploader: string;
  onFileChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onResourceTypeChange: (value: string) => void;
  onSubjectChange: (value: string) => void;
  onTitleChange: (value: string) => void;
  onUploaderChange: (value: string) => void;
}

const subjectOptions = RESOURCE_SUBJECTS.filter((item) => item.id !== 'all');
const typeOptions = RESOURCE_TYPES.filter((item) => item.id !== 'all');

export function UploadFormFields(props: UploadFormFieldsProps) {
  const {
    error,
    file,
    fileRef,
    resourceType,
    subject,
    title,
    uploader,
    onFileChange,
    onResourceTypeChange,
    onSubjectChange,
    onTitleChange,
    onUploaderChange,
  } = props;

  return (
    <div className="space-y-4">
      <div>
        <label className="text-sm font-medium">选择文件</label>
        <button
          type="button"
          className="mt-1.5 w-full rounded-lg border-2 border-dashed p-4 text-center transition-colors hover:border-primary/50"
          onClick={() => fileRef.current?.click()}
        >
          {file ? (
            <div className="text-sm">
              <p className="truncate font-medium">{file.name}</p>
              <p className="text-muted-foreground">{formatFileSize(file.size)}</p>
            </div>
          ) : (
            <div className="text-sm text-muted-foreground">
              <Upload className="mx-auto mb-1 h-6 w-6" />
              <p>点击选择文件（最大 {MAX_RESOURCE_FILE_SIZE_LABEL}）</p>
            </div>
          )}
        </button>
        <input ref={fileRef} accept={RESOURCE_ACCEPT_ATTR} type="file" className="hidden" onChange={onFileChange} />
      </div>

      <div>
        <label className="text-sm font-medium">资料标题</label>
        <Input className="mt-1.5" value={title} onChange={(event) => onTitleChange(event.target.value)} placeholder="如：线性代数第三章笔记" />
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        <div>
          <label className="text-sm font-medium">学科</label>
          <Select value={subject} onValueChange={onSubjectChange}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>{subjectOptions.map((item) => <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>)}</SelectContent>
          </Select>
        </div>
        <div>
          <label className="text-sm font-medium">类型</label>
          <Select value={resourceType} onValueChange={onResourceTypeChange}>
            <SelectTrigger className="mt-1.5"><SelectValue /></SelectTrigger>
            <SelectContent>{typeOptions.map((item) => <SelectItem key={item.id} value={item.id}>{item.name}</SelectItem>)}</SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <label className="text-sm font-medium">上传者昵称</label>
        <Input className="mt-1.5" value={uploader} onChange={(event) => onUploaderChange(event.target.value)} placeholder="留空则显示“匿名”，VIP 请填写固定昵称" />
      </div>

      {error ? <p className="text-sm text-destructive">{error}</p> : null}
    </div>
  );
}
