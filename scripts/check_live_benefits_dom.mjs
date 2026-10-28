import https from 'https';

async function fetchLivePDP() {
  const url = 'https://tryzavelyn.com/products/zavelyn-botanaroots-organic-batana-hair-growth-oil';
  const html = await new Promise((resolve, reject) => {
    https.get(url, (res) => {
      let data = '';
      res.on('data', chunk => data += chunk);
      res.on('end', () => resolve(data));
    }).on('error', reject);
  });

  const blockStart = html.indexOf('class="zv-benefits-block"');
  if (blockStart !== -1) {
    const blockEnd = html.indexOf('</div>', html.indexOf('</div>', blockStart) + 100);
    console.log('--- LIVE BENEFITS BLOCK CURRENT DOM ---');
    console.log(html.substring(blockStart - 20, blockStart + 1200));
    console.log('---------------------------------------');
  } else {
    console.log('zv-benefits-block not found in live HTML');
  }
}

fetchLivePDP().catch(console.error);
