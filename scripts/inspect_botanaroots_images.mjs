import fs from 'fs';

const data = JSON.parse(fs.readFileSync('scripts/botanaroots_backend_audit.json', 'utf8'));
const images = data.product?.images?.nodes || [];

console.log(`Found ${images.length} images on Shopify for BotanaRoots:`);
images.forEach((img, idx) => {
  console.log(`[${idx + 1}] ID: ${img.id} | ${img.width}x${img.height} | URL: ${img.url}`);
});
