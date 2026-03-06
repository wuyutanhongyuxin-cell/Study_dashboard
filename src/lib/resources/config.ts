export const RESOURCE_SUBJECT_VALUES = [
  'politics',
  'english',
  'math',
  'major',
  'general',
] as const;

export const RESOURCE_TYPE_VALUES = [
  'textbook',
  'exam_paper',
  'notes',
  'video',
  'tool',
  'other',
] as const;

export const RESOURCE_SORT_VALUES = ['newest', 'oldest', 'downloads', 'size'] as const;

export type ResourceSubject = typeof RESOURCE_SUBJECT_VALUES[number];
export type ResourceType = typeof RESOURCE_TYPE_VALUES[number];
export type ResourceSort = typeof RESOURCE_SORT_VALUES[number];
export type ResourcePreviewKind = 'image' | 'pdf' | null;

export const MAX_RESOURCE_FILE_SIZE_BYTES = 200 * 1024 * 1024;
export const MAX_RESOURCE_FILE_SIZE_LABEL = '200MB';
export const RESOURCE_UPLOAD_WINDOW_MS = 60 * 60 * 1000;
export const RESOURCE_UPLOAD_MAX_COUNT = 8;
export const RESOURCE_UPLOAD_MAX_BYTES = 1024 * 1024 * 1024;

export const RESOURCE_SUBJECTS = [
  { id: 'all', name: '全部' },
  { id: 'politics', name: '政治' },
  { id: 'english', name: '英语一' },
  { id: 'math', name: '数学一' },
  { id: 'major', name: '874专业课' },
  { id: 'general', name: '通用资料' },
] as const;

export const RESOURCE_TYPES = [
  { id: 'all', name: '全部类型' },
  { id: 'textbook', name: '教材课本' },
  { id: 'exam_paper', name: '历年真题' },
  { id: 'notes', name: '学习笔记' },
  { id: 'video', name: '视频片段' },
  { id: 'tool', name: '工具软件' },
  { id: 'other', name: '其他' },
] as const;

export const VIP_USERS = [
  { id: 'liumiao', nickname: '刘喵', emoji: '🐱', tabLabel: '🐱刘喵的资料' },
  { id: 'mx', nickname: 'MX', emoji: '⭐', tabLabel: '⭐MX的资料' },
] as const;

export const RESOURCE_FILE_RULES = {
  pdf: { label: 'PDF', icon: '📄', color: 'text-red-500', mimeType: 'application/pdf', previewKind: 'pdf' },
  doc: { label: 'Word', icon: '📝', color: 'text-blue-500', mimeType: 'application/msword', previewKind: null },
  docx: { label: 'Word', icon: '📝', color: 'text-blue-500', mimeType: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', previewKind: null },
  xls: { label: 'Excel', icon: '📊', color: 'text-green-500', mimeType: 'application/vnd.ms-excel', previewKind: null },
  xlsx: { label: 'Excel', icon: '📊', color: 'text-green-500', mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', previewKind: null },
  ppt: { label: 'PPT', icon: '📽️', color: 'text-orange-500', mimeType: 'application/vnd.ms-powerpoint', previewKind: null },
  pptx: { label: 'PPT', icon: '📽️', color: 'text-orange-500', mimeType: 'application/vnd.openxmlformats-officedocument.presentationml.presentation', previewKind: null },
  png: { label: '图片', icon: '🖼️', color: 'text-sky-500', mimeType: 'image/png', previewKind: 'image' },
  jpg: { label: '图片', icon: '🖼️', color: 'text-sky-500', mimeType: 'image/jpeg', previewKind: 'image' },
  jpeg: { label: '图片', icon: '🖼️', color: 'text-sky-500', mimeType: 'image/jpeg', previewKind: 'image' },
  gif: { label: 'GIF', icon: '🖼️', color: 'text-sky-500', mimeType: 'image/gif', previewKind: 'image' },
  webp: { label: 'WebP', icon: '🖼️', color: 'text-sky-500', mimeType: 'image/webp', previewKind: 'image' },
  zip: { label: 'ZIP', icon: '📦', color: 'text-yellow-600', mimeType: 'application/zip', previewKind: null },
  rar: { label: 'RAR', icon: '📦', color: 'text-yellow-600', mimeType: 'application/vnd.rar', previewKind: null },
  '7z': { label: '7Z', icon: '📦', color: 'text-yellow-600', mimeType: 'application/x-7z-compressed', previewKind: null },
  tar: { label: 'TAR', icon: '📦', color: 'text-yellow-600', mimeType: 'application/x-tar', previewKind: null },
  gz: { label: 'GZ', icon: '📦', color: 'text-yellow-600', mimeType: 'application/gzip', previewKind: null },
  mp4: { label: '视频', icon: '🎬', color: 'text-pink-500', mimeType: 'video/mp4', previewKind: null },
  mp3: { label: '音频', icon: '🎵', color: 'text-cyan-500', mimeType: 'audio/mpeg', previewKind: null },
  wav: { label: '音频', icon: '🎵', color: 'text-cyan-500', mimeType: 'audio/wav', previewKind: null },
  txt: { label: '文本', icon: '📃', color: 'text-gray-500', mimeType: 'text/plain; charset=utf-8', previewKind: null },
  md: { label: 'Markdown', icon: '📃', color: 'text-gray-500', mimeType: 'text/markdown; charset=utf-8', previewKind: null },
  csv: { label: 'CSV', icon: '📃', color: 'text-gray-500', mimeType: 'text/csv; charset=utf-8', previewKind: null },
  json: { label: 'JSON', icon: '📃', color: 'text-gray-500', mimeType: 'application/json; charset=utf-8', previewKind: null },
} as const satisfies Record<string, {
  label: string;
  icon: string;
  color: string;
  mimeType: string;
  previewKind: ResourcePreviewKind;
}>;

export const FILE_FORMAT_CONFIG = RESOURCE_FILE_RULES;
export const ALLOWED_EXTENSIONS = new Set(Object.keys(RESOURCE_FILE_RULES));
export const RESOURCE_PREVIEWABLE_EXTENSIONS = new Set(
  Object.entries(RESOURCE_FILE_RULES)
    .filter(([, rule]) => rule.previewKind !== null)
    .map(([ext]) => ext)
);
export const RESOURCE_ACCEPT_ATTR = Object.keys(RESOURCE_FILE_RULES)
  .map((ext) => `.${ext}`)
  .join(',');

export function getFileFormatConfig(fileExt: string) {
  const rule = RESOURCE_FILE_RULES[fileExt as keyof typeof RESOURCE_FILE_RULES];
  if (rule) return rule;
  return {
    color: 'text-gray-500',
    icon: '📎',
    label: fileExt ? fileExt.toUpperCase() : '文件',
    mimeType: 'application/octet-stream',
    previewKind: null,
  } as const;
}
