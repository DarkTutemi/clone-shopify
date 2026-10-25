import fs from 'fs';

async function fetchFunnel() {
  const url = 'https://m.sakerplus.com/funnel/news-sakerplus-fence-post-repair-kit';
  console.log('Fetching', url, '...');
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (iPhone; CPU iPhone OS 16_6 like Mac OS X) AppleWebKit/605.1.15 (KHTML, like Gecko) Version/16.6 Mobile/15E148 Safari/604.1',
        'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8',
        'Accept-Language': 'en-US,en;q=0.9'
      }
    });
    console.log('Status:', res.status);
    const html = await res.text();
    fs.writeFileSync('saker_fence_funnel.html', html);
    console.log('Saved saker_fence_funnel.html, length:', html.length);

    // Find all GIFs!
    const gifRegex = /https?:\/\/[^"'\s]+\.gif(?:\?[^"'\s]*)?/gi;
    const gifs = Array.from(new Set(html.match(gifRegex) || []));
    console.log('\n--- FOUND GIFS (' + gifs.length + ') ---');
    gifs.forEach((g, i) => console.log(`[${i+1}] ${g}`));

    // Find all images / webp / png
    const imgRegex = /https?:\/\/[^"'\s]+\.(?:png|jpg|jpeg|webp)(?:\?[^"'\s]*)?/gi;
    const imgs = Array.from(new Set(html.match(imgRegex) || []));
    console.log('\n--- FOUND OTHER IMAGES (' + imgs.length + ') ---');
    imgs.slice(0, 15).forEach((img, i) => console.log(`[${i+1}] ${img}`));

    // Find page title
    const title = html.match(/<title>([^<]+)<\/title>/i);
    console.log('\nTitle:', title ? title[1] : 'No title');

  } catch (e) {
    console.error('Fetch error:', e);
  }
}

fetchFunnel();
