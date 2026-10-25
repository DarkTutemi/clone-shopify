import fs from 'fs';

const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';
const THEME_ID = '186607567033';
const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || "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";

async function getAccessToken() {
  const res = await fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'client_credentials'
    })
  });
  const data = await res.json();
  if (!data.access_token) {
    throw new Error('Failed to get access token: ' + JSON.stringify(data));
  }
  return data.access_token;
}

async function uploadThemeAsset(token, key, value) {
  const url = `https://${SHOP_DOMAIN}/admin/api/2024-10/themes/${THEME_ID}/assets.json`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'X-Shopify-Access-Token': token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      asset: { key, value }
    })
  });
  const data = await res.json();
  if (data.errors) {
    throw new Error(`Upload ${key} failed: ${JSON.stringify(data.errors)}`);
  }
  console.log(`✔ Uploaded ${key} (${value.length} bytes)`);
  return data.asset;
}

async function updateProductTemplate(token, productId) {
  const url = `https://${SHOP_DOMAIN}/admin/api/2024-10/products/${productId}.json`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'X-Shopify-Access-Token': token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      product: {
        id: productId,
        template_suffix: 'srefalsteam'
      }
    })
  });
  const data = await res.json();
  if (data.errors) {
    throw new Error(`Update product template failed: ${JSON.stringify(data.errors)}`);
  }
  console.log(`✔ Product updated with template_suffix: srefalsteam!`);
  return data.product;
}

async function main() {
  const token = await getAccessToken();
  console.log('Got access token.');

  // 1. Upload snippets
  const snippets = [
    { key: 'snippets/srefalsteam-head.liquid', path: 'Clone-srefalsteam/theme/snippets/srefalsteam-head.liquid' },
    { key: 'snippets/srefalsteam-hero-styles.liquid', path: 'Clone-srefalsteam/theme/snippets/srefalsteam-hero-styles.liquid' },
    { key: 'snippets/srefalsteam-hero.liquid', path: 'Clone-srefalsteam/theme/snippets/srefalsteam-hero.liquid' },
    { key: 'snippets/srefalsteam-sections.liquid', path: 'Clone-srefalsteam/theme/snippets/srefalsteam-sections.liquid' },
    { key: 'snippets/srefalsteam-scripts.liquid', path: 'Clone-srefalsteam/theme/snippets/srefalsteam-scripts.liquid' }
  ];

  for (const s of snippets) {
    const content = fs.readFileSync(s.path, 'utf8');
    await uploadThemeAsset(token, s.key, content);
  }

  // 2. Upload master template
  const masterContent = fs.readFileSync('Clone-srefalsteam/theme/templates/product.srefalsteam.liquid', 'utf8');
  await uploadThemeAsset(token, 'templates/product.srefalsteam.liquid', masterContent);

  // 3. Set Product Template Suffix
  const seeded = JSON.parse(fs.readFileSync('Clone-srefalsteam/data/seeded_product.json', 'utf8'));
  console.log(`Setting template_suffix on product ID: ${seeded.productId}...`);
  await updateProductTemplate(token, seeded.productId);

  // 4. Verify Live Response
  console.log('\n--- Verifying live URL ---');
  const testRes = await fetch(seeded.url);
  console.log(`HTTP Status: ${testRes.status}`);
  const html = await testRes.text();
  console.log(`HTML Length: ${html.length}`);

  if (html.includes('SrefalSteam')) {
    console.log('✔ Verified: SrefalSteam product title present!');
  }
  if (html.includes('CLAIM YOURS NOW!')) {
    console.log('✔ Verified: Main CTA button present!');
  }
  if (html.includes('Promo Clean') && html.includes('SPECIAL DEAL')) {
    console.log('✔ Verified: Special Deal promo box present!');
  }
  if (html.includes(String(seeded.variantId))) {
    console.log(`✔ Verified: Live variant ID ${seeded.variantId} present in form!`);
  }
  if (html.includes('Why SrefalSteam')) {
    console.log('✔ Verified: Comparison table present!');
  }
  if (html.includes('FAQ')) {
    console.log('✔ Verified: FAQ section present!');
  }
}

main().catch(console.error);
