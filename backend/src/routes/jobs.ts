import { Router } from 'express';
import Queue from 'bull';

const router = Router();
const scrapeQueue = new Queue('scrape', process.env.REDIS_URL || 'redis://localhost:6379');

router.post('/schedule', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'url required' });
  const job = await scrapeQueue.add({ url }, { attempts: 3 });
  return res.json({ jobId: job.id });
});

router.get('/results', async (req, res) => {
  // simple fetch of last results
  // In production implement paging and RBAC
  const results = await (await import('../db')).prisma.scrapeResult.findMany({ orderBy: { createdAt: 'desc' }, take: 50 });
  return res.json(results);
});

export default router;
