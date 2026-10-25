import fs from 'fs';

const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';
const THEME_ID = '186607567033';
const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || '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';

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
  return data.access_token;
}

async function uploadThemeAsset(token, key, value) {
  const url = `https://${SHOP_DOMAIN}/admin/api/2024-10/themes/${THEME_ID}/assets.json`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify({
      asset: { key, value }
    })
  });
  if (res.ok) {
    console.log(`  ✔ Uploaded: ${key}`);
    return true;
  } else {
    const err = await res.text();
    console.error(`  ✗ Failed ${key}:`, err.slice(0, 200));
    return false;
  }
}

async function main() {
  const token = await getAccessToken();

  console.log('1. Uploading theme section & template...');
  const sectionContent = fs.readFileSync('Clone-sakerplus/data/heating_lamp/section.heating-lamp-funnel.liquid', 'utf-8');
  await uploadThemeAsset(token, 'sections/heating-lamp-funnel.liquid', sectionContent);

  const templateContent = fs.readFileSync('Clone-sakerplus/data/heating_lamp/product.sakerplus-livestock-heating-lamp.liquid', 'utf-8');
  await uploadThemeAsset(token, 'templates/product.sakerplus-livestock-heating-lamp.liquid', templateContent);

  console.log('2. Updating Product template_suffix...');
  const prodId = '15455757336761';
  const prodRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/products/${prodId}.json`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify({
      product: {
        id: prodId,
        template_suffix: 'sakerplus-livestock-heating-lamp'
      }
    })
  });
  const prodData = await prodRes.json();
  console.log('  Product template updated:', prodData.product?.template_suffix);

  console.log('3. Linking product to Collections...');
  const colRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/custom_collections.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const colData = await colRes.json();
  const targetCols = colData.custom_collections?.filter(c => 
    c.title.includes('Best Sellers') || c.title.includes('Home') || c.title.includes('Tools')
  ) || [];

  for (const c of targetCols) {
    try {
      const collectRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/collects.json`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
        body: JSON.stringify({
          collect: {
            product_id: prodId,
            collection_id: c.id
          }
        })
      });
      console.log(`  Linked to [${c.title}]:`, collectRes.ok ? 'OK' : collectRes.status);
    } catch (e) {}
  }

  console.log('\n🚀 ALL DONE!');
  console.log(`Advertorial News: https://tryzavelyn.com/pages/news-sakerplus-livestock-heating-lamp`);
  console.log(`Product Funnel PDP: https://tryzavelyn.com/products/sakerplus-livestock-heating-lamp`);
}

main().catch(console.error);
