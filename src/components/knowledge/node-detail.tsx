'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { NODE_STATUS, type NodeStatus } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { KnowledgeNode } from '@/lib/db/schema';

const STATUS_BG: Record<NodeStatus, string> = {
  not_started: 'bg-gray-500 hover:bg-gray-600',
  learning: 'bg-blue-500 hover:bg-blue-600',
  reviewing: 'bg-yellow-500 hover:bg-yellow-600',
  mastered: 'bg-green-500 hover:bg-green-600',
};

interface NodeDetailProps {
  node: KnowledgeNode | null;
  allNodes: KnowledgeNode[];
  onStatusChange: (id: number, status: NodeStatus) => void;
}

export function NodeDetail({ node, allNodes, onStatusChange }: NodeDetailProps) {
  if (!node) {
    return (
      <Card className="h-full flex items-center justify-center">
        <CardContent>
          <p className="text-muted-foreground text-sm">选择一个节点查看详情</p>
        </CardContent>
      </Card>
    );
  }

  const children = allNodes.filter((n) => n.parentId === node.id);

  // Calculate subtree mastery
  function getSubtreeNodes(parentId: number): KnowledgeNode[] {
    const direct = allNodes.filter((n) => n.parentId === parentId);
    const all: KnowledgeNode[] = [...direct];
    for (const child of direct) {
      all.push(...getSubtreeNodes(child.id));
    }
    return all;
  }

  const subtreeNodes = getSubtreeNodes(node.id);
  const leafNodes = subtreeNodes.filter(
    (n) => !allNodes.some((c) => c.parentId === n.id)
  );
  const masteredLeaves = leafNodes.filter((n) => n.status === 'mastered').length;
  const masteryPercent = leafNodes.length > 0
    ? Math.round((masteredLeaves / leafNodes.length) * 100)
    : (node.status === 'mastered' ? 100 : 0);

  return (
    <Card className="h-full">
      <CardHeader className="pb-3">
        <CardTitle className="text-lg">{node.name}</CardTitle>
        {node.description && (
          <p className="text-sm text-muted-foreground mt-1">{node.description}</p>
        )}
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Status */}
        <div>
          <p className="text-sm font-medium mb-2">当前状态</p>
          <div className="flex gap-2 flex-wrap">
            {(Object.keys(NODE_STATUS) as NodeStatus[]).map((s) => (
              <Button
                key={s}
                size="sm"
                variant={node.status === s ? 'default' : 'outline'}
                className={cn(
                  'text-xs h-7',
                  node.status === s && `${STATUS_BG[s]} text-white border-transparent`
                )}
                onClick={() => onStatusChange(node.id, s)}
              >
                {NODE_STATUS[s].label}
              </Button>
            ))}
          </div>
        </div>

        {/* Mastery */}
        {subtreeNodes.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2">子树掌握度</p>
            <div className="flex items-center gap-3">
              <div className="flex-1 h-2 bg-muted rounded-full overflow-hidden">
                <div
                  className="h-full bg-green-500 transition-all"
                  style={{ width: `${masteryPercent}%` }}
                />
              </div>
              <span className="text-sm text-muted-foreground">
                {masteredLeaves}/{leafNodes.length} ({masteryPercent}%)
              </span>
            </div>
          </div>
        )}

        {/* Children */}
        {children.length > 0 && (
          <div>
            <p className="text-sm font-medium mb-2">子节点</p>
            <div className="space-y-1.5">
              {children.map((child) => {
                const childStatus = NODE_STATUS[child.status as NodeStatus];
                return (
                  <div
                    key={child.id}
                    className="flex items-center justify-between py-1 px-2 rounded bg-muted/50 text-sm"
                  >
                    <span className="truncate">{child.name}</span>
                    <Badge
                      variant="secondary"
                      className={cn(
                        'text-xs text-white shrink-0 ml-2',
                        STATUS_BG[child.status as NodeStatus]?.split(' ')[0]
                      )}
                    >
                      {childStatus.label}
                    </Badge>
                  </div>
                );
              })}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
