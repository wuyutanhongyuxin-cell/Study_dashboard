import type Database from 'better-sqlite3';
import {
  ALLOWED_EXTENSIONS,
  MAX_RESOURCE_FILE_SIZE_BYTES,
  RESOURCE_SUBJECT_VALUES,
  RESOURCE_TYPE_VALUES,
} from '@/lib/resources/config';

const resourceSubjectsSql = quoteSqlList(RESOURCE_SUBJECT_VALUES);
const resourceTypesSql = quoteSqlList(RESOURCE_TYPE_VALUES);
const resourceExtSql = quoteSqlList(Array.from(ALLOWED_EXTENSIONS).sort());

export const RESOURCES_TABLE_SQL = `
  CREATE TABLE IF NOT EXISTS resources (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    title TEXT NOT NULL CHECK(length(trim(title)) BETWEEN 1 AND 200),
    original_name TEXT NOT NULL,
    storage_path TEXT NOT NULL,
    file_size INTEGER NOT NULL CHECK(file_size > 0 AND file_size <= ${MAX_RESOURCE_FILE_SIZE_BYTES}),
    mime_type TEXT NOT NULL,
    file_ext TEXT NOT NULL CHECK(file_ext IN (${resourceExtSql})),
    subject TEXT NOT NULL DEFAULT 'general' CHECK(subject IN (${resourceSubjectsSql})),
    resource_type TEXT NOT NULL DEFAULT 'other' CHECK(resource_type IN (${resourceTypesSql})),
    uploader TEXT NOT NULL DEFAULT '鍖垮悕' CHECK(length(trim(uploader)) BETWEEN 1 AND 24),
    download_count INTEGER NOT NULL DEFAULT 0 CHECK(download_count >= 0),
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  );
`;

export function migrateResourcesToV2(sqlite: Database.Database) {
  const transaction = sqlite.transaction(() => {
    sqlite.prepare('ALTER TABLE resources RENAME TO resources_legacy;').run();
    sqlite.exec(RESOURCES_TABLE_SQL);
    sqlite.prepare(`
      INSERT INTO resources (
        id, title, original_name, storage_path, file_size, mime_type,
        file_ext, subject, resource_type, uploader, download_count, created_at
      )
      SELECT
        id,
        CASE WHEN length(trim(title)) BETWEEN 1 AND 200 THEN trim(title) ELSE trim(original_name) END,
        original_name,
        storage_path,
        CASE WHEN file_size > 0 AND file_size <= ${MAX_RESOURCE_FILE_SIZE_BYTES} THEN file_size ELSE 1 END,
        CASE WHEN length(trim(mime_type)) > 0 THEN trim(mime_type) ELSE 'application/octet-stream' END,
        CASE
          WHEN lower(file_ext) IN (${resourceExtSql}) THEN lower(file_ext)
          ELSE lower(substr(original_name, instr(original_name, '.') + 1))
        END,
        CASE WHEN subject IN (${resourceSubjectsSql}) THEN subject ELSE 'general' END,
        CASE
          WHEN resource_type = 'video_link' THEN 'video'
          WHEN resource_type IN (${resourceTypesSql}) THEN resource_type
          ELSE 'other'
        END,
        CASE WHEN length(trim(uploader)) BETWEEN 1 AND 24 THEN trim(uploader) ELSE '鍖垮悕' END,
        CASE WHEN download_count >= 0 THEN download_count ELSE 0 END,
        COALESCE(created_at, datetime('now'))
      FROM resources_legacy
      WHERE lower(
        CASE
          WHEN lower(file_ext) IN (${resourceExtSql}) THEN lower(file_ext)
          ELSE lower(substr(original_name, instr(original_name, '.') + 1))
        END
      ) IN (${resourceExtSql});
    `).run();
    sqlite.prepare('DROP TABLE resources_legacy;').run();
    sqlite.pragma('user_version = 2');
  });

  transaction();
}

function quoteSqlList(values: readonly string[]) {
  return values.map((value) => `'${value}'`).join(', ');
}
