import fs from 'fs';

async function fetchAli() {
  const url = 'https://www.aliexpress.com/item/1005008481785634.html';
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/122.0.0.0 Safari/537.36',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });
    console.log('Status:', res.status);
    const text = await res.text();
    fs.writeFileSync('ali_raw.html', text);
    console.log('Saved ali_raw.html, length:', text.length);

    // Look for title or json data
    const titleMatch = text.match(/<title>([^<]+)<\/title>/i);
    console.log('Title:', titleMatch ? titleMatch[1] : 'No title');

    // Look for og:image or runParams
    const ogImg = text.match(/<meta property="og:image" content="([^"]+)"/i);
    console.log('OG Image:', ogImg ? ogImg[1] : 'No og:image');

    const descMatch = text.match(/<meta property="og:description" content="([^"]+)"/i);
    console.log('OG Desc:', descMatch ? descMatch[1] : 'No og:desc');

    const runParams = text.match(/data:\s*(\{.+?\})\s*,\s*csrfToken/s);
    if (runParams) {
      console.log('Found data block!');
    }
  } catch (e) {
    console.error('Fetch error:', e);
  }
}

fetchAli();
