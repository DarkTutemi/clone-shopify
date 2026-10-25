import fs from 'fs';
import path from 'path';

const mediaList = [
  { id: 'hero', url: 'https://cdn.myshopage.com/79d22bcb-8381-4891-4c57-d5c616076f00', filename: 'grater_hero_banner.jpg' },
  { id: 'pkg1', url: 'https://cdn.myshopage.com/4dea8cba-5fe0-4bcd-a54d-6fe8b3ec5e00/w400.jpg', filename: 'pkg_white_1pc.jpg' },
  { id: 'pkg2', url: 'https://cdn.myshopage.com/4ea3ad77-8a8a-4a27-cdc9-1f1b1f291c00/w400.jpg', filename: 'pkg_green_1pc.jpg' },
  { id: 'pkg3', url: 'https://cdn.myshopage.com/72fc8f3a-f864-4a00-ea3a-ba79dd45a400/w400.jpg', filename: 'pkg_white_2pcs.jpg' },
  { id: 'pkg4', url: 'https://cdn.myshopage.com/00e74b8d-aeb5-4612-cb76-63673e290200/w400.jpg', filename: 'pkg_green_2pcs.jpg' },
  { id: 'drum1', url: 'https://cdn.myshopage.com/2eb44588-0d73-4b8d-a51f-39e4dfe89400/w200.png', filename: 'grater_drum_slice.png' },
  { id: 'drum2', url: 'https://cdn.myshopage.com/e9a9b7bd-5e19-4a55-b1a6-d3dbc1ee3c00/w200.png', filename: 'grater_drum_coarse.png' },
  { id: 'drum3', url: 'https://cdn.myshopage.com/88d63a32-a64d-4d2f-23a4-6fafb4437500/w200.png', filename: 'grater_drum_fine.png' },
  { id: 'drum4', url: 'https://cdn.myshopage.com/4b65d00c-3ef8-41f1-8cc6-04ffc4e79b00/w200.png', filename: 'grater_drum_waffle.png' },
  { id: 'feat1', url: 'https://cdn.myshopage.com/3f8fe31b-8a2b-4a6c-e582-86da91b4a400/w400.png', filename: 'grater_feat_safe_hopper.png' },
  { id: 'feat2', url: 'https://cdn.myshopage.com/e9ee8aaf-94e5-42b3-69c5-f47c839c8b00/w400.png', filename: 'grater_feat_rotary_power.png' },
  { id: 'feat3', url: 'https://cdn.myshopage.com/88a8f138-1d55-4a0d-760e-b5b141754600/w400.png', filename: 'grater_feat_suction_lock.png' },
  { id: 'feat4', url: 'https://cdn.myshopage.com/2d427331-1a4c-4a17-7deb-93c2be629b00/w400.png', filename: 'grater_feat_easy_rinse.png' },
  { id: 'feat5', url: 'https://cdn.myshopage.com/1020f567-5d39-4363-d1ab-e0020ed2f200/w400.png', filename: 'grater_prep_holiday.png' }
];

const outDir = './grater_media';
fs.mkdirSync(outDir, { recursive: true });

async function downloadAll() {
  console.log(`Downloading ${mediaList.length} cheese grater media files...`);
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
  console.log('✔ All grater media downloaded!');
}

downloadAll().catch(console.error);
