import fs from 'fs';
import path from 'path';

const mediaDir = './nebulizer_media';
if (!fs.existsSync(mediaDir)) {
  fs.mkdirSync(mediaDir, { recursive: true });
}

const assets = [
  { name: 'nebulizer_hero_bogo.webp', url: 'https://www.nroome.com/cdn/shop/files/Nroome_Hero_BOGO.webp?v=1764308733&width=1600' },
  { name: 'nebulizer_kid_using.webp', url: 'https://www.nroome.com/cdn/shop/files/BreatheBuddy3.webp?v=1765431684&width=1600' },
  { name: 'nebulizer_parts_kit.webp', url: 'https://www.nroome.com/cdn/shop/files/Nroome2-Parts.webp?v=1765431684&width=1600' },
  { name: 'nebulizer_case_box.webp', url: 'https://www.nroome.com/cdn/shop/files/Nroome2-Case.webp?v=1765431684&width=1600' },
  { name: 'nebulizer_testimonials_banner.webp', url: 'https://www.nroome.com/cdn/shop/files/Nroome_2_-_Testimonials2.webp?v=1765431684&width=1600' },
  { name: 'nebulizer_dimensions.webp', url: 'https://www.nroome.com/cdn/shop/files/Product_Image_2.webp?v=1764308733&width=1600' },
  { name: 'nebulizer_customer_susan.webp', url: 'https://www.nroome.com/cdn/shop/files/testimonial2.webp?v=1715066517' },
  { name: 'nebulizer_review_1.jpg', url: 'https://www.nroome.com/cdn/shop/files/1740968553__image__huge.jpg?v=1759318780&width=1000' },
  { name: 'nebulizer_review_2.jpg', url: 'https://www.nroome.com/cdn/shop/files/1740925469__img_8722__huge.jpg?v=1759318839&width=1000' },
  { name: 'nebulizer_review_3.jpg', url: 'https://www.nroome.com/cdn/shop/files/1736032603__1000051230__huge.jpg?v=1759318947&width=1000' },
  { name: 'logo_webmd.webp', url: 'https://www.nroome.com/cdn/shop/files/WebMD_logo.webp?v=1715237054' },
  { name: 'logo_womenshealth.webp', url: 'https://www.nroome.com/cdn/shop/files/2560px-Womenshealthlogo_svg.webp?v=1715237278' },
  { name: 'logo_usatoday.png', url: 'https://www.nroome.com/cdn/shop/files/19.01_-_ConversionWise_Ltd_-_DDV_-_82426_-_USA_Today.png?v=1715237107' }
];

async function downloadAll() {
  console.log(`Starting download of ${assets.length} assets...`);
  const downloaded = [];

  for (const item of assets) {
    const dest = path.join(mediaDir, item.name);
    try {
      console.log(`Fetching ${item.name} from ${item.url}...`);
      const res = await fetch(item.url, {
        headers: {
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
          'Referer': 'https://www.nroome.com/'
        }
      });
      if (!res.ok) {
        console.error(`  ❌ Failed: status ${res.status}`);
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

  fs.writeFileSync(path.join(mediaDir, 'downloaded_summary.json'), JSON.stringify(downloaded, null, 2));
  console.log(`\nDownloaded ${downloaded.length}/${assets.length} assets.`);
}

downloadAll().catch(console.error);
