'use client';

import { useState, useCallback, useRef, useEffect } from 'react';

interface Message {
  id?: number;
  role: 'user' | 'assistant';
  content: string;
  createdAt?: string;
}

export function useChatStream(conversationId: number | null) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isStreaming, setIsStreaming] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  const loadConversation = useCallback(async (convId: number) => {
    try {
      const res = await fetch(`/api/chat/conversations?id=${convId}`);
      if (res.ok) {
        const data = await res.json();
        setMessages(data.messages || []);
      }
    } catch (err) {
      console.error('Failed to load conversation:', err);
    }
  }, []);

  useEffect(() => {
    if (conversationId) {
      loadConversation(conversationId);
    } else {
      setMessages([]);
    }
  }, [conversationId, loadConversation]);

  const sendMessage = useCallback(
    async (content: string) => {
      if (isStreaming) return;

      const userMessage: Message = { role: 'user', content };
      setMessages((prev) => [...prev, userMessage]);
      setIsStreaming(true);

      const assistantMessage: Message = { role: 'assistant', content: '' };
      setMessages((prev) => [...prev, assistantMessage]);

      try {
        abortRef.current = new AbortController();
        const res = await fetch('/api/chat', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ conversationId, message: content }),
          signal: abortRef.current.signal,
        });

        if (!res.ok) {
          throw new Error(`HTTP ${res.status}`);
        }

        const reader = res.body?.getReader();
        if (!reader) throw new Error('No response body');

        const decoder = new TextDecoder();
        let accumulated = '';

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          const chunk = decoder.decode(value, { stream: true });
          const lines = chunk.split('\n');

          for (const line of lines) {
            if (line.startsWith('data: ')) {
              const data = line.slice(6);
              if (data === '[DONE]') continue;

              try {
                const parsed = JSON.parse(data);
                if (parsed.token) {
                  accumulated += parsed.token;
                  setMessages((prev) => {
                    const updated = [...prev];
                    updated[updated.length - 1] = {
                      role: 'assistant',
                      content: accumulated,
                    };
                    return updated;
                  });
                }
                if (parsed.conversationId) {
                  // New conversation was created, return the ID via event
                  window.dispatchEvent(
                    new CustomEvent('chat:new-conversation', {
                      detail: { conversationId: parsed.conversationId },
                    })
                  );
                }
              } catch {
                // Skip malformed JSON lines
              }
            }
          }
        }
      } catch (err) {
        if ((err as Error).name !== 'AbortError') {
          console.error('Stream error:', err);
          setMessages((prev) => {
            const updated = [...prev];
            updated[updated.length - 1] = {
              role: 'assistant',
              content: '抱歉，请求出错了，请重试。',
            };
            return updated;
          });
        }
      } finally {
        setIsStreaming(false);
        abortRef.current = null;
      }
    },
    [conversationId, isStreaming]
  );

  return { messages, sendMessage, isStreaming, loadConversation };
}
