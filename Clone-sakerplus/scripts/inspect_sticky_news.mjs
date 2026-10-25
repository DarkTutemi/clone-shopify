import fs from 'fs';

const dom = fs.readFileSync('Clone-sakerplus/data/heating_lamp/extracted_news_dom.html', 'utf8');
const lines = dom.split('\n');

for (let i = 0; i < lines.length; i++) {
  if (lines[i].includes('fixed') || lines[i].includes('sticky') || lines[i].includes('bottom-0')) {
    console.log(`Line ${i}:`, lines[i].substring(0, 150));
  }
}
