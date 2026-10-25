const urls = [
  'https://tryzavelyn.com/products/livestock-heating-lamp.js',
  'https://tryzavelyn.com/products/thoson-magtrack.js',
  'https://tryzavelyn.com/products/srefalsteam.js',
  'https://tryzavelyn.com/products/the-yeoman-sweep.js'
];

async function check() {
  for (const url of urls) {
    const res = await fetch(url);
    const p = await res.json();
    console.log(`\n=== ${p.title} (${p.handle}) ===`);
    console.log('ID:', p.id);
    console.log('Variants:');
    p.variants.forEach((v, i) => {
      console.log(`  [${i+1}] Title: "${v.title}" | ID: ${v.id} | Price: $${(v.price/100).toFixed(2)} | Avail: ${v.available}`);
    });
  }
}

check().catch(console.error);
