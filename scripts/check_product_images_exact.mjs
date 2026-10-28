import { getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';

async function checkMedia() {
  const token = await getAccessToken();

  for (const prodId of ['15469511213241', '15469512163513', '15461356011705']) {
    const res = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/products/${prodId}/images.json`, {
      headers: { 'X-Shopify-Access-Token': token }
    });
    const data = await res.json();
    console.log(`Product ${prodId} images count:`, data.images?.length);
    console.log(JSON.stringify(data.images, null, 2));
  }
}

checkMedia().catch(console.error);
