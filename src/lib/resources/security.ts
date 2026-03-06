import type { NextRequest } from 'next/server';
import {
  ALLOWED_EXTENSIONS,
  MAX_RESOURCE_FILE_SIZE_BYTES,
  RESOURCE_FILE_RULES,
  RESOURCE_SORT_VALUES,
  RESOURCE_SUBJECT_VALUES,
  RESOURCE_TYPE_VALUES,
  type ResourceSort,
  type ResourceSubject,
  type ResourceType,
} from '@/lib/resources/config';
import { matchesExpectedSignature } from '@/lib/resources/file-signatures';

export interface ResourceListParams {
  limit: number;
  offset: number;
  search: string | null;
  sort: ResourceSort;
  subject: ResourceSubject | null;
  type: ResourceType | null;
  uploader: string | null;
}

export interface ResourceUploadPayload {
  file: File;
  fileExt: string;
  fileSize: number;
  mimeType: string;
  originalName: string;
  resourceType: ResourceType;
  subject: ResourceSubject;
  title: string;
  uploader: string;
}

export function parseResourceListParams(searchParams: URLSearchParams): ResourceListParams {
  return {
    limit: parseInteger(searchParams.get('limit'), 'limit', 50, 1, 200),
    offset: parseInteger(searchParams.get('offset'), 'offset', 0, 0, 10_000),
    search: normalizeSearch(searchParams.get('search')),
    sort: parseOptionalEnum(searchParams.get('sort'), RESOURCE_SORT_VALUES, '无效的排序方式') ?? 'newest',
    subject: parseOptionalEnum(searchParams.get('subject'), RESOURCE_SUBJECT_VALUES, '无效的学科分类'),
    type: parseOptionalEnum(searchParams.get('type'), RESOURCE_TYPE_VALUES, '无效的资料类型'),
    uploader: normalizeUploader(searchParams.get('uploader')),
  };
}

export async function parseResourceUpload(formData: FormData): Promise<ResourceUploadPayload> {
  const file = formData.get('file');
  if (!(file instanceof File)) {
    throw new Error('请选择要上传的文件');
  }
  if (file.size <= 0) {
    throw new Error('文件不能为空');
  }
  if (file.size > MAX_RESOURCE_FILE_SIZE_BYTES) {
    throw new Error('文件大小不能超过 200MB');
  }

  const originalName = file.name.trim();
  const fileExt = getFileExtension(originalName);
  if (!fileExt || !ALLOWED_EXTENSIONS.has(fileExt)) {
    throw new Error('不支持的文件格式');
  }

  const title = normalizeTitle(formData.get('title'));
  if (!title) {
    throw new Error('请填写 1 到 200 字的资料标题');
  }

  const subject = parseRequiredEnum(formData.get('subject'), RESOURCE_SUBJECT_VALUES, '无效的学科分类');
  const resourceType = parseRequiredEnum(formData.get('resourceType'), RESOURCE_TYPE_VALUES, '无效的资料类型');
  const uploader = normalizeUploader(formData.get('uploader')) ?? '匿名';
  const mimeType = getSafeMimeType(fileExt);
  const header = Buffer.from(await file.slice(0, 512).arrayBuffer());

  if (!matchesExpectedSignature(fileExt, header)) {
    throw new Error('文件内容与扩展名不匹配，请检查后重新上传');
  }

  return { file, fileExt, fileSize: file.size, mimeType, originalName, resourceType, subject, title, uploader };
}

export function getSafeMimeType(fileExt: string): string {
  return RESOURCE_FILE_RULES[fileExt as keyof typeof RESOURCE_FILE_RULES]?.mimeType ?? 'application/octet-stream';
}

export function encodeDownloadName(fileName: string) {
  return encodeURIComponent(fileName).replace(/'/g, '%27');
}

export function getClientIp(request: NextRequest): string {
  const forwardedFor = request.headers.get('x-forwarded-for');
  if (forwardedFor) {
    return forwardedFor.split(',')[0]?.trim() || 'unknown';
  }
  return request.headers.get('x-real-ip')?.trim() || 'unknown';
}

function parseInteger(raw: string | null, name: string, fallback: number, min: number, max: number) {
  if (raw === null || raw === '') return fallback;
  const value = Number(raw);
  if (!Number.isInteger(value) || value < min || value > max) {
    throw new Error(`${name} 参数无效`);
  }
  return value;
}

function parseOptionalEnum<T extends readonly string[]>(raw: string | null, values: T, error: string): T[number] | null {
  if (!raw || raw === 'all') return null;
  if (values.includes(raw as T[number])) {
    return raw as T[number];
  }
  throw new Error(error);
}

function parseRequiredEnum<T extends readonly string[]>(raw: FormDataEntryValue | null, values: T, error: string): T[number] {
  if (typeof raw === 'string' && values.includes(raw as T[number])) {
    return raw as T[number];
  }
  throw new Error(error);
}

function normalizeTitle(raw: FormDataEntryValue | null) {
  if (typeof raw !== 'string') return null;
  const title = raw.replace(/\s+/g, ' ').trim();
  if (!title || title.length > 200) return null;
  return title;
}

function normalizeUploader(raw: FormDataEntryValue | null) {
  if (typeof raw !== 'string') return null;
  const uploader = raw.replace(/[\u0000-\u001f\u007f]/g, '').replace(/\s+/g, ' ').trim();
  if (!uploader) return null;
  if (uploader.length > 24) {
    throw new Error('上传者昵称不能超过 24 字');
  }
  return uploader;
}

function normalizeSearch(raw: string | null) {
  const value = raw?.replace(/\s+/g, ' ').trim();
  if (!value) return null;
  if (value.length > 100) {
    throw new Error('搜索关键词不能超过 100 字');
  }
  return value;
}

function getFileExtension(fileName: string) {
  const ext = fileName.split('.').pop()?.toLowerCase() ?? '';
  return ext.replace(/[^a-z0-9]/g, '');
}
