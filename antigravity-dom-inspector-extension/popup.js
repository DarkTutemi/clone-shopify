// Popup script - Antigravity DOM Inspector

const BRIDGE_STATUS_URL = 'http://127.0.0.1:9876/status';

async function checkBridge() {
  const dot = document.getElementById('bridge-status-dot');
  const text = document.getElementById('bridge-status-text');
  try {
    const res = await fetch(BRIDGE_STATUS_URL, { cache: 'no-store', signal: AbortSignal.timeout(2000) });
    if (res.ok) {
      dot.className = 'status-dot online';
      text.innerText = 'Agent Bridge: Online (Port 9876)';
      text.style.color = '#4ade80';
      return;
    }
  } catch (e) { /* offline */ }
  dot.className = 'status-dot';
  text.innerText = 'Agent Bridge: Offline (Copy Mode)';
  text.style.color = '#fbbf24';
}

async function activateInspector() {
  try {
    // Method 1: Use scripting API (needs scripting permission in manifest)
    if (chrome.scripting) {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (tab && tab.id) {
        // First try to toggle if already loaded
        try {
          await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            func: () => {
              if (window.__AG_DOM_INSPECTOR_TOGGLE__) {
                window.__AG_DOM_INSPECTOR_TOGGLE__();
                return 'toggled';
              }
              return 'not_loaded';
            }
          });
        } catch (e) {
          console.warn('scripting.executeScript failed:', e);
        }

        // Then inject the script file if not loaded
        try {
          await chrome.scripting.executeScript({
            target: { tabId: tab.id },
            files: ['content.js']
          });
        } catch (e2) {
          // Already loaded or other error - ignore
        }

        window.close();
      }
    }
  } catch (err) {
    console.error('Activate failed:', err);
    document.getElementById('error-msg').style.display = 'block';
    document.getElementById('error-msg').innerText = 'Lỗi: ' + err.message + '. Thử tải lại trang rồi bấm nút trên trang thay thế.';
  }
}

document.getElementById('activate-btn').addEventListener('click', activateInspector);

// Also show inline fallback instructions
document.getElementById('fallback-toggle').addEventListener('click', async () => {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (tab && tab.id) {
    chrome.tabs.sendMessage(tab.id, { action: 'toggle' }, (response) => {
      if (chrome.runtime.lastError) {
        // Content script not loaded yet, inject it
        chrome.scripting.executeScript({
          target: { tabId: tab.id },
          files: ['content.js']
        }).then(() => window.close());
      } else {
        window.close();
      }
    });
  }
});

checkBridge();
