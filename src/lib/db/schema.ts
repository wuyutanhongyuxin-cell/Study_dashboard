import { sqliteTable, text, integer, real } from 'drizzle-orm/sqlite-core';

export const studySessions = sqliteTable('study_sessions', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  subject: text('subject').notNull(),
  startTime: text('start_time').notNull(),
  endTime: text('end_time'),
  duration: integer('duration'), // minutes
  notes: text('notes'),
  createdAt: text('created_at').notNull().default("(datetime('now'))"),
});

export const dailyProgress = sqliteTable('daily_progress', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  date: text('date').notNull().unique(),
  politicsMinutes: integer('politics_minutes').notNull().default(0),
  englishMinutes: integer('english_minutes').notNull().default(0),
  mathMinutes: integer('math_minutes').notNull().default(0),
  majorMinutes: integer('major_minutes').notNull().default(0),
  totalMinutes: integer('total_minutes').notNull().default(0),
  mood: integer('mood'), // 1-5
  efficiency: integer('efficiency'), // 1-5
  summary: text('summary'),
});

export const chatConversations = sqliteTable('chat_conversations', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull().default('新对话'),
  createdAt: text('created_at').notNull().default("(datetime('now'))"),
  updatedAt: text('updated_at').notNull().default("(datetime('now'))"),
});

export const chatMessages = sqliteTable('chat_messages', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  conversationId: integer('conversation_id').notNull().references(() => chatConversations.id),
  role: text('role', { enum: ['user', 'assistant'] }).notNull(),
  content: text('content').notNull(),
  createdAt: text('created_at').notNull().default("(datetime('now'))"),
});

export const agentReports = sqliteTable('agent_reports', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  date: text('date').notNull(),
  agentType: text('agent_type', { enum: ['analyst', 'strategist', 'coach'] }).notNull(),
  content: text('content').notNull(), // JSON string
  createdAt: text('created_at').notNull().default("(datetime('now'))"),
});

export const morningBriefs = sqliteTable('morning_briefs', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  date: text('date').notNull().unique(),
  content: text('content').notNull(), // Markdown
  metrics: text('metrics'), // JSON string
  createdAt: text('created_at').notNull().default("(datetime('now'))"),
});

export const intelItems = sqliteTable('intel_items', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  date: text('date').notNull(),
  category: text('category', { enum: ['policy', 'experience', 'resource', 'news'] }).notNull(),
  title: text('title').notNull(),
  summary: text('summary').notNull(),
  url: text('url'),
  source: text('source'),
  relevance: real('relevance'), // 0-1
  createdAt: text('created_at').notNull().default("(datetime('now'))"),
});

export const knowledgeNodes = sqliteTable('knowledge_nodes', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  subject: text('subject').notNull(),
  parentId: integer('parent_id'),
  name: text('name').notNull(),
  description: text('description'),
  status: text('status', { enum: ['not_started', 'learning', 'reviewing', 'mastered'] }).notNull().default('not_started'),
  sortOrder: integer('sort_order').notNull().default(0),
});

export const goals = sqliteTable('goals', {
  id: integer('id').primaryKey({ autoIncrement: true }),
  title: text('title').notNull(),
  type: text('type', { enum: ['daily', 'weekly', 'monthly', 'phase'] }).notNull(),
  subject: text('subject'),
  targetValue: integer('target_value'),
  currentValue: integer('current_value').notNull().default(0),
  unit: text('unit').default('分钟'),
  completed: integer('completed', { mode: 'boolean' }).notNull().default(false),
  dueDate: text('due_date'),
  createdAt: text('created_at').notNull().default("(datetime('now'))"),
});

export type StudySession = typeof studySessions.$inferSelect;
export type DailyProgress = typeof dailyProgress.$inferSelect;
export type ChatConversation = typeof chatConversations.$inferSelect;
export type ChatMessage = typeof chatMessages.$inferSelect;
export type AgentReport = typeof agentReports.$inferSelect;
export type MorningBrief = typeof morningBriefs.$inferSelect;
export type IntelItem = typeof intelItems.$inferSelect;
export type KnowledgeNode = typeof knowledgeNodes.$inferSelect;
export type Goal = typeof goals.$inferSelect;
