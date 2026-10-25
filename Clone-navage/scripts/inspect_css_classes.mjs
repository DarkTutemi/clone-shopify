import fs from 'fs';

const css = fs.readFileSync('Clone-navage/data/navage-theme.css', 'utf8');

// Find .container
const matches = [...css.matchAll(/(\.container[^{]*\{[^}]*\})/g)].map(m => m[1]);
console.log('Container matches count:', matches.length);
matches.slice(0, 5).forEach(m => console.log(m));

// Find .content-box
const cbMatches = [...css.matchAll(/(\.content-box[^{]*\{[^}]*\})/g)].map(m => m[1]);
console.log('\nContent-box matches count:', cbMatches.length);
cbMatches.slice(0, 5).forEach(m => console.log(m));

// Find heading.h2
const h2Matches = [...css.matchAll(/(\.h2[^{]*\{[^}]*\})/g)].map(m => m[1]);
console.log('\nh2 matches count:', h2Matches.length);
h2Matches.slice(0, 5).forEach(m => console.log(m));
