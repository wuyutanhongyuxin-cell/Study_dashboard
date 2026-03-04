'use client';

import { useEffect, useRef } from 'react';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MarkdownRenderer } from './markdown-renderer';
import { cn } from '@/lib/utils';
import { Bot, User } from 'lucide-react';

interface Message {
  id?: number;
  role: 'user' | 'assistant';
  content: string;
  createdAt?: string;
}

interface ChatMessagesProps {
  messages: Message[];
  isStreaming: boolean;
}

export function ChatMessages({ messages, isStreaming }: ChatMessagesProps) {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  if (messages.length === 0) {
    return (
      <div className="flex-1 flex items-center justify-center text-muted-foreground">
        <div className="text-center space-y-2">
          <Bot className="h-12 w-12 mx-auto opacity-50" />
          <p className="text-lg font-medium">AI 督学助手</p>
          <p className="text-sm">有什么考研问题可以问我</p>
        </div>
      </div>
    );
  }

  return (
    <ScrollArea className="flex-1">
      <div className="p-4 space-y-4">
        {messages.map((msg, i) => (
          <div
            key={msg.id ?? i}
            className={cn(
              'flex gap-3',
              msg.role === 'user' ? 'justify-end' : 'justify-start'
            )}
          >
            {msg.role === 'assistant' && (
              <div className="shrink-0 w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center">
                <Bot className="h-4 w-4 text-primary" />
              </div>
            )}
            <div
              className={cn(
                'max-w-[80%] rounded-lg px-4 py-2',
                msg.role === 'user'
                  ? 'bg-primary text-primary-foreground'
                  : 'bg-muted'
              )}
            >
              {msg.role === 'assistant' ? (
                <MarkdownRenderer content={msg.content} />
              ) : (
                <p className="whitespace-pre-wrap">{msg.content}</p>
              )}
              {msg.role === 'assistant' &&
                isStreaming &&
                i === messages.length - 1 &&
                !msg.content && (
                  <span className="inline-block w-2 h-4 bg-foreground/50 animate-pulse" />
                )}
            </div>
            {msg.role === 'user' && (
              <div className="shrink-0 w-8 h-8 rounded-full bg-primary flex items-center justify-center">
                <User className="h-4 w-4 text-primary-foreground" />
              </div>
            )}
          </div>
        ))}
        <div ref={bottomRef} />
      </div>
    </ScrollArea>
  );
}
