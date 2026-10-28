async function testPreview() {
  const previewUrl = 'https://tryzavelyn.com/?preview_theme_id=187702804665';
  console.log('1. Requesting preview session from:', previewUrl);

  const res1 = await fetch(previewUrl, {
    redirect: 'manual',
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });

  const cookies = [];
  const rawCookies = res1.headers.getSetCookie ? res1.headers.getSetCookie() : [res1.headers.get('set-cookie')];
  for (const c of rawCookies) {
    if (c) cookies.push(c.split(';')[0]);
  }
  console.log('Got cookies:', cookies);

  const cookieHeader = cookies.join('; ');

  console.log('\n2. Fetching BotanaRoots PDP with preview cookies...');
  const pdpUrl = 'https://tryzavelyn.com/products/zavelyn-botanaroots-organic-batana-hair-growth-oil';
  const res2 = await fetch(pdpUrl, {
    headers: {
      'Cookie': cookieHeader,
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36'
    }
  });

  const html = await res2.text();
  console.log('PDP HTML status:', res2.status, 'Length:', html.length);
  const hasComponent = html.includes('zv-botana-bundle-container');
  console.log('Contains zv-botana-bundle-container?', hasComponent);

  if (hasComponent) {
    const idx = html.indexOf('zv-botana-bundle-container');
    console.log('\n--- Component Snippet ---');
    console.log(html.substring(idx, idx + 600));
  }
}

testPreview().catch(console.error);
