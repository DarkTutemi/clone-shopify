import fs from 'fs';

const html = fs.readFileSync('Clone-willafarm/data/willafarm_hero_extracted.html', 'utf8');

// Find media queries in hero
const mediaMatches = [...html.matchAll(/@media[^{]+\{([\s\S]+?\}\s*\})/g)].map(m => m[0]);
console.log('Hero media queries:\n', mediaMatches.join('\n\n'));

// Find the HTML markup (after </style>)
const markup = html.substring(html.indexOf('</style>') + 8);
console.log('\n--- Hero HTML Markup (first 1000 chars) ---');
console.log(markup.slice(0, 1000));
