@echo off
echo 🚀 Starting The Cosmic Coffeehouse servers...
echo.

echo 🐳 Starting MongoDB Docker container...
docker run -d --name cosmic-mongo -p 27017:27017 mongo:latest 2>nul
if %errorlevel% neq 0 (
    echo ⚡ Starting existing MongoDB container...
    docker start cosmic-mongo
)
echo ✅ MongoDB is starting up...

echo.
echo ⏳ Waiting for MongoDB to be ready...
timeout /t 5 /nobreak >nul

echo.
echo 🌟 Starting frontend and backend servers...
echo.
echo 🎯 Frontend will be available at: http://localhost:5182
echo 🎯 Backend API will be available at: http://localhost:3001
echo.
echo Press Ctrl+C to stop the servers, or use npm run stop
echo.

npm run dev