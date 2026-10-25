import fs from 'fs';

async function run() {
  const urls = [
    'https://cdn.shopify.com/s/files/1/0826/2483/9865/files/tgwkEV9Zr.jpg?v=1792905883',
    'https://cdn.shopify.com/s/files/1/0826/2483/9865/files/3PKEj9qFE9.jpg?v=1792905880'
  ];
  for (const url of urls) {
    const filename = url.split('/').pop().split('?')[0];
    const res = await fetch(url);
    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(`scratch_colors/${filename}`, buf);
    console.log(`Saved ${filename} (${buf.length} bytes)`);
  }
}
run();
