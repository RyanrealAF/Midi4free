@echo off
setlocal

echo 🚀 Starting DrumExtract deployment...

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not running. Please start Docker Desktop.
    exit /b 1
)

echo 🔨 Building production image...
docker-compose -f docker-compose.prod.yml build --no-cache

echo 🛑 Stopping existing containers...
docker-compose -f docker-compose.prod.yml down

echo 🚀 Starting application...
docker-compose -f docker-compose.prod.yml up -d

echo ⏳ Waiting for application to be ready...
timeout /t 10 /nobreak >nul

echo 🔍 Checking application health...
curl -f http://localhost:8000/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Application is running successfully!
    echo 🌐 Application is available at: http://localhost:8000
) else (
    echo ❌ Application health check failed. Please check the logs:
    echo    docker-compose -f docker-compose.prod.yml logs
    exit /b 1
)

echo 🎉 Deployment completed successfully!