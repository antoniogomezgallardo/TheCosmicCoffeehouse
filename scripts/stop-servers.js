#!/usr/bin/env node

const { exec } = require('child_process');
const os = require('os');

console.log('🛑 Stopping The Cosmic Coffeehouse development servers...\n');

// Function to execute command and return promise
function execPromise(command) {
    return new Promise((resolve, reject) => {
        exec(command, (error, stdout, stderr) => {
            if (error) {
                resolve({ error, stdout, stderr });
            } else {
                resolve({ stdout, stderr });
            }
        });
    });
}

async function stopServers() {
    console.log('🔍 Finding development server processes...');

    if (os.platform() === 'win32') {
        // Windows approach
        try {
            // Get all node processes with command lines
            const result = await execPromise('wmic process where "name=\'node.exe\'" get processid,commandline');

            if (result.stdout) {
                const lines = result.stdout.split('\n');
                const processesToKill = [];

                for (const line of lines) {
                    // Skip header and empty lines
                    if (!line.trim() || line.startsWith('CommandLine')) continue;

                    if (line.includes('vite') || line.includes('nodemon') ||
                        (line.includes('ts-node') && !line.includes('claude-code'))) {

                        // Extract PID from the end of the line
                        const parts = line.trim().split(/\s+/);
                        const pid = parts[parts.length - 1];

                        if (pid && /^\d+$/.test(pid)) {
                            processesToKill.push(pid);
                            console.log(`📱 Found process to stop: ${pid} - ${line.substring(0, 60)}...`);
                        }
                    }
                }

                // Kill the processes
                for (const pid of processesToKill) {
                    console.log(`📱 Stopping process ${pid}...`);
                    await execPromise(`taskkill /f /pid ${pid}`);
                    console.log(`✅ Stopped process ${pid}`);
                }

                if (processesToKill.length === 0) {
                    console.log('ℹ️  No development servers were running');
                }
            }
        } catch (error) {
            console.log('⚠️  Error stopping Node.js processes:', error.message);
        }

        // Stop MongoDB container
        console.log('\n🐳 Stopping MongoDB Docker container...');
        const dockerResult = await execPromise('docker stop cosmic-mongo');
        if (dockerResult.error) {
            console.log('ℹ️  MongoDB container was not running');
        } else {
            console.log('✅ MongoDB container stopped');
        }
    } else {
        // Unix/Linux approach
        console.log('Unix/Linux stop commands not implemented yet');
    }

    console.log('\n🎉 Development servers stopped! Claude Code remains running.');
    console.log('\nTo restart servers: npm run start:mongo then npm run dev');
}

stopServers().catch(console.error);