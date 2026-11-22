# Repository Guidelines & Safety Guardrails

## 1. Browser Process Protection (CRITICAL)
- **Zero Impact on Personal Browsers:** The user's personal Google Chrome browser, windows, and all open tabs must never be closed or interrupted by agent automation.
- **Prohibited Commands:** Never execute `Stop-Process -Name chrome`, `Get-Process chrome | Stop-Process`, `taskkill /IM chrome.exe`, or any wildcard process kill commands.
- **Port Conflicts:** If a DevTools/CDP port is in use, dynamically increment to the next available port or fail gracefully. Never terminate the process holding a port.
- **Process Ownership:** Automations may only terminate child processes that were explicitly spawned by the active session and tracked by their exact PID.

## 2. Storefront Production Protection
- **Live Theme Protection:** Never modify or publish to Live Theme `187597717689` without explicit, unambiguous user confirmation.
- **Draft Theme Development:** All ongoing feature development and testing must remain isolated on designated Draft Themes.
- **Advertising Funnels:** Never alter URLs, pricing, or templates of legacy ad funnels (Holster, Rehab Glove, BabiGuard, Yeoman, BotanaRoots).
