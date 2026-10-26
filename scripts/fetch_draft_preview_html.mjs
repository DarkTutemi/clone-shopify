import fs from 'fs';

async function fetchWithPreview(handle) {
  const url = `https://tryzavelyn.com/products/${encodeURIComponent(handle)}?preview_theme_id=187597717689`;
  
  // Step 1: Initial request to get preview cookies
  const res1 = await fetch(url, { redirect: 'manual' });
  const setCookie = res1.headers.get('set-cookie') || '';
  
  // Format cookie string
  const cookies = setCookie.split(',').map(c => c.split(';')[0].trim()).join('; ');
  
  // Step 2: Fetch target URL with preview cookies
  const loc = res1.headers.get('location') || url;
  const res2 = await fetch(loc, {
    headers: {
      'Cookie': cookies + '; _shopify_preview=187597717689'
    }
  });
  const html = await res2.text();
  return html;
}

async function main() {
  const handles = [
    'sakerplus®-universal-diesel-injector-removal-kit-clearance-sale',
    'zavelyn-thermoglove-smart-thermostatic-heated-fingerless-gloves',
    'zavelyn-5-in-1-rotary-cheese-grater-shredder'
  ];

  for (const h of handles) {
    console.log('====================================================');
    console.log(`Checking ${h}...`);
    const html = await fetchWithPreview(h);
    console.log(`Length: ${html.length}`);
    console.log(`zv-value-prop:`, html.includes('zv-value-prop'));
    console.log(`zv-features:`, html.includes('zv-features'));
    console.log(`zv-storytelling:`, html.includes('zv-storytelling'));
    console.log(`zv-how-it-works:`, html.includes('zv-how-it-works'));
    console.log(`zv-specs:`, html.includes('zv-specs'));
    console.log(`zv-comparison:`, html.includes('zv-comparison'));
    console.log(`zv-included:`, html.includes('zv-included'));
    console.log(`zv-extended-faq:`, html.includes('zv-extended-faq'));
  }
}

main().catch(console.error);
