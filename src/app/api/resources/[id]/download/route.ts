import { eq, sql } from 'drizzle-orm';
import { NextRequest, NextResponse } from 'next/server';
import { db } from '@/lib/db';
import { resources } from '@/lib/db/schema';
import { createFileBody, getFileSize, resolveUploadPath } from '@/lib/resources/storage';
import { encodeDownloadName, getSafeMimeType } from '@/lib/resources/security';

export const runtime = 'nodejs';

export async function GET(_request: NextRequest, { params }: { params: { id: string } }) {
  try {
    const id = Number(params.id);
    if (!Number.isInteger(id) || id <= 0) {
      return NextResponse.json({ error: '无效的资料 ID' }, { status: 400 });
    }

    const item = db.select().from(resources).where(eq(resources.id, id)).get();
    if (!item) {
      return NextResponse.json({ error: '资料不存在' }, { status: 404 });
    }

    const filePath = resolveUploadPath(item.storagePath);
    const encodedName = encodeDownloadName(item.originalName);
    const fileSize = getFileSize(filePath);

    db.update(resources)
      .set({ downloadCount: sql`${resources.downloadCount} + 1` })
      .where(eq(resources.id, id))
      .run();

    return new NextResponse(createFileBody(filePath), {
      headers: {
        'Cache-Control': 'private, max-age=3600',
        'Content-Disposition': `attachment; filename*=UTF-8''${encodedName}`,
        'Content-Length': String(fileSize),
        'Content-Type': getSafeMimeType(item.fileExt),
      },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : '下载失败';
    const status = message === '非法的文件路径' ? 400 : message.includes('no such file') ? 404 : 500;
    return NextResponse.json({ error: status === 404 ? '文件不存在' : message }, { status });
  }
}
