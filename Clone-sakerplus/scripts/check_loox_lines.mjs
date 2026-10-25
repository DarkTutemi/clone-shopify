import fs from 'fs';

async function checkLooxLines() {
  const pageRes = await fetch('https://www.sakerplus.com/products/sakerplus%C2%AE-tpu-sensory-textured-floor-mats', {
    headers: { 'User-Agent': 'Mozilla/5.0' }
  });
  const html = await pageRes.text();
  const lines = html.split('\n');
  lines.forEach((line, idx) => {
    if (line.toLowerCase().includes('loox')) {
      console.log(`L${idx + 1}: ${line.trim().slice(0, 150)}`);
    }
  });
}

checkLooxLines();
