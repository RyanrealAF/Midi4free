@echo off
REM DrumExtract Deployment Script for Windows
REM This script builds and deploys the application using Docker

echo 🚀 Starting DrumExtract deployment...

REM Check if Docker is installed
where docker >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ❌ Docker is not installed. Please install Docker first.
    exit /b 1
)

REM Check if Docker Compose is installed
where docker-compose >nul 2>&1
if %ERRORLEVEL% neq 0 (
    echo ❌ Docker Compose is not installed. Please install Docker Compose first.
    exit /b 1
)

REM Build the production image
echo 🔨 Building production image...
docker-compose -f docker-compose.prod.yml build --no-cache

REM Stop any existing containers
echo 🛑 Stopping existing containers...
docker-compose -f docker-compose.prod.yml down

REM Start the application
echo 🚀 Starting application...
docker-compose -f docker-compose.prod.yml up -d

REM Wait for the application to be ready
echo ⏳ Waiting for application to be ready...
timeout /t 10 /nobreak >nul

REM Check if the application is healthy
echo 🔍 Checking application health...
curl -f http://localhost:8000/health >nul 2>&1
if %ERRORLEVEL% equ 0 (
    echo ✅ Application is running successfully!
    echo 🌐 Application is available at: http://localhost:8000
) else (
    echo ❌ Application health check failed. Please check the logs:
    echo    docker-compose -f docker-compose.prod.yml logs
    exit /b 1
)

echo 🎉 Deployment completed successfully!