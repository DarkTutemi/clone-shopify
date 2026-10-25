import fs from 'fs';
import path from 'path';
import { execSync } from 'child_process';

const targetDir = 'C:/Users/Admin/AppData/Local/ms-playwright-go/1.57.0';
const srcPackage = 'C:/Users/Admin/.gemini/antigravity-ide/brain/ba009709-9c7b-4366-a57b-5a4a187c37c3/scratch/playwright/package';

if (!fs.existsSync(targetDir)) {
  fs.mkdirSync(targetDir, { recursive: true });
}

// 1. Copy package directory
const targetPackage = path.join(targetDir, 'package');
if (fs.existsSync(targetPackage)) {
  fs.rmSync(targetPackage, { recursive: true, force: true });
}
fs.cpSync(srcPackage, targetPackage, { recursive: true });
console.log('Copied package folder.');

// 2. Setup node/win32_x64/node.exe
const nodeDir = path.join(targetDir, 'node', 'win32_x64');
fs.mkdirSync(nodeDir, { recursive: true });
const sysNode = 'C:/Program Files/nodejs/node.exe';
fs.copyFileSync(sysNode, path.join(nodeDir, 'node.exe'));
console.log('Copied node.exe.');

// 3. Create playwright.cmd
const cmdContent = `@echo off
setlocal
if not defined PLAYWRIGHT_NODEJS_PATH (
    set "PLAYWRIGHT_NODEJS_PATH=%~dp0node\\win32_x64\\node.exe"
)
if not exist "%PLAYWRIGHT_NODEJS_PATH%" (
    set "PLAYWRIGHT_NODEJS_PATH=node"
)
"%PLAYWRIGHT_NODEJS_PATH%" "%~dp0package\\cli.js" %*
`;
fs.writeFileSync(path.join(targetDir, 'playwright.cmd'), cmdContent);

// 4. Create playwright.sh
const shContent = `#!/bin/sh
SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PLAYWRIGHT_NODEJS_PATH="$SCRIPT_DIR/node/win32_x64/node.exe"
if [ ! -f "$PLAYWRIGHT_NODEJS_PATH" ]; then
    PLAYWRIGHT_NODEJS_PATH="node"
fi
"$PLAYWRIGHT_NODEJS_PATH" "$SCRIPT_DIR/package/cli.js" "$@"
`;
fs.writeFileSync(path.join(targetDir, 'playwright.sh'), shContent);

console.log('Driver installed successfully!');
const testOut = execSync(`"${path.join(targetDir, 'playwright.cmd')}" --version`).toString();
console.log('Driver test version output:', testOut.trim());
