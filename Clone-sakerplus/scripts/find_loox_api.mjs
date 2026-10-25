import fs from 'fs';

async function findLooxApi() {
  const pageRes = await fetch('https://www.sakerplus.com', {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  const html = await pageRes.text();
  
  const matches = [...html.matchAll(/(?:src|href)=["']([^"']*loox[^"']*)["']/gi)];
  console.log('Loox script URLs:');
  for (const m of matches) {
    console.log(' -', m[1]);
  }

  // Look for loox shop ID
  const shopIdMatch = html.match(/loox\s*\.?\s*hash\s*=\s*['"]([^'"]+)['"]/i) || html.match(/data-loox-hash=['"]([^'"]+)['"]/i);
  console.log('Loox hash match:', shopIdMatch);
}

findLooxApi();
