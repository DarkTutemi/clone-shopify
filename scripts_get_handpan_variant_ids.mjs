const handles = ['zavelyn-drum-pro', 'zavelyn-drum-plus', 'zavelyn-drum-mini'];

async function check() {
  for (const h of handles) {
    const res = await fetch(`https://tryzavelyn.com/products/${h}.js`);
    const p = await res.json();
    console.log(`\n=== ${p.title} (${p.handle}) ===`);
    console.log('Product ID:', p.id);
    p.variants.forEach((v, i) => {
      console.log(`  [${i+1}] ${v.title} | ID: ${v.id} | $${(v.price/100).toFixed(2)} | Compare: $${(v.compare_at_price/100).toFixed(2)}`);
    });
  }
}

check().catch(console.error);
