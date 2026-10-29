import fs from 'fs';
import { getAccessToken, SHOP } from './batch1_config.mjs';

async function main() {
  const token = await getAccessToken();

  const imgPath = './backups/denture_new_images/img_featured.jpg';
  const fileBuffer = fs.readFileSync(imgPath);
  const base64Data = fileBuffer.toString('base64');

  console.log('Adding new featured image to product 15474563907769 at position 1...');

  const res = await fetch(`https://${SHOP}/admin/api/2026-10/products/15474563907769/images.json`, {
    method: 'POST',
    headers: {
      'X-Shopify-Access-Token': token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      image: {
        position: 1,
        attachment: base64Data,
        filename: 'zavelyn-custom-fit-dentures-featured.jpg'
      }
    })
  });

  const data = await res.json();
  if (data.errors) {
    console.error('Error adding image:', JSON.stringify(data.errors));
    return;
  }

  console.log('Successfully created image ID:', data.image.id, 'Position:', data.image.position, 'Src:', data.image.src);

  // Now verify all product images
  const verifyRes = await fetch(`https://${SHOP}/admin/api/2026-10/products/15474563907769.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const verifyData = await verifyRes.json();
  console.log('New total images count:', verifyData.product.images.length);
  verifyData.product.images.forEach(img => {
    console.log(`Pos: ${img.position} | ID: ${img.id} | Src: ${img.src}`);
  });
}

main().catch(console.error);
