import fs from 'fs';

const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';

async function checkLiveUrl(path) {
  const url = `https://${SHOP_DOMAIN}${path}`;
  try {
    const res = await fetch(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });
    console.log(`URL: ${url} => Status: ${res.status}`);
    const text = await res.text();
    console.log(`  Length: ${text.length} bytes`);
    
    // Check if it has password page or actual content
    if (text.includes('Opening soon') || text.includes('password')) {
      console.log('  ⚠️ Store has storefront password enabled.');
    } else {
      console.log('  ✔ Storefront is public / accessible!');
    }

    const title = text.match(/<title>([^<]+)<\/title>/i);
    console.log('  Title:', title ? title[1].trim() : 'N/A');
  } catch (e) {
    console.error(`Error fetching ${url}:`, e.message);
  }
}

async function main() {
  await checkLiveUrl('/products/sakerplus-fence-post-repair-kit');
  await checkLiveUrl('/pages/news-sakerplus-fence-post-repair-kit');
  await checkLiveUrl('/');
}

main();
