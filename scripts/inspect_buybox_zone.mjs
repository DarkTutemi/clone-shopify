import fs from 'fs';

const html = fs.readFileSync('kitty_pdp_full.html', 'utf-8');

// Search for Trust / FAQ inside shop_product_details
const endDetails = html.indexOf('shopify-section-template--21121800667180__scrolling_features_bar_QmiYpj');
const buyBoxZone = html.substring(html.indexOf('shopify-section-template--21121800667180__shop_product_details_JbqzwH'), endDetails);

console.log('BuyBox Zone length:', buyBoxZone.length);
// Find all headings or block types in this zone
const blockComments = [...buyBoxZone.matchAll(/<!--\s*([^-]+)\s*-->/g)].map(m => m[1].trim());
console.log('Block comments in BuyBox:', blockComments.filter(c => c.length < 60));

// Find accordions or details tags in BuyBox
const detailsTags = [...buyBoxZone.matchAll(/<details[\s\S]*?<\/details>/gi)];
console.log('Details/Accordions in BuyBox count:', detailsTags.length);
detailsTags.forEach((d, i) => console.log(`Accordion ${i+1}:`, d[0].substring(0, 150)));

// Find icons with text or trust benefits in BuyBox
const trustMatches = [...buyBoxZone.matchAll(/class=["'][^"']*(?:trust|benefit|guarantee|badge|icon-text)[^"']*["']/gi)];
console.log('Trust/benefit matches count:', trustMatches.length);

fs.writeFileSync('scripts/buybox_zone_summary.txt', buyBoxZone, 'utf-8');
