'use client';

import { useState, useEffect, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Upload } from 'lucide-react';
import { VIP_USERS } from '@/lib/constants';
import { ResourceCard } from '@/components/resources/resource-card';
import { ResourceFilter } from '@/components/resources/resource-filter';
import { UploadDialog } from '@/components/resources/upload-dialog';
import { PreviewDialog } from '@/components/resources/preview-dialog';
import type { Resource } from '@/lib/db/schema';

export default function ResourcesPage() {
  const [items, setItems] = useState<Resource[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(false);

  // 筛选状态
  const [tab, setTab] = useState('all'); // 'all' | VIP user nickname
  const [subject, setSubject] = useState('all');
  const [type, setType] = useState('all');
  const [search, setSearch] = useState('');

  // 对话框
  const [uploadOpen, setUploadOpen] = useState(false);
  const [previewItem, setPreviewItem] = useState<Resource | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const fetchItems = useCallback(async () => {
    setLoading(true);
    try {
      const params = new URLSearchParams();
      if (subject !== 'all') params.set('subject', subject);
      if (type !== 'all') params.set('type', type);
      if (search) params.set('search', search);
      // Tab 对应 uploader 筛选
      if (tab !== 'all') {
        const vip = VIP_USERS.find((u) => u.id === tab);
        if (vip) params.set('uploader', vip.nickname);
      }
      params.set('sort', 'newest');

      const qs = params.toString();
      const res = await fetch(`/api/resources${qs ? `?${qs}` : ''}`);
      const data = await res.json();
      setItems(data.items || []);
      setTotal(data.total || 0);
    } catch (err) {
      console.error('Failed to fetch resources:', err);
    } finally {
      setLoading(false);
    }
  }, [subject, type, search, tab]);

  useEffect(() => {
    fetchItems();
  }, [fetchItems]);

  // 搜索防抖
  const [searchInput, setSearchInput] = useState('');
  useEffect(() => {
    const timer = setTimeout(() => setSearch(searchInput), 300);
    return () => clearTimeout(timer);
  }, [searchInput]);

  return (
    <div className="space-y-6">
      {/* 标题 + 上传按钮 */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold">学习资料库</h1>
          <p className="text-sm text-muted-foreground mt-1">
            共 {total} 份资料，欢迎上传分享
          </p>
        </div>
        <Button onClick={() => setUploadOpen(true)}>
          <Upload className="h-4 w-4 mr-1.5" />
          上传资料
        </Button>
      </div>

      {/* VIP Tabs */}
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="all">全部资料</TabsTrigger>
          {VIP_USERS.map((u) => (
            <TabsTrigger key={u.id} value={u.id}>{u.tabLabel}</TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      {/* 筛选 */}
      <ResourceFilter
        subject={subject}
        type={type}
        search={searchInput}
        onSubjectChange={setSubject}
        onTypeChange={setType}
        onSearchChange={setSearchInput}
      />

      {/* 内容区 */}
      {loading ? (
        <div className="text-center py-12 text-muted-foreground">加载中...</div>
      ) : items.length === 0 ? (
        <div className="text-center py-12 text-muted-foreground">
          <p>暂无资料</p>
          <p className="text-sm mt-1">点击「上传资料」分享你的学习资料</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <ResourceCard
              key={item.id}
              item={item}
              onPreview={() => { setPreviewItem(item); setPreviewOpen(true); }}
            />
          ))}
        </div>
      )}

      {/* 上传对话框 */}
      <UploadDialog
        open={uploadOpen}
        onOpenChange={setUploadOpen}
        onSuccess={fetchItems}
      />

      {/* 预览对话框 */}
      <PreviewDialog
        item={previewItem}
        open={previewOpen}
        onOpenChange={setPreviewOpen}
      />
    </div>
  );
}
