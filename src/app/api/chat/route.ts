export const runtime = 'nodejs';

import { NextRequest } from 'next/server';
import Anthropic from '@anthropic-ai/sdk';
import { db } from '@/lib/db';
import { chatConversations, chatMessages } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';

const SYSTEM_PROMPT = `你是 Desheng 的考研 AI 督学助手。Desheng 是上海交通大学日语系本科生，目标跨考集成电路学院 085400 电子信息专硕。考试科目：政治、英语一、数学一、874电子信息专业综合。请用中文回答，数学公式用 LaTeX 格式（$..$ 行内，$$...$$ 行间）。`;

export async function POST(req: NextRequest) {
  try {
    const { conversationId, message } = await req.json();
    const apiKey = process.env.ANTHROPIC_API_KEY;

    if (!message || typeof message !== 'string') {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    if (!apiKey) {
      return new Response(JSON.stringify({ error: 'ANTHROPIC_API_KEY is not configured' }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    let convId = conversationId;

    // Create conversation if none provided
    if (!convId) {
      const title =
        message.length > 30 ? message.slice(0, 30) + '...' : message;
      const [newConv] = await db
        .insert(chatConversations)
        .values({ title })
        .returning();
      convId = newConv.id;
    } else {
      // Update conversation timestamp
      await db
        .update(chatConversations)
        .set({ updatedAt: new Date().toISOString() })
        .where(eq(chatConversations.id, convId));
    }

    // Save user message
    await db.insert(chatMessages).values({
      conversationId: convId,
      role: 'user',
      content: message,
    });

    // Load conversation history for context
    const history = await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.conversationId, convId))
      .orderBy(chatMessages.createdAt);

    const anthropicMessages = history.map((msg) => ({
      role: msg.role as 'user' | 'assistant',
      content: msg.content,
    }));

    // Create Anthropic client
    const anthropic = new Anthropic({
      apiKey,
    });

    // Stream response
    const encoder = new TextEncoder();
    let fullResponse = '';

    const stream = new ReadableStream({
      async start(controller) {
        let finalized = false;
        const finalize = async (assistantText?: string) => {
          if (finalized) return;
          finalized = true;

          if (assistantText && assistantText.trim().length > 0) {
            try {
              await db.insert(chatMessages).values({
                conversationId: convId,
                role: 'assistant',
                content: assistantText,
              });
            } catch (dbError) {
              console.error('Failed to save assistant message:', dbError);
            }
          }

          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        };

        try {
          // Send conversationId first so the client knows which conversation
          if (!conversationId) {
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ conversationId: convId })}\n\n`
              )
            );
          }

          const messageStream = anthropic.messages.stream({
            model: 'claude-sonnet-4-20250514',
            max_tokens: 4096,
            system: SYSTEM_PROMPT,
            messages: anthropicMessages,
          });

          messageStream.on('text', (text) => {
            fullResponse += text;
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ token: text })}\n\n`
              )
            );
          });

          messageStream.on('end', async () => {
            await finalize(fullResponse);
          });

          messageStream.on('error', async (error) => {
            console.error('Anthropic stream error:', error);
            const fallback = '\n\n[请求出错，请重试]';
            fullResponse = fullResponse || fallback;
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ token: fallback })}\n\n`
              )
            );
            await finalize(fullResponse);
          });
        } catch (error) {
          console.error('Stream setup error:', error);
          if (!finalized) {
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ error: 'Failed to create stream' })}\n\n`
              )
            );
            controller.close();
          }
        }
      },
    });

    return new Response(stream, {
      headers: {
        'Content-Type': 'text/event-stream',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive',
      },
    });
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(JSON.stringify({ error: 'Internal server error' }), {
      status: 500,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
