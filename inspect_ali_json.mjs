import fs from 'fs';

const raw = fs.readFileSync('ali_runparams.json', 'utf8');
try {
  const data = JSON.parse(raw);
  console.log('Top keys:', Object.keys(data));
  
  // Product title
  const title = data.titleModule?.subject || data.productInfoComponent?.subject || data.actionModule?.itemTitle || '';
  console.log('\n--- TITLE ---');
  console.log(title);

  // Images
  const imgList = data.imageModule?.imagePathList || data.imageComponent?.imagePathList || [];
  console.log('\n--- IMAGES ---', imgList.length);
  imgList.forEach((img, idx) => console.log(`[${idx+1}] ${img}`));

  // SKU / Variants
  const skuList = data.skuModule?.skuPriceList || data.priceComponent?.skuPriceList || [];
  console.log('\n--- VARIANTS (SKUs) ---', skuList.length);
  skuList.forEach(sku => {
    console.log(`- ID: ${sku.skuId} | prop: ${sku.skuPropIds} | price: ${sku.skuVal?.actSkuCalPrice || sku.skuVal?.skuCalPrice} | val: ${JSON.stringify(sku.skuVal)}`);
  });

  // SKU props (names of variants)
  const skuProps = data.skuModule?.productSKUPropertyList || [];
  console.log('\n--- SKU PROPS ---');
  skuProps.forEach(p => {
    console.log(`Prop: ${p.skuPropertyName}`);
    p.skuPropertyValues.forEach(v => {
      console.log(`  - ${v.propertyValueId}: "${v.propertyValueDisplayName}" | img: ${v.skuPropertyImagePath}`);
    });
  });

  // Specs
  const specs = data.specsModule?.props || data.productPropComponent?.props || [];
  console.log('\n--- SPECS ---', specs.length);
  specs.forEach(s => console.log(`- ${s.attrName}: ${s.attrValue}`));

  // Description URL
  console.log('\n--- DESCRIPTION URL ---');
  console.log(data.descriptionModule?.descriptionUrl);

} catch (e) {
  console.error('JSON parse error:', e.message);
  // Search text
  console.log('Length:', raw.length);
}
