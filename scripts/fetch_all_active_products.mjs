import { getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';
import fs from 'fs';

async function fetchAllActiveProducts() {
  const token = await getAccessToken();
  let products = [];
  let url = `https://${SHOP}/admin/api/${API_VERSION}/products.json?limit=250&status=active`;

  while (url) {
    const res = await fetch(url, {
      headers: { 'X-Shopify-Access-Token': token }
    });
    const data = await res.json();
    if (data.products) {
      products.push(...data.products);
    }
    const linkHeader = res.headers.get('link');
    if (linkHeader && linkHeader.includes('rel="next"')) {
      const match = linkHeader.match(/<([^>]+)>;\s*rel="next"/);
      url = match ? match[1] : null;
    } else {
      url = null;
    }
  }

  console.log(`Found ${products.length} active products.`);
  const summary = products.map(p => ({
    id: p.id,
    title: p.title,
    handle: p.handle,
    template_suffix: p.template_suffix,
    variantsCount: p.variants.length,
    variants: p.variants.map(v => ({
      id: v.id,
      title: v.title,
      price: v.price,
      sku: v.sku,
      inventory_policy: v.inventory_policy,
      inventory_management: v.inventory_management,
      inventory_quantity: v.inventory_quantity
    }))
  }));

  fs.writeFileSync('scripts/active_products_list.json', JSON.stringify(summary, null, 2));
  console.log('Saved to scripts/active_products_list.json');
}

fetchAllActiveProducts().catch(console.error);
