import fs from 'fs';

async function scrapeLanding() {
  const res = await fetch('https://wiggostoyfactory.com/products/mega-lifters%E2%84%A2', {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });
  const html = await res.text();
  fs.writeFileSync('megalifters_page.html', html);
  console.log('Saved megalifters_page.html, size:', html.length);

  const headings = [...html.matchAll(/<h[1-4][^>]*>(.*?)<\/h[1-4]>/gi)].map(m => m[1].replace(/<[^>]+>/g, '').trim()).filter(Boolean);
  console.log('Headings found:', headings.slice(0, 15));
}

scrapeLanding().catch(console.error);
