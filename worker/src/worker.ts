import Bull from 'bull';
import fetch from 'node-fetch';
import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();
const q = new Bull(
  'scrape',
  process.env.REDIS_URL || 'redis://redis:6379'
);

q.process(async job => {
  const { url } = job.data;
  // Call the scraper service via Redis or HTTP
  // For simplicity: call the scraper container via HTTP
  // or spawn CLI. We'll simulate an HTTP call to scraper
  // that returns HTML
  try {
    const resp = await fetch(
      `http://scraper:8000/fetch?url=${encodeURIComponent(url)}`
    );
    const { content } = await resp.json() as any;
    await prisma.scrapeResult.create({ data: { url, content } });
    return { ok: true };
  } catch (err) {
    console.error('worker error', err);
    throw err;
  }
});

q.on('failed', (job, err) => console.error('job failed', job.id, err));

console.log('worker started');
