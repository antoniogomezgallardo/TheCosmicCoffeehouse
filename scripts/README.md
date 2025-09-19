# Server Management Scripts

This directory contains scripts for managing The Cosmic Coffeehouse development servers safely.

## 🚀 Available Scripts

### Node.js Script (Recommended)
- **`stop-servers.js`** - Smart server management that preserves Claude Code
  - Targets only development servers (Vite, Nodemon, ts-node)
  - Protects Claude Code from being terminated
  - Stops MongoDB Docker container
  - Cross-platform compatible

### Batch Files (Windows)
- **`start-servers.bat`** - Interactive startup with status messages
- **`stop-servers.bat`** - Windows batch version with process detection
- **`stop-cosmic-servers.bat`** - Alternative batch approach

### PowerShell Scripts (Windows)
- **`stop-servers.ps1`** - PowerShell version with colored output
- **`stop-dev-servers.ps1`** - Alternative PowerShell implementation

## 📋 Usage

### Via npm scripts (Recommended):
```bash
# Safe stop (preserves Claude Code)
npm run stop

# Start MongoDB + both servers
npm run restart

# Start just MongoDB
npm run start:mongo

# Alternative stop methods
npm run stop:safe
npm run stop:all
```

### Direct script execution:
```bash
# Node.js (cross-platform)
node scripts/stop-servers.js

# Windows Batch
scripts/start-servers.bat
scripts/stop-servers.bat

# PowerShell
powershell -ExecutionPolicy Bypass -File scripts/stop-servers.ps1
```

## 🛡️ Safety Features

All scripts are designed to:
- ✅ **Preserve Claude Code** - Never terminate Claude Code processes
- ✅ **Target specific processes** - Only stop development servers
- ✅ **Provide feedback** - Clear output showing what was stopped
- ✅ **Handle errors gracefully** - Continue execution if processes aren't running

## 🔧 How It Works

The scripts identify processes by command line patterns:
- `vite` - Frontend development server
- `nodemon` - Backend file watcher
- `ts-node` - TypeScript execution (excluding Claude Code)
- `concurrently` - Multi-server manager

Claude Code is protected by excluding processes containing `claude-code` in their command line.