import fs from 'fs';

const raw = fs.readFileSync('Clone-pandadrum/live_template_collection.zavelyn-handpans.json', 'utf8');
const tpl = JSON.parse(raw);

console.log('zhp_bestsellers in live template:');
console.log(JSON.stringify(tpl.sections.zhp_bestsellers, null, 2));
