import { spawn } from 'child_process';
import fs from 'fs';
import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');

const CDP_PORT = 9335;
const userDataDir = `${process.env.TEMP}\\chrome-image-shot-${Date.now()}`;
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

  console.log('Navigating to Live vFit PDP...');
  await send('Page.navigate', { url: 'https://tryzavelyn.com/products/zavelyn-vfit-red-light-intimate-wellness-device?nocache=' + Date.now() });
  await new Promise(r => setTimeout(r, 4500));

  const imgData = await send('Runtime.evaluate', {
    expression: `(() => {
      const heading = Array.from(document.querySelectorAll('h3')).find(h => h.innerText.includes('How the Zavelyn vFit™ Triple Action Works'));
      if (!heading) return { foundHeading: false };
      
      const parent = heading.closest('div');
      const img = parent ? parent.querySelector('img') : null;
      
      return {
        foundHeading: true,
        headingText: heading.innerText,
        imgSrc: img ? img.src : null,
        imgComplete: img ? img.complete : false,
        naturalWidth: img ? img.naturalWidth : 0,
        naturalHeight: img ? img.naturalHeight : 0,
        displayedWidth: img ? Math.round(img.getBoundingClientRect().width) : 0,
        displayedHeight: img ? Math.round(img.getBoundingClientRect().height) : 0
      };
    })()`,
    returnByValue: true
  });

  console.log('Image Live Verification Data:', JSON.stringify(imgData.result.value, null, 2));

  // Scroll to this section and take a screenshot
  console.log('Scrolling to Triple Action section...');
  await send('Runtime.evaluate', {
    expression: `(() => {
      const heading = Array.from(document.querySelectorAll('h3')).find(h => h.innerText.includes('How the Zavelyn vFit™ Triple Action Works'));
      if (heading) {
        heading.scrollIntoView({ behavior: 'instant', block: 'start' });
        window.scrollBy(0, -40);
      }
    })()`
  });
  await new Promise(r => setTimeout(r, 1200));

  const shot = await send('Page.captureScreenshot', { format: 'png' });
  const shotPath = `${ARTIFACTS_DIR}/vfit_triple_tech_new_image_verified.png`;
  fs.writeFileSync(shotPath, Buffer.from(shot.data, 'base64'));
  console.log(`✓ Saved screenshot of updated Triple Action section to ${shotPath}`);

  await ws.close();
  chrome.kill();
  try { fs.rmSync(userDataDir, { recursive: true, force: true }); } catch (e) {}
}

main().catch(console.error);
