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

  const raw = JSON.parse(fs.readFileSync('Clone-thoson/data/product.json', 'utf8')).product;
  const existing = await findProductByHandle(token, 'thoson-magtrack');

  const variants = [
    {
      title: 'Rookie',
      price: '69.00',
      compare_at_price: '139.00',
      sku: 'MAGTRACK-32',
      requires_shipping: true,
      inventory_management: null,
      option1: 'Rookie'
    },
    {
      title: 'PRO',
      price: '119.00',
      compare_at_price: '169.00',
      sku: 'MAGTRACK-68',
      requires_shipping: true,
      inventory_management: null,
      option1: 'PRO'
    },
    {
      title: 'Master',
      price: '159.00',
      compare_at_price: '299.00',
      sku: 'MAGTRACK-141',
      requires_shipping: true,
      inventory_management: null,
      option1: 'Master'
    }
  ];

  const productPayload = {
    title: raw.title || 'Thoson MagTrack™',
    handle: 'thoson-magtrack',
    vendor: raw.vendor || 'Thoson',
    product_type: raw.product_type || 'Magnetic Train Track Set',
    status: 'active',
    body_html: raw.body_html || '',
    tags: raw.tags || 'age:3-5, age:5+, cat:building, cat:stem, season:bfcm, season:fall, season:gifts, season:holiday, season:winter',
    options: [
      {
        name: 'Version',
        values: ['Rookie', 'PRO', 'Master']
      }
    ],
    variants: variants,
    images: raw.images.map(img => ({ src: img.src }))
  };

  let product;
  if (existing) {
    console.log(`Product already exists: thoson-magtrack (ID: ${existing.id}). Updating...`);
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
          body_html: productPayload.body_html,
          status: 'active'
        }
      })
    });
    const data = await res.json();
    product = data.product || existing;
  } else {
    console.log('Creating new product: thoson-magtrack...');
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
      throw new Error('Failed to create thoson-magtrack');
    }
    product = data.product;
  }

  console.log(`✔ Product successfully seeded!`);
  console.log(`Product ID: ${product.id}`);
  console.log(`Variants count: ${product.variants.length}`);
  product.variants.forEach(v => {
    console.log(`  - Variant: ${v.title} | ID: ${v.id} | Price: $${v.price} (Compare: $${v.compare_at_price})`);
  });
  console.log(`Live URL: https://tryzavelyn.com/products/${product.handle}`);

  const summary = {
    productId: product.id,
    handle: product.handle,
    title: product.title,
    url: `https://tryzavelyn.com/products/${product.handle}`,
    variants: product.variants.map(v => ({
      id: v.id,
      title: v.title,
      price: v.price,
      compareAtPrice: v.compare_at_price,
      sku: v.sku
    }))
  };

  fs.writeFileSync('Clone-thoson/data/seeded_product.json', JSON.stringify(summary, null, 2));
}

seedProduct().catch(console.error);
