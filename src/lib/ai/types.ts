export type AIProvider = 'anthropic' | 'deepseek';

export type AIChatRole = 'system' | 'user' | 'assistant';

export interface AIMessage {
  role: AIChatRole;
  content: string;
}
