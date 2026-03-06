export {
  ALLOWED_EXTENSIONS,
  FILE_FORMAT_CONFIG,
  getFileFormatConfig,
  MAX_RESOURCE_FILE_SIZE_BYTES,
  MAX_RESOURCE_FILE_SIZE_LABEL,
  RESOURCE_ACCEPT_ATTR,
  RESOURCE_SORT_VALUES,
  RESOURCE_SUBJECTS,
  RESOURCE_SUBJECT_VALUES,
  RESOURCE_TYPES,
  RESOURCE_TYPE_VALUES,
  VIP_USERS,
} from '@/lib/resources/config';

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
