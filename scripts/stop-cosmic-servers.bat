@echo off
echo 🛑 Stopping The Cosmic Coffeehouse development servers...
echo.

echo 🔍 Killing development server processes by PID...

REM Get PIDs of vite, nodemon, and ts-node processes (but not Claude Code)
for /f "tokens=2" %%i in ('tasklist /fi "imagename eq node.exe" /fo csv ^| findstr /i "vite"') do (
    echo Stopping Vite process %%i
    taskkill /f /pid %%i 2>nul
)

for /f "tokens=2" %%i in ('tasklist /fi "imagename eq node.exe" /fo csv ^| findstr /i "nodemon"') do (
    echo Stopping Nodemon process %%i
    taskkill /f /pid %%i 2>nul
)

for /f "tokens=2" %%i in ('tasklist /fi "imagename eq node.exe" /fo csv ^| findstr /i "ts-node"') do (
    echo Stopping ts-node process %%i
    taskkill /f /pid %%i 2>nul
)

echo.
echo 🐳 Stopping MongoDB Docker container...
docker stop cosmic-mongo 2>nul

echo.
echo 🎉 Development servers stopped! Claude Code should remain running.
echo.
echo To verify Claude Code is still running, check that you can still use it.
echo To restart servers: npm run start:mongo then npm run dev
pause