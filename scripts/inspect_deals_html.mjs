import { getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';

async function main() {
  const token = await getAccessToken();
  const url = `https://${SHOP}/collections/deals-of-the-day?view=showroom&preview_theme_id=187926020281`;
  const res = await fetch(url, {
    headers: {
      'Cookie': `preview_theme_id=187926020281`
    }
  });
  const html = await res.text();
  
  const searchStr = 'zv-shelf-item';
  let pos = 0;
  let count = 0;
  while ((pos = html.indexOf(searchStr, pos)) !== -1) {
    count++;
    console.log(`Found ${searchStr} #${count} at ${pos}:`);
    console.log(html.slice(pos - 30, pos + 250));
    console.log('---');
    pos += searchStr.length;
    if (count >= 12) break;
  }
}

main().catch(console.error);
