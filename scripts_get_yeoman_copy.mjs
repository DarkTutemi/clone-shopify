import fs from 'fs';

const html = fs.readFileSync('Clone-yeoman/data/the-yeoman-sweep.html', 'utf8');

// Find "Questions we actually get"
const faqIdx = html.indexOf('Questions we actually get');
if (faqIdx !== -1) {
  const faqChunk = html.slice(faqIdx, faqIdx + 15000);
  // find faq question blocks
  const items = [...faqChunk.matchAll(/<div[^>]*class="[^"]*faq[^"]*"[^>]*>([\s\S]*?)<\/div>/gi)];
  console.log('FAQ chunk length:', faqChunk.length);
  // Let's search for questions
  const qMatches = [...faqChunk.matchAll(/<(?:button|h[3-6]|p|div)[^>]*class="[^"]*(?:title|heading|question|summary)[^"]*"[^>]*>([\s\S]*?)<\/(?:button|h[3-6]|p|div)>/gi)];
  qMatches.forEach((m, i) => {
    console.log(`Q${i+1}:`, m[1].replace(/<[^>]+>/g, '').trim());
  });
}

// Find specs or what one pass does
const passIdx = html.indexOf('What one pass actually does');
if (passIdx !== -1) {
  console.log('\n--- WHAT ONE PASS DOES ---');
  console.log(html.slice(passIdx, passIdx + 1500).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
}

// Find "What it picks up"
const picksIdx = html.indexOf('What it picks up');
if (picksIdx !== -1) {
  console.log('\n--- WHAT IT PICKS UP ---');
  console.log(html.slice(picksIdx, picksIdx + 1500).replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
}
