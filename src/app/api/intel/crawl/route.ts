import { NextResponse } from 'next/server';
import { CrawlerService } from '@/lib/intel/crawler';

export const runtime = 'nodejs';

export async function POST() {
  try {
    const crawler = new CrawlerService();
    const results = await crawler.crawl();
    return NextResponse.json({ success: true, count: results.length, results });
  } catch (error) {
    console.error('Crawl error:', error);
    return NextResponse.json(
      { error: 'Failed to crawl', details: String(error) },
      { status: 500 }
    );
  }
}
