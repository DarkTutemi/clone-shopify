import { spawn } from 'child_process';
import fs from 'fs';
import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');

const CDP_PORT = 9315;
const userDataDir = `${process.env.TEMP}\\chrome-live-pay-${Date.now()}`;
const ARTIFACTS_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\d0f634e2-c9dd-4bad-bdb2-3c956abea303';

async function main() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chrome = spawn(chromePath, [
    '--headless=new',
    `--remote-debugging-port=${CDP_PORT}`,
    `--user-data-dir=${userDataDir}`,
    '--window-size=1440,1100'
  ]);
  await new Promise(r => setTimeout(r, 1500));

  const resTabs = await fetch(`http://127.0.0.1:${CDP_PORT}/json`);
  const tabs = await resTabs.json();
  const tab = tabs.find(t => t.type === 'page' && t.webSocketDebuggerUrl);

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

  await send('Page.enable');
  await send('DOM.enable');
  await send('CSS.enable');

  console.log('Navigating to Live vFit PDP...');
  await send('Page.navigate', { url: 'https://tryzavelyn.com/products/zavelyn-vfit-red-light-intimate-wellness-device?nocache=' + Date.now() });
  await new Promise(r => setTimeout(r, 4000));

  const vfitData = await send('Runtime.evaluate', {
    expression: `(() => {
      const row = document.querySelector('.zv-payment-icons-row');
      const icons = Array.from(document.querySelectorAll('.zv-payment-icon'));
      const svgs = Array.from(document.querySelectorAll('.zv-payment-icon svg, .zv-payment-icon .zv-pay-svg'));
      
      const iconsInfo = svgs.map(s => {
        const rect = s.getBoundingClientRect();
        return {
          title: s.closest('.zv-payment-icon')?.getAttribute('title') || s.getAttribute('aria-labelledby'),
          width: Math.round(rect.width),
          height: Math.round(rect.height),
          viewBox: s.getAttribute('viewBox'),
          classes: s.getAttribute('class')
        };
      });

      const buyBoxArea = document.querySelector('.zv-cta-group') || document.querySelector('.zv-buybox-actions') || document.querySelector('#zvClaimOfferBtn');
      const buyBoxRect = buyBoxArea ? buyBoxArea.getBoundingClientRect() : null;
      const rowRect = row ? row.getBoundingClientRect() : null;

      return {
        hasRow: !!row,
        iconCount: icons.length,
        svgCount: svgs.length,
        iconsInfo,
        buyBoxRect,
        rowRect
      };
    })()`,
    returnByValue: true
  });

  console.log('vFit Payment Icons Live State:', JSON.stringify(vfitData.result.value, null, 2));

  // Capture Buy Box + Payment Icons screenshot
  const shotClip = await send('Runtime.evaluate', {
    expression: `(() => {
      const claimBtn = document.querySelector('#zvClaimOfferBtn') || document.querySelector('.kc-claim-button');
      const payRow = document.querySelector('.zv-payment-icons-row');
      if (!claimBtn || !payRow) return null;
      const r1 = claimBtn.getBoundingClientRect();
      const r2 = payRow.getBoundingClientRect();
      const x = Math.max(0, Math.min(r1.left, r2.left) - 30);
      const y = Math.max(0, r1.top - 20);
      const width = Math.max(r1.width, r2.width) + 60;
      const height = (r2.bottom - r1.top) + 40;
      return { x, y, width, height, scale: 1 };
    })()`,
    returnByValue: true
  });

  if (shotClip.result.value) {
    const clip = shotClip.result.value;
    const shot = await send('Page.captureScreenshot', {
      format: 'png',
      clip: { x: clip.x, y: clip.y, width: clip.width, height: clip.height, scale: 2 }
    });
    const shotPath = `${ARTIFACTS_DIR}/vfit_payment_icons_crisp_verified.png`;
    fs.writeFileSync(shotPath, Buffer.from(shot.data, 'base64'));
    console.log(`✓ Saved Buy Box & Payment Icons screenshot to ${shotPath}`);
  }

  // Also verify BotanaRoots PDP zero bleed
  console.log('\nNavigating to Live BotanaRoots PDP (Zero-bleed check)...');
  await send('Page.navigate', { url: 'https://tryzavelyn.com/products/zavelyn-botanaroots-organic-batana-hair-growth-oil?nocache=' + Date.now() });
  await new Promise(r => setTimeout(r, 4000));

  const botanaData = await send('Runtime.evaluate', {
    expression: `(() => {
      const hasBotanaBundle = !!document.querySelector('.zv-botana-card, .zv-bundle-tier');
      const hasSelfCareSection = !!document.querySelector('.zv-selfcare-hero, .zv-addon-card');
      const icons = Array.from(document.querySelectorAll('.zv-payment-icon'));
      return {
        hasBotanaBundle,
        hasSelfCareSection,
        botanaPayIconsCount: icons.length
      };
    })()`,
    returnByValue: true
  });
  console.log('BotanaRoots Zero Bleed Check:', JSON.stringify(botanaData.result.value, null, 2));

  await ws.close();
  chrome.kill();
  try {
    fs.rmSync(userDataDir, { recursive: true, force: true });
  } catch (e) {}
}

main().catch(console.error);
