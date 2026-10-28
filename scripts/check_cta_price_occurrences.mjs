import https from 'https';

const options = {
  hostname: 'tryzavelyn.com',
  path: '/products/zavelyn-botanaroots-organic-batana-hair-growth-oil',
  headers: {
    'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) Chrome/120.0.0.0 Safari/537.36'
  }
};

https.get(options, (res) => {
  let data = '';
  res.on('data', c => data += c);
  res.on('end', () => {
    const matches = data.match(/zvCtaPrice/g);
    console.log('Occurrences of zvCtaPrice in HTML:', matches ? matches.length : 0);
    // Find lines
    data.split('\n').forEach((line, i) => {
      if (line.includes('zvCtaPrice')) {
        console.log(`Line ${i+1}: ${line.trim()}`);
      }
    });
  });
});
