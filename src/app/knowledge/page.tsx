'use client';

import { useState, useEffect, useCallback } from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { TreeView } from '@/components/knowledge/tree-view';
import { NodeDetail } from '@/components/knowledge/node-detail';
import { type NodeStatus } from '@/lib/constants';
import type { KnowledgeNode } from '@/lib/db/schema';
import { Loader2, TreesIcon } from 'lucide-react';

export default function KnowledgePage() {
  const [nodes, setNodes] = useState<KnowledgeNode[]>([]);
  const [loading, setLoading] = useState(true);
  const [seeding, setSeeding] = useState(false);
  const [selectedId, setSelectedId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState('math');

  const fetchNodes = useCallback(async () => {
    setLoading(true);
    const res = await fetch('/api/knowledge');
    const data = await res.json();
    setNodes(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchNodes();
  }, [fetchNodes]);

  async function handleSeed() {
    setSeeding(true);
    await fetch('/api/knowledge', { method: 'POST' });
    await fetchNodes();
    setSeeding(false);
  }

  async function handleStatusChange(id: number, status: NodeStatus) {
    // Optimistic update
    setNodes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, status } : n))
    );
    await fetch(`/api/knowledge/${id}`, {
      method: 'PATCH',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
  }

  const filteredNodes = nodes.filter((n) => n.subject === activeTab);
  const selectedNode = nodes.find((n) => n.id === selectedId) ?? null;

  // Calculate mastery stats for the current tab
  const leafNodes = filteredNodes.filter(
    (n) => !filteredNodes.some((c) => c.parentId === n.id)
  );
  const masteredCount = leafNodes.filter((n) => n.status === 'mastered').length;
  const masteryPercent = leafNodes.length > 0
    ? Math.round((masteredCount / leafNodes.length) * 100)
    : 0;

  if (loading) {
    return (
      <div className="flex items-center justify-center h-[60vh]">
        <Loader2 className="h-6 w-6 animate-spin text-muted-foreground" />
      </div>
    );
  }

  if (nodes.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] gap-4">
        <TreesIcon className="h-12 w-12 text-muted-foreground" />
        <p className="text-muted-foreground">知识树尚未初始化</p>
        <Button onClick={handleSeed} disabled={seeding}>
          {seeding ? (
            <>
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              正在初始化...
            </>
          ) : (
            '初始化知识树'
          )}
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      <Tabs value={activeTab} onValueChange={(v) => { setActiveTab(v); setSelectedId(null); }}>
        <div className="flex items-center justify-between">
          <TabsList>
            <TabsTrigger value="math">数学一</TabsTrigger>
            <TabsTrigger value="major">874电子信息</TabsTrigger>
          </TabsList>
          <div className="text-sm text-muted-foreground">
            已掌握{' '}
            <span className="font-medium text-green-500">{masteredCount}</span>
            /{leafNodes.length}
            <span className="ml-1">({masteryPercent}%)</span>
          </div>
        </div>

        <TabsContent value="math" className="mt-3">
          <KnowledgeContent
            nodes={filteredNodes}
            allNodes={nodes}
            selectedId={selectedId}
            selectedNode={selectedNode}
            onSelect={setSelectedId}
            onStatusChange={handleStatusChange}
          />
        </TabsContent>
        <TabsContent value="major" className="mt-3">
          <KnowledgeContent
            nodes={filteredNodes}
            allNodes={nodes}
            selectedId={selectedId}
            selectedNode={selectedNode}
            onSelect={setSelectedId}
            onStatusChange={handleStatusChange}
          />
        </TabsContent>
      </Tabs>
    </div>
  );
}

function KnowledgeContent({
  nodes,
  allNodes,
  selectedId,
  selectedNode,
  onSelect,
  onStatusChange,
}: {
  nodes: KnowledgeNode[];
  allNodes: KnowledgeNode[];
  selectedId: number | null;
  selectedNode: KnowledgeNode | null;
  onSelect: (id: number) => void;
  onStatusChange: (id: number, status: NodeStatus) => void;
}) {
  return (
    <div className="grid grid-cols-5 gap-4">
      <Card className="col-span-3">
        <CardHeader className="pb-2">
          <CardTitle className="text-base">知识点目录</CardTitle>
        </CardHeader>
        <CardContent className="pt-0">
          <TreeView
            nodes={nodes}
            selectedId={selectedId}
            onSelect={onSelect}
            onStatusChange={onStatusChange}
          />
        </CardContent>
      </Card>
      <div className="col-span-2">
        <NodeDetail
          node={selectedNode}
          allNodes={allNodes}
          onStatusChange={onStatusChange}
        />
      </div>
    </div>
  );
}
