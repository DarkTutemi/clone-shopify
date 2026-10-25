
const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';
const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = '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';

async function main() {
  const tRes = await fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  const tData = await tRes.json();
  const token = tData.access_token;
  
  const pRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/products/15455757336761.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const pData = await pRes.json();
  console.log('Title:', pData.product.title);
  console.log('Images count:', pData.product.images?.length);
  pData.product.images?.forEach((img, i) => console.log(`  [${i}]: ${img.src}`));
  console.log('Variants:');
  pData.product.variants?.forEach(v => console.log(`  Variant ID: ${v.id}, Title: ${v.title}, Price: ${v.price}, CompareAt: ${v.compare_at_price}`));
}
main();
