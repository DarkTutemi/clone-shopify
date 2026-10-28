async function checkPreviewCookies() {
  const url = 'https://tryzavelyn.com/?preview_theme_id=187597717689';
  const res = await fetch(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
    },
    redirect: 'manual'
  });

  console.log('Status:', res.status);
  console.log('Headers:');
  for (const [k, v] of res.headers.entries()) {
    if (k.toLowerCase().includes('cookie') || k.toLowerCase().includes('location') || k.toLowerCase().includes('theme')) {
      console.log(` - ${k}: ${v}`);
    }
  }

  const rawCookies = res.headers.getSetCookie ? res.headers.getSetCookie() : [res.headers.get('set-cookie')];
  console.log('\nSet-Cookie headers count:', rawCookies.length);
  rawCookies.forEach(c => console.log(' Cookie:', c.split(';')[0]));
}

checkPreviewCookies().catch(console.error);
