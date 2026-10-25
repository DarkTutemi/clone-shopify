const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = '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';
const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';

async function getFence() {
  const tokenRes = await fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  const { access_token } = await tokenRes.json();
  const res = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/products.json?handle=sakerplus-fence-post-repair-kit`, {
    headers: { 'X-Shopify-Access-Token': access_token }
  });
  const data = await res.json();
  console.log('Fence product:', {
    id: data.products[0]?.id,
    handle: data.products[0]?.handle,
    template_suffix: data.products[0]?.template_suffix,
    variants: data.products[0]?.variants.map(v => ({ id: v.id, title: v.title, price: v.price, compare: v.compare_at_price, policy: v.inventory_policy }))
  });
}
getFence().catch(console.error);
