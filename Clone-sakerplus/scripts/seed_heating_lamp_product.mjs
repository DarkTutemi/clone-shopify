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

  const handle = 'sakerplus-livestock-heating-lamp';
  const existing = await findProductByHandle(token, handle);

  const variants = [
    {
      title: '1 Pack (Light + US Switch Cord)',
      price: '49.99',
      compare_at_price: '99.99',
      sku: 'PT131318-1PACK',
      requires_shipping: true,
      inventory_management: null,
      option1: '1 Pack'
    },
    {
      title: '2 Pack (Light + US Switch Cord)',
      price: '89.99',
      compare_at_price: '179.99',
      sku: 'PT131318-2PACK',
      requires_shipping: true,
      inventory_management: null,
      option1: '2 Pack'
    }
  ];

  const images = [
    { src: 'https://cdn.myshopage.com/54872b77-422f-45a5-7cfb-756212792b00.jpg' },
    { src: 'https://cdn.myshopage.com/4574c936-7435-4b05-2934-ed1e12887e00.png' },
    { src: 'https://cdn.myshopage.com/898406ff-0448-41a5-2440-fd49b2375e00/w1000.jpg' },
    { src: 'https://cdn.myshopage.com/8f765e2e-fcbd-4199-ab9b-433d4da5c000.jpg' },
    { src: 'https://cdn.myshopage.com/27c967b2-512d-43ee-b366-7568d2a3a700/w500.jpg' }
  ];

  const bodyHtml = `
<p><strong>Intelligent Auto-Regulating Livestock Heating Lamp</strong></p>
<p>Keep your chickens, chicks, ducks, and small livestock comfortably warm without dangerous fire hazards or harsh red glare.</p>
<ul>
  <li><strong>Digital Temperature Setting:</strong> Precision LED display from 28°C to 35°C (82°F–95°F).</li>
  <li><strong>Automatic Heat Regulation:</strong> Automatically turns off when target temperature is reached and resumes when temps dip.</li>
  <li><strong>100% Safe & Fireproof:</strong> Sealed fireproof polymer shell with no exposed filaments or shattered glass.</li>
  <li><strong>Even Warm Air Convection:</strong> Eliminates hot spots and cold corners.</li>
  <li><strong>Standard E27/E26 Base:</strong> Easy screw-in installation with included US standard switch cord.</li>
</ul>
`;

  const productPayload = {
    title: 'Sakerplus® Livestock Heating Lamp',
    handle: handle,
    vendor: 'Sakerplus',
    product_type: 'Livestock Heating Lamp',
    status: 'active',
    body_html: bodyHtml,
    tags: 'livestock, heating lamp, brooder, farm, chicken coop, heat lamp, pet care',
    options: [
      {
        name: 'Package',
        values: ['1 Pack', '2 Pack']
      }
    ],
    variants: variants,
    images: images
  };

  let product;
  if (existing) {
    console.log(`Product already exists: ${handle} (ID: ${existing.id}). Updating...`);
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
    console.log(`Creating product: ${handle}...`);
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
      throw new Error(`Failed to create product ${handle}`);
    }
    product = data.product;
  }

  console.log(`✔ Product successfully seeded!`);
  console.log(`Product ID: ${product.id}`);
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

  fs.writeFileSync('Clone-sakerplus/data/heating_lamp/seeded_product.json', JSON.stringify(summary, null, 2));
}

seedProduct().catch(console.error);
