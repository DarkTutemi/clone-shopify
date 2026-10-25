import fs from 'fs';

const content = fs.readFileSync('Clone-navage/theme/templates/page.sinusitis-sufferer.liquid', 'utf8');

console.log('Template length:', content.length);
console.log('Contains container class?', content.includes('class="container'));
console.log('Contains rich-text?', content.includes('rich-text'));

const mainPos = content.indexOf('<main');
console.log('\n--- First 1500 chars of main ---');
console.log(content.substring(mainPos, mainPos + 1500));
