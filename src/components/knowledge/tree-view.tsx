'use client';

import { useState, useCallback, useMemo } from 'react';
import { TreeNodeItem } from './tree-node';
import { ScrollArea } from '@/components/ui/scroll-area';
import type { KnowledgeNode } from '@/lib/db/schema';
import type { NodeStatus } from '@/lib/constants';

interface TreeViewProps {
  nodes: KnowledgeNode[];
  selectedId: number | null;
  onSelect: (id: number) => void;
  onStatusChange: (id: number, status: NodeStatus) => void;
}

export function TreeView({ nodes, selectedId, onSelect, onStatusChange }: TreeViewProps) {
  const [expanded, setExpanded] = useState<Set<number>>(() => {
    // Auto-expand root nodes
    const roots = new Set<number>();
    for (const node of nodes) {
      if (node.parentId === null) {
        roots.add(node.id);
      }
    }
    return roots;
  });

  const childrenMap = useMemo(() => {
    const map = new Map<number | null, KnowledgeNode[]>();
    for (const node of nodes) {
      const key = node.parentId;
      if (!map.has(key)) map.set(key, []);
      map.get(key)!.push(node);
    }
    return map;
  }, [nodes]);

  const toggle = useCallback((id: number) => {
    setExpanded((prev) => {
      const next = new Set(prev);
      if (next.has(id)) {
        next.delete(id);
      } else {
        next.add(id);
      }
      return next;
    });
  }, []);

  function renderNodes(parentId: number | null, depth: number): React.ReactNode {
    const children = childrenMap.get(parentId);
    if (!children) return null;

    return children.map((node) => {
      const hasChildren = childrenMap.has(node.id);
      const isExpanded = expanded.has(node.id);

      return (
        <div key={node.id}>
          <TreeNodeItem
            node={node}
            depth={depth}
            isExpanded={isExpanded}
            isSelected={selectedId === node.id}
            hasChildren={hasChildren}
            onToggle={() => toggle(node.id)}
            onSelect={() => onSelect(node.id)}
            onStatusChange={onStatusChange}
          />
          {hasChildren && isExpanded && renderNodes(node.id, depth + 1)}
        </div>
      );
    });
  }

  return (
    <ScrollArea className="h-[calc(100vh-220px)]">
      <div className="py-1">{renderNodes(null, 0)}</div>
    </ScrollArea>
  );
}
