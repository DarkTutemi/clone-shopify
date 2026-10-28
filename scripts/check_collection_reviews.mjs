import fs from 'fs';

const content = fs.readFileSync('draft_theme_pre_fix_backup/sections__willa-main-collection.liquid', 'utf8');
const idx = content.indexOf('modulo');
console.log(content.slice(idx - 200, idx + 300));
