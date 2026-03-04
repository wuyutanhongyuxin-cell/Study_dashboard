import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function runStrategist(analysisData: Record<string, unknown>) {
  const prompt = `你是一个考研学习策略规划师。基于以下学习数据分析结果，请为学生制定明天和本周的学习计划。

分析数据：
${JSON.stringify(analysisData, null, 2)}

考试科目：
- 政治（思想政治理论）
- 英语一
- 数学一
- 874电子信息专业综合（上海交通大学集成电路学院）

请返回以下JSON格式（不要包含markdown代码块标记）：
{
  "tomorrow": {
    "date": "<明天日期>",
    "blocks": [
      {
        "time": "<时间段，如 08:00-10:00>",
        "subject": "<科目>",
        "task": "<具体任务>",
        "duration": <分钟数>
      }
    ],
    "totalHours": <number>,
    "focus": "<当天重点>"
  },
  "weekPlan": {
    "priorities": ["<本周优先事项>"],
    "subjectDistribution": {
      "politics": "<建议时间比例>",
      "english": "<建议时间比例>",
      "math": "<建议时间比例>",
      "major": "<建议时间比例>"
    },
    "milestones": ["<本周目标>"]
  },
  "adjustments": ["<基于分析的调整建议>"]
}`;

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
