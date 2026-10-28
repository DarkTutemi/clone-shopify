async function test() {
  const initRes = await fetch('https://tryzavelyn.com/?preview_theme_id=187702804665', { redirect: 'manual' });
  const raw = initRes.headers.getSetCookie ? initRes.headers.getSetCookie() : [initRes.headers.get('set-cookie')];
  const cookie = raw[0]?.split(';')[0];

  const res = await fetch('https://tryzavelyn.com/products/zavelyn-botanaroots-organic-batana-hair-growth-oil', {
    headers: { 'Cookie': cookie }
  });
  const html = await res.text();
  const payIdx = html.indexOf('zv-payment-icons-row');
  const payEnd = html.indexOf('<!-- 7. BACKEND DATA', payIdx);
  const snippet = html.substring(payIdx, payEnd);
  
  const matches = [];
  const re = /title="([^"]+)"/g;
  let m;
  while ((m = re.exec(snippet)) !== null) {
    matches.push(m[1]);
  }
  console.log('Payment icons found in HTML:', matches);

  // Check if old text exists
  const hasOldText = html.includes('Secure Checkout') || html.includes('30-Day Returns') || html.includes('Trusted by Thousands');
  console.log('Does HTML still contain old trust text?', hasOldText);
}

test().catch(console.error);
