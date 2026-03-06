import { and, asc, desc, eq, like, or, sql, type SQL } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { resources } from '@/lib/db/schema';
import { checkUploadRateLimit } from '@/lib/resources/rate-limit';
import { createStoragePath, removeUploadFile, writeFileToUploads } from '@/lib/resources/storage';
import { getClientIp, parseResourceListParams, parseResourceUpload } from '@/lib/resources/security';

export const runtime = 'nodejs';

export async function GET(request: NextRequest) {
  try {
    const params = parseResourceListParams(request.nextUrl.searchParams);
    const conditions: SQL[] = [];
    if (params.subject) conditions.push(eq(resources.subject, params.subject));
    if (params.type) conditions.push(eq(resources.resourceType, params.type));
    if (params.uploader) conditions.push(eq(resources.uploader, params.uploader));
    if (params.search) {
      conditions.push(or(like(resources.title, `%${params.search}%`), like(resources.originalName, `%${params.search}%`)) as SQL);
    }

    const whereClause = conditions.length > 0 ? and(...conditions) : undefined;
    const orderBy = params.sort === 'downloads'
      ? desc(resources.downloadCount)
      : params.sort === 'size'
        ? desc(resources.fileSize)
        : params.sort === 'oldest'
          ? asc(resources.createdAt)
          : desc(resources.createdAt);

    const [items, countResult] = await Promise.all([
      db.select().from(resources).where(whereClause).orderBy(orderBy).limit(params.limit).offset(params.offset),
      db.select({ count: sql<number>`count(*)` }).from(resources).where(whereClause),
    ]);

    return NextResponse.json({ items, total: countResult[0]?.count ?? 0 });
  } catch (error) {
    return NextResponse.json({ error: error instanceof Error ? error.message : '资料列表查询失败' }, { status: 400 });
  }
}

export async function POST(request: NextRequest) {
  let storagePath: string | null = null;

  try {
    const payload = await parseResourceUpload(await request.formData());
    const rateLimit = checkUploadRateLimit(getClientIp(request), payload.fileSize);
    if (!rateLimit.ok) {
      return NextResponse.json(
        { error: '上传过于频繁，请稍后再试' },
        { status: 429, headers: { 'Retry-After': String(rateLimit.retryAfterSeconds) } }
      );
    }

    storagePath = createStoragePath(payload.fileExt);
    await writeFileToUploads(payload.file, storagePath);

    const result = db.insert(resources).values({
      fileExt: payload.fileExt,
      fileSize: payload.fileSize,
      mimeType: payload.mimeType,
      originalName: payload.originalName,
      resourceType: payload.resourceType,
      storagePath,
      subject: payload.subject,
      title: payload.title,
      uploader: payload.uploader,
    }).run();

    return NextResponse.json({ id: result.lastInsertRowid, success: true });
  } catch (error) {
    if (storagePath) removeUploadFile(storagePath);
    const message = error instanceof Error ? error.message : '上传失败，请重试';
    return NextResponse.json({ error: message }, { status: isClientUploadError(message) ? 400 : 500 });
  }
}

function isClientUploadError(message: string) {
  return [
    '请选择要上传的文件',
    '文件不能为空',
    '文件大小不能超过 200MB',
    '不支持的文件格式',
    '请填写 1 到 200 字的资料标题',
    '无效的学科分类',
    '无效的资料类型',
    '上传者昵称不能超过 24 字',
    '文件内容与扩展名不匹配，请检查后重新上传',
  ].includes(message);
}
