import fs from 'fs';

async function testStorefront() {
  const url = 'https://tryzavelyn.com/products/zavelyn-sensory-floor-mats';
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    }
  });

  console.log('Status:', res.status);
  console.log('Headers:');
  for (const [k, v] of res.headers.entries()) {
    if (k.includes('x-') || k.includes('cf-') || k.includes('cache') || k.includes('location')) {
      console.log('  ', k, ':', v);
    }
  }

  const text = await res.text();
  console.log('Length:', text.length);
  const title = text.match(/<title>([^<]+)<\/title>/i);
  console.log('Title in HTML:', title ? title[1] : 'null');
  
  if (text.includes('password')) console.log('Contains "password"');
  if (text.includes('404')) console.log('Contains "404"');
  if (text.includes('Sensory')) console.log('Contains "Sensory"');

  fs.writeFileSync('scripts/prod1_storefront_response.html', text, 'utf8');
}

testStorefront().catch(console.error);
