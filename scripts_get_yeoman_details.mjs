import fs from 'fs';

const raw = fs.readFileSync('Clone-yeoman/data/the-yeoman-sweep.json', 'utf8');
const p = JSON.parse(raw);

console.log('=== YEOMAN PRODUCT SUMMARY ===');
console.log('Title:', p.title);
console.log('Handle:', p.handle);
console.log('Vendor:', p.vendor);
console.log('Variants:');
p.variants?.forEach(v => {
  console.log(`  - ID: ${v.id} | Title: ${v.title} | Price: ${v.price} | CompareAt: ${v.compare_at_price}`);
});
console.log('Images:');
p.images?.forEach((img, i) => {
  console.log(`  [${i+1}] ${typeof img === 'string' ? img : img.src}`);
});

const html = fs.readFileSync('Clone-yeoman/data/the-yeoman-sweep.html', 'utf8');
console.log('\nHTML Length:', html.length);

// Extract headings
const headings = [...html.matchAll(/<h[1-4][^>]*>(.*?)<\/h[1-4]>/gis)].map(m => m[1].replace(/<[^>]+>/g, '').trim()).filter(Boolean);
console.log('Sample Headings:', headings.slice(0, 15));

// Extract FAQ items
const faqMatches = [...html.matchAll(/<details[^>]*>([\s\S]*?)<\/details>/gi)];
console.log('Found Details/FAQs:', faqMatches.length);
if (faqMatches.length > 0) {
  faqMatches.slice(0, 8).forEach((m, i) => {
    const sum = m[1].match(/<summary[^>]*>([\s\S]*?)<\/summary>/i);
    const summary = sum ? sum[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim() : '';
    const body = m[1].replace(/<summary[\s\S]*?<\/summary>/i, '').replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
    console.log(`FAQ ${i+1}: ${summary}\n  ${body.slice(0, 200)}...\n`);
  });
}
