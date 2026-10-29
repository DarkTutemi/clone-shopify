import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
import { getAccessToken, SHOP } from './batch1_config.mjs';

async function checkProduct() {
  const token = await getAccessToken();

  // 1. Get Live Theme ID
  const themesRes = await fetch(`https://${SHOP}/admin/api/2026-10/themes.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const themesData = await themesRes.json();
  const liveTheme = themesData.themes.find(t => t.role === 'main');
  console.log('Live Theme ID:', liveTheme?.id, 'Name:', liveTheme?.name);

  // 2. Fetch product by handle: livestock-heating-lamp
  const prodRes = await fetch(`https://${SHOP}/admin/api/2026-10/products.json?handle=livestock-heating-lamp`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const prodData = await prodRes.json();
  const product = prodData.products?.[0];
  if (!product) {
    console.error('Product not found!');
    return;
  }

  console.log('\nProduct Details:');
  console.log('  ID:', product.id);
  console.log('  Title:', product.title);
  console.log('  Handle:', product.handle);
  console.log('  Template Suffix:', product.template_suffix);
  console.log('  Status:', product.status);
  console.log('  Variants Count:', product.variants?.length);
  console.log('\nVariants:');
  product.variants?.forEach(v => {
    console.log(`  - ID: ${v.id} | Title: "${v.title}" | Price: $${v.price} | CompareAt: $${v.compare_at_price} | SKU: ${v.sku}`);
  });

  // 3. Check what template file is used
  const templateKey = product.template_suffix ? `templates/product.${product.template_suffix}.json` : 'templates/product.json';
  console.log(`\nChecking template on Live Theme: ${templateKey}...`);
  const tplRes = await fetch(`https://${SHOP}/admin/api/2026-10/themes/${liveTheme.id}/assets.json?asset[key]=${templateKey}`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const tplData = await tplRes.json();
  if (tplData.asset?.value) {
    console.log(`✓ Template ${templateKey} found on Live Theme!`);
    console.log('Template Content:\n', tplData.asset.value);
  } else {
    console.log(`Template ${templateKey} not found:`, tplData);
  }
}

checkProduct().catch(console.error);
