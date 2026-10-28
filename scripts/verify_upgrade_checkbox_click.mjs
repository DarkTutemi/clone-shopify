import fs from 'fs';
import { spawn } from 'child_process';

const PORT = 9299;
const BOGO_PAGE_URL = 'https://tryzavelyn.com/pages/botanaroots-bogo-offer?preview_theme_id=187736654009';
const ARTIFACT_DIR = 'C:/Users/Admin/.gemini/antigravity-ide/brain/d0f634e2-c9dd-4bad-bdb2-3c956abea303';

async function testUpgradeClick() {
  console.log('Testing Size Upgrade checkbox click and visual display in Chrome...');

  const chromeProc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${process.env.TEMP}\\chrome-upgrade-test-${Date.now()}`,
    '--headless=new',
    '--disable-gpu',
    '--window-size=1440,1200',
    'about:blank'
  ]);

  await new Promise(r => setTimeout(r, 1500));
  const res = await fetch(`http://127.0.0.1:${PORT}/json`);
  const tabs = await res.json();
  const tab = tabs.find(t => t.type === 'page' && !t.url.startsWith('chrome-extension')) || tabs[0];
  const ws = new WebSocket(tab.webSocketDebuggerUrl);
  await new Promise(r => ws.addEventListener('open', r));

  let msgId = 1;
  function send(method, params = {}) {
    return new Promise((resolve, reject) => {
      const curId = msgId++;
      const handler = (evt) => {
        const msg = JSON.parse(evt.data.toString());
        if (msg.id === curId) {
          ws.removeEventListener('message', handler);
          if (msg.error) reject(msg.error);
          else resolve(msg.result);
        }
      };
      ws.addEventListener('message', handler);
      ws.send(JSON.stringify({ id: curId, method, params }));
    });
  }

  console.log('Navigating to BOGO preview page...');
  await send('Page.navigate', { url: BOGO_PAGE_URL });
  await new Promise(r => setTimeout(r, 4000));

  // 1. Initial State before clicking upgrade
  console.log('\n--- STATE 1: BEFORE CLICKING UPGRADE ---');
  const beforeEval = await send('Runtime.evaluate', {
    expression: `(() => {
      const card = document.getElementById('zvUpsellCard');
      const input = document.getElementById('zvSizeUpgradeCheck');
      const checkSpan = card.querySelector('.zv-custom-check');
      const checkSvg = checkSpan?.querySelector('svg');
      const total = document.getElementById('zvSummaryTotal')?.textContent?.trim();

      const spanStyle = window.getComputedStyle(checkSpan);
      const svgStyle = window.getComputedStyle(checkSvg);

      return {
        cardActive: card.classList.contains('active'),
        inputChecked: input.checked,
        spanBg: spanStyle.backgroundColor,
        spanBorder: spanStyle.borderColor,
        svgOpacity: svgStyle.opacity,
        svgStroke: svgStyle.stroke,
        totalPrice: total
      };
    })()`,
    returnByValue: true
  });
  console.log('Before Click State:', JSON.stringify(beforeEval.result.value, null, 2));

  // 2. Click the Upgrade Card (simulate real user click)
  console.log('\n--- CLICKING THE SIZE UPGRADE CARD ---');
  await send('Runtime.evaluate', {
    expression: `document.getElementById('zvUpsellCard').click()`
  });
  await new Promise(r => setTimeout(r, 500));

  // 3. State after clicking upgrade
  console.log('\n--- STATE 2: AFTER CLICKING UPGRADE ---');
  const afterEval = await send('Runtime.evaluate', {
    expression: `(() => {
      const card = document.getElementById('zvUpsellCard');
      const input = document.getElementById('zvSizeUpgradeCheck');
      const checkSpan = card.querySelector('.zv-custom-check');
      const checkSvg = checkSpan?.querySelector('svg');
      const total = document.getElementById('zvSummaryTotal')?.textContent?.trim();
      const pkg = document.getElementById('zvSummaryPackage')?.textContent?.trim();
      const cta = document.getElementById('zvCtaPrice')?.textContent?.trim();

      const cardStyle = window.getComputedStyle(card);
      const spanStyle = window.getComputedStyle(checkSpan);
      const svgStyle = window.getComputedStyle(checkSvg);

      return {
        cardActive: card.classList.contains('active'),
        inputChecked: input.checked,
        cardBg: cardStyle.backgroundColor,
        cardBorder: cardStyle.borderColor,
        spanBg: spanStyle.backgroundColor,
        spanBorder: spanStyle.borderColor,
        svgOpacity: svgStyle.opacity,
        svgStroke: svgStyle.stroke,
        totalPrice: total,
        packageText: pkg,
        ctaPrice: cta
      };
    })()`,
    returnByValue: true
  });
  console.log('After Click State:', JSON.stringify(afterEval.result.value, null, 2));

  // 4. Capture Clip Screenshot of the Upgrade Card + Summary Box
  console.log('\nCapturing screenshot of the checked Upgrade Card...');
  const clipEval = await send('Runtime.evaluate', {
    expression: `(() => {
      const el = document.getElementById('zvUpsellCard');
      const rect = el.getBoundingClientRect();
      return {
        x: rect.left,
        y: rect.top + window.scrollY,
        width: rect.width,
        height: rect.height + 250 // Include summary box
      };
    })()`,
    returnByValue: true
  });
  const clip = clipEval.result.value;

  const shot = await send('Page.captureScreenshot', {
    format: 'png',
    clip: {
      x: clip.x - 10,
      y: clip.y - 10,
      width: clip.width + 20,
      height: clip.height + 30,
      scale: 2
    }
  });

  const outPath = `${ARTIFACT_DIR}/upgrade_checkbox_checked_verified.png`;
  fs.writeFileSync(outPath, Buffer.from(shot.data, 'base64'));
  console.log(`✓ Saved screenshot of checked upgrade card to ${outPath}`);

  chromeProc.kill();
}

testUpgradeClick().catch(console.error);
