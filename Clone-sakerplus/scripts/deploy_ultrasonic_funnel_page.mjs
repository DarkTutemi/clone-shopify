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
    console.error(`  ✗ Failed ${key}:`, err.slice(0, 150));
    return false;
  }
}

async function main() {
  const token = await getAccessToken();

  console.log('1. Uploading theme section & template...');
  const sectionContent = fs.readFileSync('Clone-sakerplus/theme/sections/ultrasonic-cutter-funnel.liquid', 'utf-8');
  await uploadThemeAsset(token, 'sections/ultrasonic-cutter-funnel.liquid', sectionContent);

  const templateContent = fs.readFileSync('Clone-sakerplus/theme/templates/page.ultrasonic-funnel.liquid', 'utf-8');
  await uploadThemeAsset(token, 'templates/page.ultrasonic-funnel.liquid', templateContent);

  console.log('2. Creating or updating Shopify Page...');
  // Check if page exists
  const pagesRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/pages.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const pagesData = await pagesRes.json();
  const existingPage = pagesData.pages?.find(p => p.handle.includes('ultrasonic'));

  const pagePayload = {
    page: {
      title: "Saker® 40kHz Cordless Ultrasonic Precision Cutter Kit Checkout",
      handle: "order-saker-cordless-ultrasonic-cutter-and-grinder",
      template_suffix: "ultrasonic-funnel",
      published: true
    }
  };

  if (existingPage) {
    console.log(`  Updating existing page ID: ${existingPage.id}...`);
    const updateRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/pages/${existingPage.id}.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
      body: JSON.stringify(pagePayload)
    });
    console.log('  Page update status:', updateRes.status);
  } else {
    console.log('  Creating new page...');
    const createRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/pages.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
      body: JSON.stringify(pagePayload)
    });
    const pageData = await createRes.json();
    console.log('  Page created! ID:', pageData.page?.id, '| Handle:', pageData.page?.handle);
  }

  console.log('3. Linking product to Collections...');
  const prodCreated = JSON.parse(fs.readFileSync('Clone-sakerplus/data/ultrasonic_product_created.json', 'utf-8'));
  const productId = prodCreated.product.id;

  // Add to collections
  const colRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/custom_collections.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const colData = await colRes.json();
  const targetCols = colData.custom_collections?.filter(c => 
    c.title.includes('Power Tools') || c.title.includes('Best Sellers') || c.title.includes('Home Improvement')
  ) || [];

  for (const c of targetCols) {
    try {
      const collectRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/collects.json`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
        body: JSON.stringify({
          collect: {
            product_id: productId,
            collection_id: c.id
          }
        })
      });
      console.log(`  Linked to [${c.title}]:`, collectRes.ok ? 'OK' : collectRes.status);
    } catch (e) {}
  }

  console.log('\n🚀 ALL DONE!');
  console.log(`Funnel Page: https://${SHOP_DOMAIN}/pages/order-saker-cordless-ultrasonic-cutter-and-grinder`);
  console.log(`Product PDP: https://${SHOP_DOMAIN}/products/saker-cordless-ultrasonic-cutter-and-grinder`);
}

main().catch(console.error);
