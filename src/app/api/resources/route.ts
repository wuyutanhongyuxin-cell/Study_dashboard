import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { resources } from '@/lib/db/schema';
import { desc, eq, like, sql, and, asc } from 'drizzle-orm';
import { ALLOWED_EXTENSIONS } from '@/lib/constants';
import fs from 'fs';
import path from 'path';
import crypto from 'crypto';

export const runtime = 'nodejs';

const MAX_FILE_SIZE = 50 * 1024 * 1024; // 50MB
const VALID_SUBJECTS = ['politics', 'english', 'math', 'major', 'general'] as const;
const VALID_TYPES = ['textbook', 'exam_paper', 'notes', 'video_link', 'tool', 'other'] as const;

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const subject = searchParams.get('subject');
  const type = searchParams.get('type');
  const uploader = searchParams.get('uploader');
  const search = searchParams.get('search');
  const sort = searchParams.get('sort') || 'newest';
  const limit = Math.min(Number(searchParams.get('limit') || 50), 200);
  const offset = Number(searchParams.get('offset') || 0);

  // 动态组合 WHERE 条件
  const conditions = [];
  if (subject && subject !== 'all') {
    conditions.push(eq(resources.subject, subject));
  }
  if (type && type !== 'all') {
    conditions.push(eq(resources.resourceType, type));
  }
  if (uploader) {
    conditions.push(eq(resources.uploader, uploader));
  }
  if (search) {
    conditions.push(like(resources.title, `%${search}%`));
  }

  const whereClause = conditions.length > 0 ? and(...conditions) : undefined;

  // 排序
  const orderBy = sort === 'downloads'
    ? desc(resources.downloadCount)
    : sort === 'size'
      ? desc(resources.fileSize)
      : sort === 'oldest'
        ? asc(resources.createdAt)
        : desc(resources.createdAt);

  const [items, countResult] = await Promise.all([
    db.select().from(resources).where(whereClause).orderBy(orderBy).limit(limit).offset(offset),
    db.select({ count: sql<number>`count(*)` }).from(resources).where(whereClause),
  ]);

  return NextResponse.json({
    items,
    total: countResult[0]?.count ?? 0,
  });
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const file = formData.get('file') as File | null;
    const title = (formData.get('title') as string)?.trim();
    const subject = (formData.get('subject') as string) || 'general';
    const resourceType = (formData.get('resourceType') as string) || 'other';
    const uploader = (formData.get('uploader') as string)?.trim() || '匿名';

    // 验证文件存在
    if (!file || !(file instanceof File)) {
      return NextResponse.json({ error: '请选择要上传的文件' }, { status: 400 });
    }

    // 验证文件大小
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: '文件大小不能超过 50MB' }, { status: 400 });
    }
    if (file.size === 0) {
      return NextResponse.json({ error: '文件不能为空' }, { status: 400 });
    }

    // 验证扩展名
    const originalName = file.name;
    const ext = originalName.split('.').pop()?.toLowerCase() || '';
    if (!ALLOWED_EXTENSIONS.has(ext)) {
      return NextResponse.json({ error: `不支持的文件格式: .${ext}` }, { status: 400 });
    }

    // 验证标题
    if (!title) {
      return NextResponse.json({ error: '请填写资料标题' }, { status: 400 });
    }
    if (title.length > 200) {
      return NextResponse.json({ error: '标题不能超过 200 字' }, { status: 400 });
    }

    // 验证枚举值
    if (!VALID_SUBJECTS.includes(subject as typeof VALID_SUBJECTS[number])) {
      return NextResponse.json({ error: '无效的学科分类' }, { status: 400 });
    }
    if (!VALID_TYPES.includes(resourceType as typeof VALID_TYPES[number])) {
      return NextResponse.json({ error: '无效的资料类型' }, { status: 400 });
    }

    // 存储文件：data/uploads/YYYY-MM-DD/<uuid>.<ext>
    const dateStr = new Date().toISOString().slice(0, 10);
    const uuid = crypto.randomUUID();
    const storagePath = `${dateStr}/${uuid}.${ext}`;
    const uploadsDir = path.join(process.cwd(), 'data', 'uploads', dateStr);

    if (!fs.existsSync(uploadsDir)) {
      fs.mkdirSync(uploadsDir, { recursive: true });
    }

    const filePath = path.join(uploadsDir, `${uuid}.${ext}`);
    const buffer = Buffer.from(await file.arrayBuffer());
    fs.writeFileSync(filePath, buffer);

    // 写入数据库
    const result = db.insert(resources).values({
      title,
      originalName,
      storagePath,
      fileSize: file.size,
      mimeType: file.type || 'application/octet-stream',
      fileExt: ext,
      subject,
      resourceType,
      uploader,
    }).run();

    return NextResponse.json({ success: true, id: result.lastInsertRowid });
  } catch (err) {
    console.error('Upload failed:', err);
    return NextResponse.json({ error: '上传失败，请重试' }, { status: 500 });
  }
}
