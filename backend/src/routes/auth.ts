import { Router } from 'express';
import { z } from 'zod';
import argon2 from 'argon2';
import { prisma } from '../db';
import { signAccessToken, signRefreshToken } from '../auth/jwt';

const router = Router();

const loginSchema = z.object({ email: z.string().email(), password: z.string() });

router.post('/register', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.errors });
  const { email, password } = parsed.data;
  const hashed = await argon2.hash(password);
  const user = await prisma.user.create({ data: { email, password: hashed } });
  return res.json({ id: user.id, email: user.email });
});

router.post('/login', async (req, res) => {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) return res.status(400).json({ error: parsed.error.errors });
  const { email, password } = parsed.data;
  const user = await prisma.user.findUnique({ where: { email } });
  if (!user) return res.status(401).json({ error: 'invalid' });
  const ok = await argon2.verify(user.password, password);
  if (!ok) return res.status(401).json({ error: 'invalid' });
  const access = signAccessToken({ sub: user.id, role: user.role });
  const refresh = signRefreshToken({ sub: user.id });
  await prisma.session.create({ data: { userId: user.id, token: refresh } });
  res.cookie('refresh_token', refresh, { httpOnly: true, secure: false, sameSite: 'lax' });
  return res.json({ accessToken: access });
});

export default router;
