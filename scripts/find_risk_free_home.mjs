import { getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';

async function findOnHome() {
  const initRes = await fetch(`https://tryzavelyn.com/?preview_theme_id=187597717689`, {
    headers: { 'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) QA-Runner/2.0' },
    redirect: 'manual'
  });
  const rawCookies = initRes.headers.getSetCookie ? initRes.headers.getSetCookie() : [initRes.headers.get('set-cookie')];
  const cookieHeader = (rawCookies || []).filter(Boolean).map(c => c.split(';')[0]).join('; ');

  const res = await fetch(`https://tryzavelyn.com/?preview_theme_id=187597717689`, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) QA-Runner/2.0',
      'Cookie': cookieHeader
    }
  });

  const html = await res.text();
  const lines = html.split('\n');
  lines.forEach((line, idx) => {
    if (/risk[- ]free/i.test(line)) {
      console.log(`Line ${idx + 1}: ${line.trim()}`);
      for (let j = Math.max(0, idx - 4); j <= Math.min(lines.length - 1, idx + 4); j++) {
        console.log(`  [${j + 1}] ${lines[j].trim()}`);
      }
    }
  });
}
findOnHome();
