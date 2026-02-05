@echo off
echo 🚀 Starting DrumExtract Development Environment
echo ==============================================

REM Check if Docker is running
docker info >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ Docker is not running. Please start Docker first.
    pause
    exit /b 1
)

REM Start backend in Docker
echo 📦 Starting backend services...
docker-compose up -d

REM Wait for backend to be ready
echo ⏳ Waiting for backend to be ready...
timeout /t 5 >nul

REM Check if backend is responding
curl -s http://localhost:8000/health >nul 2>&1
if %errorlevel% equ 0 (
    echo ✅ Backend is ready at http://localhost:8000
) else (
    echo ⚠️  Backend might still be starting. You can check http://localhost:8000/health
)

REM Start frontend development server
echo 🎯 Starting frontend development server...
echo Frontend will be available at http://localhost:3000
echo Backend API is available at http://localhost:8000
echo.
echo Development commands:
echo   Frontend: npm run dev (in this terminal)
echo   Backend: docker-compose logs -f (in another terminal)
echo   Stop: docker-compose down
echo.

REM Start frontend
npm run dev