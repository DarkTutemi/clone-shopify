import fs from 'fs';

const html = fs.readFileSync('Clone-thoson/data/product.html', 'utf8');

// Find all image URLs in Thoson
const imgUrls = [...new Set(html.match(/https:\/\/[^\"\'\s\)]+\.(?:png|jpg|jpeg|webp)/gi) || [])];
console.log('Thoson Image URLs count:', imgUrls.length);
imgUrls.slice(0, 15).forEach((u, i) => console.log(`  [${i+1}] ${u}`));

// Find video URLs
const videoUrls = [...new Set(html.match(/https:\/\/[^\"\'\s\)]+\.mp4/gi) || [])];
console.log('\nThoson Video URLs:', videoUrls);

// Find what's included
const incIdx = html.indexOf("What's included");
if (incIdx !== -1) {
  console.log('\n--- What\'s included snippet ---');
  console.log(html.substring(incIdx, incIdx + 800).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '));
}

// Find FAQs
const faqIdx = html.indexOf('Frequently Asked');
if (faqIdx !== -1) {
  console.log('\n--- FAQ snippet ---');
  console.log(html.substring(faqIdx, faqIdx + 1200).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' '));
}
