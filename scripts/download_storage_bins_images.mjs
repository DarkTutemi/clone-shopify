import fs from 'fs';
import path from 'path';

const dir = './backups/storage_bins_scraped_images';
fs.mkdirSync(dir, { recursive: true });

async function downloadImages() {
  const url = 'https://mytrendyes.com/products/large-foldable-zippered-storage-bin-with-handles-for-quilts-and-bedding.js';
  const res = await fetch(url);
  const data = await res.json();
  console.log(`Downloading ${data.images.length} images...`);
  for (let i = 0; i < data.images.length; i++) {
    const rawUrl = data.images[i].startsWith('//') ? 'https:' + data.images[i] : data.images[i];
    const cleanUrl = rawUrl.split('?')[0];
    const ext = path.extname(cleanUrl) || '.png';
    const filePath = path.join(dir, `bin_img_${i + 1}${ext}`);
    try {
      const imgRes = await fetch(rawUrl);
      if (imgRes.ok) {
        const buf = Buffer.from(await imgRes.arrayBuffer());
        fs.writeFileSync(filePath, buf);
        console.log(`Saved [${i + 1}] ${filePath} (${buf.length} bytes)`);
      }
    } catch (e) {
      console.error(`Error downloading image ${i + 1}: ${e.message}`);
    }
  }
}
downloadImages();
