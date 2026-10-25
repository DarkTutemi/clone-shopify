import fs from 'fs';

const html = fs.readFileSync('Clone-navage/data/sinusitis_page.html', 'utf8');
const snippet = html.substring(130534, 138046);
console.log('Snippet length:', snippet.length);
fs.writeFileSync('Clone-navage/data/between_header_and_content.html', snippet);
console.log('Saved to between_header_and_content.html');
