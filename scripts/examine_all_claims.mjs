import fs from 'fs';

const sources = JSON.parse(fs.readFileSync('scripts/batch3_full_sources.json', 'utf8'));

for (const [id, prod] of Object.entries(sources)) {
  console.log(`\n================================================================`);
  console.log(`PRODUCT ID: ${id} | TITLE: ${prod.title} | HANDLE: ${prod.handle}`);
  console.log(`================================================================`);
  console.log('FULL DESCRIPTION:\n');
  console.log(prod.description);
}
