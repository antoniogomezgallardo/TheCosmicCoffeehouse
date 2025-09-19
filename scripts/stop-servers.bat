@echo off
echo 🛑 Stopping The Cosmic Coffeehouse servers...
echo.

echo 🔍 Finding development server processes...

echo 📱 Stopping Vite frontend server...
for /f "tokens=2 delims==" %%i in ('wmic process where "commandline like '%%vite%%'" get processid /format:value 2^>nul ^| find "ProcessId"') do (
    if not "%%i"=="" (
        echo Found frontend process: %%i
        taskkill /f /pid %%i 2>nul
        echo ✅ Frontend server stopped
    )
)

echo 📱 Stopping Nodemon/ts-node backend server...
for /f "tokens=2 delims==" %%i in ('wmic process where "commandline like '%%nodemon%%' or commandline like '%%ts-node%%'" get processid /format:value 2^>nul ^| find "ProcessId"') do (
    if not "%%i"=="" (
        echo Found backend process: %%i
        taskkill /f /pid %%i 2>nul
        echo ✅ Backend server stopped
    )
)

echo 📱 Stopping Concurrently process...
for /f "tokens=2 delims==" %%i in ('wmic process where "commandline like '%%concurrently%%'" get processid /format:value 2^>nul ^| find "ProcessId"') do (
    if not "%%i"=="" (
        echo Found concurrently process: %%i
        taskkill /f /pid %%i 2>nul
        echo ✅ Concurrently process stopped
    )
)

echo.
echo 🐳 Stopping MongoDB Docker container...
docker stop cosmic-mongo 2>nul
if %errorlevel% neq 0 (
    echo ℹ️  MongoDB container was not running
) else (
    echo ✅ MongoDB container stopped
)

echo.
echo 🎉 Development servers stopped! Claude Code remains running.
echo.
echo To start again, run: npm run dev (after starting MongoDB with npm run start:mongo)
pause