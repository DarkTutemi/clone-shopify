import fs from 'fs';

async function testImages() {
  const urls = JSON.parse(fs.readFileSync('cheese_grater_image_urls.json', 'utf8'));
  console.log(`Testing ${urls.length} image URLs...`);

  const results = [];
  for (let i = 0; i < urls.length; i++) {
    const u = urls[i];
    try {
      const res = await fetch(u, {
        headers: { 'Referer': 'https://m.sakerplus.com/', 'User-Agent': 'Mozilla/5.0' }
      });
      const contentType = res.headers.get('content-type');
      const contentLength = res.headers.get('content-length');
      results.push({ index: i, url: u, status: res.status, contentType, contentLength });
      console.log(`[${i}] ${res.status} | ${contentType} | ${contentLength} bytes | ${u}`);
    } catch (e) {
      console.error(`[${i}] Error:`, e.message);
    }
  }

  fs.writeFileSync('cheese_grater_media_inspected.json', JSON.stringify(results, null, 2), 'utf8');
}

testImages().catch(console.error);
