#!/bin/bash

echo "🚀 Starting Web Scraper Project Setup..."

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker and try again."
    exit 1
fi

# Check if docker-compose is available
if ! command -v docker-compose > /dev/null 2>&1; then
    echo "❌ docker-compose not found. Please install Docker Compose."
    exit 1
fi

# Create environment file if it doesn't exist
if [ ! -f backend/.env ]; then
    echo "📝 Creating backend/.env from template..."
    cp backend/.env.example backend/.env
    echo "✅ Please edit backend/.env with your configuration before proceeding."
else
    echo "✅ backend/.env already exists"
fi

echo "🏗️  Building and starting services..."
docker-compose up --build -d

echo "⏳ Waiting for services to be ready..."
sleep 10

# Check if services are running
if docker-compose ps | grep -q "Up"; then
    echo "✅ Services are starting up!"
    echo ""
    echo "🌐 Application URLs:"
    echo "   Frontend: http://localhost:3000"
    echo "   API:      http://localhost:4000" 
    echo "   PostgreSQL: localhost:5432"
    echo "   Redis:    localhost:6379"
    echo ""
    echo "📋 Useful commands:"
    echo "   View logs:    docker-compose logs -f [service-name]"
    echo "   Stop all:     docker-compose down"
    echo "   Rebuild:      docker-compose up --build"
    echo ""
    echo "🎉 Setup complete! Visit http://localhost:3000 to start using the scraper."
else
    echo "❌ Some services failed to start. Check logs with: docker-compose logs"
    exit 1
fi
