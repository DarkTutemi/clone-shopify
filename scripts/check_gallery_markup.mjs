import fs from 'fs';

const content = fs.readFileSync('draft_theme_pre_fix_backup/sections__zavelyn-pdp-main.liquid', 'utf8');
const mediaIdx = content.indexOf('zv-pdp-gallery-col');
console.log(content.slice(mediaIdx, mediaIdx + 2000));
