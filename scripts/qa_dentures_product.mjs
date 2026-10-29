import { spawn } from 'child_process';
import fs from 'fs';
import { getAccessToken, SHOP } from './batch1_config.mjs';

const PORT = 9292;
const URL = 'https://tryzavelyn.com/products/zavelyn-custom-fit-home-dentures';
const PRODUCT_ID = '15474563907769';

async function setProductStatus(status) {
  const token = await getAccessToken();
  console.log(`Setting product ${PRODUCT_ID} status to: ${status}...`);
  const res = await fetch(`https://${SHOP}/admin/api/2026-10/products/${PRODUCT_ID}.json`, {
    method: 'PUT',
    headers: {
      'X-Shopify-Access-Token': token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      product: {
        id: PRODUCT_ID,
        status,
        published_at: (status === 'active') ? new Date().toISOString() : null
      }
    })
  });
  const data = await res.json();
  if (data.product) {
    console.log(`✓ Product status is now: ${data.product.status} (published_at: ${data.product.published_at})`);
  } else {
    throw new Error('Failed to set status: ' + JSON.stringify(data));
  }
}

async function runQA() {
  try {
    await setProductStatus('active');
    await new Promise(r => setTimeout(r, 2000));

    console.log(`\n========================================================================`);
    console.log(`RUNNING DENTURES PRODUCT QA ON LIVE STORE`);
    console.log(`URL: ${URL}`);
    console.log(`========================================================================\n`);

    const chromeProc = spawn('C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe', [
      `--remote-debugging-port=${PORT}`,
      `--user-data-dir=${process.env.TEMP}\\chrome-dentures-qa-${Date.now()}`,
      '--headless=new',
      '--disable-gpu',
      '--window-size=1440,1000',
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
  await send('Page.navigate', { url: URL });
  await new Promise(r => setTimeout(r, 5000));

  // 1. Initial State QA
  const initialData = await send('Runtime.evaluate', {
    expression: `(() => {
      const title = document.querySelector('h1')?.innerText?.trim();
      const eyebrow = document.querySelector('.zv-pdp-eyebrow')?.innerText?.trim();
      const leadProp = document.querySelector('.zv-lead-prop')?.innerText?.trim();
      const bullets = Array.from(document.querySelectorAll('.zv-bullet-item')).map(b => b.innerText.trim());

      const cards = Array.from(document.querySelectorAll('#zvBundleOffers .kc-offer')).map((c, i) => {
        const radio = c.querySelector('input[type=\"radio\"]');
        const badge = c.querySelector('.kc-offer__badge')?.innerText?.trim() || null;
        const copyStrong = c.querySelector('.kc-offer__copy strong')?.innerText?.trim();
        const copySmall = c.querySelector('.kc-offer__copy small')?.innerText?.trim();
        const price = c.querySelector('.zv-tier-price')?.innerText?.trim();
        const compare = c.querySelector('.zv-tier-compare')?.innerText?.trim();
        return {
          index: i + 1,
          tier: c.getAttribute('data-tier'),
          bundleVal: c.getAttribute('data-bundle-val'),
          checked: radio ? radio.checked : false,
          badge,
          copyStrong,
          copySmall,
          price,
          compare
        };
      });

      const mainPrice = document.getElementById('zvPriceCurrent')?.innerText?.trim();
      const mainCompare = document.getElementById('zvPriceCompare')?.innerText?.trim();
      const mainSave = document.getElementById('zvPriceSave')?.innerText?.trim();

      // Check sections presence
      const hasDenturesBody = document.getElementById('dentures-details') !== null;
      const sections = Array.from(document.querySelectorAll('.zv-dentures-section h2')).map(h => h.innerText.trim());

      return {
        title,
        eyebrow,
        leadProp,
        bullets,
        cardCount: cards.length,
        cards,
        mainPrice,
        mainCompare,
        mainSave,
        hasDenturesBody,
        sections
      };
    })()`,
    returnByValue: true
  });

  console.log('1. INITIAL STATE & BUY BOX CONTENT:');
  console.log(JSON.stringify(initialData.result.value, null, 2));

  // 2. Click Buy 2 (Card 2)
  console.log('\n2. CLICKING BUY 2...');
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

  const afterBuy2 = await send('Runtime.evaluate', {
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
  console.log('After Buy 2:', JSON.stringify(afterBuy2.result.value, null, 2));

  // 3. Click Buy 1 (Card 3)
  console.log('\n3. CLICKING BUY 1...');
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

  const afterBuy1 = await send('Runtime.evaluate', {
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
  console.log('After Buy 1:', JSON.stringify(afterBuy1.result.value, null, 2));

  // 4. Click back to Buy 3 (Card 1)
  console.log('\n4. RESTORING BUY 3...');
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
      document.querySelectorAll('#shopify-privacy-banner, .privacy-banner, [aria-label*=\"consent\" i], [class*=\"consent\" i], [class*=\"cookie\" i], #preview-bar-iframe, iframe').forEach(el => el.remove());
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
  const desktopPath = './backups/screenshots/dentures_desktop_bundle.png';
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
      document.querySelectorAll('#shopify-privacy-banner, .privacy-banner, [aria-label*=\"consent\" i], [class*=\"consent\" i], [class*=\"cookie\" i], #preview-bar-iframe, iframe').forEach(el => el.remove());
      const bundle = document.getElementById('zvBundleOffers');
      if (bundle) bundle.scrollIntoView({ behavior: 'instant', block: 'center' });
    })()`
  });
  await new Promise(r => setTimeout(r, 1200));
  const mobileShot = await send('Page.captureScreenshot', { format: 'png' });
  const mobilePath = './backups/screenshots/dentures_mobile_bundle.png';
  fs.writeFileSync(mobilePath, Buffer.from(mobileShot.data, 'base64'));
  console.log(`✓ Mobile screenshot saved to ${mobilePath}`);

  // Copy screenshots to artifacts directory for report embedding
  const artifactDir = 'C:/Users/Admin/.gemini/antigravity-ide/brain/d0f634e2-c9dd-4bad-bdb2-3c956abea303';
  fs.copyFileSync(desktopPath, `${artifactDir}/dentures_desktop_bundle.png`);
  fs.copyFileSync(mobilePath, `${artifactDir}/dentures_mobile_bundle.png`);
  console.log('✓ Copied screenshots to artifacts directory.');

  chromeProc.kill();
  } finally {
    // Revert product back to draft status as instructed
    await setProductStatus('draft');
  }
}

runQA().catch(console.error);
