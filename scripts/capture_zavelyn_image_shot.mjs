import { spawn } from 'child_process';
import fs from 'fs';
import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');

const CDP_PORT = 9340;
const userDataDir = `${process.env.TEMP}\\chrome-image-wait-${Date.now()}`;
const ARTIFACTS_DIR = 'C:\\Users\\Admin\\.gemini\\antigravity-ide\\brain\\d0f634e2-c9dd-4bad-bdb2-3c956abea303';

async function main() {
  const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
  const chrome = spawn(chromePath, [
    '--headless=new',
    `--remote-debugging-port=${CDP_PORT}`,
    `--user-data-dir=${userDataDir}`,
    '--window-size=1440,1600'
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

  console.log('Navigating to Live vFit PDP...');
  await send('Page.navigate', { url: 'https://tryzavelyn.com/products/zavelyn-vfit-red-light-intimate-wellness-device' });

  // Wait until image is loaded
  let loaded = false;
  for (let i = 0; i < 20; i++) {
    await new Promise(r => setTimeout(r, 1000));
    const check = await send('Runtime.evaluate', {
      expression: `(() => {
        const heading = Array.from(document.querySelectorAll('h3')).find(h => h.innerText.includes('How the Zavelyn vFit™ Triple Action Works'));
        const parent = heading ? heading.closest('div') : null;
        const img = parent ? parent.querySelector('img') : null;
        return {
          complete: img ? img.complete : false,
          naturalWidth: img ? img.naturalWidth : 0,
          src: img ? img.src : null
        };
      })()`,
      returnByValue: true
    });
    console.log(`Poll ${i+1}:`, check.result.value);
    if (check.result.value && check.result.value.complete && check.result.value.naturalWidth > 0) {
      loaded = true;
      break;
    }
  }

  // Scroll to section
  await send('Runtime.evaluate', {
    expression: `(() => {
      const heading = Array.from(document.querySelectorAll('h3')).find(h => h.innerText.includes('How the Zavelyn vFit™ Triple Action Works'));
      if (heading) {
        heading.scrollIntoView({ behavior: 'instant', block: 'start' });
        window.scrollBy(0, -30);
      }
    })()`
  });
  await new Promise(r => setTimeout(r, 1000));

  const shot = await send('Page.captureScreenshot', { format: 'png' });
  const shotPath = `${ARTIFACTS_DIR}/vfit_zavelyn_box_image_live_verified.png`;
  fs.writeFileSync(shotPath, Buffer.from(shot.data, 'base64'));
  console.log(`✓ Saved screenshot with ZAVELYN box image to ${shotPath}`);

  await ws.close();
  chrome.kill();
  try { fs.rmSync(userDataDir, { recursive: true, force: true }); } catch (e) {}
}

main().catch(console.error);
