import fs from 'fs';

const html = fs.readFileSync('Clone-sakerplus/data/loox_sample.html', 'utf8');

// Find pagination or load more buttons / scripts
const loadMore = html.match(/load-more[\s\S]*?>/gi) || [];
console.log('Load more matches:', loadMore);

const scriptMatches = [...html.matchAll(/data-url=["']([^"']+)["']/gi)];
console.log('data-url matches:', scriptMatches.map(m => m[1]));

const nextMatches = [...html.matchAll(/next-page[^"']*["']([^"']*)["']/gi)];
console.log('next-page matches:', nextMatches.map(m => m[0]));

// Search for any ajax URL
const ajaxMatches = [...html.matchAll(/https:\/\/loox\.io\/widget\/7GiGt8f0rB\/[a-zA-Z0-9_\-\?&=]+/gi)];
console.log('Ajax matches:', [...new Set(ajaxMatches.map(m => m[0]))]);
