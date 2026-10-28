import fs from 'fs';

const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || "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";
const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';

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

  // 1. Identify live theme
  const themesRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/2026-01/themes.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const themesData = await themesRes.json();
  const liveTheme = themesData.themes.find(t => t.role === 'main');
  console.log(`Current Live Theme: ID=${liveTheme.id}, Name="${liveTheme.name}"`);

  // 2. Check BotanaRoots product details & template_suffix
  const prodRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/2026-01/products/15461545935033.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const prodData = await prodRes.json();
  console.log(`Product: Title="${prodData.product.title}", Handle="${prodData.product.handle}", TemplateSuffix="${prodData.product.template_suffix}"`);

  // 3. Inspect live theme assets
  const assetsRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/2026-01/themes/${liveTheme.id}/assets.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const assetsData = await assetsRes.json();
  const relevantAssets = assetsData.assets.filter(a => 
    a.key.includes('zavelyn-pdp') || 
    a.key.includes('product') || 
    a.key.includes('benefit') ||
    a.key.includes('botana')
  );
  console.log('Relevant assets in live theme:');
  relevantAssets.forEach(a => console.log(` - ${a.key}`));

  // 4. Fetch sections/zavelyn-pdp-main.liquid
  const pdpMainRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/2026-01/themes/${liveTheme.id}/assets.json?asset[key]=sections/zavelyn-pdp-main.liquid`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const pdpMainData = await pdpMainRes.json();
  if (pdpMainData.asset && pdpMainData.asset.value) {
    fs.writeFileSync('backups/live_zavelyn-pdp-main.liquid.bak', pdpMainData.asset.value);
    console.log(`Saved backup of sections/zavelyn-pdp-main.liquid (${pdpMainData.asset.value.length} bytes) to backups/live_zavelyn-pdp-main.liquid.bak`);
    
    // Search for the incorrect copy in pdpMain
    const idx = pdpMainData.asset.value.indexOf('Engineered for maximum reliability');
    if (idx !== -1) {
      console.log('Found incorrect text in sections/zavelyn-pdp-main.liquid at char index:', idx);
      const snippet = pdpMainData.asset.value.substring(Math.max(0, idx - 300), Math.min(pdpMainData.asset.value.length, idx + 800));
      console.log('--- Context Snippet ---');
      console.log(snippet);
      console.log('-----------------------');
    } else {
      console.log('Incorrect text NOT found in sections/zavelyn-pdp-main.liquid!');
    }
  }

  // Also check sections/zavelyn-pdp-data.liquid if exists
  const pdpDataRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/2026-01/themes/${liveTheme.id}/assets.json?asset[key]=snippets/zavelyn-pdp-data.liquid`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const pdpDataJson = await pdpDataRes.json();
  if (pdpDataJson.asset && pdpDataJson.asset.value) {
    fs.writeFileSync('backups/live_zavelyn-pdp-data.liquid.bak', pdpDataJson.asset.value);
    console.log(`Saved backup of snippets/zavelyn-pdp-data.liquid`);
  }
}

main().catch(console.error);
