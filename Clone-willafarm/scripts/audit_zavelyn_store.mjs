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

async function fetchAll(token, endpoint) {
  let items = [];
  let url = `https://${SHOP_DOMAIN}/admin/api/2024-10/${endpoint}`;
  while (url) {
    const res = await fetch(url, {
      headers: { 'X-Shopify-Access-Token': token }
    });
    const linkHeader = res.headers.get('link');
    const data = await res.json();
    const key = Object.keys(data)[0];
    if (data[key] && Array.isArray(data[key])) {
      items = items.concat(data[key]);
    }
    // check next page
    if (linkHeader && linkHeader.includes('rel="next"')) {
      const match = linkHeader.match(/<([^>]+)>;\s*rel="next"/);
      url = match ? match[1] : null;
    } else {
      url = null;
    }
  }
  return items;
}

async function main() {
  const token = await getAccessToken();
  console.log('Got access token. Auditing Zavelyn store...');

  // 1. All products
  console.log('Fetching all products...');
  const products = await fetchAll(token, 'products.json?limit=250');
  console.log(`Found ${products.length} products total.`);

  // 2. Collections
  console.log('Fetching custom collections...');
  const customCols = await fetchAll(token, 'custom_collections.json?limit=250');
  console.log('Fetching smart collections...');
  const smartCols = await fetchAll(token, 'smart_collections.json?limit=250');
  const allCollections = [...customCols, ...smartCols];
  console.log(`Found ${allCollections.length} collections total.`);

  // 3. Shop info & policies
  console.log('Fetching shop info...');
  const shopRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/shop.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const shopData = await shopRes.json();

  // 4. Collects (product-to-collection mapping)
  console.log('Fetching collects...');
  const collects = await fetchAll(token, 'collects.json?limit=250');
  console.log(`Found ${collects.length} collection mappings.`);

  // Assemble Product Inventory
  const productInventory = products.map(p => {
    const assignedCols = collects
      .filter(c => c.product_id === p.id)
      .map(c => {
        const col = allCollections.find(col => col.id === c.collection_id);
        return col ? col.title : String(c.collection_id);
      });

    return {
      id: p.id,
      title: p.title,
      handle: p.handle,
      status: p.status,
      vendor: p.vendor,
      product_type: p.product_type,
      tags: p.tags,
      template_suffix: p.template_suffix,
      url: `https://tryzavelyn.com/products/${p.handle}`,
      imagesCount: p.images.length,
      mainImage: p.images[0]?.src || '',
      images: p.images.map(img => img.src),
      options: p.options.map(opt => ({ name: opt.name, values: opt.values })),
      variantsCount: p.variants.length,
      variants: p.variants.map(v => ({
        id: v.id,
        title: v.title,
        price: v.price,
        compare_at_price: v.compare_at_price,
        sku: v.sku,
        available: v.inventory_quantity > 0 || v.inventory_management === null,
        option1: v.option1,
        option2: v.option2,
        option3: v.option3
      })),
      priceRange: {
        min: Math.min(...p.variants.map(v => parseFloat(v.price) || 0)),
        max: Math.max(...p.variants.map(v => parseFloat(v.price) || 0))
      },
      assignedCollections: assignedCols,
      bodyHtmlSnippet: (p.body_html || '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 300)
    };
  });

  const summary = {
    shop: {
      name: shopData.shop?.name,
      domain: shopData.shop?.domain,
      email: shopData.shop?.email,
      currency: shopData.shop?.currency,
      money_format: shopData.shop?.money_format
    },
    totalProducts: products.length,
    activeProducts: products.filter(p => p.status === 'active').length,
    collections: allCollections.map(c => ({
      id: c.id,
      title: c.title,
      handle: c.handle,
      products_count: c.products_count,
      sort_order: c.sort_order,
      rules: c.rules || null
    })),
    productInventory
  };

  fs.writeFileSync('Clone-willafarm/data/zavelyn_catalog_audit.json', JSON.stringify(summary, null, 2));
  console.log('✔ Saved catalog audit to Clone-willafarm/data/zavelyn_catalog_audit.json');

  // Print high-level breakdown
  console.log('\n--- ZAVELYN STORE AUDIT SUMMARY ---');
  console.log(`Shop: ${shopData.shop?.name} (${shopData.shop?.domain})`);
  console.log(`Total Products: ${products.length} (Active: ${summary.activeProducts})`);
  console.log('\nCollections:');
  allCollections.forEach(c => console.log(`  - [${c.id}] ${c.title} (handle: ${c.handle}, products: ${c.products_count || '?'})`));

  console.log('\nActive Products Overview:');
  summary.productInventory.filter(p => p.status === 'active').forEach(p => {
    console.log(`  • "${p.title}" | Type: ${p.product_type || 'N/A'} | Variants: ${p.variantsCount} | Price: $${p.priceRange.min} - $${p.priceRange.max} | Handle: ${p.handle}`);
  });
}

main().catch(console.error);
