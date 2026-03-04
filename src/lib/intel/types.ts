export interface IntelSource {
  name: string;
  category: 'policy' | 'experience' | 'resource' | 'news';
}

export interface CrawlResult {
  title: string;
  summary: string;
  url: string;
  source: string;
  category: string;
  relevance: number;
}
