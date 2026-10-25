import fs from 'fs';

async function run() {
  const res = await fetch('https://pandadrum.com/pages/collection');
  const html = await res.text();
  fs.writeFileSync('Clone-pandadrum/collection_page.html', html, 'utf8');
  console.log('Saved collection_page.html, size:', html.length);

  // Look for key text blocks
  const sections = [
    'Escape to Calmness',
    'Panda Drums® you\'ll love',
    'Easy to Learn and Soothing to Play',
    'What you\'ll get',
    'Radhi Devlukia',
    'Ethereal in E',
    'Comparison',
    'Buyer\'s Guide',
    'Awakening Inner Creativity',
    'Fun for the Whole Family',
    'Healing Resonance',
    'Making Music More Magical',
    'Boost Your Child\'s Creativity',
    'FAQ'
  ];

  for (const s of sections) {
    const idx = html.indexOf(s);
    console.log(`\n--- Keyword: "${s}" -> Found at index: ${idx} ---`);
    if (idx !== -1) {
      console.log(html.slice(idx, idx + 400).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
    }
  }
}

run().catch(console.error);
