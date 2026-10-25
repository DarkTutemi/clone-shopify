import fs from 'fs';

const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';
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

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function main() {
  const token = await getAccessToken();
  console.log('Got access token.');

  // Fetch existing handles to prevent duplicates
  const existingRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-01/products.json?limit=250`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const existingData = await existingRes.json();
  const existingHandles = new Set((existingData.products || []).map(p => p.handle));
  console.log(`Currently ${existingHandles.size} products in store.`);

  const seedProducts = JSON.parse(fs.readFileSync('Clone-sakerplus/data/seed_50_products.json', 'utf8'));
  console.log(`Total products to process: ${seedProducts.length}`);

  let created = 0;
  let skipped = 0;

  for (let i = 0; i < seedProducts.length; i++) {
    const p = seedProducts[i];
    if (existingHandles.has(p.handle)) {
      console.log(`[${i + 1}/${seedProducts.length}] Skipping existing: ${p.title} (${p.handle})`);
      skipped++;
      continue;
    }

    console.log(`[${i + 1}/${seedProducts.length}] Creating: ${p.title} (${p.handle})...`);

    const payload = {
      product: {
        title: p.title,
        handle: p.handle,
        body_html: p.body_html || '',
        vendor: 'Sakerplus',
        product_type: p.product_type || 'Tools & Home Improvement',
        tags: (p.tags || []).concat(['bestseller']).join(', '),
        options: (p.options && p.options.length > 0) ? p.options.map(opt => ({
          name: opt.name,
          values: opt.values
        })) : [{ name: 'Title' }],
        variants: (p.variants && p.variants.length > 0) ? p.variants.map(v => ({
          title: v.title,
          price: v.price,
          compare_at_price: v.compare_at_price,
          sku: v.sku,
          option1: v.option1,
          option2: v.option2,
          option3: v.option3
        })) : [{ price: '29.99', title: 'Default Title' }],
        images: (p.images || []).slice(0, 15).map(src => ({ src }))
      }
    };

    try {
      const res = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-01/products.json`, {
        method: 'POST',
        headers: {
          'X-Shopify-Access-Token': token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(payload)
      });

      if (res.ok) {
        const data = await res.json();
        console.log(`  ✔ Created! ID: ${data.product.id}`);
        existingHandles.add(p.handle);
        created++;
      } else {
        const err = await res.text();
        console.error(`  ✗ Error (${res.status}):`, err.slice(0, 150));
      }
    } catch (e) {
      console.error(`  ✗ Network exception:`, e.message);
    }

    await sleep(750); // Throttle to stay well within Shopify REST 2 req/sec bucket
  }

  console.log(`\nSeeding completed! Created: ${created}, Skipped: ${skipped}, Total target: ${seedProducts.length}`);
}

main();
