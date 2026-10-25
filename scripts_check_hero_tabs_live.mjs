import fs from 'fs';

const raw = fs.readFileSync('Clone-pandadrum/live_template_collection.zavelyn-handpans.json', 'utf8');
const tpl = JSON.parse(raw);

console.log('zhp_hero:', JSON.stringify(tpl.sections.zhp_hero, null, 2));
console.log('zhp_model_tabs:', JSON.stringify(tpl.sections.zhp_model_tabs, null, 2));
console.log('zhp_what_you_get:', JSON.stringify(tpl.sections.zhp_what_you_get, null, 2));
