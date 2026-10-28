import { spawn } from 'child_process';
import fs from 'fs';
import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');

const CDP_PORT = 9330;
const userDataDir = `${process.env.TEMP}\\chrome-faq-shot-${Date.now()}`;
const ARTIFACTS_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\d0f634e2-c9dd-4bad-bdb2-3c956abea303';

async function main() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chrome = spawn(chromePath, [
    '--headless=new',
    `--remote-debugging-port=${CDP_PORT}`,
    `--user-data-dir=${userDataDir}`,
    '--window-size=1440,1400'
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

  await send('Page.navigate', { url: 'https://tryzavelyn.com/products/zavelyn-vfit-red-light-intimate-wellness-device?nocache=' + Date.now() });
  await new Promise(r => setTimeout(r, 4500));

  // Scroll to FAQ section
  await send('Runtime.evaluate', {
    expression: `(() => {
      const faqSec = document.querySelector('.zv-vfit-faq-section');
      if (faqSec) {
        faqSec.scrollIntoView({ behavior: 'instant', block: 'center' });
      }
    })()`
  });
  await new Promise(r => setTimeout(r, 1500));

  // Take screenshot of viewport
  const shot = await send('Page.captureScreenshot', { format: 'png' });
  const shotPath = `${ARTIFACTS_DIR}/vfit_faq_section_live_view.png`;
  fs.writeFileSync(shotPath, Buffer.from(shot.data, 'base64'));
  console.log(`✓ Saved viewport screenshot of FAQ to ${shotPath}`);

  // Now scroll to show the transition from Reviews to FAQ
  await send('Runtime.evaluate', {
    expression: `(() => {
      const reviewHeader = Array.from(document.querySelectorAll('h3')).find(h => h.innerText.includes('Real Reviews from Over 100,000+ Women'));
      if (reviewHeader) {
        reviewHeader.scrollIntoView({ behavior: 'instant', block: 'start' });
        window.scrollBy(0, -20);
      }
    })()`
  });
  await new Promise(r => setTimeout(r, 1000));

  const shotTransition = await send('Page.captureScreenshot', { format: 'png' });
  const shotTransitionPath = `${ARTIFACTS_DIR}/vfit_reviews_to_faq_transition.png`;
  fs.writeFileSync(shotTransitionPath, Buffer.from(shotTransition.data, 'base64'));
  console.log(`✓ Saved Reviews-to-FAQ transition screenshot to ${shotTransitionPath}`);

  await ws.close();
  chrome.kill();
  try { fs.rmSync(userDataDir, { recursive: true, force: true }); } catch (e) {}
}

main().catch(console.error);
