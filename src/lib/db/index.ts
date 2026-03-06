import Database from 'better-sqlite3';
import fs from 'fs';
import path from 'path';
import { drizzle } from 'drizzle-orm/better-sqlite3';
import { migrateResourcesToV2, RESOURCES_TABLE_SQL } from '@/lib/db/resources-table';
import * as schema from './schema';

const dataDir = path.join(process.cwd(), 'data');
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const dbPath = path.join(dataDir, 'study.db');
const sqlite = new Database(dbPath);
sqlite.pragma('journal_mode = WAL');
sqlite.pragma('foreign_keys = ON');

export const db = drizzle(sqlite, { schema });

sqlite.exec(`
  CREATE TABLE IF NOT EXISTS study_sessions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subject TEXT NOT NULL,
    start_time TEXT NOT NULL,
    end_time TEXT,
    duration INTEGER,
    notes TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS daily_progress (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL UNIQUE,
    politics_minutes INTEGER NOT NULL DEFAULT 0,
    english_minutes INTEGER NOT NULL DEFAULT 0,
    math_minutes INTEGER NOT NULL DEFAULT 0,
    major_minutes INTEGER NOT NULL DEFAULT 0,
    total_minutes INTEGER NOT NULL DEFAULT 0,
    mood INTEGER,
    efficiency INTEGER,
    summary TEXT
  );

  CREATE TABLE IF NOT EXISTS chat_conversations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL DEFAULT 'New Chat',
    created_at TEXT NOT NULL DEFAULT (datetime('now')),
    updated_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS chat_messages (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    conversation_id INTEGER NOT NULL REFERENCES chat_conversations(id),
    role TEXT NOT NULL CHECK(role IN ('user', 'assistant')),
    content TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS agent_reports (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    agent_type TEXT NOT NULL CHECK(agent_type IN ('analyst', 'strategist', 'coach')),
    content TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS morning_briefs (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL UNIQUE,
    content TEXT NOT NULL,
    metrics TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS intel_items (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    date TEXT NOT NULL,
    category TEXT NOT NULL CHECK(category IN ('policy', 'experience', 'resource', 'news')),
    title TEXT NOT NULL,
    summary TEXT NOT NULL,
    url TEXT,
    source TEXT,
    relevance REAL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );

  CREATE TABLE IF NOT EXISTS knowledge_nodes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    subject TEXT NOT NULL,
    parent_id INTEGER,
    name TEXT NOT NULL,
    description TEXT,
    status TEXT NOT NULL DEFAULT 'not_started' CHECK(status IN ('not_started', 'learning', 'reviewing', 'mastered')),
    sort_order INTEGER NOT NULL DEFAULT 0
  );

  ${RESOURCES_TABLE_SQL}

  CREATE TABLE IF NOT EXISTS goals (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL,
    type TEXT NOT NULL CHECK(type IN ('daily', 'weekly', 'monthly', 'phase')),
    subject TEXT,
    target_value INTEGER,
    current_value INTEGER NOT NULL DEFAULT 0,
    unit TEXT DEFAULT 'minutes',
    completed INTEGER NOT NULL DEFAULT 0,
    due_date TEXT,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`);

function runStartupMigrations() {
  let version = Number(sqlite.pragma('user_version', { simple: true }) || 0);
  if (version < 1) {
    migrateToV1();
    version = 1;
  }
  if (version < 2) {
    migrateResourcesToV2(sqlite);
  }
}

function migrateToV1() {
  const transaction = sqlite.transaction(() => {
    const tables = ['study_sessions', 'chat_conversations', 'chat_messages', 'agent_reports', 'morning_briefs', 'intel_items', 'goals'];

    tables.forEach((table) => {
      sqlite.prepare(`UPDATE ${table} SET created_at = datetime('now') WHERE created_at = '(datetime(''now''))'`).run();
    });
    sqlite.prepare("UPDATE chat_conversations SET updated_at = datetime('now') WHERE updated_at = '(datetime(''now''))'").run();
    sqlite.prepare('CREATE UNIQUE INDEX IF NOT EXISTS idx_intel_items_date_title ON intel_items(date, title);').run();
    sqlite.prepare('CREATE UNIQUE INDEX IF NOT EXISTS idx_agent_reports_date_agent_type ON agent_reports(date, agent_type);').run();
    sqlite.prepare(`DELETE FROM intel_items WHERE EXISTS (SELECT 1 FROM intel_items older WHERE older.date = intel_items.date AND older.title = intel_items.title AND older.id < intel_items.id);`).run();
    sqlite.prepare(`DELETE FROM agent_reports WHERE EXISTS (SELECT 1 FROM agent_reports older WHERE older.date = agent_reports.date AND older.agent_type = agent_reports.agent_type AND older.id < agent_reports.id);`).run();
    sqlite.pragma('user_version = 1');
  });

  transaction();
}

runStartupMigrations();
