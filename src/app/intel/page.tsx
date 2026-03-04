'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { IntelCard } from '@/components/intel/intel-card';
import { IntelFilter } from '@/components/intel/intel-filter';
import { IntelDetailDialog } from '@/components/intel/intel-detail-dialog';
import type { IntelItem } from '@/lib/db/schema';

export default function IntelPage() {
  const [items, setItems] = useState<IntelItem[]>([]);
  const [loading, setLoading] = useState(false);
  const [crawling, setCrawling] = useState(false);
  const [category, setCategory] = useState('all');
  const [selectedItem, setSelectedItem] = useState<IntelItem | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const params = category !== 'all' ? `?category=${category}` : '';
      const res = await fetch(`/api/intel${params}`);
      const data = await res.json();
      setItems(data);
    } catch (err) {
      console.error('Failed to fetch intel items:', err);
    } finally {
      setLoading(false);
    }
  }, [category]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  async function handleCrawl() {
    setCrawling(true);
    try {
      const res = await fetch('/api/intel/crawl', { method: 'POST' });
      if (!res.ok) throw new Error('Failed to crawl');
      await fetchItems();
    } catch (err) {
      console.error('Crawl failed:', err);
    } finally {
      setCrawling(false);
    }
  }

  function handleCardClick(item: IntelItem) {
    setSelectedItem(item);
    setDialogOpen(true);
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">信息聚合</h1>
          <p className="text-sm text-muted-foreground mt-1">
            上海交通大学集成电路学院考研相关信息
          </p>
        </div>
        <Button onClick={handleCrawl} disabled={crawling}>
          {crawling ? '抓取中...' : '抓取信息'}
        </Button>
      </div>

      <IntelFilter active={category} onChange={setCategory} />

      {loading ? (
        <div className="text-center py-12 text-muted-foreground">加载中...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>暂无信息</p>
          <p className="text-sm mt-1">点击&ldquo;抓取信息&rdquo;获取最新内容</p>
        </div>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {items.map((item) => (
            <IntelCard
              key={item.id}
              item={item}
              onClick={() => handleCardClick(item)}
            />
          ))}
        </div>
      )}

      <IntelDetailDialog
        item={selectedItem}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />
    </div>
  );
}
