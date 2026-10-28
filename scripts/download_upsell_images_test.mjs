import fs from 'fs';

fs.mkdirSync('prototypes/vfit-selfcare-upsell/media', { recursive: true });

async function downloadImages() {
  const images = [
    {
      name: 'eyemask_shopify_live.avif',
      url: 'https://cdn.shopify.com/s/files/1/0826/2483/9865/files/Sc34c469c6944416db67152e6dd6e2e744_jpg_220x220q75_jpg.avif?v=1793197124'
    },
    {
      name: 'eyemask_source_hd.jpg',
      url: 'https://ae-pic-a1.aliexpress-media.com/kf/Sc34c469c6944416db67152e6dd6e2e744.jpg'
    },
    {
      name: 'facemask_shopify_live.avif',
      url: 'https://cdn.shopify.com/s/files/1/0826/2483/9865/files/S83e211de0c344c90a968827469788b850_jpg_220x220q75_jpg.avif?v=1793197212'
    },
    {
      name: 'facemask_source_hd.jpg',
      url: 'https://ae-pic-a1.aliexpress-media.com/kf/S83e211de0c344c90a968827469788b850.jpg'
    }
  ];

  for (const item of images) {
    try {
      const res = await fetch(item.url);
      const buf = Buffer.from(await res.arrayBuffer());
      const path = `prototypes/vfit-selfcare-upsell/media/${item.name}`;
      fs.writeFileSync(path, buf);
      console.log(`Saved ${path}: ${buf.length} bytes, content-type: ${res.headers.get('content-type')}`);
    } catch (e) {
      console.error(`Failed ${item.name}:`, e);
    }
  }
}

downloadImages().catch(console.error);
