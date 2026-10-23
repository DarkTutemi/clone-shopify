// Antigravity DOM Inspector & Agent Direct Bridge
// Injects floating controls, laser highlighter, DOM/CSS inspector, 
// and 1-click clipboard copy + direct HTTP bridge to the Antigravity Agent.

(function () {
  if (window.__AG_DOM_INSPECTOR_LOADED__) {
    console.log('[Antigravity Inspector] Already loaded. Toggling visibility.');
    window.__AG_DOM_INSPECTOR_TOGGLE__ && window.__AG_DOM_INSPECTOR_TOGGLE__();
    return;
  }
  window.__AG_DOM_INSPECTOR_LOADED__ = true;

  const BRIDGE_URL = 'http://127.0.0.1:9876/feedback';
  let isInspectMode = false;
  let hoveredEl = null;
  let selectedEl = null;

  // 1. Create Laser Hover Box & Click Overlay
  const hoverBox = document.createElement('div');
  hoverBox.id = 'ag-hover-outline';
  hoverBox.style.cssText = `
    position: fixed;
    pointer-events: none;
    z-index: 2147483640;
    border: 2px dashed #00d2ff;
    background: rgba(0, 210, 255, 0.12);
    box-shadow: 0 0 14px rgba(0, 210, 255, 0.5), inset 0 0 10px rgba(0, 210, 255, 0.2);
    transition: all 0.05s ease-out;
    display: none;
    border-radius: 4px;
  `;
  document.documentElement.appendChild(hoverBox);

  // Hover Label
  const hoverTag = document.createElement('div');
  hoverTag.id = 'ag-hover-tag';
  hoverTag.style.cssText = `
    position: absolute;
    top: -24px;
    left: 0;
    background: #0f172a;
    color: #38bdf8;
    font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
    font-size: 11px;
    font-weight: 700;
    padding: 2px 8px;
    border-radius: 3px;
    border: 1px solid #38bdf8;
    white-space: nowrap;
    pointer-events: none;
  `;
  hoverBox.appendChild(hoverTag);

  // 2. Floating Toggle Button (bottom-right)
  const toggleBtn = document.createElement('button');
  toggleBtn.id = 'ag-toggle-btn';
  toggleBtn.innerHTML = `
    <span style="display:inline-flex; align-items:center; gap:8px;">
      <span style="font-size:16px;">🎯</span>
      <span id="ag-btn-text" style="font-weight:700;">Inspect for Agent</span>
      <span id="ag-btn-badge" style="background:#22c55e; width:8px; height:8px; border-radius:50%; display:inline-block;"></span>
    </span>
  `;
  toggleBtn.style.cssText = `
    position: fixed;
    bottom: 24px;
    right: 24px;
    z-index: 2147483645;
    background: linear-gradient(135deg, #0f172a 0%, #1e293b 100%);
    color: #f8fafc;
    border: 1px solid #38bdf8;
    box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 0 15px rgba(56, 189, 248, 0.35);
    padding: 10px 18px;
    border-radius: 9999px;
    cursor: pointer;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    font-size: 13px;
    transition: all 0.2s cubic-bezier(0.4, 0, 0.2, 1);
    user-select: none;
  `;
  toggleBtn.title = "Click hoặc bấm Alt+I để Bật/Tắt soi DOM. Bấm Alt+H để ẩn nút này.";
  toggleBtn.onmouseenter = () => {
    toggleBtn.style.transform = 'scale(1.05)';
    toggleBtn.style.boxShadow = '0 12px 28px -5px rgba(0, 0, 0, 0.6), 0 0 22px rgba(56, 189, 248, 0.6)';
  };
  toggleBtn.onmouseleave = () => {
    toggleBtn.style.transform = 'scale(1)';
    toggleBtn.style.boxShadow = '0 10px 25px -5px rgba(0, 0, 0, 0.5), 0 0 15px rgba(56, 189, 248, 0.35)';
  };
  document.documentElement.appendChild(toggleBtn);

  // 3. Modal Dialog for Inspected Element
  const modal = document.createElement('div');
  modal.id = 'ag-inspect-modal';
  modal.style.cssText = `
    position: fixed;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    width: 640px;
    max-width: 92vw;
    max-height: 86vh;
    background: #090d16;
    color: #e2e8f0;
    border: 1px solid #334155;
    border-radius: 14px;
    box-shadow: 0 25px 60px -15px rgba(0,0,0,0.85), 0 0 35px rgba(56,189,248,0.25);
    z-index: 2147483647;
    display: none;
    flex-direction: column;
    overflow: hidden;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
  `;
  modal.innerHTML = `
    <div style="display:flex; align-items:center; justify-content:space-between; padding:14px 18px; border-bottom:1px solid #1e293b; background:#0f172a;">
      <div style="display:flex; align-items:center; gap:10px;">
        <span style="font-size:18px;">🛠️</span>
        <strong style="font-size:14px; color:#f8fafc; letter-spacing:0.3px;">ANTIGRAVITY DOM INSPECTOR</strong>
        <span id="ag-modal-tag" style="background:#0284c7; color:#fff; font-size:11px; padding:2px 8px; border-radius:4px; font-family:monospace;">TAG</span>
      </div>
      <button id="ag-modal-close" style="background:transparent; border:none; color:#94a3b8; font-size:20px; cursor:pointer; line-height:1;">✕</button>
    </div>

    <div style="padding:16px 18px; overflow-y:auto; display:flex; flex-direction:column; gap:14px; max-height:calc(86vh - 130px);">
      <!-- Note Input -->
      <div>
        <label style="display:block; font-size:12px; font-weight:700; color:#38bdf8; margin-bottom:6px;">
          ✍️ YÊU CẦU SỬA CHO AGENT (Prompt Note):
        </label>
        <textarea id="ag-user-note" rows="3" placeholder="Ví dụ: Nút này padding quá to, đổi màu thành #0f172a, căn giữa chữ và bỏ border..." style="width:100%; box-sizing:border-box; background:#1e293b; color:#f8fafc; border:1px solid #475569; border-radius:8px; padding:10px; font-size:13px; resize:vertical; outline:none; font-family:inherit;"></textarea>
      </div>

      <!-- Quick Summary -->
      <div style="background:#0f172a; border:1px solid #1e293b; border-radius:8px; padding:12px; font-size:12px;">
        <div style="display:grid; grid-template-columns: 80px 1fr; gap:6px; font-family:monospace;">
          <span style="color:#64748b;">Selector:</span>
          <span id="ag-info-selector" style="color:#a5f3fc; word-break:break-all;"></span>
          <span style="color:#64748b;">XPath:</span>
          <span id="ag-info-xpath" style="color:#cbd5e1; word-break:break-all;"></span>
          <span style="color:#64748b;">Size:</span>
          <span id="ag-info-size" style="color:#fcd34d;"></span>
          <span style="color:#64748b;">Text:</span>
          <span id="ag-info-text" style="color:#e2e8f0; max-height:48px; overflow:hidden; text-overflow:ellipsis;"></span>
        </div>
      </div>

      <!-- Computed Key Styles -->
      <div>
        <label style="display:block; font-size:12px; font-weight:700; color:#94a3b8; margin-bottom:6px;">
          🎨 COMPUTED CSS STYLES:
        </label>
        <div id="ag-info-styles" style="background:#020617; border:1px solid #1e293b; border-radius:8px; padding:10px; font-family:monospace; font-size:11px; color:#cbd5e1; max-height:140px; overflow-y:auto; line-height:1.5;"></div>
      </div>

      <!-- Outer HTML Preview -->
      <div>
        <label style="display:block; font-size:12px; font-weight:700; color:#94a3b8; margin-bottom:6px;">
          📄 OUTER HTML:
        </label>
        <pre id="ag-info-html" style="background:#020617; border:1px solid #1e293b; border-radius:8px; padding:10px; font-family:monospace; font-size:11px; color:#f43f5e; max-height:160px; overflow-y:auto; margin:0; white-space:pre-wrap; word-break:break-all;"></pre>
      </div>
    </div>

    <!-- Actions Footer -->
    <div style="display:flex; align-items:center; justify-content:space-between; padding:12px 18px; border-top:1px solid #1e293b; background:#0f172a;">
      <div id="ag-status-msg" style="font-size:12px; color:#94a3b8;">Sẵn sàng</div>
      <div style="display:flex; gap:10px;">
        <button id="ag-copy-btn" style="background:#1e293b; color:#38bdf8; border:1px solid #38bdf8; padding:8px 14px; border-radius:6px; font-size:12px; font-weight:700; cursor:pointer; display:flex; align-items:center; gap:6px;">
          📋 Copy Prompt Cho Chat
        </button>
        <button id="ag-send-bridge-btn" style="background:linear-gradient(135deg, #0284c7 0%, #2563eb 100%); color:#ffffff; border:none; padding:8px 16px; border-radius:6px; font-size:12px; font-weight:700; cursor:pointer; display:flex; align-items:center; gap:6px; box-shadow:0 0 10px rgba(37,99,235,0.4);">
          🚀 Gửi Trực Tiếp Cho Agent
        </button>
      </div>
    </div>
  `;
  document.documentElement.appendChild(modal);

  // Cache all modal inner elements immediately after append
  const elModalTag  = modal.querySelector('#ag-modal-tag');
  const elModalClose = modal.querySelector('#ag-modal-close');
  const elUserNote  = modal.querySelector('#ag-user-note');
  const elSelector  = modal.querySelector('#ag-info-selector');
  const elXpath     = modal.querySelector('#ag-info-xpath');
  const elSize      = modal.querySelector('#ag-info-size');
  const elText      = modal.querySelector('#ag-info-text');
  const elHtml      = modal.querySelector('#ag-info-html');
  const elStyles    = modal.querySelector('#ag-info-styles');
  const elStatusMsg = modal.querySelector('#ag-status-msg');
  const elCopyBtn   = modal.querySelector('#ag-copy-btn');
  const elSendBtn   = modal.querySelector('#ag-send-bridge-btn');

  // Toast notification (always visible, outside modal)
  const toast = document.createElement('div');
  toast.id = 'ag-toast';
  toast.style.cssText = `
    position: fixed;
    bottom: 80px;
    right: 24px;
    z-index: 2147483647;
    background: #0f172a;
    color: #f8fafc;
    border: 1px solid #22c55e;
    border-radius: 10px;
    padding: 12px 18px;
    font-size: 13px;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif;
    font-weight: 600;
    box-shadow: 0 8px 24px rgba(0,0,0,0.5), 0 0 15px rgba(34,197,94,0.3);
    display: none;
    max-width: 360px;
    line-height: 1.4;
    transition: opacity 0.3s;
  `;
  document.documentElement.appendChild(toast);

  function showToast(msg, color = '#22c55e', duration = 3000) {
    toast.innerHTML = msg;
    toast.style.borderColor = color;
    toast.style.boxShadow = `0 8px 24px rgba(0,0,0,0.5), 0 0 15px ${color}55`;
    toast.style.display = 'block';
    toast.style.opacity = '1';
    clearTimeout(toast._timer);
    toast._timer = setTimeout(() => {
      toast.style.opacity = '0';
      setTimeout(() => { toast.style.display = 'none'; }, 300);
    }, duration);
  }

  // Backdrop
  const backdrop = document.createElement('div');
  backdrop.id = 'ag-modal-backdrop';
  backdrop.style.cssText = `
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    background: rgba(0,0,0,0.6);
    backdrop-filter: blur(2px);
    z-index: 2147483646;
    display: none;
  `;
  document.documentElement.appendChild(backdrop);

  // Helper: CSS Selector Generator
  function getCssSelector(el) {
    if (!(el instanceof Element)) return '';
    const path = [];
    while (el && el.nodeType === Node.ELEMENT_NODE) {
      let selector = el.nodeName.toLowerCase();
      if (el.id) {
        selector += '#' + CSS.escape(el.id);
        path.unshift(selector);
        break;
      } else {
        let sibling = el;
        let nth = 1;
        while ((sibling = sibling.previousElementSibling)) {
          if (sibling.nodeName.toLowerCase() === selector) nth++;
        }
        if (el.className && typeof el.className === 'string') {
          const classes = el.className.trim().split(/\s+/).filter(c => !c.startsWith('ag-'));
          if (classes.length > 0) {
            selector += '.' + classes.slice(0, 2).map(c => CSS.escape(c)).join('.');
          }
        }
        if (nth !== 1) selector += `:nth-of-type(${nth})`;
      }
      path.unshift(selector);
      el = el.parentElement;
    }
    return path.join(' > ');
  }

  // Helper: XPath Generator
  function getXPath(element) {
    if (!element || element.nodeType !== 1) return '';
    if (element.id) return `//*[@id="${element.id}"]`;
    const paths = [];
    for (; element && element.nodeType === 1; element = element.parentNode) {
      let index = 0;
      let hasSameNamedSiblings = false;
      for (let sibling = element.previousSibling; sibling; sibling = sibling.previousSibling) {
        if (sibling.nodeType === 1 && sibling.nodeName === element.nodeName) {
          index++;
          hasSameNamedSiblings = true;
        }
      }
      for (let sibling = element.nextSibling; sibling && !hasSameNamedSiblings; sibling = sibling.nextSibling) {
        if (sibling.nodeType === 1 && sibling.nodeName === element.nodeName) {
          hasSameNamedSiblings = true;
        }
      }
      const tagName = element.nodeName.toLowerCase();
      const pathIndex = hasSameNamedSiblings ? `[${index + 1}]` : '';
      paths.splice(0, 0, tagName + pathIndex);
    }
    return paths.length ? '/' + paths.join('/') : '';
  }

  // Helper: Key Computed Styles
  function getKeyStyles(el) {
    const cs = window.getComputedStyle(el);
    const keys = [
      'display', 'position', 'width', 'height', 'padding', 'margin', 
      'color', 'background-color', 'font-family', 'font-size', 'font-weight', 'line-height',
      'border', 'border-radius', 'flex-direction', 'justify-content', 'align-items', 'gap', 'opacity'
    ];
    const res = {};
    for (const k of keys) {
      const v = cs.getPropertyValue(k);
      if (v && v !== 'none' && v !== 'normal' && v !== 'auto' && v !== 'rgba(0, 0, 0, 0)') {
        res[k] = v;
      }
    }
    return res;
  }

  // Toggle Inspect Mode
  function setInspectMode(active) {
    isInspectMode = active;
    const badge = document.getElementById('ag-btn-badge');
    const text = document.getElementById('ag-btn-text');

    if (isInspectMode) {
      toggleBtn.style.background = 'linear-gradient(135deg, #0284c7 0%, #0369a1 100%)';
      toggleBtn.style.borderColor = '#38bdf8';
      text.innerText = 'Click any element to inspect...';
      badge.style.background = '#38bdf8';
      badge.style.boxShadow = '0 0 10px #38bdf8';
      document.body.style.cursor = 'crosshair';
    } else {
      toggleBtn.style.background = 'linear-gradient(135deg, #0f172a 0%, #1e293b 100%)';
      toggleBtn.style.borderColor = '#475569';
      text.innerText = 'Inspect for Agent';
      badge.style.background = '#22c55e';
      badge.style.boxShadow = 'none';
      document.body.style.cursor = 'default';
      hoverBox.style.display = 'none';
    }
  }

  window.__AG_DOM_INSPECTOR_TOGGLE__ = () => {
    setInspectMode(!isInspectMode);
  };

  toggleBtn.addEventListener('click', (e) => {
    e.stopPropagation();
    setInspectMode(!isInspectMode);
  });

  // Track Hover
  window.addEventListener('mousemove', (e) => {
    if (!isInspectMode) return;
    const target = e.target;
    if (!target || target.closest('#ag-toggle-btn') || target.closest('#ag-inspect-modal') || target === hoverBox) {
      return;
    }
    hoveredEl = target;
    const rect = target.getBoundingClientRect();
    hoverBox.style.display = 'block';
    hoverBox.style.top = `${rect.top}px`;
    hoverBox.style.left = `${rect.left}px`;
    hoverBox.style.width = `${rect.width}px`;
    hoverBox.style.height = `${rect.height}px`;

    const tag = target.tagName.toLowerCase();
    const id = target.id ? `#${target.id}` : '';
    const firstClass = target.classList.length ? `.${target.classList[0]}` : '';
    hoverTag.innerText = `<${tag}${id}${firstClass}> ${Math.round(rect.width)}x${Math.round(rect.height)}`;
  }, true);

  // Trap Click on Target
  window.addEventListener('click', (e) => {
    if (!isInspectMode) return;
    const target = e.target;
    if (!target || target.closest('#ag-toggle-btn') || target.closest('#ag-inspect-modal')) {
      return;
    }

    e.preventDefault();
    e.stopPropagation();
    e.stopImmediatePropagation();

    selectedEl = target;
    setInspectMode(false);
    openModalForElement(selectedEl);
  }, true);

  // Populate & Open Modal
  let currentInspectionData = null;

  function openModalForElement(el) {
    const rect = el.getBoundingClientRect();
    const selector = getCssSelector(el);
    const xpath = getXPath(el);
    const styles = getKeyStyles(el);
    const innerText = (el.innerText || el.textContent || '').trim().replace(/\s+/g, ' ');
    const outerHtml = el.outerHTML;

    currentInspectionData = {
      url: window.location.href,
      pageTitle: document.title,
      timestamp: new Date().toISOString(),
      tagName: el.tagName.toLowerCase(),
      selector: selector,
      xpath: xpath,
      size: `${Math.round(rect.width)}px × ${Math.round(rect.height)}px`,
      innerText: innerText.slice(0, 300),
      styles: styles,
      outerHtml: outerHtml.length > 2500 ? outerHtml.slice(0, 2500) + '\n<!-- ... truncated ... -->' : outerHtml
    };

    // Use cached element refs — never getElementById in callbacks
    elModalTag.innerText = `<${currentInspectionData.tagName}>`;
    elSelector.innerText = selector;
    elXpath.innerText = xpath;
    elSize.innerText = currentInspectionData.size;
    elText.innerText = innerText ? `"${innerText.slice(0, 100)}${innerText.length > 100 ? '...' : ''}"` : '(none)';
    elHtml.textContent = currentInspectionData.outerHtml;

    const stylesLines = Object.entries(styles).map(([k, v]) => `  ${k}: ${v};`).join('\n');
    elStyles.textContent = stylesLines || '/* No explicit computed styles */';

    elUserNote.value = '';
    elStatusMsg.innerText = 'Phần tử đã chọn. Nhập ghi chú & chọn hành động.';
    elStatusMsg.style.color = '#94a3b8';

    backdrop.style.display = 'block';
    modal.style.display = 'flex';
    elUserNote.focus();
  }

  function closeModal() {
    modal.style.display = 'none';
    backdrop.style.display = 'none';
  }

  elModalClose.addEventListener('click', closeModal);
  backdrop.addEventListener('click', closeModal);

  // Keyboard Shortcuts:
  // - Escape: Thoát Inspect Mode hoặc đóng modal
  // - Alt + I (hoặc Alt + Shift + I): Bật / tắt chế độ Soi phần tử
  // - Alt + H: Ẩn / hiện nút bấm nổi ở góc dưới
  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
      if (modal.style.display === 'flex' || modal.style.display === 'block') {
        closeModal();
      } else if (isInspectMode) {
        setInspectMode(false);
      }
      return;
    }

    if (e.altKey && (e.key === 'i' || e.key === 'I')) {
      e.preventDefault();
      setInspectMode(!isInspectMode);
      return;
    }

    if (e.altKey && (e.key === 'h' || e.key === 'H')) {
      e.preventDefault();
      const isHidden = toggleBtn.style.display === 'none';
      toggleBtn.style.display = isHidden ? 'flex' : 'none';
      showToast(isHidden ? '👁️ Đã hiện nút Inspect (Góc dưới)' : '🙈 Đã ẩn nút Inspect (Bấm Alt+H để hiện lại)', '#38bdf8', 2500);
      return;
    }
  });

  // Build Markdown Prompt Payload
  function buildMarkdownPrompt(note) {
    if (!currentInspectionData) return '';
    return [
      `### 🔍 BÁO CÁO PHẦN TỬ CẦN SỬA (DOM INSPECTION)`,
      `**URL:** ${currentInspectionData.url}`,
      `**Trang:** ${currentInspectionData.pageTitle}`,
      `**Tag / Size:** \`<${currentInspectionData.tagName}>\` (${currentInspectionData.size})`,
      `**CSS Selector:** \`${currentInspectionData.selector}\``,
      `**XPath:** \`${currentInspectionData.xpath}\``,
      note ? `\n> **YÊU CẦU CỦA PANEER:**\n> ${note.split('\n').join('\n> ')}\n` : '',
      `**Computed Styles chính:**`,
      '```css',
      Object.entries(currentInspectionData.styles).map(([k, v]) => `${k}: ${v};`).join('\n'),
      '```',
      `**Outer HTML:**`,
      '```html',
      currentInspectionData.outerHtml,
      '```'
    ].filter(Boolean).join('\n');
  }

  // Action 1: Copy to Clipboard
  elCopyBtn.addEventListener('click', async () => {
    const note = elUserNote.value.trim();
    const md = buildMarkdownPrompt(note);

    try {
      await navigator.clipboard.writeText(md);
      elStatusMsg.innerText = '✅ Đã copy! Dán vào khung chat với Agent.';
      elStatusMsg.style.color = '#4ade80';
      showToast('📋 Đã copy prompt vào Clipboard!<br><small>Dán vào chat với Agent là xong.</small>', '#38bdf8', 3000);
      setTimeout(() => { closeModal(); }, 900);
    } catch (err) {
      console.error(err);
      elStatusMsg.innerText = '❌ Không thể copy tự động. Hãy thử lại.';
      elStatusMsg.style.color = '#f87171';
      showToast('❌ Copy thất bại: ' + err.message, '#f87171', 4000);
    }
  });

  // Action 2: Send Directly to Agent Bridge Server
  elSendBtn.addEventListener('click', async () => {
    const note = elUserNote.value.trim();
    const payload = {
      ...currentInspectionData,
      userNote: note,
      markdown: buildMarkdownPrompt(note)
    };

    const originalBtnText = elSendBtn.innerHTML;
    elSendBtn.innerHTML = '⏳ Đang gửi...';
    elStatusMsg.innerText = '⏳ Đang kết nối tới Agent Bridge...';
    elStatusMsg.style.color = '#38bdf8';
    elSendBtn.disabled = true;
    elSendBtn.style.opacity = '0.6';

    async function sendViaBackground() {
      return new Promise((resolve, reject) => {
        if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.sendMessage) {
          chrome.runtime.sendMessage({ action: 'send_to_bridge', data: payload }, (response) => {
            if (chrome.runtime.lastError) {
              return reject(new Error(chrome.runtime.lastError.message));
            }
            if (response && response.success) {
              return resolve(response.data);
            }
            reject(new Error(response?.error || 'Bridge request failed'));
          });
        } else {
          reject(new Error('Extension runtime not available'));
        }
      });
    }

    try {
      // 1. Try background worker first (no HTTPS/CSP mixed content issue)
      let sent = false;
      try {
        await sendViaBackground();
        sent = true;
      } catch (bgErr) {
        console.log('[AG Inspector] Background bridge failed, trying direct fetch:', bgErr.message);
        // 2. Direct fetch fallback
        const res = await fetch(BRIDGE_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload)
        });
        if (res.ok) sent = true;
        else throw new Error(`HTTP ${res.status}`);
      }

      if (sent) {
        elSendBtn.innerHTML = '✅ Đã gửi thành công!';
        elSendBtn.style.background = '#16a34a';
        elStatusMsg.innerText = '🚀 Đã gửi tới Agent thành công!';
        elStatusMsg.style.color = '#4ade80';
        showToast(`🚀 Agent đã nhận feedback!<br><small>Phần tử: &lt;${payload.tagName}&gt; — "${note ? note.slice(0, 50) : 'Đã gửi'}"</small>`, '#22c55e', 4000);
        setTimeout(() => {
          closeModal();
          elSendBtn.innerHTML = originalBtnText;
          elSendBtn.style.background = 'linear-gradient(135deg, #0284c7 0%, #2563eb 100%)';
        }, 900);
      }
    } catch (err) {
      console.warn('[AG Inspector] Bridge error:', err.message);
      // 3. Fallback: auto clipboard copy
      try {
        await navigator.clipboard.writeText(payload.markdown);
        elSendBtn.innerHTML = '📋 Đã copy!';
        elStatusMsg.innerText = '⚠️ Bridge bận → Đã TỰ ĐỘNG COPY vào Clipboard!';
        elStatusMsg.style.color = '#fbbf24';
        showToast('⚠️ Chưa kết nối Bridge trực tiếp.<br><small>Đã tự động copy prompt vào Clipboard! Paneer chỉ cần paste vào chat.</small>', '#f59e0b', 5000);
        setTimeout(() => {
          elSendBtn.innerHTML = originalBtnText;
        }, 2000);
      } catch (clipErr) {
        elSendBtn.innerHTML = '❌ Lỗi';
        elStatusMsg.innerText = '❌ Lỗi: ' + err.message;
        elStatusMsg.style.color = '#f87171';
        showToast('❌ Thất bại: ' + err.message, '#f87171', 5000);
      }
    } finally {
      elSendBtn.disabled = false;
      elSendBtn.style.opacity = '1';
    }
  });

  console.log('[Antigravity DOM Inspector] Loaded successfully. Press button or call window.__AG_DOM_INSPECTOR_TOGGLE__() to inspect.');

  // Listen for messages from popup
  if (typeof chrome !== 'undefined' && chrome.runtime && chrome.runtime.onMessage) {
    chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
      if (message.action === 'toggle') {
        setInspectMode(!isInspectMode);
        sendResponse({ status: 'ok', isActive: isInspectMode });
      }
      return true;
    });
  }
})();
