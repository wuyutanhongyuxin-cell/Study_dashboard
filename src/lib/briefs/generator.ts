import Anthropic from '@anthropic-ai/sdk';
import { db } from '@/lib/db';
import { agentReports, morningBriefs, dailyProgress } from '@/lib/db/schema';
import { eq, gte } from 'drizzle-orm';
import { format, subDays } from 'date-fns';

function getClient() {
  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    throw new Error('ANTHROPIC_API_KEY is not configured');
  }
  return new Anthropic({ apiKey });
}

export async function generateBrief(date: string): Promise<string> {
  const client = getClient();
  // Fetch agent reports for this date
  const reports = db
    .select()
    .from(agentReports)
    .where(eq(agentReports.date, date))
    .all();

  // Fetch recent progress data
  const weekAgo = format(subDays(new Date(date), 7), 'yyyy-MM-dd');
  const recentProgress = db
    .select()
    .from(dailyProgress)
    .where(gte(dailyProgress.date, weekAgo))
    .all();

  const analystReport = reports.find(r => r.agentType === 'analyst');
  const strategistReport = reports.find(r => r.agentType === 'strategist');
  const coachReport = reports.find(r => r.agentType === 'coach');

  // Calculate metrics
  const totalMinutesWeek = recentProgress.reduce((sum, p) => sum + p.totalMinutes, 0);
  const totalHoursWeek = Math.round(totalMinutesWeek / 60 * 10) / 10;
  const studyDays = recentProgress.filter(p => p.totalMinutes > 0).length;

  const metrics = {
    totalHoursWeek,
    studyDays,
    avgMinutesPerDay: Math.round(totalMinutesWeek / 7),
    subjectBalance: {
      politics: recentProgress.reduce((s, p) => s + p.politicsMinutes, 0),
      english: recentProgress.reduce((s, p) => s + p.englishMinutes, 0),
      math: recentProgress.reduce((s, p) => s + p.mathMinutes, 0),
      major: recentProgress.reduce((s, p) => s + p.majorMinutes, 0),
    },
  };

  const prompt = `你是考研学习平台的晨报生成器。请根据以下数据生成一份简洁、鼓励性的每日晨报。

## Agent 分析报告
${analystReport ? `### 数据分析\n${analystReport.content}` : '暂无分析报告'}

${strategistReport ? `### 学习策略\n${strategistReport.content}` : '暂无策略报告'}

${coachReport ? `### 教练反馈\n${coachReport.content}` : '暂无教练反馈'}

## 本周数据
- 总学习时长: ${totalHoursWeek} 小时
- 学习天数: ${studyDays}/7 天
- 日均学习: ${metrics.avgMinutesPerDay} 分钟
- 科目分布: 政治 ${metrics.subjectBalance.politics}分钟, 英语 ${metrics.subjectBalance.english}分钟, 数学 ${metrics.subjectBalance.math}分钟, 874 ${metrics.subjectBalance.major}分钟

请生成一份包含以下部分的晨报（Markdown 格式）：
1. **今日概览** - 简短问候和今日重点
2. **昨日回顾** - 基于数据的简要总结
3. **今日计划** - 基于策略的具体建议
4. **一句激励** - 简短有力的激励语

保持简洁，总长度不超过500字。`;

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1024,
    messages: [{ role: 'user', content: prompt }],
  });

  const content = response.content[0].type === 'text' ? response.content[0].text : '';

  // Save brief to DB
  db.insert(morningBriefs)
    .values({
      date,
      content,
      metrics: JSON.stringify(metrics),
      createdAt: new Date().toISOString(),
    })
    .onConflictDoUpdate({
      target: morningBriefs.date,
      set: {
        content,
        metrics: JSON.stringify(metrics),
      },
    })
    .run();

  return content;
}
