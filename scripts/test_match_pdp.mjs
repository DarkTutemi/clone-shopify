import { getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';

async function test() {
  const initRes = await fetch(`https://tryzavelyn.com/?preview_theme_id=187597717689`, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) QA-Runner/2.0' },
    redirect: 'manual'
  });
  const rawCookies = initRes.headers.getSetCookie ? initRes.headers.getSetCookie() : [initRes.headers.get('set-cookie')];
  const cookieHeader = (rawCookies || []).filter(Boolean).map(c => c.split(';')[0]).join('; ');

  const res = await fetch(`https://tryzavelyn.com/products/zavelyn-sensory-floor-mats?preview_theme_id=187597717689`, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) QA-Runner/2.0',
      'Cookie': cookieHeader
    }
  });

  const html = await res.text();
  const prohibitedGuaranteeRegex = /\b(60[- ]day\s*(money[- ]back\s*)?guarantee|90[- ]day\s*(sound\s*)?guarantee|60[- ]night\s*risk[- ]free\s*trial)\b/gi;
  const matches = html.match(prohibitedGuaranteeRegex);
  console.log('Matches:', matches);

  if (matches) {
    const idx = html.indexOf(matches[0]);
    console.log('Context around index', idx, ':');
    console.log(html.slice(Math.max(0, idx - 200), Math.min(html.length, idx + 200)));
  }
}
test();
