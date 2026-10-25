import fs from 'fs';
import path from 'path';

const outDir = 'dough_mixer_media';
if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

const rawList = [
  // Product Hero / Variants
  { name: 'dough_mixer_hero_banner.jpg', url: 'https://cdn.myshopage.com/c5bfe694-8a8c-4db6-fc5d-cbaf3591a600/w1280.jpg' },
  { name: 'dough_mixer_red_card.jpg', url: 'https://cdn.myshopage.com/2f0c86c5-c12b-421e-ae93-939500f5ff00/w1000.jpg' },
  { name: 'dough_mixer_white_card.jpg', url: 'https://cdn.myshopage.com/8987195f-e92b-4f59-3c47-569cb4700600/w1000.jpg' },
  
  // Step 2 & Advertorial key visuals
  { name: 'dough_mixer_intro_compare.jpg', url: 'https://cdn.myshopage.com/5968fe0f-eed2-43f6-45aa-5cf60d3e5700/w1000.jpg' },
  { name: 'dough_mixer_knead_action.gif', url: 'https://d32xfih3ke9x04.cloudfront.net/Public/img/formImage/d3c735cf58e234b2664405d7fa294262.gif' },
  { name: 'dough_mixer_ferment_rise.gif', url: 'https://d32xfih3ke9x04.cloudfront.net/Public/img/formImage/f05e40c99db52e8e361a903068882d5f.gif' },
  { name: 'dough_mixer_easy_clean.gif', url: 'https://cdn.myshopage.com/c481fde5-6e9e-4181-143e-e4813196fe00/w1000.gif' },
  { name: 'dough_mixer_smooth_dough.gif', url: 'https://cdn.myshopage.com/6986edfc-2560-494e-228a-0c7a03158400/w1000.gif' },
  { name: 'dough_mixer_3in1_feature.jpg', url: 'https://cdn.myshopage.com/16755e88-669a-488e-f65b-9ea19792c800/w1000.jpg' },
  { name: 'dough_mixer_bowl_capacity.jpg', url: 'https://cdn.myshopage.com/b4ef4dec-3c9a-4ae5-bf5c-b87c12082600/w1000.jpg' },
  { name: 'dough_mixer_motor_power.jpg', url: 'https://cdn.myshopage.com/2f7c0b91-6d10-4bfd-3300-d6dbcb3be800/w1000.jpg' },
  { name: 'dough_mixer_temperature_control.jpg', url: 'https://cdn.myshopage.com/2814b45e-81fa-4fab-bd5b-090d23aba600/w1000.jpg' },
  { name: 'dough_mixer_step_guide.png', url: 'https://d32xfih3ke9x04.cloudfront.net/Public/img/formImage/e397ccaff1463874ca0ac0e51d3330f0.png' },

  // User review photos
  { name: 'dough_mixer_review_1.jpg', url: 'https://cdn.myshopage.com/7b4e2e96-606c-4ab1-07ee-b7f9654d2200.jpg' },
  { name: 'dough_mixer_review_2.jpg', url: 'https://cdn.myshopage.com/066aa7cc-33b7-4d5c-6434-02d3bfc4fa00.jpg' },
  { name: 'dough_mixer_review_3.jpg', url: 'https://cdn.myshopage.com/48f526bb-90b9-4a74-fe9b-ee0786647500.jpg' },
  { name: 'dough_mixer_review_4.jpg', url: 'https://cdn.myshopage.com/09d31e6e-8ed3-4c5f-3f60-7a8e1a78b100.jpg' },
  { name: 'dough_mixer_review_5.jpg', url: 'https://cdn.myshopage.com/bc2d277c-b322-4fcc-661e-ddd1ef72c400.jpg' },
  { name: 'dough_mixer_review_6.jpg', url: 'https://cdn.myshopage.com/6fed926e-cf4e-4e2f-d855-7c3d46ca5600.jpg' },
  { name: 'dough_mixer_review_7.jpg', url: 'https://cdn.myshopage.com/4f369144-595b-4b87-7588-4ba680a98f00.jpg' }
];

async function downloadAll() {
  console.log(`Downloading ${rawList.length} media assets with browser headers...`);
  const headers = {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Referer': 'https://m.sakerplus.com/'
  };

  for (const item of rawList) {
    const dest = path.join(outDir, item.name);
    try {
      let res = await fetch(item.url, { headers });
      if (!res.ok) {
        // try fallback without /w1000.jpg
        const altUrl = item.url.replace(/\/w\d+\.(?:jpg|png|gif)/, '');
        res = await fetch(altUrl, { headers });
      }
      if (!res.ok) {
        console.error(`❌ Failed to download ${item.name}: ${res.status}`);
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
