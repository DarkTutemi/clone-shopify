import fs from 'fs';

const code = fs.readFileSync('scripts/zavelyn-pdp-main.liquid', 'utf8');

console.log("=== 1. FORM & ACTION TAGS ===");
const formMatches = code.match(/<form[\s\S]*?<\/form>/gi) || [];
console.log(`Found ${formMatches.length} forms in zavelyn-pdp-main.liquid`);
formMatches.forEach((f, i) => {
  const actionMatch = f.match(/action=["']([^"']*)["']/i);
  const methodMatch = f.match(/method=["']([^"']*)["']/i);
  const idMatch = f.match(/id=["']([^"']*)["']/i);
  console.log(`Form ${i+1}: id="${idMatch?.[1]}" action="${actionMatch?.[1]}" method="${methodMatch?.[1]}"`);
});

console.log("\n=== 2. ADD TO CART & BUY NOW BUTTONS ===");
const buttonMatches = code.match(/<button[\s\S]*?<\/button>/gi) || [];
buttonMatches.forEach(b => {
  if (b.toLowerCase().includes('cart') || b.toLowerCase().includes('buy') || b.includes('zv-atc') || b.includes('zv-buy')) {
    const text = b.replace(/<[^>]+>/g, '').trim().replace(/\s+/g, ' ');
    const id = b.match(/id=["']([^"']*)["']/i)?.[1];
    const type = b.match(/type=["']([^"']*)["']/i)?.[1];
    const cls = b.match(/class=["']([^"']*)["']/i)?.[1];
    console.log(`Button: id="${id}" type="${type}" class="${cls}" text="${text}"`);
  }
});

console.log("\n=== 3. JAVASCRIPT LOGIC ANALYSIS ===");
const scriptMatches = code.match(/<script[\s\S]*?<\/script>/gi) || [];
console.log(`Found ${scriptMatches.length} script tags`);

scriptMatches.forEach((s, idx) => {
  console.log(`\n--- Script Tag ${idx+1} (${s.length} chars) ---`);
  console.log('Includes /cart/add:', s.includes('/cart/add'));
  console.log('Includes checkout redirect:', s.includes('/checkout') || s.includes('location.href'));
  console.log('Includes variant change:', s.includes('variant') || s.includes('change'));
  console.log('Includes bundle calculation:', s.includes('bundle') || s.includes('tier') || s.includes('discount'));
  console.log('Includes CartDrawer trigger:', s.includes('CartDrawer') || s.includes('cart-drawer') || s.includes('open'));
});

// Check bundle logic specifically
const bundleSection = code.indexOf('zv-bundle') !== -1 || code.indexOf('tier') !== -1;
console.log('\nHas bundle/tier UI:', bundleSection);
