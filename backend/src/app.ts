import express from 'express';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
// @ts-ignore
import RedisStore from 'rate-limit-redis';
import Redis from 'ioredis';
import cors from 'cors';
import cookieParser from 'cookie-parser';

import authRouter from './routes/auth';
import jobsRouter from './routes/jobs';

const app = express();
app.use(helmet());
app.use(express.json());
app.use(cookieParser());

const redis = new Redis(process.env.REDIS_URL || 'redis://localhost:6379');
const limiter = rateLimit({
  store: new (RedisStore as any)({ client: redis }),
  windowMs: 15 * 60 * 1000,
  max: 200,
});
app.use(limiter);
app.use(cors({ origin: process.env.FRONTEND_ORIGIN || 'http://localhost:3000', credentials: true }));

app.use('/api/auth', authRouter);
app.use('/api/jobs', jobsRouter);

export default app;
