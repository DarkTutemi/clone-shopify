import fs from 'fs';

const urls = [
  { name: 'pro', url: 'https://pandadrum.com/products/panda-drum-pro' },
  { name: 'plus', url: 'https://pandadrum.com/products/11-tone-panda-drum-set' },
  { name: 'mini', url: 'https://pandadrum.com/products/8-tone-panda-drum' }
];

async function run() {
  for (const item of urls) {
    console.log(`Fetching HTML for ${item.name}...`);
    const res = await fetch(item.url);
    const html = await res.text();
    fs.writeFileSync(`Clone-pandadrum/${item.name}.html`, html, 'utf8');

    // Extract headings
    const headings = [...html.matchAll(/<h[1-4][^>]*>(.*?)<\/h[1-4]>/gis)]
      .map(m => m[1].replace(/<[^>]+>/g, '').trim())
      .filter(Boolean);
    console.log(`[${item.name.toUpperCase()}] Headings count: ${headings.length}`);
    console.log('Sample headings:', headings.slice(0, 10));
  }
}

run().catch(console.error);
