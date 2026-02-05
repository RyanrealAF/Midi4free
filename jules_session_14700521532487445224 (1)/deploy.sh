#!/bin/bash

# DrumExtract Deployment Script
# This script builds and deploys the application using Docker

set -e

echo "🚀 Starting DrumExtract deployment..."

# Check if Docker is installed
if ! command -v docker &> /dev/null; then
    echo "❌ Docker is not installed. Please install Docker first."
    exit 1
fi

# Check if Docker Compose is installed
if ! command -v docker-compose &> /dev/null; then
    echo "❌ Docker Compose is not installed. Please install Docker Compose first."
    exit 1
fi

# Build the production image
echo "🔨 Building production image..."
docker-compose -f docker-compose.prod.yml build --no-cache

# Stop any existing containers
echo "🛑 Stopping existing containers..."
docker-compose -f docker-compose.prod.yml down

# Start the application
echo "🚀 Starting application..."
docker-compose -f docker-compose.prod.yml up -d

# Wait for the application to be ready
echo "⏳ Waiting for application to be ready..."
sleep 10

# Check if the application is healthy
echo "🔍 Checking application health..."
if curl -f http://localhost:8000/health &> /dev/null; then
    echo "✅ Application is running successfully!"
    echo "🌐 Application is available at: http://localhost:8000"
else
    echo "❌ Application health check failed. Please check the logs:"
    echo "   docker-compose -f docker-compose.prod.yml logs"
    exit 1
fi

echo "🎉 Deployment completed successfully!"