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

async function seedProduct() {
  const token = await getAccessToken();
  console.log('Got access token.');

  const raw = JSON.parse(fs.readFileSync('Clone-srefalsteam/data/product.json', 'utf8')).product;
  const existing = await findProductByHandle(token, 'srefalsteam');

  const variant = {
    title: 'Default Title',
    price: '89.99',
    compare_at_price: '149.99',
    sku: 'SREFALSTEAM-PROMO',
    requires_shipping: true,
    inventory_management: null,
    option1: 'Default Title'
  };

  const productPayload = {
    title: raw.title || 'SrefalSteam™',
    handle: 'srefalsteam',
    vendor: raw.vendor || 'Srefal',
    product_type: raw.product_type || 'Steam Cleaner',
    status: 'active',
    tags: raw.tags || 'steam cleaner, srefalsteam, cleaning, home',
    options: [
      {
        name: 'Title',
        values: ['Default Title']
      }
    ],
    variants: [variant],
    images: raw.images.map(img => ({ src: img.src }))
  };

  let product;
  if (existing) {
    console.log(`Product already exists: srefalsteam (ID: ${existing.id}). Updating...`);
    const updateUrl = `https://${SHOP_DOMAIN}/admin/api/2024-10/products/${existing.id}.json`;
    const res = await fetch(updateUrl, {
      method: 'PUT',
      headers: {
        'X-Shopify-Access-Token': token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        product: {
          id: existing.id,
          title: productPayload.title,
          vendor: productPayload.vendor,
          product_type: productPayload.product_type,
          tags: productPayload.tags,
          status: 'active',
          images: productPayload.images
        }
      })
    });
    const data = await res.json();
    product = data.product || existing;
  } else {
    console.log('Creating new product: srefalsteam...');
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
      console.error('Error creating product:', JSON.stringify(data.errors));
      throw new Error('Failed to create srefalsteam');
    }
    product = data.product;
  }

  console.log(`✔ Product successfully seeded!`);
  console.log(`Product ID: ${product.id}`);
  console.log(`Variant ID: ${product.variants[0].id}`);
  console.log(`Variant Title: ${product.variants[0].title}`);
  console.log(`Price: $${product.variants[0].price} (Compare: $${product.variants[0].compare_at_price})`);
  console.log(`Live URL: https://tryzavelyn.com/products/${product.handle}`);

  const summary = {
    productId: product.id,
    variantId: product.variants[0].id,
    handle: product.handle,
    title: product.title,
    price: product.variants[0].price,
    compareAtPrice: product.variants[0].compare_at_price,
    url: `https://tryzavelyn.com/products/${product.handle}`
  };

  fs.writeFileSync('Clone-srefalsteam/data/seeded_product.json', JSON.stringify(summary, null, 2));
}

seedProduct().catch(console.error);
