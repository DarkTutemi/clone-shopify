import fs from 'fs';

const lines = fs.readFileSync('Clone-pandadrum/hero_and_tabs_clean.txt', 'utf8').split('\n');
console.log('Total lines:', lines.length);
console.log(lines.slice(120, 260).join('\n'));
