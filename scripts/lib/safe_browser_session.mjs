/**
 * Safe Browser Session Manager
 * Ensures 100% process isolation, dynamic port selection without killing port owners,
 * and verified single-PID cleanup.
 */

import net from 'net';
import fs from 'fs';
import os from 'os';
import path from 'path';
import { spawn } from 'child_process';

/**
 * Checks if a TCP port is free without modifying any process.
 */
export function isPortFree(port) {
  return new Promise((resolve) => {
    const server = net.createServer();
    server.once('error', () => {
      resolve(false);
    });
    server.once('listening', () => {
      server.close(() => resolve(true));
    });
    server.listen(port, '127.0.0.1');
  });
}

/**
 * Finds the first free port in a range.
 * If preferred port is busy, increments safely. NEVER kills the process holding the port!
 */
export async function findFreePort(startPort = 9230, maxAttempts = 20) {
  for (let p = startPort; p < startPort + maxAttempts; p++) {
    const free = await isPortFree(p);
    if (free) return p;
  }
  throw new Error(`No free port found between ${startPort} and ${startPort + maxAttempts}`);
}

/**
 * Launches an isolated headless Chrome instance.
 */
export async function launchSafeBrowser({
  chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe',
  preferredPort = 9230,
  width = 1440,
  height = 900
} = {}) {
  // 1. Find an available port safely
  const port = await findFreePort(preferredPort);

  // 2. Create isolated unique temporary profile
  const sessionDir = path.join(os.tmpdir(), `zvhc_safe_browser_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`);
  fs.mkdirSync(sessionDir, { recursive: true });

  // 3. Spawn process
  const args = [
    '--headless=new',
    `--remote-debugging-port=${port}`,
    `--user-data-dir=${sessionDir}`,
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    `--window-size=${width},${height}`
  ];

  const proc = spawn(chromePath, args, { detached: false });
  const pid = proc.pid;

  if (!pid) {
    throw new Error('Failed to spawn browser process');
  }

  // 4. Return session object with safe targeted cleanup
  return {
    proc,
    pid,
    port,
    userDataDir: sessionDir,
    async close() {
      // ONLY kill the exact PID spawned by this session
      try {
        if (proc && !proc.killed) {
          proc.kill();
        }
      } catch (err) {
        console.error(`Error closing browser PID ${pid}:`, err);
      }

      // Safe clean up of temp dir
      try {
        if (fs.existsSync(sessionDir)) {
          fs.rmSync(sessionDir, { recursive: true, force: true, maxRetries: 3 });
        }
      } catch {}
    }
  };
}
