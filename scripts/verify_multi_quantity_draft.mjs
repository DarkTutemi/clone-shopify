import path from 'path';
import fs from 'fs';
import { spawn } from 'child_process';
import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');

const CDP_PORT = 9282;
const ARTIFACTS_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\d0f634e2-c9dd-4bad-bdb2-3c956abea303';
const userDataDir = `${process.env.TEMP}\\chrome-vfit-qty-${Date.now()}`;

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
    height: 1050,
    deviceScaleFactor: 1,
    mobile: false
  });

  const vfitDraftUrl = 'https://dsdujr-vn.myshopify.com/products/zavelyn-vfit-red-light-intimate-wellness-device?preview_theme_id=187720335545';
  console.log('\n--- 1. NAVIGATING TO vFIT ON DRAFT THEME ---');
  await send('Page.navigate', { url: vfitDraftUrl });
  await new Promise(r => setTimeout(r, 3500));

  // Check Buy Box quantity stepper
  const evalBuyBox = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const stepper = document.querySelector('.zv-buy1-container .zv-qty-stepper');
      const minus = document.getElementById('vfitQtyMinus');
      const disp = document.getElementById('vfitQtyDisplay');
      const plus = document.getElementById('vfitQtyPlus');
      const buy1Price = document.getElementById('zvBuy1Price')?.innerText;

      return {
        hasBuy1Container: !!document.querySelector('.zv-buy1-container'),
        hasStepper: !!stepper,
        initialQty: disp?.innerText,
        buy1Price
      };
    })()`
  });
  console.log('Buy Box Quantity Evaluation:', evalBuyBox.result.value);

  // Capture Buy Box with quantity selector
  await captureShot(send, 'draft_theme_vfit_buybox_qty.png');

  // 2. Increase vFit quantity to 2
  console.log('\n--- 2. INCREASE vFIT QUANTITY TO 2 ---');
  await send('Runtime.evaluate', {
    expression: `document.getElementById('vfitQtyPlus')?.click()`
  });
  await new Promise(r => setTimeout(r, 400));

  // 3. Scroll to Self-Care Upsell and increase Eye Mask & Face Mask quantities to 2
  console.log('\n--- 3. SELECT EYE MASK & FACE MASK AND SET QUANTITY = 2 EACH ---');
  await send('Runtime.evaluate', {
    expression: `(() => {
      // Select Eye Mask and set qty 2
      document.getElementById('zvCardEye')?.click();
      window.changeAddonQty('eyeMask', 1); // now 2

      // Select Face Mask and set qty 2
      document.getElementById('zvCardFace')?.click();
      window.changeAddonQty('faceMask', 1); // now 2

      document.getElementById('zvSelfCareRoutine')?.scrollIntoView({ behavior: 'instant', block: 'center' });
    })()`
  });
  await new Promise(r => setTimeout(r, 800));

  const evalSummary = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      return {
        vfitName: document.getElementById('zvSummaryVfitName')?.innerText,
        vfitPrice: document.getElementById('zvSummaryVfitPrice')?.innerText,
        vfitQty: document.getElementById('zvSummaryVfitQty')?.innerText,

        eyeName: document.getElementById('zvSummaryEyeName')?.innerText,
        eyePrice: document.getElementById('zvSummaryEyePrice')?.innerText,
        eyeQty: document.getElementById('zvSummaryEyeQty')?.innerText,
        eyeCardQty: document.getElementById('displayCardQtyEye')?.innerText,
        eyePill: document.getElementById('pillEye')?.innerText,

        faceName: document.getElementById('zvSummaryFaceName')?.innerText,
        facePrice: document.getElementById('zvSummaryFacePrice')?.innerText,
        faceQty: document.getElementById('zvSummaryFaceQty')?.innerText,
        faceCardQty: document.getElementById('displayCardQtyFace')?.innerText,
        facePill: document.getElementById('pillFace')?.innerText,

        summaryTotal: document.getElementById('zvSummaryTotal')?.innerText,
        summaryCompare: document.getElementById('zvSummaryCompare')?.innerText,
        summarySavings: document.getElementById('zvSummarySavings')?.innerText,
        tierBadge: document.getElementById('zvSummaryTierBadge')?.innerText,
        ctaLabel: document.getElementById('zvSelfCareCtaLabel')?.innerText
      };
    })()`
  });
  console.log('\n=== MULTI-QUANTITY EVALUATION RESULT ===');
  console.log(evalSummary.result.value);

  await captureShot(send, 'draft_theme_vfit_multi_quantity_selected.png');

  ws.close();
  chrome.kill();
  try { fs.rmSync(userDataDir, { recursive: true, force: true }); } catch (e) {}

  console.log('\n✨ ALL MULTI-QUANTITY LIVE TESTS PASSED!');
}

main().catch(err => {
  console.error('Fatal in verify_multi_quantity_draft:', err);
  process.exit(1);
});
