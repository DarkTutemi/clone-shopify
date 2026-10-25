import fs from 'fs';

const checkoutHtml = fs.readFileSync('Clone-sakerplus/data/heating_lamp/checkout.html', 'utf8');
const landingHtml = fs.readFileSync('Clone-sakerplus/data/heating_lamp/landing.html', 'utf8');

console.log('Checkout size:', checkoutHtml.length);
console.log('Landing size:', landingHtml.length);

// Extract title, price, variants from checkout
const priceMatches = checkoutHtml.match(/\$\d+(\.\d{2})?/g) || [];
console.log('Prices in checkout:', [...new Set(priceMatches)].slice(0, 10));

// Check for JSON data embedded in the page (__NUXT__, window.__INITIAL_STATE__, etc.)
['__NUXT__', '__INITIAL_STATE__', 'dataLayer', 'product', 'variants'].forEach(key => {
  const count = (checkoutHtml.match(new RegExp(key, 'gi')) || []).length;
  console.log(`${key} in checkout: ${count}`);
});

// Look for Nuxt state in checkout
const nuxtMatch = checkoutHtml.match(/window\.__NUXT__\s*=\s*([\s\S]*?);<\/script>/);
if (nuxtMatch) {
  console.log('Found __NUXT__ in checkout! Length:', nuxtMatch[1].length);
  fs.writeFileSync('Clone-sakerplus/data/heating_lamp/checkout_nuxt.js', nuxtMatch[1]);
}

const landingNuxt = landingHtml.match(/window\.__NUXT__\s*=\s*([\s\S]*?);<\/script>/);
if (landingNuxt) {
  console.log('Found __NUXT__ in landing! Length:', landingNuxt[1].length);
  fs.writeFileSync('Clone-sakerplus/data/heating_lamp/landing_nuxt.js', landingNuxt[1]);
}
