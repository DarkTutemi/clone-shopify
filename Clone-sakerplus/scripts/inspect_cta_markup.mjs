import fs from 'fs';

const dom = fs.readFileSync('Clone-sakerplus/data/heating_lamp/extracted_news_dom.html', 'utf8');

const idx1 = dom.indexOf('GET 50% OFF →');
if (idx1 !== -1) {
  console.log('--- Context around GET 50% OFF → ---');
  console.log(dom.substring(idx1 - 300, idx1 + 200));
}

const idx2 = dom.indexOf('GET 50% OFF NOW');
if (idx2 !== -1) {
  console.log('--- Context around GET 50% OFF NOW ---');
  console.log(dom.substring(idx2 - 300, idx2 + 200));
}
