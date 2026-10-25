import fs from 'fs';

const html = fs.readFileSync('Clone-yeoman/data/the-yeoman-sweep.html', 'utf8');

const cssLinks = [...html.matchAll(/<link[^>]+rel=["']stylesheet["'][^>]+href=["']([^"']+)["']/gi)].map(m => m[1]);
console.log('CSS links in the-yeoman-sweep.html:');
cssLinks.forEach(c => console.log(' ', c));
