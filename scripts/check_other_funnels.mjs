import fs from 'fs';

const files = [
  'backup_phase_a_templates/sections__thoson-magtrack-funnel.liquid',
  'backup_phase_a_templates/sections__yeoman-sweep-funnel.liquid',
  'backup_phase_a_templates/sections__heating-lamp-funnel.liquid'
];

files.forEach(f => {
  const content = fs.readFileSync(f, 'utf8');
  const lines = content.split('\n');
  console.log(`\n=== ${f} ===`);
  console.log('Total lines:', lines.length);
  lines.forEach((l, i) => {
    if (l.includes('<!-- 1.') || l.includes('<!-- 2.') || l.includes('class="wf-hero-section') || l.includes('class="hero')) {
      console.log(`Line ${i}: ${l.trim().slice(0, 80)}`);
    }
  });
});
