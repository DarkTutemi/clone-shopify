import { getAccessToken, SHOP } from './batch1_config.mjs';

async function main() {
  const token = await getAccessToken();
  const res = await fetch(`https://${SHOP}/admin/api/2026-10/products/15474563907769.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const data = await res.json();
  console.log('Total images currently:', data.product.images.length);
  data.product.images.forEach(img => {
    console.log(`ID: ${img.id}, Position: ${img.position}, Width: ${img.width}, Height: ${img.height}, Src: ${img.src}`);
  });
}

main().catch(console.error);
