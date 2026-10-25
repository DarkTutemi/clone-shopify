import fs from 'fs';

const html = fs.readFileSync('Clone-sakerplus/data/loox_sample.html', 'utf8');
const idx = html.indexOf('data-id="iNDW4lv3o8"');
console.log(html.slice(idx, idx + 2500));
