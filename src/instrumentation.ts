export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    const cron = await import('node-cron');

    // 22:30 每晚 Agent 分析
    cron.schedule('30 22 * * *', async () => {
      console.log('[CRON] Running nightly agent analysis...');
      try {
        await fetch('http://localhost:3000/api/agents/run', { method: 'POST' });
        console.log('[CRON] Agent analysis complete');
      } catch (e) {
        console.error('[CRON] Agent analysis failed:', e);
      }
    });

    // 07:00 每日信息抓取
    cron.schedule('0 7 * * *', async () => {
      console.log('[CRON] Running daily intel crawl...');
      try {
        await fetch('http://localhost:3000/api/intel/crawl', { method: 'POST' });
        console.log('[CRON] Intel crawl complete');
      } catch (e) {
        console.error('[CRON] Intel crawl failed:', e);
      }
    });

    // 07:30 生成晨报
    cron.schedule('30 7 * * *', async () => {
      console.log('[CRON] Generating morning brief...');
      try {
        const today = new Date().toISOString().split('T')[0];
        await fetch('http://localhost:3000/api/briefs', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ date: today }),
        });
        console.log('[CRON] Morning brief generated');
      } catch (e) {
        console.error('[CRON] Morning brief generation failed:', e);
      }
    });

    console.log('[CRON] Scheduled tasks registered');
  }
}
