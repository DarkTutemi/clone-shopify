import fs from 'fs';

const raw = fs.readFileSync('Clone-pandadrum/live_template_collection.zavelyn-handpans.json', 'utf8');
const tpl = JSON.parse(raw);

console.log('Sections in live template:');
for (const [secKey, secVal] of Object.entries(tpl.sections)) {
  console.log(`\n--- Section: ${secKey} (${secVal.type}) ---`);
  if (secVal.settings && Object.keys(secVal.settings).length > 0) {
    console.log('Settings:', secVal.settings);
  }
  if (secVal.blocks) {
    console.log('Blocks count:', Object.keys(secVal.blocks).length);
    for (const [blkKey, blkVal] of Object.entries(secVal.blocks)) {
      console.log(`  Block ${blkKey}:`, blkVal.settings);
    }
  }
}
