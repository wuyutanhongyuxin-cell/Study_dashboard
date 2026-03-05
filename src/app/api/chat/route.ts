export const runtime = 'nodejs';

import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { chatConversations, chatMessages } from '@/lib/db/schema';
import { eq } from 'drizzle-orm';
import { validateConfiguredProvider } from '@/lib/ai/auth';
import { getConfiguredProvider } from '@/lib/ai/config';
import { getAIErrorMessage, isAIAuthError } from '@/lib/ai/errors';
import { streamText } from '@/lib/ai/client';

const SYSTEM_PROMPT = `你是 Desheng 的考研 AI 督学助手。Desheng 是上海交通大学日语系本科生，目标跨考集成电路学院 085400 电子信息专硕。考试科目：政治、英语一、数学一、874电子信息专业综合。请用中文回答，数学公式用 LaTeX 格式（$..$ 行内，$$...$$ 行间）。`;

export async function POST(req: NextRequest) {
  try {
    const { conversationId, message } = await req.json();

    if (!message || typeof message !== 'string') {
      return new Response(JSON.stringify({ error: 'Message is required' }), {
        status: 400,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    try {
      getConfiguredProvider();
    } catch (error) {
      return new Response(JSON.stringify({ error: getAIErrorMessage(error) }), {
        status: 503,
        headers: { 'Content-Type': 'application/json' },
      });
    }

    try {
      await validateConfiguredProvider();
    } catch (error) {
      if (isAIAuthError(error)) {
        return new Response(
          JSON.stringify({ error: 'AI provider credential is invalid' }),
          {
            status: 503,
            headers: { 'Content-Type': 'application/json' },
          }
        );
      }
      throw error;
    }

    let convId = conversationId;
    const now = new Date().toISOString();

    if (!convId) {
      const title = message.length > 30 ? `${message.slice(0, 30)}...` : message;
      const [newConv] = await db
        .insert(chatConversations)
        .values({ title, createdAt: now, updatedAt: now })
        .returning();
      convId = newConv.id;
    } else {
      await db
        .update(chatConversations)
        .set({ updatedAt: now })
        .where(eq(chatConversations.id, convId));
    }

    await db.insert(chatMessages).values({
      conversationId: convId,
      role: 'user',
      content: message,
      createdAt: now,
    });

    const history = await db
      .select()
      .from(chatMessages)
      .where(eq(chatMessages.conversationId, convId))
      .orderBy(chatMessages.createdAt);

    const encoder = new TextEncoder();
    let fullResponse = '';

    const stream = new ReadableStream({
      async start(controller) {
        let finalized = false;

        const finalize = async (assistantText?: string) => {
          if (finalized) {
            return;
          }
          finalized = true;

          if (assistantText && assistantText.trim().length > 0) {
            try {
              await db.insert(chatMessages).values({
                conversationId: convId,
                role: 'assistant',
                content: assistantText,
                createdAt: new Date().toISOString(),
              });
            } catch (dbError) {
              console.error('Failed to save assistant message:', dbError);
            }
          }

          controller.enqueue(encoder.encode('data: [DONE]\n\n'));
          controller.close();
        };

        try {
          if (!conversationId) {
            controller.enqueue(
              encoder.encode(
                `data: ${JSON.stringify({ conversationId: convId })}\n\n`
              )
            );
          }

          await streamText({
            messages: [
              { role: 'system', content: SYSTEM_PROMPT },
              ...history.map((msg) => ({
                role: msg.role as 'user' | 'assistant',
                content: msg.content,
              })),
            ],
            maxTokens: 4096,
            onToken: (token) => {
              fullResponse += token;
              controller.enqueue(
                encoder.encode(`data: ${JSON.stringify({ token })}\n\n`)
              );
            },
            onComplete: async () => {
              await finalize(fullResponse);
            },
            onError: async (error) => {
              console.error('AI stream error:', error);
              const fallback = isAIAuthError(error)
                ? '\n\n[AI 服务鉴权失败，请联系管理员更新密钥]'
                : '\n\n[请求出错，请重试]';
              fullResponse = fullResponse || fallback;
              controller.enqueue(
                encoder.encode(
                  `data: ${JSON.stringify({ token: fallback })}\n\n`
                )
              );
              await finalize(fullResponse);
            },
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
