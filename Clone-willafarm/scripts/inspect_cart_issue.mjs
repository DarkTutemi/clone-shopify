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

async function getThemeAsset(token, key) {
  const url = `https://${SHOP_DOMAIN}/admin/api/2024-10/themes/${THEME_ID}/assets.json?asset[key]=${encodeURIComponent(key)}`;
  const res = await fetch(url, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const data = await res.json();
  return data.asset ? data.asset.value : null;
}

async function run() {
  // 1. Check live PDP HTML for cart links
  const pdpRes = await fetch('https://tryzavelyn.com/products/livestock-heating-lamp');
  const pdpHtml = await pdpRes.text();
  
  const cartLinkRegex = /<a[^>]*cart[^>]*>[\s\S]*?<\/a>/gi;
  const matches = pdpHtml.match(cartLinkRegex) || [];
  console.log('--- PDP Cart Links ---');
  matches.forEach(m => console.log(m));

  // Also check homepage
  const homeRes = await fetch('https://tryzavelyn.com/');
  const homeHtml = await homeRes.text();
  const homeMatches = homeHtml.match(cartLinkRegex) || [];
  console.log('--- Home Cart Links ---');
  homeMatches.forEach(m => console.log(m));

  // Check cart-drawer presence
  console.log('PDP has cart-drawer:', pdpHtml.includes('cart-drawer'));
  console.log('Home has cart-drawer:', homeHtml.includes('cart-drawer'));

  // 2. Check layout/theme.liquid
  const token = await getAccessToken();
  const themeLiquid = await getThemeAsset(token, 'layout/theme.liquid');
  console.log('theme.liquid has cart drawer render:', themeLiquid.includes('cart-drawer'));

  // 3. Check layout/offer.liquid if exists
  const offerLiquid = await getThemeAsset(token, 'layout/offer.liquid');
  console.log('offer.liquid exists:', !!offerLiquid);

  // 4. Check sections/header.liquid or snippets/offer-header.liquid
  const headerLiquid = await getThemeAsset(token, 'sections/header.liquid');
  console.log('sections/header.liquid length:', headerLiquid ? headerLiquid.length : 0);
  
  const willaHeader = await getThemeAsset(token, 'sections/willa-header.liquid');
  console.log('sections/willa-header.liquid length:', willaHeader ? willaHeader.length : 0);

  const offerHeader = await getThemeAsset(token, 'snippets/offer-header.liquid');
  console.log('snippets/offer-header.liquid length:', offerHeader ? offerHeader.length : 0);
}

run().catch(console.error);
