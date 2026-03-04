import { runAnalyst } from './analyst';
import { runStrategist } from './strategist';
import { runCoach } from './coach';
import { db } from '@/lib/db';
import { agentReports } from '@/lib/db/schema';

export async function runOrchestrator() {
  const today = new Date().toISOString().slice(0, 10);

  // Step 1: Run analyst first
  const analysisData = await runAnalyst();

  // Step 2: Run strategist + coach in parallel
  const [strategyData, coachMessage] = await Promise.all([
    runStrategist(analysisData),
    runCoach(analysisData),
  ]);

  // Step 3: Save all reports to DB
  await db.insert(agentReports).values([
    {
      date: today,
      agentType: 'analyst',
      content: JSON.stringify(analysisData),
    },
    {
      date: today,
      agentType: 'strategist',
      content: JSON.stringify(strategyData),
    },
    {
      date: today,
      agentType: 'coach',
      content: typeof coachMessage === 'string' ? coachMessage : JSON.stringify(coachMessage),
    },
  ]);

  return {
    analyst: analysisData,
    strategist: strategyData,
    coach: coachMessage,
    date: today,
  };
}
