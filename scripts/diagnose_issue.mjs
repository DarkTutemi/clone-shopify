import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
import { getAccessToken, SHOP } from './batch1_config.mjs';

async function diagnose() {
  const token = await getAccessToken();

  // 1. Inspect Themes
  const resThemes = await fetch(`https://${SHOP}/admin/api/2026-10/themes.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const dataThemes = await resThemes.json();
  console.log('=== ALL THEMES IN STORE ===');
  for (const t of dataThemes.themes) {
    console.log(`ID: ${t.id} | Name: "${t.name}" | Role: ${t.role} | UpdatedAt: ${t.updated_at}`);
  }

  // 2. Inspect Product 15474869960889
  const resP = await fetch(`https://${SHOP}/admin/api/2026-10/products/15474869960889.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const dataP = await resP.json();
  const p = dataP.product;
  console.log('\n=== PRODUCT 15474869960889 ===');
  console.log('Title:', p.title);
  console.log('Handle:', p.handle);
  console.log('Status:', p.status);
  console.log('Template Suffix:', p.template_suffix);
  console.log('Options:', JSON.stringify(p.options));
  console.log('Images count:', p.images.length);
  p.images.forEach((img, i) => console.log(`  Image ${i+1} (id: ${img.id}): ${img.src}`));
  console.log('Variants:');
  p.variants.forEach(v => console.log(`  Variant ${v.id}: ${v.title} | price: ${v.price} | compare: ${v.compare_at_price} | img_id: ${v.image_id}`));
}

diagnose().catch(console.error);
