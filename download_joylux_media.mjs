import fs from 'fs';
import path from 'path';

const outDir = 'joylux_media';
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const mediaList = [
  // Device & Kits
  { name: 'joylux_vfit_starter_kit.jpg', url: 'https://joylux.com/cdn/shop/files/vfit-starter-kit-625262.jpg?v=1750446046&width=1200' },
  { name: 'joylux_vfit_classic_device.jpg', url: 'https://cdn.shopify.com/s/files/1/1120/5174/files/vfit-216847.jpg?v=1734795614&width=1200' },
  { name: 'joylux_vfit_plus_pro.jpg', url: 'https://cdn.shopify.com/s/files/1/1120/5174/files/vfit-plus-upgraded-device-819189.jpg?v=1731066968&width=1200' },
  
  // Clinical / Technology / Lifestyle
  { name: 'joylux_lifestyle_hand.jpg', url: 'https://images.replocdn.com/images/aaeb819f-df52-4f26-91b8-fd8d1bbb688a/b3ecc738-3b5f-403e-9f1a-42968f5880d4' },
  { name: 'joylux_triple_tech.png', url: 'https://cdn.shopify.com/s/files/1/1120/5174/files/image1.png?v=1737542156&width=1000' },
  { name: 'joylux_clinical_stats.svg', url: 'https://cdn.shopify.com/s/files/1/1120/5174/files/stats.svg?v=1741210238' },
  { name: 'joylux_clinical_diagram.png', url: 'https://cdn.shopify.com/s/files/1/1120/5174/files/Screenshot_2025-03-05_at_22.33.09.png?v=1741210403&width=1000' },
  { name: 'joylux_app_tracker.png', url: 'https://cdn.shopify.com/s/files/1/1120/5174/files/Untitled_design_-_2025-02-02T103751.609.png?v=1738472893&width=1000' },
  { name: 'joylux_dr_sarah.webp', url: 'https://cdn.shopify.com/s/files/1/1120/5174/files/Joylux_team_Sarah_720x_2494d0f6-4a2e-4dd8-8716-e81bc79de179.webp?v=1737187154' },
  
  // Reviews
  { name: 'joylux_review_1.png', url: 'https://cdn.shopify.com/s/files/1/1120/5174/files/review_1.png?v=1737439212&width=600' },
  { name: 'joylux_review_2.png', url: 'https://cdn.shopify.com/s/files/1/1120/5174/files/review_2.png?v=1737439211&width=600' },
  { name: 'joylux_review_3.png', url: 'https://cdn.shopify.com/s/files/1/1120/5174/files/review_3.png?v=1737439211&width=600' },
  { name: 'joylux_review_4.png', url: 'https://cdn.shopify.com/s/files/1/1120/5174/files/review_4.png?v=1737439211&width=600' }
];

async function downloadAll() {
  console.log(`Downloading ${mediaList.length} Joylux media assets...`);
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
  };

  for (const item of mediaList) {
    const dest = path.join(outDir, item.name);
    try {
      const res = await fetch(item.url, { headers });
      if (!res.ok) {
        console.error(`❌ Failed: ${item.name} (${res.status})`);
        continue;
      }
      const buf = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(dest, buf);
      console.log(`✔ Downloaded: ${item.name} (${buf.length} bytes)`);
    } catch (e) {
      console.error(`Error downloading ${item.name}:`, e.message);
    }
  }
}

downloadAll().catch(console.error);
