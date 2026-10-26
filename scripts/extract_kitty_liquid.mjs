import fs from 'fs';

const html = fs.readFileSync('kittycollective_full.html', 'utf-8');
const match = html.match(/id=["']shopify-section-template--21121800405036__custom_liquid_Bt7VbN["'][^>]*>([\s\S]*?)<\/div>\s*<\/div>\s*<\/div>\s*<div[^>]*id=["']shopify-section-sections--21121800732716__footer/i);

if (match) {
  const content = match[1];
  console.log('custom_liquid_Bt7VbN length:', content.length);
  
  // Extract all sub-sections / components inside this custom liquid
  const blocks = [...content.matchAll(/<(?:div|section)[^>]*class=["']([^"']*(?:hero|banner|feature|benefit|guarantee|review|faq|bundle|story|press|comparison|step|grid|gallery|video)[^"']*)["'][^>]*>/gi)];
  console.log(`Found ${blocks.length} component classes:`);
  const uniqueClasses = [...new Set(blocks.map(b => b[1]))];
  uniqueClasses.slice(0, 30).forEach(c => console.log('  .', c));

  // Extract texts inside this section
  const lines = content.replace(/<style[\s\S]*?<\/style>/gi, '')
    .replace(/<script[\s\S]*?<\/script>/gi, '')
    .replace(/<[^>]+>/g, '\n')
    .split('\n')
    .map(l => l.trim())
    .filter(l => l.length > 15);
  
  console.log('\nText highlights (sample 25):');
  lines.slice(0, 30).forEach((l, idx) => console.log(`${idx + 1}. ${l}`));
} else {
  console.log('No match for custom_liquid_Bt7VbN');
}
