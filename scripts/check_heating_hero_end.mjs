import fs from 'fs';

const content = fs.readFileSync('backup_phase_a_templates/sections__heating-lamp-funnel.liquid', 'utf8');
const lines = content.split('\n');
lines.forEach((l, i) => {
  if (l.includes('</section>') && i < 350) {
    console.log(`Line ${i}: ${l.trim()}`);
  }
  if (l.includes('<!-- SECTION 2') || l.includes('class="wf-sec') || l.includes('class="wf-features') || l.includes('<!-- 2.')) {
    if (i < 350) console.log(`Section start line ${i}: ${l.trim()}`);
  }
});
