import Anthropic from '@anthropic-ai/sdk';

const client = new Anthropic({ apiKey: process.env.ANTHROPIC_API_KEY });

export async function runCoach(analysisData: Record<string, unknown>) {
  const prompt = `你是一位温暖而专业的考研学习教练。请基于以下学习数据分析结果，用中文为学生提供个性化的激励反馈。

分析数据：
${JSON.stringify(analysisData, null, 2)}

要求：
1. 真诚地肯定学生的努力和进步
2. 针对薄弱环节给出鼓励性的建议（不是批评）
3. 结合具体数据说话，让学生感受到被关注
4. 语气要像一位关心学生的学长/学姐
5. 最后给出一句激励的话

请直接返回中文文本（markdown格式），不需要JSON格式。`;

  const response = await client.messages.create({
    model: 'claude-sonnet-4-20250514',
    max_tokens: 1500,
    messages: [{ role: 'user', content: prompt }],
  });

  const text = response.content[0].type === 'text' ? response.content[0].text : '';
  return text;
}
