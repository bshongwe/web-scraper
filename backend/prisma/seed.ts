import { PrismaClient } from '@prisma/client';
import argon2 from 'argon2';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Starting database seed...');

  // Create sample users
  const hashedPassword = await argon2.hash('password123');
  
  const user1 = await prisma.user.upsert({
    where: { email: 'admin@example.com' },
    update: {},
    create: {
      email: 'admin@example.com',
      password: hashedPassword,
      role: 'admin',
    },
  });

  const user2 = await prisma.user.upsert({
    where: { email: 'user@example.com' },
    update: {},
    create: {
      email: 'user@example.com',
      password: hashedPassword,
      role: 'user',
    },
  });

  // Create sample scrape results
  await prisma.scrapeResult.createMany({
    data: [
      {
        url: 'https://example.com',
        content:
          '<html><head><title>Example Domain</title></head>' +
          '<body><h1>Example Domain</h1>' +
          '<p>This domain is for use in illustrative examples ' +
          'in documents.</p></body></html>',
      },
      {
        url: 'https://httpbin.org/html',
        content:
          '<html><head><title>Herman Melville - Moby-Dick</title>' +
          '</head><body><h1>Moby-Dick</h1>' +
          '<p>Call me Ishmael. Some years ago...</p></body></html>',
      },
      {
        url: 'https://jsonplaceholder.typicode.com/',
        content:
          '<html><head><title>JSONPlaceholder</title></head>' +
          '<body><h1>JSONPlaceholder</h1>' +
          '<p>Free fake API for testing and prototyping.</p>' +
          '</body></html>',
      },
    ],
    skipDuplicates: true,
  });

  console.log(`✅ Created users:`);
  console.log(`   Admin: ${user1.email} (ID: ${user1.id})`);
  console.log(`   User:  ${user2.email} (ID: ${user2.id})`);
  console.log(`✅ Created sample scrape results`);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ Seed failed:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
