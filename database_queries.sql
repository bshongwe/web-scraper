-- Database Exploration Queries
-- Execute these in your PostgreSQL client or through Prisma Studio

-- 1. View all tables and their structure
\dt

-- 2. Check User table structure
\d "User"

-- 3. Check Session table structure  
\d "Session"

-- 4. Check ScrapeResult table structure
\d "ScrapeResult"

-- 5. Count records in each table
SELECT 'Users' as table_name, COUNT(*) as record_count FROM "User"
UNION ALL
SELECT 'Sessions' as table_name, COUNT(*) as record_count
FROM "Session"  
UNION ALL
SELECT 'ScrapeResults' as table_name, COUNT(*) as record_count
FROM "ScrapeResult";

-- 6. View all users with their session counts
SELECT 
  u.id,
  u.email,
  u.role,
  u."createdAt",
  COUNT(s.id) as session_count
FROM "User" u
LEFT JOIN "Session" s ON u.id = s."userId" AND s.revoked = false
GROUP BY u.id, u.email, u.role, u."createdAt"
ORDER BY u."createdAt" DESC;

-- 7. View recent scrape results
SELECT 
  id,
  url,
  LENGTH(content) as content_length,
  "createdAt"
FROM "ScrapeResult"
ORDER BY "createdAt" DESC
LIMIT 10;

-- 8. Find most scraped domains
SELECT 
  SUBSTRING(url FROM 'https?://([^/]+)') as domain,
  COUNT(*) as scrape_count
FROM "ScrapeResult"
GROUP BY SUBSTRING(url FROM 'https?://([^/]+)')
ORDER BY scrape_count DESC;

-- 9. Check active sessions
SELECT 
  s.id,
  u.email,
  s."createdAt",
  s.revoked
FROM "Session" s
JOIN "User" u ON s."userId" = u.id
WHERE s.revoked = false
ORDER BY s."createdAt" DESC;

-- 10. Database size information
SELECT 
  schemaname,
  tablename,
  attname,
  n_distinct,
  correlation
FROM pg_stats
WHERE schemaname = 'public';

-- 11. Find users who might need cleanup (old sessions)
SELECT 
  u.email,
  COUNT(s.id) as total_sessions,
  COUNT(CASE WHEN s.revoked = false THEN 1 END) as active_sessions,
  MAX(s."createdAt") as last_session
FROM "User" u
LEFT JOIN "Session" s ON u.id = s."userId"
GROUP BY u.id, u.email
HAVING COUNT(s.id) > 5;

-- 12. Scraping activity by day
SELECT 
  DATE("createdAt") as scrape_date,
  COUNT(*) as scrapes_count,
  COUNT(DISTINCT SUBSTRING(url FROM 'https?://([^/]+)')) as unique_domains
FROM "ScrapeResult"
WHERE "createdAt" >= CURRENT_DATE - INTERVAL '30 days'
GROUP BY DATE("createdAt")
ORDER BY scrape_date DESC;
