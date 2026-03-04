'use client';

import { Button } from '@/components/ui/button';

const categories = [
  { id: 'all', label: '全部' },
  { id: 'policy', label: '政策' },
  { id: 'experience', label: '经验' },
  { id: 'resource', label: '资源' },
  { id: 'news', label: '新闻' },
];

interface IntelFilterProps {
  active: string;
  onChange: (category: string) => void;
}

export function IntelFilter({ active, onChange }: IntelFilterProps) {
  return (
    <div className="flex gap-2">
      {categories.map((cat) => (
        <Button
          key={cat.id}
          variant={active === cat.id ? 'default' : 'outline'}
          size="sm"
          onClick={() => onChange(cat.id)}
        >
          {cat.label}
        </Button>
      ))}
    </div>
  );
}
