'use client';

import { useEffect, useState } from 'react';
import { Upload } from 'lucide-react';
import { ResourceCard } from '@/components/resources/resource-card';
import { ResourceFilter } from '@/components/resources/resource-filter';
import { PreviewDialog } from '@/components/resources/preview-dialog';
import { UploadDialog } from '@/components/resources/upload-dialog';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useResources } from '@/hooks/use-resources';
import { VIP_USERS } from '@/lib/constants';
import type { Resource } from '@/lib/db/schema';

export default function ResourcesPage() {
  const [tab, setTab] = useState('all');
  const [subject, setSubject] = useState('all');
  const [type, setType] = useState('all');
  const [search, setSearch] = useState('');
  const [searchInput, setSearchInput] = useState('');
  const [uploadOpen, setUploadOpen] = useState(false);
  const [previewItem, setPreviewItem] = useState<Resource | null>(null);
  const [previewOpen, setPreviewOpen] = useState(false);

  const { error, items, loading, reload, total } = useResources({ search, subject, tab, type });

  useEffect(() => {
    const timer = window.setTimeout(() => setSearch(searchInput.trim()), 300);
    return () => window.clearTimeout(timer);
  }, [searchInput]);

  function handlePreview(item: Resource) {
    setPreviewItem(item);
    setPreviewOpen(true);
  }

  function handlePreviewOpenChange(open: boolean) {
    setPreviewOpen(open);
    if (!open) {
      setPreviewItem(null);
    }
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold">学习资料库</h1>
          <p className="mt-1 text-sm text-muted-foreground">共 {total} 份资料，支持上传、预览和下载</p>
        </div>
        <Button onClick={() => setUploadOpen(true)}>
          <Upload className="mr-1.5 h-4 w-4" />
          上传资料
        </Button>
      </div>

      <Tabs value={tab} onValueChange={setTab}>
        <TabsList>
          <TabsTrigger value="all">全部资料</TabsTrigger>
          {VIP_USERS.map((user) => (
            <TabsTrigger key={user.id} value={user.id}>
              {user.tabLabel}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>

      <ResourceFilter
        search={searchInput}
        subject={subject}
        type={type}
        onSearchChange={setSearchInput}
        onSubjectChange={setSubject}
        onTypeChange={setType}
      />

      {error ? (
        <div className="rounded-lg border border-destructive/40 bg-destructive/5 p-4 text-sm text-destructive">
          <p>{error}</p>
          <Button variant="outline" size="sm" className="mt-3" onClick={reload}>
            重新加载
          </Button>
        </div>
      ) : loading ? (
        <div className="py-12 text-center text-muted-foreground">加载中...</div>
      ) : items.length === 0 ? (
        <div className="py-12 text-center text-muted-foreground">
          <p>暂无资料</p>
          <p className="mt-1 text-sm">点击“上传资料”分享你的学习资料</p>
        </div>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item) => (
            <ResourceCard key={item.id} item={item} onPreview={() => handlePreview(item)} />
          ))}
        </div>
      )}

      <UploadDialog open={uploadOpen} onOpenChange={setUploadOpen} onSuccess={reload} />
      <PreviewDialog item={previewItem} open={previewOpen} onOpenChange={handlePreviewOpenChange} />
    </div>
  );
}
