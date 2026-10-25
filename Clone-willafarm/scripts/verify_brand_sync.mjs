import fs from 'fs';

const domain = 'dsdujr-vn.myshopify.com';
const id = '172e9e29abd0fe12f671d8441479c7c2';
const sec = process.env.SHOPIFY_API_SECRET || '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';

async function getAccessToken() {
  const tRes = await fetch(`https://${domain}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: id, client_secret: sec, grant_type: 'client_credentials' })
  });
  const { access_token } = await tRes.json();
  return access_token;
}

async function verifyStorefront() {
  console.log('--- Checking Storefront tryzavelyn.com ---');
  const res = await fetch('https://tryzavelyn.com/', {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
  });
  const html = await res.text();

  const titleMatch = html.match(/<title>([^<]+)<\/title>/i);
  const title = titleMatch ? titleMatch[1].trim() : 'NOT FOUND';
  console.log(`Homepage <title>: "${title}"`);

  const hasZavelynInTitle = title.includes('Zavelyn®');
  const hasOldBrandInTitle = /saker/i.test(title);
  console.log(`  - Title contains Zavelyn®: ${hasZavelynInTitle ? '✔ PASS' : '✗ FAIL'}`);
  console.log(`  - Title free of Saker: ${!hasOldBrandInTitle ? '✔ PASS' : '✗ FAIL'}`);

  const hasHeaderLogo = html.includes('ZAVELYN<sup class="willa-reg">®</sup>');
  console.log(`  - Header logo has ZAVELYN®: ${hasHeaderLogo ? '✔ PASS' : '✗ FAIL'}`);

  const hasHeroBadge = html.includes('ZAVELYN® COLLECTION');
  console.log(`  - Hero badge has Zavelyn®: ${hasHeroBadge ? '✔ PASS' : '✗ FAIL'}`);

  const hasFeaturedProduct = html.includes('Zavelyn® Intelligent Livestock Heating Lamp');
  console.log(`  - Featured offer has Zavelyn®: ${hasFeaturedProduct ? '✔ PASS' : '✗ FAIL'}`);

  const hasFooterLogo = html.includes('Zavelyn® Inc.');
  console.log(`  - Footer copyright has Zavelyn® Inc.: ${hasFooterLogo ? '✔ PASS' : '✗ FAIL'}`);
}

async function verifyCatalog() {
  console.log('\n--- Checking Catalog via Admin API ---');
  const token = await getAccessToken();

  let products = [];
  let url = `https://${domain}/admin/api/2024-10/products.json?limit=250`;
  while (url) {
    const res = await fetch(url, { headers: { 'X-Shopify-Access-Token': token } });
    const data = await res.json();
    products = products.concat(data.products || []);
    const link = res.headers.get('link');
    if (link && link.includes('rel="next"')) {
      const match = link.match(/<([^>]+)>;\s*rel="next"/);
      url = match ? match[1] : null;
    } else {
      url = null;
    }
  }

  console.log(`Total Products: ${products.length}`);
  const nonZavelynTitles = products.filter(p => !p.title.startsWith('Zavelyn®'));
  const competitorMentionsInTitle = products.filter(p => /saker|navage|naväge|thoson|yeoman|srefal/i.test(p.title));
  const nonZavelynVendors = products.filter(p => p.vendor !== 'Zavelyn®');

  console.log(`  - Products starting with Zavelyn®: ${products.length - nonZavelynTitles.length} / ${products.length}`);
  console.log(`  - Titles with competitor names: ${competitorMentionsInTitle.length} (Expected: 0)`);
  console.log(`  - Products with vendor == Zavelyn®: ${products.length - nonZavelynVendors.length} / ${products.length}`);

  if (competitorMentionsInTitle.length > 0) {
    console.log('\nWarning: Remaining titles with competitor names:');
    competitorMentionsInTitle.forEach(p => console.log(`  - [${p.id}] ${p.title}`));
  }

  if (nonZavelynVendors.length > 0) {
    console.log('\nWarning: Non-Zavelyn vendors:');
    nonZavelynVendors.forEach(p => console.log(`  - [${p.id}] vendor: ${p.vendor}`));
  }
}

async function main() {
  await verifyStorefront();
  await verifyCatalog();
}

main().catch(console.error);
