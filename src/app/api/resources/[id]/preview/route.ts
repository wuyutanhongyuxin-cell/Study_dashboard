import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { resources } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import fs from 'fs';
import path from 'path';

export const runtime = 'nodejs';

export async function GET(
  _request: NextRequest,
  { params }: { params: { id: string } }
) {
  const id = Number(params.id);
  if (!Number.isFinite(id) || id <= 0) {
    return NextResponse.json({ error: '无效的资料 ID' }, { status: 400 });
  }

  const item = db.select().from(resources).where(eq(resources.id, id)).get();
  if (!item) {
    return NextResponse.json({ error: '资料不存在' }, { status: 404 });
  }

  const filePath = path.join(process.cwd(), 'data', 'uploads', item.storagePath);
  if (!fs.existsSync(filePath)) {
    return NextResponse.json({ error: '文件不存在' }, { status: 404 });
  }

  const fileBuffer = fs.readFileSync(filePath);

  // 预览用 inline，不递增下载计数
  const encodedName = encodeURIComponent(item.originalName).replace(/'/g, '%27');

  return new NextResponse(fileBuffer, {
    headers: {
      'Content-Type': item.mimeType,
      'Content-Length': String(item.fileSize),
      'Content-Disposition': `inline; filename*=UTF-8''${encodedName}`,
      'Cache-Control': 'public, max-age=3600',
    },
  });
}
