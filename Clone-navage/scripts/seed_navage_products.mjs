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
  if (!data.access_token) {
    throw new Error('Failed to get access token: ' + JSON.stringify(data));
  }
  return data.access_token;
}

async function findProductByHandle(token, handle) {
  const url = `https://${SHOP_DOMAIN}/admin/api/2024-10/products.json?handle=${handle}`;
  const res = await fetch(url, {
    headers: {
      'X-Shopify-Access-Token': token,
      'Content-Type': 'application/json'
    }
  });
  const data = await res.json();
  return data.products && data.products.length > 0 ? data.products[0] : null;
}

async function createOrUpdateProduct(token, rawProduct) {
  const existing = await findProductByHandle(token, rawProduct.handle);
  
  const productPayload = {
    title: rawProduct.title,
    body_html: rawProduct.body_html,
    vendor: rawProduct.vendor || 'Naväge',
    product_type: rawProduct.product_type || 'Nasal Care',
    handle: rawProduct.handle,
    status: 'active',
    tags: (rawProduct.tags ? rawProduct.tags + ', ' : '') + 'navage, sinusitis, featured, health',
    variants: rawProduct.variants.map(v => ({
      title: v.title || 'Default Title',
      price: v.price || '114.99',
      compare_at_price: v.compare_at_price || null,
      sku: v.sku || `NAV-${rawProduct.handle.toUpperCase()}`,
      requires_shipping: true,
      inventory_management: null
    })),
    images: rawProduct.images.map(img => ({ src: img.src }))
  };

  if (existing) {
    console.log(`Product already exists: ${rawProduct.handle} (ID: ${existing.id}). Updating...`);
    const updateUrl = `https://${SHOP_DOMAIN}/admin/api/2024-10/products/${existing.id}.json`;
    const updatePayload = {
      product: {
        id: existing.id,
        title: productPayload.title,
        body_html: productPayload.body_html,
        status: 'active',
        vendor: productPayload.vendor,
        product_type: productPayload.product_type,
        tags: productPayload.tags
      }
    };
    const res = await fetch(updateUrl, {
      method: 'PUT',
      headers: {
        'X-Shopify-Access-Token': token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(updatePayload)
    });
    const data = await res.json();
    return data.product || existing;
  } else {
    console.log(`Creating new product: ${rawProduct.handle}...`);
    const createUrl = `https://${SHOP_DOMAIN}/admin/api/2024-10/products.json`;
    const res = await fetch(createUrl, {
      method: 'POST',
      headers: {
        'X-Shopify-Access-Token': token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ product: productPayload })
    });
    const data = await res.json();
    if (data.errors) {
      console.error('Create error:', JSON.stringify(data.errors));
      throw new Error(`Failed to create product ${rawProduct.handle}`);
    }
    return data.product;
  }
}

async function run() {
  const token = await getAccessToken();
  console.log('Got access token.');

  const p1Raw = JSON.parse(fs.readFileSync('Clone-navage/data/product1.json', 'utf8')).product;
  const p2Raw = JSON.parse(fs.readFileSync('Clone-navage/data/product2.json', 'utf8')).product;

  console.log('\n--- Seeding Product 1: Naväge Advanced Nose Cleaner ---');
  const prod1 = await createOrUpdateProduct(token, p1Raw);
  console.log(`✔ Product 1 seeded! ID: ${prod1.id}, Variant ID: ${prod1.variants[0].id}`);
  console.log(`  Live URL: https://tryzavelyn.com/products/${prod1.handle}`);

  console.log('\n--- Seeding Product 2: Naväge Starter Bundle ---');
  const prod2 = await createOrUpdateProduct(token, p2Raw);
  console.log(`✔ Product 2 seeded! ID: ${prod2.id}, Variant ID: ${prod2.variants[0].id}`);
  console.log(`  Live URL: https://tryzavelyn.com/products/${prod2.handle}`);

  const outputSummary = {
    product1: {
      id: prod1.id,
      handle: prod1.handle,
      title: prod1.title,
      variantId: prod1.variants[0].id,
      price: prod1.variants[0].price,
      url: `https://tryzavelyn.com/products/${prod1.handle}`
    },
    product2: {
      id: prod2.id,
      handle: prod2.handle,
      title: prod2.title,
      variantId: prod2.variants[0].id,
      price: prod2.variants[0].price,
      url: `https://tryzavelyn.com/products/${prod2.handle}`
    }
  };

  fs.writeFileSync('Clone-navage/data/seeded_products.json', JSON.stringify(outputSummary, null, 2));
  console.log('\nSeeded products summary saved to Clone-navage/data/seeded_products.json');
}

run().catch(console.error);
