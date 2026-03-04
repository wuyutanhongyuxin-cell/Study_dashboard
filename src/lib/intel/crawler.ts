import { MockDecodoClient } from './mock-client';
import { db } from '@/lib/db';
import { intelItems } from '@/lib/db/schema';
import type { CrawlResult } from './types';

export class CrawlerService {
  private client: MockDecodoClient;

  constructor() {
    this.client = new MockDecodoClient();
  }

  async crawl(): Promise<CrawlResult[]> {
    const today = new Date().toISOString().slice(0, 10);
    const results = await this.client.universalScrape();

    // Save to DB
    for (const item of results) {
      await db.insert(intelItems).values({
        date: today,
        category: item.category as 'policy' | 'experience' | 'resource' | 'news',
        title: item.title,
        summary: item.summary,
        url: item.url,
        source: item.source,
        relevance: item.relevance,
      });
    }

    return results;
  }
}
