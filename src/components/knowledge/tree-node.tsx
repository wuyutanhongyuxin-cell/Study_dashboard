'use client';

import { ChevronRight } from 'lucide-react';
import { NODE_STATUS, type NodeStatus } from '@/lib/constants';
import { cn } from '@/lib/utils';
import type { KnowledgeNode } from '@/lib/db/schema';

const STATUS_BG: Record<NodeStatus, string> = {
  not_started: 'bg-gray-500',
  learning: 'bg-blue-500',
  reviewing: 'bg-yellow-500',
  mastered: 'bg-green-500',
};

const STATUS_ORDER: NodeStatus[] = ['not_started', 'learning', 'reviewing', 'mastered'];

interface TreeNodeProps {
  node: KnowledgeNode;
  children?: KnowledgeNode[];
  depth: number;
  isExpanded: boolean;
  isSelected: boolean;
  hasChildren: boolean;
  onToggle: () => void;
  onSelect: () => void;
  onStatusChange: (id: number, status: NodeStatus) => void;
}

export function TreeNodeItem({
  node,
  depth,
  isExpanded,
  isSelected,
  hasChildren,
  onToggle,
  onSelect,
  onStatusChange,
}: TreeNodeProps) {
  const statusInfo = NODE_STATUS[node.status as NodeStatus];

  function cycleStatus(e: React.MouseEvent) {
    e.stopPropagation();
    const currentIdx = STATUS_ORDER.indexOf(node.status as NodeStatus);
    const nextIdx = (currentIdx + 1) % STATUS_ORDER.length;
    onStatusChange(node.id, STATUS_ORDER[nextIdx]);
  }

  return (
    <div
      className={cn(
        'flex items-center gap-1.5 py-1 px-2 rounded-md cursor-pointer transition-colors text-sm',
        'hover:bg-muted/50',
        isSelected && 'bg-muted'
      )}
      style={{ paddingLeft: `${depth * 16 + 8}px` }}
      onClick={onSelect}
    >
      {hasChildren ? (
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggle();
          }}
          className="p-0.5 hover:bg-muted rounded shrink-0"
        >
          <ChevronRight
            className={cn(
              'h-3.5 w-3.5 transition-transform',
              isExpanded && 'rotate-90'
            )}
          />
        </button>
      ) : (
        <span className="w-[18px] shrink-0" />
      )}

      <button
        onClick={cycleStatus}
        className={cn(
          'w-2.5 h-2.5 rounded-full shrink-0 transition-colors',
          STATUS_BG[node.status as NodeStatus]
        )}
        title={`${statusInfo.label} - 点击切换状态`}
      />

      <span className="truncate">{node.name}</span>
    </div>
  );
}
