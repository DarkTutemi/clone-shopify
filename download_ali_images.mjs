import fs from 'fs';

const baseUrls = [
  'https://ae-pic-a1.aliexpress-media.com/kf/S8caad85c77d84b40a290d2f1ba1c6cd6X.jpg',
  'https://ae-pic-a1.aliexpress-media.com/kf/S177bd1bc579a4da3ae62ba93a1bca73eh.jpg',
  'https://ae-pic-a1.aliexpress-media.com/kf/S764458820f7c4c3c82f17586df1417c4X.png',
  'https://ae-pic-a1.aliexpress-media.com/kf/S08e77cfeb04f4b3bb6fec33c5e0a5b4fG.jpg',
  'https://ae-pic-a1.aliexpress-media.com/kf/S8058200e72a14cfa83f1d7a4af2d6428v.jpg',
  'https://ae-pic-a1.aliexpress-media.com/kf/S2b86b676317946c9b783577a7f12f3542.jpg'
];

fs.mkdirSync('ali_images', { recursive: true });

async function run() {
  for (let i = 0; i < baseUrls.length; i++) {
    const u = baseUrls[i];
    const ext = u.endsWith('.png') ? 'png' : 'jpg';
    const filePath = `ali_images/img_${i+1}.${ext}`;
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
