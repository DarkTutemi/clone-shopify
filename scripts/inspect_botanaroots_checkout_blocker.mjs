import fs from 'fs';

const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || "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";
const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';
const LIVE_THEME_ID = '187597717689';

async function getAccessToken() {
  const tokenRes = await fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'client_credentials'
    })
  });
  const data = await tokenRes.json();
  return data.access_token;
}

async function main() {
  const token = await getAccessToken();

  // 1. Get Product 15461545935033 details and variants
  console.log('--- 1. Product 15461545935033 Variants & Options ---');
  const prodRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/2026-01/products/15461545935033.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const prodData = await prodRes.json();
  console.log('Title:', prodData.product.title);
  console.log('Options:', JSON.stringify(prodData.product.options, null, 2));
  console.log('Variants:');
  prodData.product.variants.forEach(v => {
    console.log(`- ID: ${v.id} | Title: "${v.title}" | Price: $${v.price} | Compare: $${v.compare_at_price} | SKU: ${v.sku} | Opt1: ${v.option1} | Opt2: ${v.option2} | Opt3: ${v.option3}`);
  });

  // 2. Fetch snippets/botanaroots-bundle-upsell.liquid from Live Theme
  console.log('\n--- 2. Fetching snippets/botanaroots-bundle-upsell.liquid ---');
  const snippetRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/2026-01/themes/${LIVE_THEME_ID}/assets.json?asset[key]=snippets/botanaroots-bundle-upsell.liquid`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const snippetData = await snippetRes.json();
  if (snippetData.asset?.value) {
    fs.writeFileSync('backups/live_botanaroots-bundle-upsell.liquid.bak', snippetData.asset.value);
    console.log('Saved backups/live_botanaroots-bundle-upsell.liquid.bak');
  }

  // 3. Fetch assets/botanaroots-bundle.js from Live Theme
  console.log('\n--- 3. Fetching assets/botanaroots-bundle.js ---');
  const jsRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/2026-01/themes/${LIVE_THEME_ID}/assets.json?asset[key]=assets/botanaroots-bundle.js`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const jsData = await jsRes.json();
  if (jsData.asset?.value) {
    fs.writeFileSync('backups/live_botanaroots-bundle.js.bak', jsData.asset.value);
    console.log('Saved backups/live_botanaroots-bundle.js.bak');
  }
}

main().catch(console.error);
