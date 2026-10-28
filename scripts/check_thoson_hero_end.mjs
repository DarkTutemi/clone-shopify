import fs from 'fs';

const content = fs.readFileSync('backup_phase_a_templates/sections__thoson-magtrack-funnel.liquid', 'utf8');
const lines = content.split('\n');
lines.forEach((l, i) => {
  if (l.includes('</section>') && i < 300) {
    console.log(`Line ${i}: ${l.trim()}`);
  }
  if (l.includes('<!-- SECTION 2') || l.includes('class="wf-banner') || l.includes('class="wf-sec') || l.includes('class="wf-features')) {
    if (i < 300) console.log(`Section start line ${i}: ${l.trim()}`);
  }
});
