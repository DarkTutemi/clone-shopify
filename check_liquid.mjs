import fs from 'fs';

const content = fs.readFileSync('Clone-earthlyderm/sections/earthly-pdp-main.liquid', 'utf8');
const lines = content.split('\n');

for (let i = 0; i < lines.length; i++) {
  const line = lines[i];
  if (line.includes('{%') && (line.includes('if') || line.includes('unless') || line.includes('else') || line.includes('endif') || line.includes('endunless'))) {
    console.log(`Line ${i + 1}: ${line.trim()}`);
  }
}
