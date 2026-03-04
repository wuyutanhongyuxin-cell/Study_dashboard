export const runtime = 'nodejs';

import { NextRequest } from 'next/server';
import { db } from '@/lib/db';
import { chatConversations, chatMessages } from '@/lib/db/schema';
import { desc, eq } from 'drizzle-orm';

// GET: list conversations or get messages for a specific conversation
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (id) {
      // Return messages for a specific conversation
      const messages = await db
        .select()
        .from(chatMessages)
        .where(eq(chatMessages.conversationId, Number(id)))
        .orderBy(chatMessages.createdAt);

      return Response.json({ messages });
    }

    // List all conversations ordered by updatedAt desc
    const conversations = await db
      .select()
      .from(chatConversations)
      .orderBy(desc(chatConversations.updatedAt));

    return Response.json(conversations);
  } catch (error) {
    console.error('Conversations GET error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// POST: create a new conversation
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const title = body.title || '新对话';

    const [conversation] = await db
      .insert(chatConversations)
      .values({ title })
      .returning();

    return Response.json(conversation);
  } catch (error) {
    console.error('Conversations POST error:', error);
    return Response.json({ error: 'Internal server error' }, { status: 500 });
  }
}
