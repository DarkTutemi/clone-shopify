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

async function main() {
  const token = await getAccessToken();
  console.log('Got access token. Fetching all products...');

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

  console.log(`Total products fetched: ${products.length}`);
  const brandAudit = products.map(p => ({
    id: p.id,
    handle: p.handle,
    title: p.title,
    vendor: p.vendor
  }));

  fs.writeFileSync('Clone-willafarm/scripts/products_brand_audit.json', JSON.stringify(brandAudit, null, 2));
  console.log('Saved products_brand_audit.json');

  // Find products that have other brand names or lack Zavelyn®
  const sakerprods = products.filter(p => /saker|navage|thoson|yeoman|srefal/i.test(p.title) || !p.title.includes('Zavelyn'));
  console.log(`\nFound ${sakerprods.length} products needing title update:`);
  sakerprods.forEach(p => console.log(`  - [${p.id}] "${p.title}"`));
}

main().catch(console.error);
