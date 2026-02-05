#!/bin/bash

echo "🚀 Starting DrumExtract Development Environment"
echo "=============================================="

# Check if Docker is running
if ! docker info > /dev/null 2>&1; then
    echo "❌ Docker is not running. Please start Docker first."
    exit 1
fi

# Start backend in Docker
echo "📦 Starting backend services..."
docker-compose up -d

# Wait for backend to be ready
echo "⏳ Waiting for backend to be ready..."
sleep 5

# Check if backend is responding
if curl -s http://localhost:8000/health > /dev/null; then
    echo "✅ Backend is ready at http://localhost:8000"
else
    echo "⚠️  Backend might still be starting. You can check http://localhost:8000/health"
fi

# Start frontend development server
echo "🎯 Starting frontend development server..."
echo "Frontend will be available at http://localhost:3000"
echo "Backend API is available at http://localhost:8000"
echo ""
echo "Development commands:"
echo "  Frontend: npm run dev (in this terminal)"
echo "  Backend: docker-compose logs -f (in another terminal)"
echo "  Stop: docker-compose down"
echo ""

# Start frontend
npm run dev