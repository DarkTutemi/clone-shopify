import fs from 'fs';

const html = fs.readFileSync('Clone-willafarm/data/willafarm_pdp_mobile.html', 'utf8');

function printSectionSlice(name) {
  const marker = `id="shopify-section-template--19209843408957__${name}"`;
  const idx = html.indexOf(marker);
  if (idx === -1) {
    console.log(`Marker not found: ${name}`);
    return;
  }
  const endMarker = `</section>`;
  const endIdx = html.indexOf(endMarker, idx + marker.length);
  const content = html.slice(idx, endIdx !== -1 ? endIdx + 10 : idx + 3000);
  console.log(`=== ${name} (length: ${content.length}) ===`);
  // Remove large style blocks for readability
  const stripped = content.replace(/<style[\s\S]*?<\/style>/gi, '/* STYLE OMITTED */');
  console.log(stripped.slice(0, 2000));
}

printSectionSlice('fn_ingredients');
printSectionSlice('fn_education_1');
printSectionSlice('fn_comparison');
