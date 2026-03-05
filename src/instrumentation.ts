declare global {
  // eslint-disable-next-line no-var
  var __studyDashboardCronRegistered: boolean | undefined;
}

function getLocalDateString(): string {
  const now = new Date();
  const tzOffsetMs = now.getTimezoneOffset() * 60 * 1000;
  return new Date(now.getTime() - tzOffsetMs).toISOString().slice(0, 10);
}

function getInternalBaseUrl(): string {
  return process.env.INTERNAL_API_BASE_URL || `http://127.0.0.1:${process.env.PORT || '3000'}`;
}

export async function register() {
  if (process.env.NEXT_RUNTIME !== 'nodejs') {
    return;
  }

  if (globalThis.__studyDashboardCronRegistered) {
    return;
  }

  globalThis.__studyDashboardCronRegistered = true;
  const dynamicImport = new Function('moduleName', 'return import(moduleName)');
  const cron = await dynamicImport('node-cron') as typeof import('node-cron');
  const baseUrl = getInternalBaseUrl();

  // 22:30 每晚 Agent 分析
  cron.schedule('30 22 * * *', async () => {
    console.log('[CRON] Running nightly agent analysis...');
    try {
      await fetch(`${baseUrl}/api/agents/run`, { method: 'POST' });
      console.log('[CRON] Agent analysis complete');
    } catch (e) {
      console.error('[CRON] Agent analysis failed:', e);
    }
  });

  // 07:00 每日信息抓取
  cron.schedule('0 7 * * *', async () => {
    console.log('[CRON] Running daily intel crawl...');
    try {
      await fetch(`${baseUrl}/api/intel/crawl`, { method: 'POST' });
      console.log('[CRON] Intel crawl complete');
    } catch (e) {
      console.error('[CRON] Intel crawl failed:', e);
    }
  });

  // 07:30 生成晨报
  cron.schedule('30 7 * * *', async () => {
    console.log('[CRON] Generating morning brief...');
    try {
      const today = getLocalDateString();
      await fetch(`${baseUrl}/api/briefs`, {
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
