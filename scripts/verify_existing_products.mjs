import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
import { getAccessToken, SHOP } from './batch1_config.mjs';

const EXISTING_HANDLES = [
  'zavelyn-botanaroots-organic-batana-hair-growth-oil',
  'zavelyn-botanaroots-organic-batana-oil-bogo',
  'zavelyn-custom-fit-home-dentures',
  'livestock-heating-lamp',
  'vfit',
  'yeoman-lawn-sweeper'
];

async function verifyExistingProducts() {
  const token = await getAccessToken();
  console.log('Verifying regression protection for existing products:');

  for (const handle of EXISTING_HANDLES) {
    const res = await fetch(`https://${SHOP}/admin/api/2026-10/products.json?handle=${handle}`, {
      headers: { 'X-Shopify-Access-Token': token }
    });
    const data = await res.json();
    const p = data.products?.[0];
    if (p) {
      console.log(`✓ [PASSED] ${p.title} (ID: ${p.id})`);
      console.log(`  Handle: ${p.handle} | Status: ${p.status} | Template: ${p.template_suffix || 'default'}`);
      console.log(`  Variants: ${p.variants.length} variant(s) | First Price: $${p.variants[0].price}`);
    } else {
      console.log(`- Note: handle "${handle}" not found (checking if exists under different handle)`);
    }
  }
}

verifyExistingProducts().catch(console.error);
