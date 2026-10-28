import https from 'https';

const options = {
  hostname: 'tryzavelyn.com',
  path: '/products/zavelyn-botanaroots-organic-batana-hair-growth-oil',
  method: 'GET',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36',
    'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/avif,image/webp,*/*;q=0.8',
    'Accept-Language': 'en-US,en;q=0.9',
    'Cache-Control': 'no-cache'
  }
};

https.get(options, (res) => {
  console.log('Status code:', res.statusCode);
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Data length:', data.length);
    if (data.includes('Engineered for maximum reliability')) {
      console.log('Found "Engineered for maximum reliability"!');
      const idx = data.indexOf('class="zv-benefits-block"');
      console.log(data.substring(idx, idx + 1000));
    } else {
      console.log('Not found, snippet:', data.substring(0, 300));
    }
  });
});
