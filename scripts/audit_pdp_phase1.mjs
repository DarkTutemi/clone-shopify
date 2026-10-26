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

async function main() {
  const token = await getAccessToken();

  console.log('--- 1. AUDITING THEME ASSETS (TEMPLATES & SECTIONS) ---');
  const assetsRes = await fetch(`https://${SHOP}/admin/api/2024-10/themes/${DRAFT_THEME_ID}/assets.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const assetsData = await assetsRes.json();
  const allAssets = assetsData.assets.map(a => a.key);

  const productTemplates = allAssets.filter(k => k.startsWith('templates/product'));
  const productSections = allAssets.filter(k => k.includes('product') && k.startsWith('sections/'));
  const productSnippets = allAssets.filter(k => k.includes('product') || k.includes('price') || k.includes('variant') || k.includes('buy') || k.includes('quantity') || k.includes('cart'));
  
  console.log('Product Templates:', productTemplates);
  console.log('Product Sections:', productSections);
  console.log('Cart & Product Snippets count:', productSnippets.length);

  // Inspect templates/product.json or main product template
  for (const pt of productTemplates) {
    const ptRes = await fetch(`https://${SHOP}/admin/api/2024-10/themes/${DRAFT_THEME_ID}/assets.json?asset[key]=${pt}`, {
      headers: { 'X-Shopify-Access-Token': token }
    });
    const ptData = await ptRes.json();
    console.log(`\n=== Asset: ${pt} ===`);
    try {
      const parsed = JSON.parse(ptData.asset.value);
      console.log('Sections in template:', Object.keys(parsed.sections));
      console.log('Section types:', Object.entries(parsed.sections).map(([k, v]) => `${k} -> ${v.type}`));
    } catch (e) {
      console.log('Could not parse JSON or it is Liquid:', ptData.asset.value.substring(0, 300));
    }
  }

  // Check main-product.liquid content structure
  const mainProdKey = productSections.find(s => s === 'sections/main-product.liquid' || s === 'sections/product.liquid') || productSections[0];
  if (mainProdKey) {
    const sRes = await fetch(`https://${SHOP}/admin/api/2024-10/themes/${DRAFT_THEME_ID}/assets.json?asset[key]=${mainProdKey}`, {
      headers: { 'X-Shopify-Access-Token': token }
    });
    const sData = await sRes.json();
    fs.writeFileSync('scripts/draft_main_product.liquid', sData.asset.value, 'utf-8');
    console.log(`\nSaved ${mainProdKey} to scripts/draft_main_product.liquid (${sData.asset.value.length} bytes)`);
  }

  // Check cart-drawer.liquid or cart assets
  const cartAssets = allAssets.filter(k => k.includes('cart'));
  console.log('\nCart related assets:', cartAssets);

  console.log('\n--- 2. AUDITING PRODUCTS & TEMPLATE SUFFIXES ---');
  let products = [];
  let pageInfo = null;
  // Fetch up to 100 products to see template_suffix distribution
  const pRes = await fetch(`https://${SHOP}/admin/api/2024-10/products.json?limit=100&fields=id,title,handle,template_suffix,variants,options,tags`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const pData = await pRes.json();
  products = pData.products;
  console.log(`Audited ${products.length} products.`);

  const templateSuffixes = {};
  for (const p of products) {
    const s = p.template_suffix || 'default (product.json)';
    templateSuffixes[s] = (templateSuffixes[s] || 0) + 1;
  }
  console.log('Template Suffix Distribution:', templateSuffixes);

  // Check Diesel Injector Removal Kit specifically
  const diesel = products.find(p => p.handle.includes('diesel-injector') || p.title.toLowerCase().includes('diesel injector'));
  if (diesel) {
    console.log('\n=== Diesel Injector Removal Kit Audit ===');
    console.log('ID:', diesel.id);
    console.log('Title:', diesel.title);
    console.log('Handle:', diesel.handle);
    console.log('Template Suffix:', diesel.template_suffix);
    console.log('Options:', diesel.options);
    console.log('Variants count:', diesel.variants.length);
    console.log('Variants sample:', diesel.variants.map(v => ({ id: v.id, title: v.title, price: v.price, compare_at_price: v.compare_at_price, available: v.available })));

    // Fetch metafields for Diesel Injector
    const mfRes = await fetch(`https://${SHOP}/admin/api/2024-10/products/${diesel.id}/metafields.json`, {
      headers: { 'X-Shopify-Access-Token': token }
    });
    const mfData = await mfRes.json();
    console.log('Diesel Product Metafields count:', mfData.metafields ? mfData.metafields.length : 0);
    console.log('Diesel Metafields:', mfData.metafields);
  } else {
    console.log('Diesel Injector Removal Kit not found in first 100 products, will search.');
  }

  // Check ThermoGlove as well (flagship product)
  const glove = products.find(p => p.handle.includes('thermoglove') || p.title.toLowerCase().includes('thermoglove'));
  if (glove) {
    console.log('\n=== ThermoGlove Audit ===');
    console.log('ID:', glove.id);
    console.log('Title:', glove.title);
    console.log('Template Suffix:', glove.template_suffix);
    console.log('Options:', glove.options);
    console.log('Variants count:', glove.variants.length);
    console.log('Variants sample:', glove.variants.map(v => ({ id: v.id, title: v.title, price: v.price, compare_at_price: v.compare_at_price })));
  }

  // Check Enabled Payment Types on Shop
  const shopRes = await fetch(`https://${SHOP}/admin/api/2024-10/shop.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const sData = await shopRes.json();
  console.log('\nShop currency:', sData.shop.currency);
  console.log('Shop enabled_presentment_currencies:', sData.shop.enabled_presentment_currencies);

  // Check installed apps or script tags / theme apps
  console.log('\n--- 3. CHECKING INSTALLED APPS / SCRIPT TAGS ---');
  const stRes = await fetch(`https://${SHOP}/admin/api/2024-10/script_tags.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const stData = await stRes.json();
  console.log('Script Tags:', stData.script_tags);
}

main().catch(console.error);
