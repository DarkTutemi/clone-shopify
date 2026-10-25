import fs from 'fs';

function printProductOverview(name, jsonPath) {
  console.log(`\n==================================================`);
  console.log(`PRODUCT: ${name}`);
  console.log(`==================================================`);
  const raw = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const p = raw.product;
  console.log(`Title: ${p.title}`);
  console.log(`Handle: ${p.handle}`);
  console.log(`Product Type: ${p.product_type}`);
  console.log(`Images: ${p.images?.length || 0}`);
  p.images?.slice(0, 5).forEach((img, i) => console.log(`  [Img ${i+1}] ${img.src}`));
  console.log(`Variants: ${p.variants?.length || 0}`);
  p.variants?.forEach((v, i) => console.log(`  [Var ${i+1}] Title: "${v.title}" | Price: $${v.price} | Compare: $${v.compare_at_price} | Option1: "${v.option1}"`));
  console.log(`Body HTML Length: ${p.body_html?.length || 0}`);
  if (p.body_html) {
    console.log(`Body HTML Snippet:\n${p.body_html.substring(0, 400)}\n...`);
  }
}

printProductOverview('Thoson MagTrack', 'Clone-thoson/data/product.json');
printProductOverview('Srefal Steam Pro', 'Clone-srefalsteam/data/product.json');
printProductOverview('Yeoman Sweep', 'Clone-yeoman/data/the-yeoman-sweep.json');
