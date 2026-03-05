import { MockDecodoClient } from './mock-client';
import { db } from '@/lib/db';
import { intelItems } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import type { CrawlResult } from './types';

export class CrawlerService {
  private client: MockDecodoClient;

  constructor() {
    this.client = new MockDecodoClient();
  }

  async crawl(): Promise<CrawlResult[]> {
    const today = new Date().toISOString().slice(0, 10);
    const results = await this.client.universalScrape();
    const existingRows = await db
      .select({ title: intelItems.title })
      .from(intelItems)
      .where(eq(intelItems.date, today));
    const existingTitles = new Set(existingRows.map((r) => r.title));

    // Save to DB
    for (const item of results) {
      if (existingTitles.has(item.title)) {
        continue;
      }

      const createdAt = new Date().toISOString();
      await db.insert(intelItems).values({
        date: today,
        category: item.category as 'policy' | 'experience' | 'resource' | 'news',
        title: item.title,
        summary: item.summary,
        url: item.url,
        source: item.source,
        relevance: item.relevance,
        createdAt,
      }).onConflictDoNothing({
        target: [intelItems.date, intelItems.title],
      });
      existingTitles.add(item.title);
    }

    return results;
  }
}
