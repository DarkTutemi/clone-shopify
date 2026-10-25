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

async function main() {
  const token = await getAccessToken();
  console.log('Got access token.');

  const seedProducts = JSON.parse(fs.readFileSync('Clone-sakerplus/data/seed_50_products.json', 'utf8'));
  const fenceProd = seedProducts[0]; // Sakerplus Fence Post Repair Kit

  console.log(`\nSeeding priority product: ${fenceProd.title} (${fenceProd.handle})...`);

  const payload = {
    product: {
      title: fenceProd.title,
      handle: fenceProd.handle,
      body_html: fenceProd.body_html,
      vendor: 'Sakerplus',
      product_type: 'Outdoor Tools',
      tags: fenceProd.tags.concat(['bestseller', 'fence-post-repair-kit', 'outdoor-tools']).join(', '),
      options: fenceProd.options.map(opt => ({
        name: opt.name,
        values: opt.values
      })),
      variants: fenceProd.variants.map(v => ({
        title: v.title,
        price: v.price,
        compare_at_price: v.compare_at_price,
        sku: v.sku,
        option1: v.option1,
        option2: v.option2,
        option3: v.option3
      })),
      images: fenceProd.images.map(src => ({ src }))
    }
  };

  const createRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-01/products.json`, {
    method: 'POST',
    headers: {
      'X-Shopify-Access-Token': token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(payload)
  });

  if (createRes.ok) {
    const data = await createRes.json();
    console.log(`✔ SUCCESS! Created product ID: ${data.product.id}`);
    console.log(`  Handle: ${data.product.handle}`);
    console.log(`  Variants: ${data.product.variants.length}`);
    console.log(`  Images: ${data.product.images.length}`);
    console.log(`  Store URL: https://${SHOP_DOMAIN}/products/${data.product.handle}`);
  } else {
    const errText = await createRes.text();
    console.error(`✗ Error creating product: ${errText}`);
  }
}

main();
