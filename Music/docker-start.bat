@echo off
echo Building and starting Music Streaming Application with Docker...
echo.

echo Step 1: Building and starting all services...
docker-compose up -d --build

echo.
echo Waiting for services to start...
timeout /t 10 /nobreak

echo.
echo Checking service status...
docker-compose ps

echo.
echo ============================================
echo Services are starting!
echo.
echo Frontend: http://localhost:3000
echo Backend:  http://localhost:8084
echo MySQL:    localhost:3306
echo.
echo To view logs: docker-compose logs -f
echo To stop:      docker-compose down
echo ============================================

pause

