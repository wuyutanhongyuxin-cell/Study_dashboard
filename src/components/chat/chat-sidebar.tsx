'use client';

import { useEffect, useState, useCallback } from 'react';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { cn } from '@/lib/utils';
import { Plus, MessageSquare } from 'lucide-react';

interface Conversation {
  id: number;
  title: string;
  createdAt: string;
  updatedAt: string;
}

interface ChatSidebarProps {
  activeChatId: number | null;
  onSelect: (id: number | null) => void;
}

export function ChatSidebar({ activeChatId, onSelect }: ChatSidebarProps) {
  const [conversations, setConversations] = useState<Conversation[]>([]);

  const fetchConversations = useCallback(async () => {
    try {
      const res = await fetch('/api/chat/conversations');
      if (res.ok) {
        const data = await res.json();
        setConversations(data);
      }
    } catch (err) {
      console.error('Failed to fetch conversations:', err);
    }
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  // Listen for new conversation events to refresh the list
  useEffect(() => {
    const handler = (e: Event) => {
      const detail = (e as CustomEvent).detail;
      if (detail?.conversationId) {
        onSelect(detail.conversationId);
        fetchConversations();
      }
    };
    window.addEventListener('chat:new-conversation', handler);
    return () => window.removeEventListener('chat:new-conversation', handler);
  }, [onSelect, fetchConversations]);

  const handleNewChat = () => {
    onSelect(null);
  };

  return (
    <div className="w-64 border-r border-border flex flex-col h-full bg-muted/30">
      <div className="p-3">
        <Button
          onClick={handleNewChat}
          variant="outline"
          className="w-full justify-start gap-2"
        >
          <Plus className="h-4 w-4" />
          新对话
        </Button>
      </div>
      <ScrollArea className="flex-1">
        <div className="px-2 pb-2 space-y-1">
          {conversations.map((conv) => (
            <button
              key={conv.id}
              onClick={() => onSelect(conv.id)}
              className={cn(
                'w-full text-left px-3 py-2 rounded-md text-sm truncate transition-colors',
                'hover:bg-muted',
                activeChatId === conv.id
                  ? 'bg-muted font-medium'
                  : 'text-muted-foreground'
              )}
            >
              <div className="flex items-center gap-2">
                <MessageSquare className="h-4 w-4 shrink-0" />
                <span className="truncate">{conv.title}</span>
              </div>
            </button>
          ))}
          {conversations.length === 0 && (
            <p className="text-xs text-muted-foreground text-center py-4">
              暂无对话
            </p>
          )}
        </div>
      </ScrollArea>
    </div>
  );
}
