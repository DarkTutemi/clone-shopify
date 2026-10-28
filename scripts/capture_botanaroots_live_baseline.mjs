import { spawn } from 'child_process';
import fs from 'fs';
import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');

const PORT = 9268;
const userDataDir = `${process.env.TEMP}\\chrome-botana-baseline-${Date.now()}`;
const destDir = 'prototypes/botanaroots-bogo-test/screenshots';

if (!fs.existsSync(destDir)) {
  fs.mkdirSync(destDir, { recursive: true });
}

async function capture() {
  console.log('Starting headless Chrome CDP session for Live BotanaRoots Baseline...');
  const chrome = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${userDataDir}`,
    '--headless=new',
    '--disable-gpu',
    '--no-sandbox',
    'about:blank'
  ]);
  await new Promise(r => setTimeout(r, 1500));

  const tabsRes = await fetch(`http://127.0.0.1:${PORT}/json`);
  const tabs = await tabsRes.json();
  const pageTab = tabs.find(t => t.type === 'page' && t.webSocketDebuggerUrl);
  const ws = new WebSocket(pageTab.webSocketDebuggerUrl);
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

  await send('Page.enable');
  await send('DOM.enable');

  const TARGET_URL = 'https://tryzavelyn.com/products/zavelyn-botanaroots-organic-batana-hair-growth-oil';

  // 1. Desktop 1440px
  console.log('Capturing Desktop 1440px baseline...');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 1200,
    deviceScaleFactor: 1,
    mobile: false
  });
  await send('Page.navigate', { url: TARGET_URL });
  await new Promise(r => setTimeout(r, 4500));

  const shotDesktop = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(`${destDir}/original_botanaroots_live_desktop_1440.png`, Buffer.from(shotDesktop.data, 'base64'));
  console.log(`✓ Saved ${destDir}/original_botanaroots_live_desktop_1440.png`);

  // 2. Mobile 390px
  console.log('Capturing Mobile 390px baseline...');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });
  await send('Page.navigate', { url: TARGET_URL });
  await new Promise(r => setTimeout(r, 4000));

  const shotMobile = await send('Page.captureScreenshot', { format: 'png' });
  fs.writeFileSync(`${destDir}/original_botanaroots_live_mobile_390.png`, Buffer.from(shotMobile.data, 'base64'));
  console.log(`✓ Saved ${destDir}/original_botanaroots_live_mobile_390.png`);

  await ws.close();
  chrome.kill();
  try { fs.rmSync(userDataDir, { recursive: true, force: true }); } catch (e) {}
  console.log('Baseline capture complete.');
}

capture().catch(console.error);
