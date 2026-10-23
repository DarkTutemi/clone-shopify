import fs from 'fs';

const html = fs.readFileSync('C:/Users/vutru/.gemini/antigravity-ide/brain/52dfdbad-95ab-4a1a-a447-55fbc8ecb7fd/.system_generated/steps/1921/output.txt', 'utf8');

const target = 'Buy 1, Get 1 Free!';
const idx = html.indexOf(target);
console.log('Index:', idx);
if (idx !== -1) {
  console.log('Context:\n', html.slice(idx - 500, idx + 1500));
}
