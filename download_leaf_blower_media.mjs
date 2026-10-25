import fs from 'fs';
import path from 'path';

const mediaList = [
  // GIFs
  { id: 'gif1', url: 'https://file.myshopage.com/5206986a9d052766e0617af75cc5fca0.gif', filename: 'blower_dry_car.gif' },
  { id: 'gif2', url: 'https://file.myshopage.com/561ef16312d83830f30525caf2679c8e.gif', filename: 'blower_clear_leaves.gif' },
  { id: 'gif3', url: 'https://file.myshopage.com/479040fab4e55732f8a4952685a4e4c6.gif', filename: 'blower_blast_pc.gif' },
  { id: 'gif4', url: 'https://file.myshopage.com/65ccc19d8f85d2e2fafe893eb8696281.gif', filename: 'blower_fire_charcoal.gif' },
  { id: 'gif5', url: 'https://file.myshopage.com/f86479e917451a80d5e155c4c8e6803a.gif', filename: 'blower_clear_snow.gif' },
  { id: 'gif6', url: 'https://file.myshopage.com/911945e4e85b93b14376834c211c56ac.gif', filename: 'blower_power_test.gif' },
  { id: 'gif7', url: 'https://file.myshopage.com/af5c526ba9dcef4996b097512e33572f.gif', filename: 'blower_in_action.gif' },

  // Package bundle images
  { id: 'pkg1', url: 'https://cdn.myshopage.com/7aa47916-5526-4dee-8707-e82d64103700/w400.png', filename: 'package_1_battery.png' },
  { id: 'pkg2', url: 'https://cdn.myshopage.com/fc42354a-5f6d-4c09-e4d3-77b4967e7400/w400.jpg', filename: 'package_2_batteries_toolbox.jpg' },
  { id: 'pkg3', url: 'https://cdn.myshopage.com/a1704d8e-6e5c-4367-d23c-47246e0a9800/w400.jpg', filename: 'package_2_batteries_2_nozzles.jpg' },
  { id: 'pkg4', url: 'https://cdn.myshopage.com/963288ce-079a-4d55-5d61-c4ad6f98b300/w400.jpg', filename: 'package_maxpower_pro_toolbox.jpg' },

  // Hero & feature demonstration photos
  { id: 'hero', url: 'https://cdn.myshopage.com/38b473eb-0e6d-4032-f972-ea328339e700/w1280.jpg', filename: 'blower_hero_main.jpg' },
  { id: 'feat1', url: 'https://cdn.myshopage.com/cbff7f28-634e-4f1b-31ab-6ec4cc76a100/w1000.png', filename: 'blower_feat_car_dry.png' },
  { id: 'feat2', url: 'https://cdn.myshopage.com/e290dde4-8213-4286-4cb2-6553588fe600/w500.png', filename: 'blower_feat_multipurpose.png' },
  { id: 'feat3', url: 'https://cdn.myshopage.com/b2209721-ea11-4509-fc2c-3cb35236a000/w500.png', filename: 'blower_feat_stepless.png' },
  { id: 'feat4', url: 'https://cdn.myshopage.com/4a26065e-af54-4ec0-9eaf-b38063540100/w500.png', filename: 'blower_feat_battery.png' },
  { id: 'feat5', url: 'https://cdn.myshopage.com/d4dae279-328c-4c21-ab55-f735ce66be00/w600.png', filename: 'blower_feat_air_blade.png' }
];

const outDir = './blower_media';
fs.mkdirSync(outDir, { recursive: true });

async function downloadAll() {
  console.log(`Downloading ${mediaList.length} media files...`);
  for (const item of mediaList) {
    const dest = path.join(outDir, item.filename);
    try {
      const res = await fetch(item.url, {
        headers: {
          'Referer': 'https://m.sakerplus.com/',
          'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
        }
      });
      if (res.ok) {
        const buf = Buffer.from(await res.arrayBuffer());
        fs.writeFileSync(dest, buf);
        console.log(`  ✔ [${res.status}] ${item.filename} (${buf.length} bytes)`);
      } else {
        console.error(`  ✗ [${res.status}] Failed ${item.filename}`);
      }
    } catch (e) {
      console.error(`  ✗ Error downloading ${item.filename}:`, e.message);
    }
  }
  console.log('Download complete!');
}

downloadAll().catch(console.error);
