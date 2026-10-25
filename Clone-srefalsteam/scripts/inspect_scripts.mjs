import fs from 'fs';

const html = fs.readFileSync('Clone-srefalsteam/data/product.html', 'utf8');

// Look for Before/After slider scripts
const baScripts = html.match(/before-after|comparison-slider|range|slider/gi) || [];
console.log('Before/after slider keywords count:', baScripts.length);

// Look for accordion scripts
const accMatch = html.match(/details|summary|accordion|collapsible/gi) || [];
console.log('Accordion keywords count:', accMatch.length);

// Look for inline scripts inside main
const mainMatch = html.match(/<main[^>]*>([\s\S]*?)<\/main>/i);
if (mainMatch) {
  const inlineScripts = mainMatch[1].match(/<script[^>]*>([\s\S]*?)<\/script>/gi) || [];
  console.log('Inline scripts inside main:', inlineScripts.length);
  inlineScripts.forEach((s, idx) => {
    console.log(`\nScript [${idx + 1}] (${s.length} bytes):`);
    console.log(s.slice(0, 200).replace(/\n/g, ' '));
  });
}
