const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = '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';
const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';

async function check() {
  const tokenRes = await fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  const { access_token } = await tokenRes.json();

  const res = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/products.json?limit=250&fields=id,title,handle`, {
    headers: { 'X-Shopify-Access-Token': access_token }
  });
  const data = await res.json();
  const blowers = data.products.filter(p => p.title.toLowerCase().includes('blower') || p.handle.includes('blower'));
  console.log('Matching blower products:', blowers);
}
check().catch(console.error);
