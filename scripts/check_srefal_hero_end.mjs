import fs from 'fs';

const content = fs.readFileSync('backup_phase_a_templates/sections__srefalsteam-funnel.liquid', 'utf8');
const lines = content.split('\n');
console.log(lines.slice(140, 185).join('\n'));
