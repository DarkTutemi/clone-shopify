import https from 'https';

https.get('https://tryzavelyn.com/products/zavelyn-botanaroots-organic-batana-hair-growth-oil', (res) => {
  console.log('Status code:', res.statusCode);
  console.log('Headers:', res.headers);
  let data = '';
  res.on('data', chunk => data += chunk);
  res.on('end', () => {
    console.log('Data length:', data.length);
    console.log('Preview:', data.substring(0, 500));
    if (data.includes('Engineered for maximum reliability')) {
      console.log('Found "Engineered for maximum reliability"!');
    } else {
      console.log('"Engineered for maximum reliability" not found in raw response.');
    }
  });
});
