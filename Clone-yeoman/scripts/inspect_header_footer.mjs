import fs from 'fs';

const html = fs.readFileSync('Clone-yeoman/data/the-yeoman-sweep.html', 'utf8');

// Find header
const headerMatch = html.match(/<header[\s\S]*?<\/header>/i);
console.log('Header found?', !!headerMatch);
if (headerMatch) {
  console.log('Header snippet:\n', headerMatch[0].substring(0, 500));
}

// Find footer
const footerMatch = html.match(/<footer[\s\S]*?<\/footer>/i);
console.log('\nFooter found?', !!footerMatch);
if (footerMatch) {
  console.log('Footer snippet:\n', footerMatch[0].substring(0, 500));
}
