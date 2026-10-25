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
        template_suffix: 'yeoman-sweep'
      }
    })
  });
  const data = await res.json();
  if (data.errors) {
    throw new Error(`Update product template failed: ${JSON.stringify(data.errors)}`);
  }
  console.log(`✔ Product updated with template_suffix: yeoman-sweep!`);
  return data.product;
}

async function main() {
  const token = await getAccessToken();
  console.log('Got access token.');

  // 1. Upload Template
  const liquid = fs.readFileSync('Clone-yeoman/theme/templates/product.yeoman-sweep.liquid', 'utf8');
  await uploadThemeAsset(token, 'templates/product.yeoman-sweep.liquid', liquid);

  // 2. Set Product Template Suffix
  const seeded = JSON.parse(fs.readFileSync('Clone-yeoman/data/seeded_product.json', 'utf8'));
  console.log(`Setting template_suffix on product ID: ${seeded.productId}...`);
  await updateProductTemplate(token, seeded.productId);

  // 3. Verify Live Response
  console.log('\n--- Verifying live URL ---');
  const testRes = await fetch(seeded.url);
  console.log(`HTTP Status: ${testRes.status}`);
  const html = await testRes.text();
  console.log(`HTML Length: ${html.length}`);

  if (html.includes('The World\'s First Lawn Tool That Ends The Raking')) {
    console.log('✔ Verified: Main sales headline present!');
  }
  if (html.includes('21 inch') && !html.includes('data-pack="26 in"') && !html.includes('data-pack="30 in"')) {
    console.log('✔ Verified: Only 21 inch variant present (26 in and 30 in successfully removed)!');
  }
  if (html.includes('67918044954809')) {
    console.log('✔ Verified: Correct live 21-inch variant ID 67918044954809 present in form!');
  }
}

main().catch(console.error);
