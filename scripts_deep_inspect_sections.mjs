import fs from 'fs';

const html = fs.readFileSync('Clone-pandadrum/collection_page.html', 'utf8');

function extractBetween(startPattern, endPattern) {
  const startIdx = typeof startPattern === 'string' ? html.indexOf(startPattern) : html.search(startPattern);
  if (startIdx === -1) return null;
  const endIdx = typeof endPattern === 'string' ? html.indexOf(endPattern, startIdx) : html.slice(startIdx).search(endPattern);
  if (endIdx === -1) return html.slice(startIdx, startIdx + 5000);
  return typeof endPattern === 'string' ? html.slice(startIdx, endIdx) : html.slice(startIdx, startIdx + endIdx);
}

// Let's search each block:
const blocks = [
  { name: 'Hero', keyword: 'Escape to Calmness' },
  { name: 'Product Grid', keyword: "Panda Drums® you'll love" },
  { name: 'Model Tabs / Pillars', keyword: 'Easy to Learn and Soothing to Play' },
  { name: 'What you get', keyword: "What you'll get" },
  { name: 'Endorsements', keyword: 'Radhi Devlukia' },
  { name: 'Comparison Table', keyword: 'Which instrument should you choose?' },
  { name: 'Buyers Guide', keyword: "The Ultimate Panda Drum® Buyer's Guide" },
  { name: 'FAQ', keyword: 'Frequently Asked Questions' }
];

for (const b of blocks) {
  const idx = html.indexOf(b.keyword);
  console.log(`\n================== ${b.name} (idx: ${idx}) ==================`);
  if (idx !== -1) {
    // Print around this block
    const chunk = html.slice(Math.max(0, idx - 200), idx + 2500);
    // Find images in chunk
    const imgMatches = [...chunk.matchAll(/<img[^>]+src=["']([^"']+)["']/gi)].map(m => m[1]);
    console.log('Images in chunk:', imgMatches.slice(0, 5));
    // Clean text
    const cleanText = chunk.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 600);
    console.log('Text preview:\n', cleanText);
  }
}
