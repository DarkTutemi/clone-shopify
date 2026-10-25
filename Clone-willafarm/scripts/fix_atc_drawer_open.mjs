import fs from 'fs';

const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';
const THEME_ID = '186607567033';
const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || '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';

async function getAccessToken() {
  const res = await fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  const data = await res.json();
  return data.access_token;
}

async function uploadThemeAsset(token, key, value) {
  const url = `https://${SHOP_DOMAIN}/admin/api/2024-10/themes/${THEME_ID}/assets.json`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
    body: JSON.stringify({ asset: { key, value } })
  });
  const data = await res.json();
  if (res.ok) console.log(`  ✔ Uploaded: ${key}`);
  else console.error(`  ✗ Failed: ${key}`, JSON.stringify(data.errors || data));
}

async function run() {
  console.log('--- Updating submitWfOrder() in heating-lamp-funnel.liquid ---');
  let code = fs.readFileSync('Clone-willafarm/theme/sections/heating-lamp-funnel.liquid', 'utf8');

  const oldFunction = `  async function submitWfOrder() {
    const btn = document.getElementById('wf-main-atc-btn');
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<span>Processing Secure Order...</span>';
    }

    try {
      const res = await fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [{
            id: wfSelectedVariantId,
            quantity: wfCurrentQty
          }]
        })
      });

      if (res.ok) {
        window.location.href = '/checkout';
      } else {
        window.location.href = '/cart/' + wfSelectedVariantId + ':' + wfCurrentQty;
      }
    } catch (e) {
      console.error(e);
      window.location.href = '/cart/' + wfSelectedVariantId + ':' + wfCurrentQty;
    }
  }`;

  const newFunction = `  async function submitWfOrder() {
    const btn = document.getElementById('wf-main-atc-btn');
    const originalContent = btn ? btn.innerHTML : '';
    if (btn) {
      btn.disabled = true;
      btn.innerHTML = '<span class="wf-atc-text">ADDING TO CART...</span>';
    }

    try {
      const res = await fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [{
            id: wfSelectedVariantId,
            quantity: wfCurrentQty
          }]
        })
      });

      if (res.ok) {
        if (typeof window.willaRefreshCart === 'function') {
          await window.willaRefreshCart();
        }
        if (typeof window.willaOpenCartDrawer === 'function') {
          window.willaOpenCartDrawer();
        }
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = originalContent;
        }
      } else {
        if (btn) {
          btn.disabled = false;
          btn.innerHTML = originalContent;
        }
        window.location.href = '/cart/' + wfSelectedVariantId + ':' + wfCurrentQty;
      }
    } catch (e) {
      console.error(e);
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = originalContent;
      }
      window.location.href = '/cart/' + wfSelectedVariantId + ':' + wfCurrentQty;
    }
  }`;

  if (code.includes(oldFunction)) {
    code = code.replace(oldFunction, newFunction);
    console.log('  ✔ Replaced submitWfOrder() successfully');
  } else {
    // If spacing differs, use regex replace
    const regex = /async function submitWfOrder\(\)[\s\S]*?window\.location\.href\s*=\s*'\/cart\/' \+ wfSelectedVariantId \+ ':' \+ wfCurrentQty;\s*\}\s*\}/;
    if (regex.test(code)) {
      code = code.replace(regex, newFunction);
      console.log('  ✔ Replaced submitWfOrder() via regex match');
    } else {
      console.error('  ✗ Could not find submitWfOrder() in code!');
    }
  }

  fs.writeFileSync('Clone-willafarm/theme/sections/heating-lamp-funnel.liquid', code);
  const token = await getAccessToken();
  await uploadThemeAsset(token, 'sections/heating-lamp-funnel.liquid', code);
}

run().catch(console.error);
