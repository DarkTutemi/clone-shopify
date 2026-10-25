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

  // Search product with handle livestock-heating-lamp
  const res1 = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/products.json?handle=livestock-heating-lamp`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const data1 = await res1.json();
  console.log('Product handle livestock-heating-lamp count:', data1.products?.length);
  if (data1.products?.length > 0) {
    console.log('ID:', data1.products[0].id, 'Template:', data1.products[0].template_suffix);
  }

  const res2 = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/products.json?handle=sakerplus-livestock-heating-lamp`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const data2 = await res2.json();
  console.log('Product handle sakerplus-livestock-heating-lamp count:', data2.products?.length);
  if (data2.products?.length > 0) {
    console.log('ID:', data2.products[0].id, 'Template:', data2.products[0].template_suffix);
  }
}

main().catch(console.error);
