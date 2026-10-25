import fs from 'fs';

const html = fs.readFileSync('ackerman_page.html', 'utf8');

// Search for text snippets containing 'heat', 'temperature', 'glove', 'features', 'battery'
const lines = html.split('\n');
const relevant = [];

for (const l of lines) {
  const clean = l.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  if (clean.length > 25 && clean.length < 300) {
    if (clean.toLowerCase().includes('heat') || clean.toLowerCase().includes('glove') || clean.toLowerCase().includes('display') || clean.toLowerCase().includes('usb') || clean.toLowerCase().includes('degree')) {
      relevant.push(clean);
    }
  }
}

console.log('Relevant copy snippets found:', relevant.length);
console.log(relevant.slice(0, 20));
