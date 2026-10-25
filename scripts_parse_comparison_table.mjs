import fs from 'fs';

const html = fs.readFileSync('Clone-pandadrum/comparison_table_raw.html', 'utf8');

// Replace tags with newlines and inspect
const text = html.replace(/<[^>]+>/g, '\n').split('\n').map(l => l.trim()).filter(l => l.length > 0);
console.log(text.slice(0, 80));
