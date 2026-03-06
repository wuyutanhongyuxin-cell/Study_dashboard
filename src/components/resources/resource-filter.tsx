'use client';

import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Search } from 'lucide-react';
import { RESOURCE_SUBJECTS, RESOURCE_TYPES } from '@/lib/constants';
import { cn } from '@/lib/utils';

interface ResourceFilterProps {
  subject: string;
  type: string;
  search: string;
  onSubjectChange: (v: string) => void;
  onTypeChange: (v: string) => void;
  onSearchChange: (v: string) => void;
}

export function ResourceFilter({
  subject, type, search,
  onSubjectChange, onTypeChange, onSearchChange,
}: ResourceFilterProps) {
  return (
    <div className="space-y-3">
      {/* 科目筛选 */}
      <div className="flex flex-wrap gap-1.5">
        {RESOURCE_SUBJECTS.map((s) => (
          <Button
            key={s.id}
            variant={subject === s.id ? 'default' : 'outline'}
            size="sm"
            className="h-7 text-xs"
            onClick={() => onSubjectChange(s.id)}
          >
            {s.name}
          </Button>
        ))}
      </div>

      {/* 类型筛选 */}
      <div className="flex flex-wrap gap-1.5">
        {RESOURCE_TYPES.map((t) => (
          <Button
            key={t.id}
            variant={type === t.id ? 'default' : 'outline'}
            size="sm"
            className={cn('h-7 text-xs', type === t.id ? '' : 'text-muted-foreground')}
            onClick={() => onTypeChange(t.id)}
          >
            {t.name}
          </Button>
        ))}
      </div>

      {/* 搜索框 */}
      <div className="relative">
        <Search className="absolute left-2.5 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
        <Input
          placeholder="搜索资料..."
          className="pl-8 h-9"
          value={search}
          onChange={(e) => onSearchChange(e.target.value)}
        />
      </div>
    </div>
  );
}
