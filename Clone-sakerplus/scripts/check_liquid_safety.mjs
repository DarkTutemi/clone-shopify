import fs from 'fs';

const html = fs.readFileSync('Clone-sakerplus/data/extracted_article_body.html', 'utf8');

const hasDoubleCurly = html.includes('{{');
const hasLiquidTag = html.includes('{%');

console.log('Has {{ in content:', hasDoubleCurly);
console.log('Has {% in content:', hasLiquidTag);

if (hasDoubleCurly) {
  const matches = [...html.matchAll(/\{\{[\s\S]*?\}\}/g)].map(m => m[0]);
  console.log('Sample {{ occurrences:', matches.slice(0, 5));
}
