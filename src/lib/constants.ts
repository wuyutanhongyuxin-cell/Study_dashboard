export const EXAM_DATE = new Date('2026-12-26');

export const SUBJECTS = [
  { id: 'politics', name: '政治', fullName: '思想政治理论', code: '101', totalHours: 300 },
  { id: 'english', name: '英语一', fullName: '英语一', code: '201', totalHours: 250 },
  { id: 'math', name: '数学一', fullName: '数学一', code: '301', totalHours: 500 },
  { id: 'major', name: '874', fullName: '874电子信息专业综合', code: '874', totalHours: 450 },
] as const;

export type SubjectId = typeof SUBJECTS[number]['id'];

export const NAV_ITEMS = [
  { id: 'dashboard', label: '学习看板', icon: 'LayoutDashboard', href: '/dashboard' },
  { id: 'chat', label: 'AI 督学', icon: 'MessageSquare', href: '/chat' },
  { id: 'agents', label: 'Agent 报告', icon: 'Bot', href: '/agents' },
  { id: 'briefs', label: '每日晨报', icon: 'Newspaper', href: '/briefs' },
  { id: 'intel', label: '信息聚合', icon: 'Search', href: '/intel' },
  { id: 'knowledge', label: '知识树', icon: 'GitBranch', href: '/knowledge' },
  { id: 'resources', label: '学习资料', icon: 'FolderOpen', href: '/resources' },
] as const;

export const STUDY_PHASES = [
  { id: 'foundation', name: '基础阶段', start: '2025-03', end: '2026-06' },
  { id: 'strengthen', name: '强化阶段', start: '2026-07', end: '2026-09' },
  { id: 'sprint', name: '冲刺阶段', start: '2026-10', end: '2026-12' },
] as const;

export const NODE_STATUS = {
  not_started: { label: '未开始', color: 'gray' },
  learning: { label: '学习中', color: 'blue' },
  reviewing: { label: '复习中', color: 'yellow' },
  mastered: { label: '已掌握', color: 'green' },
} as const;

export type NodeStatus = keyof typeof NODE_STATUS;

// ===== 学习资料库常量 =====

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
  { id: 'video_link', name: '视频链接' },
  { id: 'tool', name: '工具软件' },
  { id: 'other', name: '其他' },
] as const;

export const VIP_USERS = [
  { id: 'liumiao', nickname: '刘喵', emoji: '🐱', tabLabel: '🐱刘喵的资料' },
  { id: 'mx', nickname: 'MX', emoji: '⭐', tabLabel: '⭐MX的资料' },
] as const;

// 文件格式图标 + 颜色配置
export const FILE_FORMAT_CONFIG: Record<string, { icon: string; color: string; label: string }> = {
  pdf: { icon: '📄', color: 'text-red-500', label: 'PDF' },
  doc: { icon: '📝', color: 'text-blue-500', label: 'Word' },
  docx: { icon: '📝', color: 'text-blue-500', label: 'Word' },
  xls: { icon: '📊', color: 'text-green-500', label: 'Excel' },
  xlsx: { icon: '📊', color: 'text-green-500', label: 'Excel' },
  ppt: { icon: '📽️', color: 'text-orange-500', label: 'PPT' },
  pptx: { icon: '📽️', color: 'text-orange-500', label: 'PPT' },
  png: { icon: '🖼️', color: 'text-purple-500', label: '图片' },
  jpg: { icon: '🖼️', color: 'text-purple-500', label: '图片' },
  jpeg: { icon: '🖼️', color: 'text-purple-500', label: '图片' },
  gif: { icon: '🖼️', color: 'text-purple-500', label: 'GIF' },
  zip: { icon: '📦', color: 'text-yellow-600', label: 'ZIP' },
  rar: { icon: '📦', color: 'text-yellow-600', label: 'RAR' },
  '7z': { icon: '📦', color: 'text-yellow-600', label: '7Z' },
  mp4: { icon: '🎬', color: 'text-pink-500', label: '视频' },
  mp3: { icon: '🎵', color: 'text-cyan-500', label: '音频' },
  txt: { icon: '📃', color: 'text-gray-500', label: '文本' },
  md: { icon: '📃', color: 'text-gray-500', label: 'Markdown' },
};

// 允许上传的扩展名白名单
export const ALLOWED_EXTENSIONS = new Set([
  'pdf', 'doc', 'docx', 'xls', 'xlsx', 'ppt', 'pptx',
  'png', 'jpg', 'jpeg', 'gif', 'webp', 'svg',
  'zip', 'rar', '7z', 'tar', 'gz',
  'mp4', 'mp3', 'wav',
  'txt', 'md', 'csv', 'json',
]);
