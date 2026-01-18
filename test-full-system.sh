#!/bin/bash

echo "🧪 Testing Full Web Scraper System"
echo "=================================="

# Test API Health
echo "1. Testing API health..."
if curl -s http://localhost:4000/api/jobs/results > /dev/null; then
    echo "   ✅ API is responding"
else
    echo "   ❌ API is not responding"
fi

# Test Frontend
echo "2. Testing Frontend..."
if curl -s -I http://localhost:3000 | grep -q "200 OK"; then
    echo "   ✅ Frontend is responding"
else
    echo "   ❌ Frontend is not responding"
fi

# Test User Registration
echo "3. Testing User Registration..."
TEST_EMAIL="test-$(date +%s)@example.com"
REGISTER_RESULT=$(curl -s -X POST http://localhost:4000/api/auth/register \
  -H "Content-Type: application/json" \
  -d "{\"email\": \"$TEST_EMAIL\", \"password\": \"testpassword123\"}")

if echo "$REGISTER_RESULT" | grep -q "id"; then
    echo "   ✅ User registration works"
    
    # Test Login
    echo "4. Testing User Login..."
    LOGIN_RESULT=$(curl -s -X POST http://localhost:4000/api/auth/login \
      -H "Content-Type: application/json" \
      -d "{\"email\": \"$TEST_EMAIL\", \"password\": \"testpassword123\"}")
    
    if echo "$LOGIN_RESULT" | grep -q "accessToken"; then
        echo "   ✅ User login works"
        
        # Extract access token for job scheduling test
        ACCESS_TOKEN=$(echo "$LOGIN_RESULT" | \
          grep -o '"accessToken":"[^"]*"' | cut -d'"' -f4)
        
        # Test Job Scheduling
        echo "5. Testing Job Scheduling..."
        JOB_RESULT=$(curl -s -X POST http://localhost:4000/api/jobs/schedule \
          -H "Content-Type: application/json" \
          -H "Authorization: Bearer $ACCESS_TOKEN" \
          -d '{"url": "https://httpbin.org/html"}')
        
        if echo "$JOB_RESULT" | grep -q "jobId"; then
            echo "   ✅ Job scheduling works"
            echo "6. Waiting for job to process..."
            sleep 3
            
            # Check if results increased
            RESULT_COUNT=$(curl -s \
              http://localhost:4000/api/jobs/results | \
              jq length 2>/dev/null || echo "0")
            echo "   📊 Current scrape results count: $RESULT_COUNT"
        else
            echo "   ❌ Job scheduling failed"
        fi
    else
        echo "   ❌ User login failed"
    fi
else
    echo "   ❌ User registration failed"
fi

echo ""
echo "🏁 System Test Complete"
echo ""
echo "🌐 Access Points:"
echo "   Frontend: http://localhost:3000"
echo "   API: http://localhost:4000"
echo "   Prisma Studio: http://localhost:5555"
echo "   (run: docker exec web-scraper-api-1 npx prisma studio)"
echo ""
echo "🐳 Container Status:"
docker compose ps
