'use client';

import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { format } from 'date-fns';
import { zhCN } from 'date-fns/locale';
import ReactMarkdown from 'react-markdown';
import remarkMath from 'remark-math';
import rehypeKatex from 'rehype-katex';

interface BriefDisplayProps {
  content: string;
  date: string;
}

export function BriefDisplay({ content, date }: BriefDisplayProps) {
  const formattedDate = format(new Date(date), 'yyyy年M月d日 EEEE', { locale: zhCN });

  return (
    <Card>
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <span>📋</span>
          <span>{formattedDate} 晨报</span>
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="prose prose-sm dark:prose-invert max-w-none">
          <ReactMarkdown remarkPlugins={[remarkMath]} rehypePlugins={[rehypeKatex]}>
            {content}
          </ReactMarkdown>
        </div>
      </CardContent>
    </Card>
  );
}
