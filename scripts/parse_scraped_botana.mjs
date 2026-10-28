import fs from 'fs';

const html = fs.readFileSync('scripts/live_botana_scraped.html', 'utf8');
const ids = [...html.matchAll(/id=["']([^"']+)["']/g)].map(m => m[1]);
const sectionDivs = ids.filter(id => id.includes('shopify-section') || id.includes('main') || id.includes('zv'));
console.log('Unique matching IDs:');
console.log([...new Set(sectionDivs)].slice(0, 50));

// Check if ticker, description fallback, faq, shipping exist in html
console.log('Includes zv-ticker-wrap:', html.includes('zv-ticker-wrap'));
console.log('Includes zv-description-fallback or body images:', html.includes('zavelyn-botana-asset-3.png'));
console.log('Includes Extended FAQ:', html.includes('Everything you need to know about Zavelyn BotanaRoots'));
console.log('Includes Doorstep Delivery:', html.includes('Doorstep Delivery Guarantee & Real-Time Tracking'));
console.log('Includes Zavelyn BotanaRoots Batana Hair Growth Oil:', html.includes('Zavelyn BotanaRoots Batana Hair Growth Oil'));
console.log('Includes Benefits:', html.includes('Nourish your scalp and bring dry, fragile hair back to life'));
console.log('Includes Bundle:', html.includes('botanaroots-bundle'));
