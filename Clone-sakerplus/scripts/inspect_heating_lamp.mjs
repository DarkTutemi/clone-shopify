import fs from 'fs';

async function main() {
  const url = 'https://m.sakerplus.com/funnel/news-sakerplus-livestock-heating-lamp';
  const headers = { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36' };

  fs.mkdirSync('Clone-sakerplus/data/heating_lamp', { recursive: true });

  console.log('Fetching', url);
  const res = await fetch(url, { headers });
  console.log('Status:', res.status);
  console.log('Final URL:', res.url);

  const text = await res.text();
  fs.writeFileSync('Clone-sakerplus/data/heating_lamp/page.html', text);
  console.log('Saved page.html, size:', text.length);

  const titleMatch = text.match(/<title>([^<]+)<\/title>/i);
  console.log('Title:', titleMatch ? titleMatch[1] : 'No title');

  // Find all links
  const hrefRegex = /href=["']([^"']+)["']/gi;
  let m;
  const links = new Set();
  while ((m = hrefRegex.exec(text)) !== null) {
    links.add(m[1]);
  }
  console.log('Total links:', links.size);
  const internalLinks = [...links].filter(l => l.includes('sakerplus') || l.includes('funnel') || l.includes('product') || l.includes('order'));
  console.log('Key links:', internalLinks);
}

main().catch(console.error);
