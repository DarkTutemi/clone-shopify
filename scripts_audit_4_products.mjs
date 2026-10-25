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

const handles = [
  'livestock-heating-lamp',
  'thoson-magtrack',
  'srefalsteam',
  'the-yeoman-sweep'
];

async function run() {
  const token = await getAccessToken();
  console.log('=== AUDITING 4 PRODUCTS IN SHOPIFY ADMIN & LIVE STORE ===\n');

  for (const handle of handles) {
    console.log(`--------------------------------------------------`);
    console.log(`Checking Handle: "${handle}"`);
    console.log(`--------------------------------------------------`);

    // 1. Fetch from Admin API
    const res = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/products.json?handle=${handle}`, {
      headers: { 'X-Shopify-Access-Token': token }
    });
    const data = await res.json();
    const product = data.products?.[0];

    if (!product) {
      console.log(`  ✗ Product NOT found in Admin API with handle: ${handle}`);
    } else {
      console.log(`  ✔ Found in Admin API:`);
      console.log(`     ID: ${product.id}`);
      console.log(`     Title: ${product.title}`);
      console.log(`     Product Type: ${product.product_type}`);
      console.log(`     Template Suffix: "${product.template_suffix}"`);
      console.log(`     Images count: ${product.images.length}`);
      console.log(`     Variants count: ${product.variants.length}`);
      product.variants.forEach((v, i) => {
        console.log(`       [${i+1}] ${v.title} | ID: ${v.id} | Price: $${v.price} | Compare: $${v.compare_at_price}`);
      });
      console.log(`     Description Length: ${product.body_html?.length || 0} chars`);
      if (product.body_html) {
        console.log(`     Description Preview: ${product.body_html.substring(0, 200).replace(/\n/g, ' ')}...`);
      }
    }

    // 2. Fetch live URL
    const liveUrl = `https://tryzavelyn.com/products/${handle}`;
    try {
      const liveRes = await fetch(liveUrl, { redirect: 'manual' });
      console.log(`  Live URL Status: ${liveRes.status}`);
      if (liveRes.status === 200) {
        const text = await liveRes.text();
        const titleMatch = text.match(/<title>([^<]*)<\/title>/i);
        console.log(`  Live Page Title: ${titleMatch ? titleMatch[1].trim() : 'N/A'}`);
        // Find sections
        const sectionMatches = text.match(/id="shopify-section-([^"]+)"/g) || [];
        console.log(`  Rendered Sections:`, sectionMatches);
      } else {
        console.log(`  Redirect Location: ${liveRes.headers.get('location')}`);
      }
    } catch (e) {
      console.error(`  Live fetch error: ${e.message}`);
    }
  }
}

run().catch(console.error);
