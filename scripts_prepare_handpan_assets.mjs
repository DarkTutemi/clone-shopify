import fs from 'fs';

for (const name of ['pro', 'plus', 'mini']) {
  const p = JSON.parse(fs.readFileSync(`Clone-pandadrum/${name}.json`, 'utf8'));
  console.log(`\n=== ASSETS FOR ${name.toUpperCase()} ===`);
  console.log(`Variants (${p.variants.length}):`);
  p.variants.forEach(v => {
    console.log(`  - ${v.title}: ID ${v.id}, Price $${(v.price/100).toFixed(2)}, Compare $${(v.compare_at_price/100).toFixed(2)}, Option1: ${v.option1}, Image ID: ${v.featured_image ? v.featured_image.id : 'none'}`);
  });
  console.log(`Total Images: ${p.images.length}`);
  console.log('Sample images:');
  p.images.slice(0, 8).forEach((img, i) => {
    const fullUrl = img.startsWith('//') ? 'https:' + img : img;
    console.log(`  [${i+1}] ${fullUrl}`);
  });
}
