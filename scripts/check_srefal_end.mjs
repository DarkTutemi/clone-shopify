import fs from 'fs';

const content = fs.readFileSync('backup_phase_a_templates/sections__srefalsteam-funnel.liquid', 'utf8');
const lines = content.split('\n');
console.log(lines.slice(lines.length - 80).join('\n'));
