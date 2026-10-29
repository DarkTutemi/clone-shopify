import { spawn } from 'child_process';
import fs from 'fs';

const PORT = 9290;
const DEV_THEME_ID = '187736654009';
const LIVE_THEME_ID = '187597717689';

async function runQA(isLive = false) {
  const themeId = isLive ? LIVE_THEME_ID : DEV_THEME_ID;
  const url = isLive 
    ? 'https://tryzavelyn.com/products/livestock-heating-lamp'
    : `https://tryzavelyn.com/products/livestock-heating-lamp?preview_theme_id=${DEV_THEME_ID}`;

  console.log(`\n========================================================================`);
  console.log(`RUNNING LIVESTOCK BUNDLE QA ON ${isLive ? 'LIVE THEME' : 'DEV THEME'}`);
  console.log(`URL: ${url}`);
  console.log(`========================================================================\n`);

  const chromeProc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
    `--remote-debugging-port=${PORT}`,
    `--user-data-dir=${process.env.TEMP}\\chrome-qa-${Date.now()}`,
    '--headless=new',
    '--disable-gpu',
    '--window-size=1440,900',
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

  await send('Page.enable');
  await send('Runtime.enable');
  await send('Page.navigate', { url });
  await new Promise(r => setTimeout(r, 5000));

  // 1. Initial State QA
  const initialData = await send('Runtime.evaluate', {
    expression: `(() => {
      const cards = Array.from(document.querySelectorAll('#zvBundleOffers .kc-offer')).map((c, i) => {
        const radio = c.querySelector('input[type=\"radio\"]');
        const badge = c.querySelector('.kc-offer__badge')?.innerText?.trim() || null;
        const title = c.querySelector('.kc-offer__copy strong')?.innerText?.trim();
        const sub = c.querySelector('.kc-offer__copy small')?.innerText?.trim();
        const price = c.querySelector('.zv-tier-price')?.innerText?.trim();
        const compare = c.querySelector('.zv-tier-compare')?.innerText?.trim();
        return {
          index: i + 1,
          tier: c.getAttribute('data-tier'),
          bundleVal: c.getAttribute('data-bundle-val'),
          checked: radio ? radio.checked : false,
          radioVal: radio ? radio.value : null,
          badge,
          title,
          sub,
          price,
          compare
        };
      });

      const mainPrice = document.getElementById('zvPriceCurrent')?.innerText?.trim();
      const mainCompare = document.getElementById('zvPriceCompare')?.innerText?.trim();
      const mainSave = document.getElementById('zvPriceSave')?.innerText?.trim();

      return {
        cardCount: cards.length,
        cards,
        mainPrice,
        mainCompare,
        mainSave
      };
    })()`,
    returnByValue: true
  });

  console.log('1. INITIAL BUNDLE CARDS STATE:');
  console.log(JSON.stringify(initialData.result.value, null, 2));

  // 2. Click Buy 2 (Card 2)
  await send('Runtime.evaluate', {
    expression: `(() => {
      const card2Radio = document.querySelector('#zvBundleOffers .kc-offer[data-tier=\"2\"] input[type=\"radio\"]');
      if (card2Radio) {
        card2Radio.checked = true;
        card2Radio.dispatchEvent(new Event('change', { bubbles: true }));
      }
    })()`
  });
  await new Promise(r => setTimeout(r, 800));

  const afterBuy2Data = await send('Runtime.evaluate', {
    expression: `(() => {
      return {
        mainPrice: document.getElementById('zvPriceCurrent')?.innerText?.trim(),
        mainCompare: document.getElementById('zvPriceCompare')?.innerText?.trim(),
        mainSave: document.getElementById('zvPriceSave')?.innerText?.trim(),
        card2Checked: document.querySelector('#zvBundleOffers .kc-offer[data-tier=\"2\"] input[type=\"radio\"]')?.checked
      };
    })()`,
    returnByValue: true
  });
  console.log('\n2. AFTER CLICKING BUY 2:');
  console.log(JSON.stringify(afterBuy2Data.result.value, null, 2));

  // 3. Click Buy 1 (Card 3)
  await send('Runtime.evaluate', {
    expression: `(() => {
      const card1Radio = document.querySelector('#zvBundleOffers .kc-offer[data-tier=\"1\"] input[type=\"radio\"]');
      if (card1Radio) {
        card1Radio.checked = true;
        card1Radio.dispatchEvent(new Event('change', { bubbles: true }));
      }
    })()`
  });
  await new Promise(r => setTimeout(r, 800));

  const afterBuy1Data = await send('Runtime.evaluate', {
    expression: `(() => {
      return {
        mainPrice: document.getElementById('zvPriceCurrent')?.innerText?.trim(),
        mainCompare: document.getElementById('zvPriceCompare')?.innerText?.trim(),
        mainSave: document.getElementById('zvPriceSave')?.innerText?.trim(),
        card1Checked: document.querySelector('#zvBundleOffers .kc-offer[data-tier=\"1\"] input[type=\"radio\"]')?.checked
      };
    })()`,
    returnByValue: true
  });
  console.log('\n3. AFTER CLICKING BUY 1:');
  console.log(JSON.stringify(afterBuy1Data.result.value, null, 2));

  // 4. Click back to Buy 3 (Card 1)
  await send('Runtime.evaluate', {
    expression: `(() => {
      const card3Radio = document.querySelector('#zvBundleOffers .kc-offer[data-tier=\"3\"] input[type=\"radio\"]');
      if (card3Radio) {
        card3Radio.checked = true;
        card3Radio.dispatchEvent(new Event('change', { bubbles: true }));
      }
    })()`
  });
  await new Promise(r => setTimeout(r, 800));

  const afterRestoreBuy3 = await send('Runtime.evaluate', {
    expression: `(() => {
      return {
        mainPrice: document.getElementById('zvPriceCurrent')?.innerText?.trim(),
        mainCompare: document.getElementById('zvPriceCompare')?.innerText?.trim(),
        mainSave: document.getElementById('zvPriceSave')?.innerText?.trim(),
        card3Checked: document.querySelector('#zvBundleOffers .kc-offer[data-tier=\"3\"] input[type=\"radio\"]')?.checked
      };
    })()`,
    returnByValue: true
  });
  console.log('\n4. AFTER RESTORING BUY 3:');
  console.log(JSON.stringify(afterRestoreBuy3.result.value, null, 2));

  // 5. Test Claim Offer button click
  console.log('\n5. TESTING CLAIM OFFER BUTTON INTERACTION...');
  const atcResult = await send('Runtime.evaluate', {
    expression: `(async () => {
      const claimBtn = document.getElementById('zvClaimOfferBtn');
      if (!claimBtn) return { error: 'Claim button not found' };

      // Spy on fetch
      let fetchPayload = null;
      const originalFetch = window.fetch;
      window.fetch = async (...args) => {
        if (typeof args[0] === 'string' && args[0].includes('/cart/add.js')) {
          fetchPayload = JSON.parse(args[1].body);
        }
        return originalFetch.apply(window, args);
      };

      claimBtn.click();
      await new Promise(r => setTimeout(r, 2000));

      const drawerActive = document.getElementById('willaCartDrawer')?.classList.contains('active') ||
                           document.querySelector('zavelyn-cart-drawer')?.getAttribute('open') !== null;

      return {
        fetchPayload,
        drawerActive
      };
    })()`,
    awaitPromise: true,
    returnByValue: true
  });
  console.log('ATC Result:', JSON.stringify(atcResult.result.value, null, 2));

  // 6. Capture Screenshots
  if (!fs.existsSync('./backups/screenshots')) {
    fs.mkdirSync('./backups/screenshots', { recursive: true });
  }

  // Dismiss cookie/preview banners and close drawer
  await send('Runtime.evaluate', {
    expression: `(() => {
      document.querySelectorAll('#shopify-privacy-banner, .privacy-banner, [aria-label*="consent" i], [class*="consent" i], [class*="cookie" i], #preview-bar-iframe, iframe').forEach(el => el.remove());
      const drawer = document.getElementById('willaCartDrawer');
      const overlay = document.getElementById('willaCartOverlay');
      if (drawer) drawer.classList.remove('active');
      if (overlay) overlay.classList.remove('active');
    })()`
  });

  // Desktop Screenshot (1440px)
  await send('Emulation.setDeviceMetricsOverride', {
    width: 1440,
    height: 1000,
    deviceScaleFactor: 1,
    mobile: false
  });
  await send('Runtime.evaluate', {
    expression: `(() => {
      const bundle = document.getElementById('zvBundleOffers');
      if (bundle) bundle.scrollIntoView({ behavior: 'instant', block: 'center' });
    })()`
  });
  await new Promise(r => setTimeout(r, 1200));
  const desktopShot = await send('Page.captureScreenshot', { format: 'png' });
  const desktopPath = `./backups/screenshots/${isLive ? 'live' : 'dev'}_desktop_bundle.png`;
  fs.writeFileSync(desktopPath, Buffer.from(desktopShot.data, 'base64'));
  console.log(`✓ Desktop screenshot saved to ${desktopPath}`);

  // Mobile Screenshot (390px)
  await send('Emulation.setDeviceMetricsOverride', {
    width: 390,
    height: 844,
    deviceScaleFactor: 2,
    mobile: true
  });
  await send('Runtime.evaluate', {
    expression: `(() => {
      document.querySelectorAll('#shopify-privacy-banner, .privacy-banner, [aria-label*="consent" i], [class*="consent" i], [class*="cookie" i], #preview-bar-iframe, iframe').forEach(el => el.remove());
      const bundle = document.getElementById('zvBundleOffers');
      if (bundle) bundle.scrollIntoView({ behavior: 'instant', block: 'center' });
    })()`
  });
  await new Promise(r => setTimeout(r, 1200));
  const mobileShot = await send('Page.captureScreenshot', { format: 'png' });
  const mobilePath = `./backups/screenshots/${isLive ? 'live' : 'dev'}_mobile_bundle.png`;
  fs.writeFileSync(mobilePath, Buffer.from(mobileShot.data, 'base64'));
  console.log(`✓ Mobile screenshot saved to ${mobilePath}`);

  chromeProc.kill();
}

const isLive = process.argv.includes('--live');
runQA(isLive).catch(console.error);
