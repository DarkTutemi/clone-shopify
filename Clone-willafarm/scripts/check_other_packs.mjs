const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';
const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || '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';

async function main() {
  const tRes = await fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  const tData = await tRes.json();
  const token = tData.access_token;

  // Fetch some products to see 1-pack, 2-pack, 3-pack or bundle pricing
  const res = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/products.json?limit=20`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const data = await res.json();
  data.products.forEach(p => {
    const packs = p.variants.filter(v => v.title.toLowerCase().includes('pack'));
    if (packs.length > 0) {
      console.log(`Product "${p.title}":`);
      packs.forEach(v => console.log(`   ${v.title} => Price: $${v.price}, CompareAt: $${v.compare_at_price}`));
    }
  });
}

main().catch(console.error);
