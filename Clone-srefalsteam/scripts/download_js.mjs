import fs from 'fs';

const html = fs.readFileSync('Clone-srefalsteam/data/product.html', 'utf8');

// Find all script src
const scriptRegex = /<script[^>]+src=["']([^"']+)["'][^>]*>/gi;
const links = new Set();
let m;
while ((m = scriptRegex.exec(html)) !== null) {
  let url = m[1];
  if (url.startsWith('//')) url = 'https:' + url;
  if (url.startsWith('/')) url = 'https://srefal.com' + url;
  links.add(url);
}

console.log(`Found ${links.size} unique script links:`);
links.forEach(l => console.log('  ', l));

async function downloadScripts() {
  fs.mkdirSync('Clone-srefalsteam/data/js', { recursive: true });
  for (const url of links) {
    try {
      const cleanName = url.split('/').pop().split('?')[0];
      const res = await fetch(url, {
        headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64)' }
      });
      if (res.ok) {
        const text = await res.text();
        fs.writeFileSync(`Clone-srefalsteam/data/js/${cleanName}`, text);
        console.log(`✔ Downloaded: ${cleanName} (${text.length} bytes)`);
      } else {
        console.log(`✖ Failed (${res.status}): ${url}`);
      }
    } catch (err) {
      console.log(`✖ Error downloading ${url}: ${err.message}`);
    }
  }
}

downloadScripts();
