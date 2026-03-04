import Anthropic from '@anthropic-ai/sdk';
import { db } from '@/lib/db';
import { studySessions, dailyProgress } from '@/lib/db/schema';
import { desc, gte } from 'drizzle-orm';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function runAnalyst() {
  const sevenDaysAgo = new Date();
  sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);
  const dateStr = sevenDaysAgo.toISOString().slice(0, 10);

  const sessions = await db
    .select()
    .from(studySessions)
    .where(gte(studySessions.startTime, dateStr))
    .orderBy(desc(studySessions.createdAt));

  const progress = await db
    .select()
    .from(dailyProgress)
    .where(gte(dailyProgress.date, dateStr))
    .orderBy(desc(dailyProgress.date));

  const prompt = `你是一个考研学习数据分析师。请分析以下最近7天的学习数据，并以JSON格式返回结构化分析结果。

学习会话数据：
${JSON.stringify(sessions, null, 2)}

每日进度数据：
${JSON.stringify(progress, null, 2)}

请返回以下JSON格式（不要包含markdown代码块标记）：
{
  "totalHoursPerSubject": {
    "politics": <number>,
    "english": <number>,
    "math": <number>,
    "major": <number>
  },
  "trends": {
    "dailyAverage": <number in hours>,
    "bestDay": "<date>",
    "worstDay": "<date>",
    "trend": "上升" | "下降" | "稳定"
  },
  "weakAreas": ["<subject names that need more attention>"],
  "consistencyScore": <0-100>,
  "insights": ["<具体的分析洞察>"],
  "summary": "<整体分析摘要>"
}

如果数据为空，请基于空数据返回合理的默认值（0小时，无趋势等）。`;

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 2000,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';

  try {
    return JSON.parse(text);
  } catch {
    return { raw: text, error: 'Failed to parse JSON' };
  }
}
