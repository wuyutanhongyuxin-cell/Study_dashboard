import fs from 'fs';
import path from 'path';
import { randomUUID } from 'crypto';
import { Readable } from 'stream';
import type { ReadableStream as NodeReadableStream } from 'stream/web';
import { pipeline } from 'stream/promises';
import { matchesExpectedSignature } from '@/lib/resources/file-signatures';
import { RESOURCE_PREVIEWABLE_EXTENSIONS } from '@/lib/resources/config';

export function createStoragePath(fileExt: string) {
  const dateDir = new Date().toISOString().slice(0, 10);
  return `${dateDir}/${randomUUID()}.${fileExt}`;
}

export function resolveUploadPath(storagePath: string): string {
  const uploadsRoot = path.resolve(process.cwd(), 'data', 'uploads');
  const filePath = path.resolve(uploadsRoot, storagePath);
  const relative = path.relative(uploadsRoot, filePath);
  if (relative.startsWith('..') || path.isAbsolute(relative)) {
    throw new Error('非法的文件路径');
  }
  return filePath;
}

export async function writeFileToUploads(file: File, storagePath: string) {
  const filePath = resolveUploadPath(storagePath);
  fs.mkdirSync(path.dirname(filePath), { recursive: true });
  const stream = Readable.fromWeb(file.stream() as unknown as NodeReadableStream<Uint8Array>);
  await pipeline(stream, fs.createWriteStream(filePath, { flags: 'wx' }));
}

export function removeUploadFile(storagePath: string) {
  try {
    fs.rmSync(resolveUploadPath(storagePath), { force: true });
  } catch {
    // 忽略清理失败，避免覆盖主错误。
  }
}

export function createFileBody(filePath: string) {
  return Readable.toWeb(fs.createReadStream(filePath)) as ReadableStream<Uint8Array>;
}

export function getFileSize(filePath: string) {
  return fs.statSync(filePath).size;
}

export function ensurePreviewFileLooksSafe(fileExt: string, filePath: string) {
  if (!RESOURCE_PREVIEWABLE_EXTENSIONS.has(fileExt)) {
    throw new Error('当前文件格式不支持在线预览');
  }

  const fd = fs.openSync(filePath, 'r');
  const header = Buffer.alloc(512);
  try {
    fs.readSync(fd, header, 0, header.length, 0);
  } finally {
    fs.closeSync(fd);
  }

  if (!matchesExpectedSignature(fileExt, header)) {
    throw new Error('文件内容校验失败，已拒绝预览');
  }
}
