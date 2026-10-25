import fs from 'fs';

const lines = fs.readFileSync('Clone-pandadrum/hero_and_tabs_clean.txt', 'utf8').split('\n');
console.log(lines.slice(600).join('\n'));
