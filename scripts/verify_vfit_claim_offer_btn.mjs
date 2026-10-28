import { spawn } from 'child_process';
import fs from 'fs';
import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');

const CDP_PORT = 9298;
const userDataDir = `${process.env.TEMP}\\chrome-vfit-claim-${Date.now()}`;
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

  console.log('\n--- 1. NAVIGATING TO vFIT PDP ON DRAFT THEME ---');
  await send('Page.navigate', {
    url: 'https://dsdujr-vn.myshopify.com/products/zavelyn-vfit-red-light-intimate-wellness-device?preview_theme_id=187720335545'
  });
  await new Promise(r => setTimeout(r, 4500));

  // Dismiss cookie banner
  await send('Runtime.evaluate', {
    expression: `(() => {
      document.querySelectorAll('#shopify-pc__banner, .shopify-policy-container, [aria-label*="cookie"], [class*="banner"]').forEach(el => el.remove());
    })()`
  });

  // Evaluate Buy Box Elements
  const buyBoxEval = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      const claimBtn = document.getElementById('zvClaimOfferBtn');
      const buyNowBtn = document.getElementById('zvBuyNowBtn');
      const urgencyBar = document.getElementById('zvUrgencyBar');
      const payIcons = document.querySelector('.zv-payment-icons-row');
      const starterCard = document.querySelector('.zv-buy1-container');
      const stepper = document.querySelector('.zv-qty-stepper');
      const qtyDisp = document.getElementById('vfitQtyDisplay');

      return {
        hasStarterCard: !!starterCard,
        hasStepper: !!stepper,
        qty: qtyDisp?.innerText,
        hasUrgencyBar: !!urgencyBar,
        urgencyText: urgencyBar?.innerText?.trim(),
        hasClaimBtn: !!claimBtn,
        claimBtnText: claimBtn?.innerText?.trim(),
        hasBuyNowBtn: !!buyNowBtn,
        buyNowBtnText: buyNowBtn?.innerText?.trim(),
        hasPayIcons: !!payIcons
      };
    })()`
  });

  console.log('vFit Buy Box Verification Result:');
  console.log(JSON.stringify(buyBoxEval.result.value, null, 2));

  // Capture Buy Box Screenshot
  const shot = await send('Page.captureScreenshot', { format: 'png' });
  const outPath = `${ARTIFACTS_DIR}\\vfit_buybox_with_claim_offer_btn.png`;
  fs.writeFileSync(outPath, Buffer.from(shot.data, 'base64'));
  console.log('✓ Saved screenshot to:', outPath);

  // 2. Also verify BotanaRoots remains untouched
  console.log('\n--- 2. VERIFYING BOTANAROOTS PDP ZERO BLEED ---');
  await send('Page.navigate', {
    url: 'https://dsdujr-vn.myshopify.com/products/zavelyn-botanaroots-organic-batana-hair-growth-oil?preview_theme_id=187720335545'
  });
  await new Promise(r => setTimeout(r, 4500));

  const botanaEval = await send('Runtime.evaluate', {
    returnByValue: true,
    expression: `(() => {
      return {
        hasBotanaBundle: !!document.getElementById('zvBotanaBundleComponent'),
        hasBotanaCta: !!document.getElementById('zvBotanaCtaBtn'),
        hasGenericClaimBtn: !!document.getElementById('zvClaimOfferBtn'),
        hasSelfCareSection: !!document.getElementById('zvSelfCareRoutine')
      };
    })()`
  });
  console.log('BotanaRoots Verification Result:');
  console.log(JSON.stringify(botanaEval.result.value, null, 2));

  ws.close();
  chrome.kill();
  try { fs.rmSync(userDataDir, { recursive: true, force: true }); } catch (e) {}

  console.log('\n✨ VERIFICATION COMPLETED SUCCESSFULLY!');
}

main().catch(err => {
  console.error('Fatal in verify_vfit_claim_offer_btn:', err);
  process.exit(1);
});
