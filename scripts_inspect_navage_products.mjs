const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = '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';
const SHOP = 'dsdujr-vn.myshopify.com';

async function inspectProducts() {
  const tRes = await fetch(`https://${SHOP}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  const token = (await tRes.json()).access_token;

  const handles = ['navage-advanced-nose-cleaner', 'navage-starter-bundle'];
  for (const h of handles) {
    const res = await fetch(`https://${SHOP}/admin/api/2024-10/products.json?handle=${h}`, {
      headers: { 'X-Shopify-Access-Token': token }
    });
    const { products } = await res.json();
    if (products && products.length > 0) {
      const p = products[0];
      console.log('====================================================');
      console.log(`Product: ${p.title} (ID: ${p.id}, handle: ${p.handle})`);
      console.log('Variants:');
      p.variants.forEach(v => console.log(`  - ${v.title} | Price: $${v.price} | CompareAt: $${v.compare_at_price}`));
      console.log('Images:');
      p.images.forEach(img => console.log(`  - [${img.position}] ${img.src}`));
      console.log('Body HTML (first 500 chars):');
      console.log(p.body_html.substring(0, 500));
    } else {
      console.log(`Product with handle "${h}" NOT FOUND!`);
    }
  }
}

inspectProducts().catch(console.error);
