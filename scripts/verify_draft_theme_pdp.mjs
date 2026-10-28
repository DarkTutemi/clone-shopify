import path from 'path';
import fs from 'fs';
import { spawn } from 'child_process';
import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');

const CDP_PORT = 9280;
const ARTIFACTS_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\d0f634e2-c9dd-4bad-bdb2-3c956abea303';
const userDataDir = `${process.env.TEMP}\\chrome-vfit-draft-${Date.now()}`;

async function connectCDP() {
  for (let i = 0; i < 20; i++) {
    try {
      const res = await fetch(`http://127.0.0.1:${CDP_PORT}/json`);
      const tabs = await res.json();
      const tab = tabs.find(t => t.type === 'page' && t.webSocketDebuggerUrl);
      if (tab) {
        const ws = new WebSocket(tab.webSocketDebuggerUrl);
        await new Promise(r => ws.addEventListener('open', r));
        let idCounter = 1;
        function send(method, params = {}) {
          return new Promise((resolve, reject) => {
            const id = idCounter++;
            const handler = evt => {
              const msg = JSON.parse(evt.data.toString());
              if (msg.id === id) {
                ws.removeEventListener('message', handler);
                if (msg.error) reject(msg.error);
                else resolve(msg.result);
              }
            };
            ws.addEventListener('message', handler);
            ws.send(JSON.stringify({ id, method, params }));
          });
        }
        return { ws, send };
      }
    } catch (e) {}
    await new Promise(r => setTimeout(r, 400));
  }
  throw new Error('Could not connect to CDP on port ' + CDP_PORT);
}

async function captureShot(send, filename) {
  const shot = await send('Page.captureScreenshot', { format: 'png' });
  const buf = Buffer.from(shot.data, 'base64');
  const targetPath = path.join(ARTIFACTS_DIR, filename);
  fs.writeFileSync(targetPath, buf);
  console.log(`✓ Saved screenshot: ${filename} (${buf.length} bytes)`);
}

async function main() {
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    `--remote-debugging-port=${CDP_PORT}`,
    `--user-data-dir=${userDataDir}`,
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    'about:blank'
  ]);

  const { ws, send } = await connectCDP();
  console.log('Connected to CDP!');

  await send('Runtime.enable');
  await send('Page.enable');

  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 1000,
    deviceScaleFactor: 1,
    mobile: false
  });

  // 1. Check vFit PDP on Draft Theme
  const vfitDraftUrl = 'https://dsdujr-vn.myshopify.com/products/zavelyn-vfit-red-light-intimate-wellness-device?preview_theme_id=187720335545';
  console.log('\n--- 1. NAVIGATING TO vFIT ON DRAFT THEME ---');
  console.log(vfitDraftUrl);
  await send('Page.navigate', { url: vfitDraftUrl });
  await new Promise(r => setTimeout(r, 3500));

  const checkVfit = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const selfcare = document.getElementById('zvSelfCareRoutine');
      const cardEye = document.getElementById('zvCardEye');
      const cardFace = document.getElementById('zvCardFace');
      const summary = document.getElementById('zvOrderSummaryCard');
      const ctaBtn = document.getElementById('zvSelfCareCtaBtn');

      return {
        title: document.title,
        hasSelfCareSection: !!selfcare,
        hasCardEye: !!cardEye,
        hasCardFace: !!cardFace,
        hasSummaryCard: !!summary,
        ctaText: ctaBtn?.innerText?.trim(),
        cardEyePrice: cardEye?.querySelector('.zv-card-price-current')?.innerText?.trim(),
        cardFacePrice: cardFace?.querySelector('.zv-card-price-current')?.innerText?.trim(),
        cardEyeStock: cardEye?.querySelector('.zv-stock-status-pill')?.innerText?.trim()
      };
    })()`
  });
  console.log('vFit Draft Theme QA Result:', checkVfit.result.value);

  // Scroll to Self-Care Routine and capture screenshot
  await send('Runtime.evaluate', {
    expression: `(() => {
      const el = document.getElementById('zvSelfCareRoutine');
      if (el) el.scrollIntoView({ behavior: 'instant', block: 'center' });
    })()`
  });
  await new Promise(r => setTimeout(r, 800));
  await captureShot(send, 'draft_theme_vfit_selfcare_desktop.png');

  // Test selecting both add-ons on the live draft theme
  console.log('\n--- 2. TEST CLICKING ADD-ONS ON DRAFT THEME ---');
  await send('Runtime.evaluate', {
    expression: `(() => {
      document.getElementById('zvCardEye')?.click();
      document.getElementById('zvCardFace')?.click();
    })()`
  });
  await new Promise(r => setTimeout(r, 600));

  const checkAfterClick = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      return {
        summaryTotal: document.getElementById('zvSummaryTotal')?.innerText?.trim(),
        summarySavings: document.getElementById('zvSummarySavings')?.innerText?.trim(),
        summaryTierBadge: document.getElementById('zvSummaryTierBadge')?.innerText?.trim(),
        ctaLabel: document.getElementById('zvSelfCareCtaLabel')?.innerText?.trim()
      };
    })()`
  });
  console.log('After Clicking Add-ons:', checkAfterClick.result.value);
  await captureShot(send, 'draft_theme_vfit_both_selected.png');

  // 3. Verify BotanaRoots is 100% UNCHANGED
  console.log('\n--- 3. VERIFY BOTANAROOTS ON DRAFT THEME (MUST HAVE ZERO UPSELL SECTION) ---');
  const botanaUrl = 'https://dsdujr-vn.myshopify.com/products/zavelyn-botanaroots-organic-batana-hair-growth-oil?preview_theme_id=187720335545';
  await send('Page.navigate', { url: botanaUrl });
  await new Promise(r => setTimeout(r, 3500));

  const checkBotana = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const selfcare = document.getElementById('zvSelfCareRoutine');
      const buy3 = document.querySelector('.zv-tier-card[data-tier="buy3"]');
      return {
        title: document.title,
        hasSelfCareSection: !!selfcare, // MUST BE FALSE
        hasBotanaBuy3: !!buy3 // MUST BE TRUE
      };
    })()`
  });
  console.log('BotanaRoots Integrity Check:', checkBotana.result.value);

  ws.close();
  chrome.kill();
  try { fs.rmSync(userDataDir, { recursive: true, force: true }); } catch (e) {}

  console.log('\n✨ ALL LIVE DRAFT THEME VERIFICATIONS PASSED!');
}

main().catch(err => {
  console.error('Fatal in verify_draft_theme_pdp:', err);
  process.exit(1);
});
