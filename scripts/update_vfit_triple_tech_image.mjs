import fs from 'fs';
import path from 'path';
import { getAccessToken, SHOP } from './batch1_config.mjs';
import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');

const NEW_IMAGE_URL = 'https://cdn.shopify.com/s/files/1/0826/2483/9865/files/joylux_triple_tech.png?v=1793206025';

async function main() {
  console.log('=== UPDATING TRIPLE ACTION SECTION IMAGE ON VFIT PDP ===');
  const token = await getAccessToken();

  // 1. Fetch current vFit product
  const prodRes = await fetch(`https://${SHOP}/admin/api/2024-01/products.json?handle=zavelyn-vfit-red-light-intimate-wellness-device`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const prodData = await prodRes.json();
  const product = prodData.products[0];

  // Backup current body_html
  const backupDir = path.join(process.cwd(), 'backups', `vfit_pre_image_swap_${Date.now()}`);
  fs.mkdirSync(backupDir, { recursive: true });
  fs.writeFileSync(path.join(backupDir, 'vfit_body_html_pre_swap.html'), product.body_html, 'utf8');
  console.log(`✓ Backed up original body_html to ${backupDir}`);

  let currentHtml = product.body_html;

  // Locate the section "How the Zavelyn vFit™ Triple Action Works"
  const sectionMarker = 'How the Zavelyn vFit™ Triple Action Works';
  const secIdx = currentHtml.indexOf(sectionMarker);
  if (secIdx === -1) {
    throw new Error('Section marker "How the Zavelyn vFit™ Triple Action Works" not found in body_html');
  }

  // Find the <img src="..." in this section
  const imgStart = currentHtml.indexOf('<img', secIdx);
  const imgEnd = currentHtml.indexOf('>', imgStart);
  if (imgStart === -1 || imgEnd === -1) {
    throw new Error('Could not find <img> tag after section marker');
  }

  const oldImgTag = currentHtml.substring(imgStart, imgEnd + 1);
  console.log('Found current image tag:', oldImgTag);

  // Replace src attribute with the new image URL
  const updatedImgTag = oldImgTag.replace(/src=["'][^"']+["']/, `src="${NEW_IMAGE_URL}"`);
  console.log('Updated image tag:', updatedImgTag);

  const updatedBodyHtml = currentHtml.substring(0, imgStart) + updatedImgTag + currentHtml.substring(imgEnd + 1);

  // 2. Update product on Shopify Admin
  console.log('\nSending update to Shopify Admin...');
  const updateRes = await fetch(`https://${SHOP}/admin/api/2024-01/products/${product.id}.json`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
    body: JSON.stringify({
      product: {
        id: product.id,
        body_html: updatedBodyHtml
      }
    })
  });

  const updateData = await updateRes.json();
  if (!updateRes.ok || !updateData.product) {
    throw new Error('Failed to update product: ' + JSON.stringify(updateData));
  }
  console.log('✓ Successfully updated vFit product body_html with new image on Shopify Admin!');

  // Save local copy
  fs.writeFileSync('draft_working/vfit_body_html_updated_image.html', updatedBodyHtml, 'utf8');
}

main().catch(err => {
  console.error('Fatal error:', err);
  process.exit(1);
});
