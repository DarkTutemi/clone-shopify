import fs from 'fs';

const content = fs.readFileSync('backup_phase_a_templates/sections__zavelyn-pdp-main.liquid', 'utf8');
const lines = content.split('\n');
for (let i = 0; i < 40; i++) {
  if (lines[i].includes('class=')) {
    console.log(`Line ${i}: ${lines[i].trim()}`);
  }
}
