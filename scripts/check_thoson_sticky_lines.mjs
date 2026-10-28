import fs from 'fs';

const thoson = fs.readFileSync('backup_phase_a_templates/sections__thoson-magtrack-funnel.liquid', 'utf8');
const lines = thoson.split('\n');
lines.forEach((l, i) => {
  if (l.includes('wf-sticky-bar') || l.includes('sticky-bar')) {
    console.log(`Line ${i}: ${l.trim().slice(0, 80)}`);
  }
});
