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

const rawCatalog = JSON.parse(fs.readFileSync('h:/Shopify-Clone/Clone-earthlyderm/data/catalog_harvested.json', 'utf8'));

async function seedProducts() {
  const token = await getAccessToken();
  console.log('Seeding Earthly Derm products to Shopify...');

  const createdMap = {};

  for (const p of rawCatalog) {
    console.log(`\nCreating product: ${p.title} (${p.handle})...`);

    const payload = {
      product: {
        title: p.title,
        handle: p.handle,
        body_html: p.bodyHtml,
        vendor: 'Earthly Derm',
        product_type: p.productType,
        tags: ['Earthly Derm', p.category, 'Skincare', 'Organic Soap'].join(', '),
        options: [
          { name: 'Quantity' }
        ],
        variants: p.variants.map((v, idx) => ({
          option1: v.option1 || v.title,
          price: v.price,
          compare_at_price: v.compare_at_price || null,
          sku: v.sku || `${p.handle}-${idx + 1}`,
          requires_shipping: true,
          position: idx + 1
        })),
        images: p.images.map((img, idx) => ({
          src: img.src,
          alt: img.alt || p.title,
          position: idx + 1
        }))
      }
    };

    const res = await fetch(`https://${SHOP_DOMAIN}/admin/api/2026-01/products.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': token
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (data.product) {
      console.log(`  ✔ Successfully created: ${data.product.id} - ${data.product.handle}`);
      createdMap[p.handle] = {
        id: data.product.id,
        graphqlId: `gid://shopify/Product/${data.product.id}`,
        title: data.product.title,
        handle: data.product.handle,
        variants: data.product.variants.map(v => ({ id: v.id, title: v.title, price: v.price }))
      };
    } else {
      console.error(`  ❌ Failed to create product ${p.handle}:`, JSON.stringify(data));
    }
    // rate limit delay
    await new Promise(r => setTimeout(r, 1000));
  }

  fs.writeFileSync('h:/Shopify-Clone/Clone-earthlyderm/data/created_products.json', JSON.stringify(createdMap, null, 2), 'utf8');
  console.log('\n✔ Saved created products map to data/created_products.json');
}

seedProducts().catch(console.error);
