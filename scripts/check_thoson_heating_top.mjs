import fs from 'fs';

const files = [
  'backup_phase_a_templates/sections__thoson-magtrack-funnel.liquid',
  'backup_phase_a_templates/sections__heating-lamp-funnel.liquid'
];

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const lines = content.split('\n');
  console.log(`\n=== ${f} ===`);
  console.log(lines.slice(0, 35).join('\n'));
});
