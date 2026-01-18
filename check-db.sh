#!/bin/bash

echo "🔍 Database Status Check"
echo "========================"

# Check if Docker containers are running
if docker ps | grep -q "postgres"; then
    echo "✅ PostgreSQL container is running"
else
    echo "❌ PostgreSQL container is not running"
    echo "   Run: docker compose up -d postgres"
    exit 1
fi

if docker ps | grep -q "redis"; then
    echo "✅ Redis container is running"
else
    echo "❌ Redis container is not running"  
    echo "   Run: docker compose up -d redis"
fi

echo ""

# Test database connection
echo "🔗 Testing database connection..."
cd backend

if npx prisma db push --accept-data-loss &> /dev/null; then
    echo "✅ Database connection successful"
else
    echo "❌ Database connection failed"
    echo "   Check your DATABASE_URL in backend/.env"
fi

# Check if database has been migrated
echo ""
echo "🛠️  Checking database schema..."

# Try to query a table to see if schema exists
QUERY='SELECT COUNT(*) FROM "User";'
if npx prisma db execute --stdin <<< "$QUERY" &> /dev/null; then
    echo "✅ Database schema is set up"
    
    # Get record counts
    echo ""
    echo "📊 Current data:"
    npx prisma db execute --stdin <<< "
    SELECT 'Users' as table_name, COUNT(*) as count FROM \"User\"
    UNION ALL  
    SELECT 'Sessions', COUNT(*) FROM \"Session\"
    UNION ALL
    SELECT 'ScrapeResults', COUNT(*) FROM \"ScrapeResult\";
    " 2>/dev/null || echo "   Could not retrieve counts"
    
else
    echo "⚠️  Database schema not found"
    echo "   Run: npx prisma migrate dev"
fi

echo ""
echo "🚀 Quick commands:"
echo "   📊 Explore data:     npm run db:explore"
echo "   🌐 Visual browser:   npx prisma studio"  
echo "   🌱 Add sample data:  npx prisma db seed"
echo "   🔄 Reset database:   npx prisma migrate reset"
