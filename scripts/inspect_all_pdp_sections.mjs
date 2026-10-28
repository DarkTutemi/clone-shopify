import fs from 'fs';
import path from 'path';

const baseDir = 'backups/live_theme_187597717689_baseline/sections';
const sectionFiles = [
  'zavelyn-pdp-main.liquid',
  'zavelyn-pdp-ticker.liquid',
  'zavelyn-pdp-value-prop.liquid',
  'zavelyn-pdp-features.liquid',
  'zavelyn-pdp-storytelling.liquid',
  'zavelyn-pdp-steps.liquid',
  'zavelyn-pdp-comparison.liquid',
  'zavelyn-pdp-specs.liquid',
  'zavelyn-pdp-included.liquid',
  'zavelyn-pdp-faq.liquid',
  'zavelyn-pdp-description-fallback.liquid',
  'zavelyn-pdp-shipping.liquid'
];

for (const file of sectionFiles) {
  const filePath = path.join(baseDir, file);
  if (fs.existsSync(filePath)) {
    const content = fs.readFileSync(filePath, 'utf8');
    const sStart = content.indexOf('{% schema %}');
    const sEnd = content.indexOf('{% endschema %}');
    let schemaObj = null;
    if (sStart !== -1 && sEnd !== -1) {
      try {
        schemaObj = JSON.parse(content.substring(sStart + 12, sEnd).trim());
      } catch (e) {
        schemaObj = 'PARSE_ERROR';
      }
    }
    console.log(`--- ${file} (${content.length} chars) ---`);
    console.log(`Schema name: ${schemaObj?.name || 'none'}`);
    console.log(`Settings count: ${schemaObj?.settings?.length || 0}`);
    console.log(`Blocks count: ${schemaObj?.blocks?.length || 0}`);
    if (schemaObj?.settings && schemaObj.settings.length > 0) {
      console.log('Settings:', schemaObj.settings.map(s => s.id || s.content));
    }
    console.log('');
  } else {
    console.log(`File not found: ${file}`);
  }
}
