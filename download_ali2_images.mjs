import fs from 'fs';

const baseUrls = [
  'https://ae-pic-a1.aliexpress-media.com/kf/S275e311428bf43b591f9dbab6de99946Z.jpg',
  'https://ae-pic-a1.aliexpress-media.com/kf/S5585a57609664221bcdb60d581afb9d8P.jpg',
  'https://ae-pic-a1.aliexpress-media.com/kf/S7109c419c0a84869b05d5150c0672081p.jpg',
  'https://ae-pic-a1.aliexpress-media.com/kf/Scf4f74ad26544020b68e6f35c318e6170.jpg',
  'https://ae-pic-a1.aliexpress-media.com/kf/S8e3ed4cf6dd7407bb2e6ab4f428fcfe1c.png'
];

fs.mkdirSync('ali_images2', { recursive: true });

async function run() {
  for (let i = 0; i < baseUrls.length; i++) {
    const u = baseUrls[i];
    const ext = u.endsWith('.png') ? 'png' : 'jpg';
    const filePath = `ali_images2/img_${i+1}.${ext}`;
    try {
      const res = await fetch(u);
      const buf = Buffer.from(await res.arrayBuffer());
      fs.writeFileSync(filePath, buf);
      console.log(`Saved ${filePath} (${buf.length} bytes)`);
    } catch (e) {
      console.error(`Failed ${u}:`, e);
    }
  }
}

run();
