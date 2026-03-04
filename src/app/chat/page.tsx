'use client';

import { useAppStore } from '@/lib/store';
import { ChatSidebar } from '@/components/chat/chat-sidebar';
import { ChatMessages } from '@/components/chat/chat-messages';
import { ChatInput } from '@/components/chat/chat-input';
import { useChatStream } from '@/hooks/use-chat-stream';

export default function ChatPage() {
  const activeChatId = useAppStore((s) => s.activeChatId);
  const setActiveChatId = useAppStore((s) => s.setActiveChatId);
  const { messages, sendMessage, isStreaming } = useChatStream(activeChatId);

  return (
    <div className="flex h-[calc(100vh-4rem)] overflow-hidden">
      <ChatSidebar activeChatId={activeChatId} onSelect={setActiveChatId} />
      <div className="flex-1 flex flex-col min-w-0">
        <ChatMessages messages={messages} isStreaming={isStreaming} />
        <ChatInput onSend={sendMessage} disabled={isStreaming} />
      </div>
    </div>
  );
}
