#!/usr/bin/env node
/**
 * BROWSER PROCESS SAFETY GUARD (PreToolUse Hook)
 * 
 * Intercepts run_command tool calls before execution.
 * Blocks any global/unconstrained browser termination commands (e.g. Stop-Process, taskkill /IM)
 * that could inadvertently kill personal Google Chrome windows.
 */

import fs from 'fs';

function isUnsafeBrowserCommand(cmd) {
  if (!cmd || typeof cmd !== 'string') return false;

  const unsafePatterns = [
    // PowerShell: Stop-Process targeting chrome
    /Stop-Process\s+.*(?:-Name|-ProcessName|\s+)?["']?\*?chrome\*?["']?/i,
    /Get-Process\s+.*chrome.*\|.*Stop-Process/i,
    /Stop-Process.*\(Get-Process.*chrome.*\)/i,
    
    // Windows: taskkill targeting chrome by image name
    /taskkill(?:\.exe)?\s+.*(?:\/IM|\/im|-im)\s+["']?\*?chrome(?:\.exe)?\*?["']?/i,

    // Linux/macOS/Git Bash: pkill or killall targeting chrome
    /(?:pkill|killall)\s+.*chrome/i,

    // Broader wildcard termination on browser executables
    /Stop-Process\s+.*(?:-Name|-ProcessName|\s+)?["']?\*?(?:msedge|brave|firefox|opera)\*?["']?/i,
    /taskkill(?:\.exe)?\s+.*(?:\/IM|\/im|-im)\s+["']?\*?(?:msedge|brave|firefox|opera)(?:\.exe)?\*?["']?/i
  ];

  return unsafePatterns.some(pattern => pattern.test(cmd));
}

async function main() {
  let rawInput = '';
  
  try {
    rawInput = fs.readFileSync(0, 'utf8');
  } catch (err) {
    // If stdin cannot be read, allow execution safely
    console.log(JSON.stringify({ decision: 'allow' }));
    process.exit(0);
  }

  let parsed = null;
  try {
    parsed = JSON.parse(rawInput);
  } catch (e) {
    // If not JSON, check if raw string contains unsafe command
    if (isUnsafeBrowserCommand(rawInput)) {
      console.log(JSON.stringify({
        decision: 'deny',
        reason: 'CRITICAL SAFETY GUARD: Unconstrained browser termination command detected and blocked.'
      }));
      process.exit(0);
    }
    console.log(JSON.stringify({ decision: 'allow' }));
    process.exit(0);
  }

  const toolCall = parsed.toolCall || parsed;
  const toolName = toolCall.name || parsed.toolName;
  const args = toolCall.args || parsed.args || {};
  const cmd = args.CommandLine || args.commandLine || args.command || '';

  if (toolName === 'run_command' && isUnsafeBrowserCommand(cmd)) {
    const response = {
      decision: 'deny',
      reason: `SAFETY GUARD BLOCKED EXECUTION:\nCommand: "${cmd}"\nReason: Global browser process termination is strictly prohibited. Killing browsers by executable name (e.g. 'chrome.exe') risks closing the user's personal browser sessions and tabs. You must only terminate specific child PIDs spawned and owned by the current automation session.`
    };
    console.log(JSON.stringify(response));
    process.exit(0);
  }

  // Default: Allow safe tool execution
  console.log(JSON.stringify({ decision: 'allow' }));
  process.exit(0);
}

main().catch(() => {
  console.log(JSON.stringify({ decision: 'allow' }));
  process.exit(0);
});
