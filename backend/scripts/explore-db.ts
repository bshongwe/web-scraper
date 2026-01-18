import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function exploreDatabase() {
  console.log('🔍 Database Structure Exploration\n');

  try {
    // 1. Count all records
    const [userCount, sessionCount, scrapeResultCount] = await Promise.all([
      prisma.user.count(),
      prisma.session.count(),
      prisma.scrapeResult.count(),
    ]);

    console.log('📊 Record Counts:');
    console.log(`   Users: ${userCount}`);
    console.log(`   Sessions: ${sessionCount}`);
    console.log(`   Scrape Results: ${scrapeResultCount}\n`);

    // 2. Show recent users
    if (userCount > 0) {
      console.log('👥 Recent Users:');
      const users = await prisma.user.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          _count: {
            select: { sessions: true }
          }
        }
      });

      users.forEach(user => {
        const sessionInfo = `${user._count.sessions} sessions`;
        console.log(`   📧 ${user.email} (${user.role}) - ${sessionInfo}`);
      });
      console.log('');
    }

    // 3. Show recent scrape results
    if (scrapeResultCount > 0) {
      console.log('🌐 Recent Scrape Results:');
      const results = await prisma.scrapeResult.findMany({
        take: 5,
        orderBy: { createdAt: 'desc' },
        select: {
          id: true,
          url: true,
          createdAt: true,
          content: true
        }
      });

      results.forEach(result => {
        const contentLength = result.content.length;
        const truncatedUrl = result.url.length > 50
          ? result.url.substring(0, 47) + '...'
          : result.url;
        console.log(`   🔗 ${truncatedUrl}`);
        const contentInfo = `${contentLength.toLocaleString()} characters`;
        console.log(`      � Content: ${contentInfo}`);
        const scrapedInfo = result.createdAt.toLocaleString();
        console.log(`      📅 Scraped: ${scrapedInfo}\n`);
      });
    }

    // 4. Show active sessions
    if (sessionCount > 0) {
      console.log('🔑 Active Sessions:');
      const activeSessions = await prisma.session.findMany({
        where: { revoked: false },
        take: 5,
        orderBy: { createdAt: 'desc' },
        include: {
          user: {
            select: { email: true }
          }
        }
      });

      if (activeSessions.length > 0) {
        activeSessions.forEach(session => {
          console.log(`   👤 ${session.user.email}`);
          const createdInfo = session.createdAt.toLocaleString();
          console.log(`      Created: ${createdInfo}`);
        });
      } else {
        console.log('   No active sessions found');
      }
      console.log('');
    }

    // 5. Domain statistics
    if (scrapeResultCount > 0) {
      console.log('📈 Domain Statistics:');
      const results = await prisma.scrapeResult.findMany({
        select: { url: true }
      });
      
      const domainCounts = results.reduce((acc, result) => {
        try {
          const domain = new URL(result.url).hostname;
          acc[domain] = (acc[domain] || 0) + 1;
        } catch (e) {
          acc['invalid-url'] = (acc['invalid-url'] || 0) + 1;
        }
        return acc;
      }, {} as Record<string, number>);

      const sortedDomains = Object.entries(domainCounts)
        .sort(([,a], [,b]) => b - a)
        .slice(0, 5);

      sortedDomains.forEach(([domain, count]) => {
        console.log(`   🌍 ${domain}: ${count} scrapes`);
      });
      console.log('');
    }

  } catch (error) {
    console.error('❌ Error exploring database:', error);
  }
}

// Run the exploration
exploreDatabase()
  .then(() => {
    console.log('✅ Database exploration complete!');
  })
  .catch((error) => {
    console.error('❌ Exploration failed:', error);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
