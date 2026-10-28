import { spawn } from 'child_process';
import fs from 'fs';
import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');

const CDP_PORT = 9295;
const userDataDir = `${process.env.TEMP}\\chrome-shot-${Date.now()}`;

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
  await send('Page.navigate', {
    url: 'https://dsdujr-vn.myshopify.com/products/zavelyn-vfit-red-light-intimate-wellness-device?preview_theme_id=187720335545'
  });
  await new Promise(r => setTimeout(r, 4500));

  // Dismiss cookie banner & setup multi-quantity: 2 vfit, 2 eye, 2 face
  await send('Runtime.evaluate', {
    expression: `(() => {
      document.querySelectorAll('#shopify-pc__banner, .shopify-policy-container, [aria-label*="cookie"], [class*="banner"]').forEach(el => el.remove());

      // Set vFit = 2
      document.getElementById('vfitQtyPlus')?.click();

      // Select Eye & Face, set each to 2
      document.getElementById('zvCardEye')?.click();
      window.changeAddonQty('eyeMask', 1);

      document.getElementById('zvCardFace')?.click();
      window.changeAddonQty('faceMask', 1);

      // Scroll to summary card
      document.getElementById('zvOrderSummaryCard')?.scrollIntoView({ behavior: 'instant', block: 'center' });
    })()`
  });
  await new Promise(r => setTimeout(r, 1000));

  const shot = await send('Page.captureScreenshot', { format: 'png' });
  const outPath = 'C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\d0f634e2-c9dd-4bad-bdb2-3c956abea303\\draft_theme_vfit_summary_clean.png';
  fs.writeFileSync(outPath, Buffer.from(shot.data, 'base64'));
  console.log('Saved clean summary detail screenshot:', outPath);

  ws.close();
  chrome.kill();
  try { fs.rmSync(userDataDir, { recursive: true, force: true }); } catch (e) {}
}

main().catch(err => {
  console.error(err);
  process.exit(1);
});
