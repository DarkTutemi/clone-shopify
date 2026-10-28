import { getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';

const PRODUCT_ID = '15461545935033';

async function main() {
  const token = await getAccessToken();
  const res = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/products/${PRODUCT_ID}.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const data = await res.json();
  const images = data.product.images;
  console.log(`Total product images: ${images.length}`);
  images.forEach((img, idx) => {
    console.log(`[Image ${idx + 1}] ID: ${img.id} | src: ${img.src}`);
  });
}

main().catch(console.error);
