import fs from 'fs';
import path from 'path';

const mediaDir = './cozyheat_media';
if (!fs.existsSync(mediaDir)) {
  fs.mkdirSync(mediaDir, { recursive: true });
}

const assets = [
  { name: 'cozyheat_hero_brown.webp', url: 'https://everlittlekid.store/cdn/shop/files/exec-26648f3d-b5ac-403f-8087-84212258f672.webp?v=1791997900&width=1600' },
  { name: 'cozyheat_two_ways.webp', url: 'https://everlittlekid.store/cdn/shop/files/exec-9f21ca2f-2f50-4d45-a6bc-9dbe87a7ee33.webp?v=1791997900&width=1600' },
  { name: 'cozyheat_green.webp', url: 'https://everlittlekid.store/cdn/shop/files/IMG-0064.webp?v=1791997900&width=1600' },
  { name: 'cozyheat_power_moments.webp', url: 'https://everlittlekid.store/cdn/shop/files/exec-892d6cfe-7a6d-4523-967d-6fba0cde5ec1.webp?v=1791997900&width=1600' },
  { name: 'cozyheat_purple.webp', url: 'https://everlittlekid.store/cdn/shop/files/IMG-0063.webp?v=1791997900&width=1600' },
  { name: 'cozyheat_apricot.webp', url: 'https://everlittlekid.store/cdn/shop/files/IMG-0065.webp?v=1791997900&width=1600' },
  { name: 'cozyheat_maple_red.webp', url: 'https://everlittlekid.store/cdn/shop/files/IMG-0066.webp?v=1791997900&width=1600' },
  { name: 'cozyheat_model_standing.webp', url: 'https://everlittlekid.store/cdn/shop/files/IMG-0067.webp?v=1791997900&width=1600' },
  { name: 'cozyheat_lifestyle_travel.webp', url: 'https://everlittlekid.store/cdn/shop/files/exec-61c73085-cd30-45d0-95ad-d8fa83da2539.webp?v=1791997900&width=1600' },
  { name: 'cozyheat_lifestyle_sofa.webp', url: 'https://everlittlekid.store/cdn/shop/files/exec-4ac818e1-963d-4660-a9c8-537baa872359.webp?v=1791997900&width=1600' },
  { name: 'cozyheat_feat_usb.png', url: 'https://everlittlekid.store/cdn/shop/files/pdp-image-5f4c165e.png?v=1791998345&width=1500' },
  { name: 'cozyheat_wear_shawl.png', url: 'https://everlittlekid.store/cdn/shop/files/pdp-before_image-69e70463.png?v=1791998345&width=1500' },
  { name: 'cozyheat_wear_cloak.png', url: 'https://everlittlekid.store/cdn/shop/files/pdp-after_image-6d4fd412.png?v=1791998345&width=1500' },
  { name: 'cozyheat_hotspots_breakdown.png', url: 'https://everlittlekid.store/cdn/shop/files/pdp-image-bae6cdde.png?v=1791998345&width=1000' },
  { name: 'cozyheat_review_train.png', url: 'https://everlittlekid.store/cdn/shop/files/pdp-image-bed327a3.png?v=1791998345&width=1000' },
  { name: 'cozyheat_review_couch.png', url: 'https://everlittlekid.store/cdn/shop/files/pdp-image-f98840a4.png?v=1791998345&width=1000' }
];

async function downloadAll() {
  console.log(`Starting download of ${assets.length} assets...`);
  const downloaded = [];

  for (const item of assets) {
    const dest = path.join(mediaDir, item.name);
    try {
      console.log(`Fetching ${item.name}...`);
      const res = await fetch(item.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Referer': 'https://everlittlekid.store/'
        }
      });
      if (!res.ok) {
        console.error(`  ❌ Failed ${item.name}: status ${res.status}`);
        continue;
      }
      const buffer = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(dest, buffer);
      console.log(`  ✔ Saved ${dest} (${buffer.length} bytes)`);
      downloaded.push({ name: item.name, path: dest, size: buffer.length });
    } catch (e) {
      console.error(`  ❌ Error ${item.name}:`, e.message);
    }
  }

  console.log(`\nDownloaded ${downloaded.length}/${assets.length} assets.`);
}

downloadAll().catch(console.error);
