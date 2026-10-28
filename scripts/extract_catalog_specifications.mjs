import fs from 'fs';

const prods = JSON.parse(fs.readFileSync('scripts/raw_catalog_products.json', 'utf8'));

const detailedSpecs = prods.map(p => {
  const desc = p.descriptionHtml || '';
  const medicalWords = desc.match(/(cure|treat|diagnose|heal|pain relief|arthritis|inflammation|medical|therapy|therapeutic|neuropathy|sciatica)/gi) || [];
  const materials = desc.match(/(titanium|stainless steel|aluminum|tpu|silicone|leather|oxford|pvc|fleece|sherpa|brass|copper|iron|alloy)/gi) || [];
  const specs = desc.match(/(\d+\s*(?:w|v|mah|ah|rpm|psi|ton|ft|inch|cm|mm|db|hz|khz))/gi) || [];
  
  return {
    id: p.id.replace('gid://shopify/Product/', ''),
    title: p.title,
    handle: p.handle,
    status: p.status,
    hasHtml: desc.length > 0,
    descLen: desc.length,
    medicalWords: [...new Set(medicalWords.map(m => m.toLowerCase()))],
    materials: [...new Set(materials.map(m => m.toLowerCase()))],
    specs: [...new Set(specs.map(s => s.toLowerCase()))]
  };
});

fs.writeFileSync('scripts/catalog_extracted_specs.json', JSON.stringify(detailedSpecs, null, 2), 'utf8');
console.log('Saved catalog_extracted_specs.json successfully.');

const emptyDesc = detailedSpecs.filter(d => d.descLen === 0);
console.log('Products with empty description in Shopify:', emptyDesc.length);
emptyDesc.forEach(d => console.log(` - ID: ${d.id} | ${d.title} (${d.status})`));
