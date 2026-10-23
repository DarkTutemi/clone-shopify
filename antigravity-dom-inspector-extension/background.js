// background.js - Background Service Worker for Antigravity DOM Inspector
// Handles cross-origin requests to local bridge (avoiding HTTPS Mixed-Content / CSP blocks)

const BRIDGE_URL = 'http://127.0.0.1:9876/feedback';

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  if (message.action === 'send_to_bridge') {
    fetch(BRIDGE_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(message.data)
    })
      .then(async (res) => {
        if (!res.ok) {
          throw new Error(`HTTP ${res.status}: ${res.statusText}`);
        }
        const data = await res.json().catch(() => ({ status: 'ok' }));
        sendResponse({ success: true, data });
      })
      .catch((err) => {
        console.error('[Background] Bridge error:', err);
        sendResponse({ success: false, error: err.message });
      });

    return true; // Keep message channel open for async response
  }
});

// Handle Keyboard Shortcut (Alt+Shift+I)
if (chrome.commands) {
  chrome.commands.onCommand.addListener((command) => {
    if (command === 'toggle-inspector') {
      chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        if (tabs[0]?.id) {
          chrome.tabs.sendMessage(tabs[0].id, { action: 'toggle' });
        }
      });
    }
  });
}
