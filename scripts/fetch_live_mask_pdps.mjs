import fs from 'fs';

async function inspectLivePDP(handle) {
  const url = `https://tryzavelyn.com/products/${handle}`;
  const res = await fetch(url);
  const html = await res.text();
  console.log(`=== ${handle} ===`);
  console.log('Status:', res.status, 'HTML length:', html.length);
  fs.writeFileSync(`scripts/${handle}.html`, html, 'utf8');

  // Find all images in this HTML
  const imgMatches = html.match(/<img[^>]+src="([^">]+)"/gi) || [];
  console.log('Image tags found:', imgMatches.length);
  imgMatches.slice(0, 10).forEach(m => console.log('  ', m));
}

async function run() {
  await inspectLivePDP('zavelyn-red-light-eye-care-mask');
  await inspectLivePDP('zavelyn-led-red-light-face-mask');
}

run().catch(console.error);
