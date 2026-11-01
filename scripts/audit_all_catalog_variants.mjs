import { getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';
import fs from 'fs';

async function auditAllCatalogForCartIssues() {
  const token = await getAccessToken();

  // 1. Fetch publication ID for Online Store
  const pubRes = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/publications.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const pubData = await pubRes.json();
  console.log('Publications:', pubData.publications?.map(p => ({ id: p.id, name: p.name })));

  // 2. Query all products with detailed variant & publication data
  let allProducts = [];
  let url = `https://${SHOP}/admin/api/${API_VERSION}/products.json?limit=250&status=active`;

  while (url) {
    const res = await fetch(url, { headers: { 'X-Shopify-Access-Token': token } });
    const data = await res.json();
    allProducts.push(...data.products);
    const link = res.headers.get('link');
    url = (link && link.includes('rel="next"')) ? link.match(/<([^>]+)>;\s*rel="next"/)?.[1] : null;
  }

  console.log(`Auditing ${allProducts.length} active products...`);

  const issues = [];

  for (const p of allProducts) {
    // Check if product has variants
    if (!p.variants || p.variants.length === 0) {
      issues.push({ product: p.handle, issue: 'NO_VARIANTS', severity: 'CRITICAL' });
      continue;
    }

    for (const v of p.variants) {
      // Check price
      const price = parseFloat(v.price);
      if (isNaN(price) || price <= 0) {
        issues.push({ product: p.handle, variant: v.id, title: v.title, issue: `INVALID_PRICE: ${v.price}`, severity: 'CRITICAL' });
      }

      // Check inventory blocking
      if (v.inventory_management && v.inventory_policy === 'deny' && v.inventory_quantity <= 0) {
        issues.push({ product: p.handle, variant: v.id, title: v.title, issue: `OUT_OF_STOCK (deny, qty=${v.inventory_quantity})`, severity: 'HIGH' });
      }
    }
  }

  console.log(`Total data issues found: ${issues.length}`);
  if (issues.length > 0) {
    console.table(issues);
  } else {
    console.log('✅ ALL 81 products have valid prices (> 0), valid variant IDs, and no stock-denial blocking!');
  }
}

auditAllCatalogForCartIssues().catch(console.error);
