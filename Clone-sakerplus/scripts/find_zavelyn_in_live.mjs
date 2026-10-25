import fs from 'fs';

async function findZavelynInLive() {
  const res = await fetch('https://dsdujr-vn.myshopify.com/', {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  const html = await res.text();
  const lines = html.split('\n');
  lines.forEach((line, idx) => {
    if (line.toLowerCase().includes('zavelyn')) {
      console.log(`L${idx + 1}: ${line.trim().slice(0, 200)}`);
    }
  });
}

findZavelynInLive();
