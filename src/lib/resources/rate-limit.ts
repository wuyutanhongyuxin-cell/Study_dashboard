import {
  RESOURCE_UPLOAD_MAX_BYTES,
  RESOURCE_UPLOAD_MAX_COUNT,
  RESOURCE_UPLOAD_WINDOW_MS,
} from '@/lib/resources/config';

interface UploadEntry {
  bytes: number;
  timestamp: number;
}

const uploadWindow = new Map<string, UploadEntry[]>();

export function checkUploadRateLimit(ip: string, fileSize: number) {
  const now = Date.now();
  const entries = (uploadWindow.get(ip) ?? []).filter((entry) => now - entry.timestamp < RESOURCE_UPLOAD_WINDOW_MS);
  const usedBytes = entries.reduce((total, entry) => total + entry.bytes, 0);

  if (entries.length >= RESOURCE_UPLOAD_MAX_COUNT || usedBytes + fileSize > RESOURCE_UPLOAD_MAX_BYTES) {
    const retryAfterMs = RESOURCE_UPLOAD_WINDOW_MS - (now - entries[0].timestamp);
    return {
      ok: false as const,
      retryAfterSeconds: Math.max(60, Math.ceil(retryAfterMs / 1000)),
    };
  }

  entries.push({ bytes: fileSize, timestamp: now });
  uploadWindow.set(ip, entries);
  return { ok: true as const };
}
