#!/usr/bin/env powershell

Write-Host "🛑 Stopping The Cosmic Coffeehouse servers..." -ForegroundColor Red
Write-Host ""

# Stop specific processes by exact command line matches
$processesToStop = @()

# Find Vite processes
$viteProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object {
    try {
        (Get-WmiObject -Class Win32_Process -Filter "ProcessId = $($_.Id)").CommandLine -like "*vite*"
    } catch { $false }
}
$processesToStop += $viteProcesses

# Find Nodemon processes
$nodemonProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object {
    try {
        (Get-WmiObject -Class Win32_Process -Filter "ProcessId = $($_.Id)").CommandLine -like "*nodemon*"
    } catch { $false }
}
$processesToStop += $nodemonProcesses

# Find ts-node processes (but not Claude Code)
$tsNodeProcesses = Get-Process -Name "node" -ErrorAction SilentlyContinue | Where-Object {
    try {
        $cmdLine = (Get-WmiObject -Class Win32_Process -Filter "ProcessId = $($_.Id)").CommandLine
        $cmdLine -like "*ts-node*" -and $cmdLine -notlike "*claude-code*"
    } catch { $false }
}
$processesToStop += $tsNodeProcesses

# Stop the processes
foreach ($process in $processesToStop) {
    try {
        Write-Host "Stopping process: $($process.Id)" -ForegroundColor Yellow
        Stop-Process -Id $process.Id -Force -ErrorAction Stop
        Write-Host "✅ Stopped process $($process.Id)" -ForegroundColor Green
    } catch {
        Write-Host "⚠️  Could not stop process $($process.Id)" -ForegroundColor Yellow
    }
}

# Stop MongoDB container
Write-Host ""
Write-Host "🐳 Stopping MongoDB Docker container..." -ForegroundColor Cyan
$result = docker stop cosmic-mongo 2>&1
if ($LASTEXITCODE -eq 0) {
    Write-Host "✅ MongoDB container stopped" -ForegroundColor Green
} else {
    Write-Host "ℹ️  MongoDB container was not running" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "🎉 Development servers stopped! Claude Code remains running." -ForegroundColor Green