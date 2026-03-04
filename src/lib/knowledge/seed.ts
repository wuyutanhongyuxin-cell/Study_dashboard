import { db } from '@/lib/db';
import { knowledgeNodes } from '@/lib/db/schema';
import { count } from 'drizzle-orm';
import { mathTree } from './math-tree';
import { majorTree } from './major-tree';
import type { TreeNode } from './math-tree';

async function insertNodes(
  nodes: TreeNode[],
  subject: string,
  parentId: number | null,
  startOrder: number
): Promise<number> {
  let order = startOrder;
  for (const node of nodes) {
    const [inserted] = await db
      .insert(knowledgeNodes)
      .values({
        subject,
        parentId,
        name: node.name,
        description: node.description ?? null,
        status: 'not_started',
        sortOrder: order,
      })
      .returning({ id: knowledgeNodes.id });

    order++;

    if (node.children && node.children.length > 0) {
      order = await insertNodes(node.children, subject, inserted.id, order);
    }
  }
  return order;
}

export async function seedKnowledgeNodes(): Promise<number> {
  const [{ total }] = await db.select({ total: count() }).from(knowledgeNodes);

  if (total > 0) {
    return total;
  }

  let order = 0;
  order = await insertNodes(mathTree, 'math', null, order);
  order = await insertNodes(majorTree, 'major', null, order);

  return order;
}
