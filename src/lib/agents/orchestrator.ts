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

  // Step 3: Save all reports to DB (idempotent per day+agent).
  const now = new Date().toISOString();
  const reports = [
    {
      date: today,
      agentType: 'analyst' as const,
      content: JSON.stringify(analysisData),
    },
    {
      date: today,
      agentType: 'strategist' as const,
      content: JSON.stringify(strategyData),
    },
    {
      date: today,
      agentType: 'coach' as const,
      content: typeof coachMessage === 'string' ? coachMessage : JSON.stringify(coachMessage),
    },
  ];

  for (const report of reports) {
    await db
      .insert(agentReports)
      .values({ ...report, createdAt: now })
      .onConflictDoUpdate({
        target: [agentReports.date, agentReports.agentType],
        set: {
          content: report.content,
          createdAt: now,
        },
      });
  }

  return {
    analyst: analysisData,
    strategist: strategyData,
    coach: coachMessage,
    date: today,
  };
}
