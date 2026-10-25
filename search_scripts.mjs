import fs from 'fs';

const html = fs.readFileSync('ali_page.html', 'utf8');

// Find all script tags
const scripts = html.match(/<script[^>]*>([\s\S]*?)<\/script>/gi) || [];
console.log('Total scripts found:', scripts.length);

for (let i = 0; i < scripts.length; i++) {
  const content = scripts[i].replace(/<script[^>]*>|<\/script>/gi, '').trim();
  if (content.includes('432') || content.includes('12') || content.includes('handpan') || content.includes('Handpan') || content.includes('drum') || content.includes('Drum') || content.includes('price')) {
    console.log(`\nScript #${i} (length: ${content.length}):`);
    console.log(content.slice(0, 500));
  }
}
