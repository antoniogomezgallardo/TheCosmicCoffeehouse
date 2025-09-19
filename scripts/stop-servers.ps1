#!/usr/bin/env powershell

Write-Host "🛑 Stopping The Cosmic Coffeehouse servers..." -ForegroundColor Red
Write-Host ""

Write-Host "🔍 Finding development server processes..." -ForegroundColor Yellow

# Stop Vite frontend server
Write-Host "📱 Stopping Vite frontend server..." -ForegroundColor Cyan
$viteProcesses = Get-WmiObject -Class Win32_Process | Where-Object { $_.CommandLine -like "*vite*" }
foreach ($process in $viteProcesses) {
    Write-Host "Found frontend process: $($process.ProcessId)" -ForegroundColor Green
    Stop-Process -Id $process.ProcessId -Force -ErrorAction SilentlyContinue
    Write-Host "✅ Frontend server stopped" -ForegroundColor Green
}

# Stop Nodemon/ts-node backend server
Write-Host "📱 Stopping Nodemon/ts-node backend server..." -ForegroundColor Cyan
$backendProcesses = Get-WmiObject -Class Win32_Process | Where-Object {
    $_.CommandLine -like "*nodemon*" -or $_.CommandLine -like "*ts-node*"
}
foreach ($process in $backendProcesses) {
    Write-Host "Found backend process: $($process.ProcessId)" -ForegroundColor Green
    Stop-Process -Id $process.ProcessId -Force -ErrorAction SilentlyContinue
    Write-Host "✅ Backend server stopped" -ForegroundColor Green
}

# Stop Concurrently process
Write-Host "📱 Stopping Concurrently process..." -ForegroundColor Cyan
$concurrentlyProcesses = Get-WmiObject -Class Win32_Process | Where-Object { $_.CommandLine -like "*concurrently*" }
foreach ($process in $concurrentlyProcesses) {
    Write-Host "Found concurrently process: $($process.ProcessId)" -ForegroundColor Green
    Stop-Process -Id $process.ProcessId -Force -ErrorAction SilentlyContinue
    Write-Host "✅ Concurrently process stopped" -ForegroundColor Green
}

Write-Host ""
Write-Host "🐳 Stopping MongoDB Docker container..." -ForegroundColor Cyan
try {
    docker stop cosmic-mongo 2>$null
    if ($LASTEXITCODE -eq 0) {
        Write-Host "✅ MongoDB container stopped" -ForegroundColor Green
    } else {
        Write-Host "ℹ️  MongoDB container was not running" -ForegroundColor Yellow
    }
} catch {
    Write-Host "ℹ️  MongoDB container was not running" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎉 Development servers stopped! Claude Code remains running." -ForegroundColor Green
Write-Host ""
Write-Host "To start again, run: npm run dev (after starting MongoDB with npm run start:mongo)" -ForegroundColor Yellow