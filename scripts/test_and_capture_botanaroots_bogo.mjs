import { spawn } from 'child_process';
import fs from 'fs';
import path from 'path';

const PORT = 9279;
const userDataDir = `${process.env.TEMP}\\chrome-bogo-test-${Date.now()}`;
const destDir = 'prototypes/botanaroots-bogo-test/screenshots';
const artifactDir = 'C:/Users/Admin/.gemini/antigravity-ide/brain/d0f634e2-c9dd-4bad-bdb2-3c956abea303';
const prototypePath = path.resolve('prototypes/botanaroots-bogo-test/index.html');
const prototypeUrl = `file:///${prototypePath.replace(/\\/g, '/')}`;

async function main() {
  console.log('================================================================');
  console.log('🧪 TESTING & CAPTURING BOTANAROOTS BOGO PROTOTYPE VIA CHROME CDP');
  console.log(`🌐 Prototype URL: ${prototypeUrl}`);
  console.log('================================================================\n');

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

  async function saveShot(name) {
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    const localPath = `${destDir}/${name}.png`;
    const artPath = `${artifactDir}/${name}.png`;
    fs.writeFileSync(localPath, Buffer.from(shot.data, 'base64'));
    fs.writeFileSync(artPath, Buffer.from(shot.data, 'base64'));
    console.log(`  ✓ Saved ${name}.png`);
  }

  // 1. DESKTOP 1440px - Default State (Combination 5: Buy 4 Get 4 - 60ml)
  console.log('[1/8] Capturing Desktop 1440px (Default Buy 4 Get 4 - 60ml)...');
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 1100,
    deviceScaleFactor: 1,
    mobile: false
  });
  await send('Page.navigate', { url: prototypeUrl });
  await new Promise(r => setTimeout(r, 2000));
  await saveShot('bogo_desktop_1440_default_combo5');

  // Verify State Evaluation
  const stateDefault = await send('Runtime.evaluate', {
    expression: 'window.__BOTANA_BOGO_STATE__',
    returnByValue: true
  });
  console.log('  State Combo 5:', JSON.stringify(stateDefault.result.value));

  // 2. Combination 6: Buy 4 Get 4 - 120ml Upgrade ($239.96)
  console.log('[2/8] Testing & Capturing Combination 6: Buy 4 Get 4 - 120ml ($239.96)...');
  await send('Runtime.evaluate', {
    expression: 'document.getElementById("zvUpsellCard").click();'
  });
  await new Promise(r => setTimeout(r, 600));
  await saveShot('bogo_combo6_buy4get4_120ml');
  const state6 = await send('Runtime.evaluate', { expression: 'window.__BOTANA_BOGO_STATE__', returnByValue: true });
  console.log('  State Combo 6:', JSON.stringify(state6.result.value));

  // 3. Combination 3: Buy 2 Get 2 - 60ml ($79.98)
  console.log('[3/8] Testing & Capturing Combination 3: Buy 2 Get 2 - 60ml ($79.98)...');
  await send('Runtime.evaluate', {
    expression: `
      document.getElementById("zvCardBuy2").click();
      if (document.getElementById("zvSizeUpgradeCheck").checked) {
        document.getElementById("zvUpsellCard").click();
      }
    `
  });
  await new Promise(r => setTimeout(r, 600));
  await saveShot('bogo_combo3_buy2get2_60ml');
  const state3 = await send('Runtime.evaluate', { expression: 'window.__BOTANA_BOGO_STATE__', returnByValue: true });
  console.log('  State Combo 3:', JSON.stringify(state3.result.value));

  // 4. Combination 4: Buy 2 Get 2 - 120ml ($119.98)
  console.log('[4/8] Testing & Capturing Combination 4: Buy 2 Get 2 - 120ml ($119.98)...');
  await send('Runtime.evaluate', {
    expression: 'document.getElementById("zvUpsellCard").click();'
  });
  await new Promise(r => setTimeout(r, 600));
  await saveShot('bogo_combo4_buy2get2_120ml');
  const state4 = await send('Runtime.evaluate', { expression: 'window.__BOTANA_BOGO_STATE__', returnByValue: true });
  console.log('  State Combo 4:', JSON.stringify(state4.result.value));

  // 5. Combination 1: Buy 1 - 60ml ($39.99)
  console.log('[5/8] Testing & Capturing Combination 1: Buy 1 - 60ml ($39.99)...');
  await send('Runtime.evaluate', {
    expression: `
      document.getElementById("zvCardBuy1").click();
      if (document.getElementById("zvSizeUpgradeCheck").checked) {
        document.getElementById("zvUpsellCard").click();
      }
    `
  });
  await new Promise(r => setTimeout(r, 600));
  await saveShot('bogo_combo1_buy1_60ml');
  const state1 = await send('Runtime.evaluate', { expression: 'window.__BOTANA_BOGO_STATE__', returnByValue: true });
  console.log('  State Combo 1:', JSON.stringify(state1.result.value));

  // 6. Combination 2: Buy 1 - 120ml ($49.99)
  console.log('[6/8] Testing & Capturing Combination 2: Buy 1 - 120ml ($49.99)...');
  await send('Runtime.evaluate', {
    expression: 'document.getElementById("zvUpsellCard").click();'
  });
  await new Promise(r => setTimeout(r, 600));
  await saveShot('bogo_combo2_buy1_120ml');
  const state2 = await send('Runtime.evaluate', { expression: 'window.__BOTANA_BOGO_STATE__', returnByValue: true });
  console.log('  State Combo 2:', JSON.stringify(state2.result.value));

  // 7. Testing CTA Modal Simulation (Claim Offer Cart Add)
  console.log('[7/8] Testing Claim Offer Cart Add Payload Simulation...');
  await send('Runtime.evaluate', {
    expression: 'document.getElementById("zvCtaClaimOffer").click();'
  });
  await new Promise(r => setTimeout(r, 600));
  await saveShot('bogo_modal_claim_offer_payload');

  // Close modal
  await send('Runtime.evaluate', {
    expression: 'document.getElementById("zvModalConfirmBtn").click();'
  });
  await new Promise(r => setTimeout(r, 400));

  // 8. MOBILE RESPONSIVE QA (390px & 375px)
  console.log('[8/8] Capturing Mobile Viewports (390px iPhone & 375px Compact)...');
  // Reset to default Buy 4 Get 4 - 60ml
  await send('Runtime.evaluate', {
    expression: `
      document.getElementById("zvCardBuy4").click();
      if (document.getElementById("zvSizeUpgradeCheck").checked) {
        document.getElementById("zvUpsellCard").click();
      }
    `
  });

  // Mobile 390px
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });
  await new Promise(r => setTimeout(r, 800));
  await saveShot('bogo_mobile_390_hero');

  // Scroll to buybox on mobile
  await send('Runtime.evaluate', {
    expression: 'document.getElementById("zvBotanaBogoComponent").scrollIntoView({ behavior: "instant", block: "start" });'
  });
  await new Promise(r => setTimeout(r, 600));
  await saveShot('bogo_mobile_390_bundle_box');

  // Mobile 375px
  await send('Emulation.setDeviceMetricsOverride', {
    width: 375,
    height: 812,
    deviceScaleFactor: 2,
    mobile: true
  });
  await new Promise(r => setTimeout(r, 600));
  await saveShot('bogo_mobile_375_compact');

  // Check horizontal overflow
  const overflowCheck = await send('Runtime.evaluate', {
    expression: 'document.documentElement.scrollWidth > document.documentElement.clientWidth',
    returnByValue: true
  });
  console.log('  Mobile 375px Horizontal Overflow Detected:', overflowCheck.result.value);

  // TABLET 768px
  await send('Emulation.setDeviceMetricsOverride', {
    width: 768,
    height: 1024,
    deviceScaleFactor: 2,
    mobile: true
  });
  await new Promise(r => setTimeout(r, 600));
  await saveShot('bogo_tablet_768');

  await ws.close();
  chrome.kill();
  try { fs.rmSync(userDataDir, { recursive: true, force: true }); } catch (e) {}

  console.log('\n================================================================');
  console.log('✔ ALL 6 COMBINATIONS & VIEWPORT SCREENSHOTS SUCCESSFULLY CAPTURED!');
  console.log('================================================================\n');
}

main().catch(console.error);
