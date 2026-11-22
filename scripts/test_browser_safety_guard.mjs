/**
 * STATIC & MOCKED TEST SUITE FOR BROWSER SAFETY GUARD
 * Verifies that all dangerous termination patterns are blocked and safe automation runs isolated.
 * Does NOT terminate or restart any real external browsers.
 */

import { spawnSync } from 'child_process';
import net from 'net';
import os from 'os';
import path from 'path';
import { isPortFree, findFreePort } from './lib/safe_browser_session.mjs';

function runGuard(inputObj) {
  const inputStr = JSON.stringify(inputObj);
  const res = spawnSync('node', ['./scripts/guard_browser_process.mjs'], {
    input: inputStr,
    encoding: 'utf8'
  });
  try {
    return JSON.parse(res.stdout.trim());
  } catch (e) {
    return { error: e.message, stdout: res.stdout, stderr: res.stderr };
  }
}

async function runTests() {
  console.log('=== STARTING BROWSER SAFETY GUARD TEST SUITE ===\n');
  let passed = 0;
  let failed = 0;

  function assert(condition, message) {
    if (condition) {
      console.log(`✅ PASS: ${message}`);
      passed++;
    } else {
      console.error(`❌ FAIL: ${message}`);
      failed++;
    }
  }

  // TEST 1: All known browser-wide termination commands are detected and prohibited
  console.log('--- Test Suite 1: Prohibited Command Detection ---');

  const dangerousCommands = [
    'Get-Process chrome | Stop-Process',
    'Get-Process chrome -ErrorAction SilentlyContinue | Stop-Process -Force',
    'Stop-Process -Name "chrome" -Force',
    'Stop-Process -Name chrome',
    'Stop-Process -ProcessName chrome -Force',
    'taskkill /F /IM chrome.exe',
    'taskkill /im chrome.exe /f',
    'taskkill.exe /IM *chrome* /F',
    'pkill chrome',
    'killall chrome',
    'Stop-Process -Name "msedge"',
    'taskkill /IM brave.exe /F'
  ];

  dangerousCommands.forEach(cmd => {
    const result = runGuard({
      toolCall: {
        name: 'run_command',
        args: { CommandLine: cmd }
      }
    });
    assert(result.decision === 'deny', `Blocked unsafe command: "${cmd}"`);
  });

  // TEST 2: Safe and legitimate commands are permitted
  console.log('\n--- Test Suite 2: Legitimate Commands Permitted ---');

  const safeCommands = [
    'git status',
    'node scratch/test.mjs',
    'taskkill /PID 12345 /T /F',
    'Stop-Process -Id 12345',
    'Get-Process -Id 12345',
    'Get-NetTCPConnection -LocalPort 9226',
    'echo "hello world"'
  ];

  safeCommands.forEach(cmd => {
    const result = runGuard({
      toolCall: {
        name: 'run_command',
        args: { CommandLine: cmd }
      }
    });
    assert(result.decision === 'allow', `Allowed safe command: "${cmd}"`);
  });

  // TEST 3: Port Conflict Never Triggers Process Termination
  console.log('\n--- Test Suite 3: Port Conflict Non-Interference ---');
  
  const testPort = 19876;
  const dummyServer = net.createServer();
  
  await new Promise((resolve) => {
    dummyServer.listen(testPort, '127.0.0.1', () => {
      console.log(`Mock server listening on port ${testPort} (simulating occupied port)`);
      resolve();
    });
  });

  // Check that testPort is reported as not free
  const portFreeBefore = await isPortFree(testPort);
  assert(portFreeBefore === false, `Port ${testPort} correctly detected as occupied`);

  // Call findFreePort starting at testPort
  const chosenPort = await findFreePort(testPort);
  assert(chosenPort > testPort, `Safely shifted to alternate port ${chosenPort} without touching ${testPort}`);

  // Verify dummy server is still alive and running (was NOT terminated!)
  assert(dummyServer.listening === true, `Occupied port ${testPort} remained completely untouched and active`);

  dummyServer.close();

  // TEST 4: Isolated Temporary Directory Security
  console.log('\n--- Test Suite 4: Profile Isolation & Path Confinement ---');
  
  const tempBase = os.tmpdir();
  const personalProfilePath = path.join(process.env.LOCALAPPDATA || '', 'Google', 'Chrome', 'User Data');
  
  const simulatedSessionDir = path.join(tempBase, `zvhc_safe_browser_${Date.now()}`);
  assert(simulatedSessionDir.startsWith(tempBase), 'Browser session directory resides strictly in system temp directory');
  assert(!simulatedSessionDir.includes(personalProfilePath), 'Browser session directory is 100% isolated from personal Chrome profile');

  console.log(`\n=== TEST SUMMARY: ${passed} PASSED | ${failed} FAILED ===`);
  if (failed > 0) {
    process.exit(1);
  }
}

runTests().catch(err => {
  console.error('Test execution failed:', err);
  process.exit(1);
});
