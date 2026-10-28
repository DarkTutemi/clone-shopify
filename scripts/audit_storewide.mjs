import fs from 'fs';

const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = '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';
const SHOP = 'dsdujr-vn.myshopify.com';
const DRAFT_THEME_ID = '187597717689';

async function getAccessToken() {
  const tRes = await fetch(`https://${SHOP}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  const data = await tRes.json();
  return data.access_token;
}

async function auditStore() {
  console.log("=== 1. FETCHING ACCESS TOKEN ===");
  const token = await getAccessToken();

  console.log("=== 2. FETCHING ALL PRODUCTS ===");
  let allProducts = [];
  let sinceId = 0;
  while (true) {
    const res = await fetch(`https://${SHOP}/admin/api/2024-10/products.json?limit=250&since_id=${sinceId}`, {
      headers: { 'X-Shopify-Access-Token': token }
    });
    const data = await res.json();
    if (!data.products || data.products.length === 0) break;
    allProducts.push(...data.products);
    sinceId = data.products[data.products.length - 1].id;
    if (data.products.length < 250) break;
  }
  console.log(`Total products fetched: ${allProducts.length}`);

  // Save products summary
  const productSummary = allProducts.map(p => ({
    id: p.id,
    title: p.title,
    handle: p.handle,
    status: p.status,
    template_suffix: p.template_suffix,
    variants_count: p.variants.length,
    images_count: p.images.length,
    tags: p.tags,
    vendor: p.vendor,
    product_type: p.product_type,
    has_body_html: !!p.body_html && p.body_html.trim().length > 0,
    body_html_length: p.body_html ? p.body_html.length : 0,
    price_min: Math.min(...p.variants.map(v => parseFloat(v.price) || 0)),
    price_max: Math.max(...p.variants.map(v => parseFloat(v.price) || 0))
  }));

  fs.writeFileSync('scripts/audit_products_summary.json', JSON.stringify(productSummary, null, 2));
  console.log("Saved audit_products_summary.json");

  console.log("=== 3. FETCHING ALL ASSETS FROM DRAFT THEME ===");
  const assetsRes = await fetch(`https://${SHOP}/admin/api/2024-10/themes/${DRAFT_THEME_ID}/assets.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const assetsData = await assetsRes.json();
  const allAssets = assetsData.assets;
  console.log(`Total theme assets: ${allAssets.length}`);

  fs.writeFileSync('scripts/audit_theme_assets.json', JSON.stringify(allAssets, null, 2));

  // Categorize templates
  const templates = allAssets.filter(a => a.key.startsWith('templates/'));
  const sections = allAssets.filter(a => a.key.startsWith('sections/'));
  const snippets = allAssets.filter(a => a.key.startsWith('snippets/'));
  const locales = allAssets.filter(a => a.key.startsWith('locales/'));

  console.log(`Templates: ${templates.length}, Sections: ${sections.length}, Snippets: ${snippets.length}`);

  console.log("\nTemplates list:");
  templates.forEach(t => console.log(`  - ${t.key}`));

  console.log("\n=== 4. ANALYZING TEMPLATES ON DRAFT THEME ===");
  const templateContents = {};
  for (const t of templates) {
    if (t.key.endsWith('.json') || t.key.endsWith('.liquid')) {
      const res = await fetch(`https://${SHOP}/admin/api/2024-10/themes/${DRAFT_THEME_ID}/assets.json?asset[key]=${t.key}`, {
        headers: { 'X-Shopify-Access-Token': token }
      });
      const data = await res.json();
      if (data.asset && data.asset.value) {
        templateContents[t.key] = data.asset.value;
      }
    }
  }

  fs.writeFileSync('scripts/audit_templates_content.json', JSON.stringify(templateContents, null, 2));
  console.log("Saved audit_templates_content.json");
}

auditStore().catch(console.error);
