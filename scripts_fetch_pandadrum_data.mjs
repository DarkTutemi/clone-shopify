import fs from 'fs';

const products = [
  { name: 'pro', url: 'https://pandadrum.com/products/panda-drum-pro.js' },
  { name: 'plus', url: 'https://pandadrum.com/products/11-tone-panda-drum-set.js' },
  { name: 'mini', url: 'https://pandadrum.com/products/8-tone-panda-drum.js' }
];

async function run() {
  if (!fs.existsSync('Clone-pandadrum')) {
    fs.mkdirSync('Clone-pandadrum', { recursive: true });
  }

  for (const item of products) {
    console.log(`Fetching ${item.name} from ${item.url}...`);
    const res = await fetch(item.url);
    const data = await res.json();
    fs.writeFileSync(`Clone-pandadrum/${item.name}.json`, JSON.stringify(data, null, 2));
    console.log(`  Title: ${data.title}`);
    console.log(`  Price: $${(data.price / 100).toFixed(2)} | Compare: $${(data.compare_at_price / 100).toFixed(2)}`);
    console.log(`  Variants: ${data.variants.length}`);
    console.log(`  Images: ${data.images.length}`);
    data.variants.forEach((v, i) => {
      console.log(`    [Variant ${i+1}] ${v.title} | ID: ${v.id} | $${(v.price / 100).toFixed(2)} | Avail: ${v.available}`);
    });
  }
}

run().catch(console.error);
