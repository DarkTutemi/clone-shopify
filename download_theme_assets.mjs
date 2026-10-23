import fs from 'fs';
import path from 'path';

const ASSETS_DIR = 'h:/Shopify-Clone/Clone-earthlyderm/assets';
if (!fs.existsSync(ASSETS_DIR)) {
  fs.mkdirSync(ASSETS_DIR, { recursive: true });
}

const assets = [
  'https://earthlyderm.com/cdn/shop/t/18/assets/theme.css',
  'https://earthlyderm.com/cdn/shop/t/18/assets/accordion-style-2.css',
  'https://earthlyderm.com/cdn/shop/t/18/assets/section-what-to-expect.css',
  'https://earthlyderm.com/cdn/shop/t/18/assets/section-hero-banner-2.css',
  'https://earthlyderm.com/cdn/shop/t/18/assets/vendor.js',
  'https://earthlyderm.com/cdn/shop/t/18/assets/theme.js',
  'https://earthlyderm.com/cdn/shop/t/18/assets/one_time.js',
  'https://earthlyderm.com/cdn/shop/t/18/assets/cart-timer.js',
  'https://earthlyderm.com/cdn/shop/t/18/assets/countdown-timer.js'
];

async function download() {
  console.log('Downloading theme assets...');
  for (const url of assets) {
    try {
      const filename = path.basename(url.split('?')[0]);
      const res = await fetch(url, { headers: { 'User-Agent': 'Mozilla/5.0' } });
      if (res.ok) {
        const text = await res.text();
        fs.writeFileSync(path.join(ASSETS_DIR, filename), text, 'utf8');
        console.log(`✔ Downloaded ${filename} (${text.length} bytes)`);
      } else {
        console.warn(`✖ Failed HTTP ${res.status}: ${url}`);
      }
    } catch (e) {
      console.error(`✖ Error downloading ${url}:`, e.message);
    }
  }
  console.log('Done downloading assets.');
}

download();
