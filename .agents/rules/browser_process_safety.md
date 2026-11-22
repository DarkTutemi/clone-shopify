# Rule: Browser Process Isolation & Personal Chrome Protection

**PRIORITY: CRITICAL / NON-NEGOTIABLE**

## 1. Absolute Directive
**The user's personal Google Chrome browser, windows, and open tabs must NEVER be terminated, closed, or interrupted by any Antigravity agent or automated script.**

---

## 2. Strictly Prohibited Commands
The following actions and commands are strictly banned across all tools, shell sessions, and automation scripts:

* ❌ `Get-Process chrome | Stop-Process`
* ❌ `Stop-Process -Name "chrome"` or `Stop-Process -ProcessName chrome`
* ❌ `taskkill /IM chrome.exe` or `taskkill /F /IM chrome.exe`
* ❌ `pkill chrome`, `killall chrome`, or any wildcard process termination targeting browser executables.
* ❌ Terminating or restarting any external process solely because a debugging port (e.g., 9222, 9224, 9226) is occupied.
* ❌ Connecting to, modifying, or terminating pre-existing browser sessions without explicit user permission.

Any attempt to run browser-wide kill commands will be intercepted and denied by the `.agents/hooks.json` safety guard.

---

## 3. Safe Browser Automation Protocol

Whenever an agent or script needs to launch a browser for DevTools, screenshots, DOM inspection, or QA:

### A. Process & Profile Isolation
1. **Isolated Data Directory:** Always create an isolated temporary directory in the system temp folder (e.g., `join(tmpdir(), 'cdp_session_' + Date.now())`).
2. **Never Touch Default Profiles:** Never point `--user-data-dir` to the user's primary Chrome profile (`AppData\Local\Google\Chrome\User Data`).
3. **Headless Execution:** Run with `--headless=new` and clean teardown handlers.

### B. Dynamic Port Allocation & Conflict Handling
1. **Dynamic Port Preference:** Use `--remote-debugging-port=0` where supported to let the OS assign an ephemeral port.
2. **Port Conflict Policy:** If using a fixed candidate port (e.g., 9226) and it is occupied:
   * Select a different port (e.g., 9227, 9228, 9230).
   * **NEVER terminate the process currently occupying the port.**
   * If no port is available, fail safely with an informative message.

### C. Strict Process Ownership & Safe Cleanup
1. **Ownership Tracking:** Capture and record the exact child process ID (`proc.pid`) immediately upon spawning.
2. **Targeted Cleanup Only:** Cleanup routines may **only** terminate the exact child process spawned by the current script:
   * Node.js: `childProc.kill()`
   * Windows: `taskkill /PID <child.pid> /T /F`
3. **Refuse Unknown PIDs:** If process ownership cannot be verified, do not issue any termination signal. Leave the process untouched and report it for manual review.
