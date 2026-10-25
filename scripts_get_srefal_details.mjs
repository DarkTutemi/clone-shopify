import fs from 'fs';

const hero = fs.readFileSync('Clone-srefalsteam/theme/snippets/srefalsteam-hero.liquid', 'utf8');
const sections = fs.readFileSync('Clone-srefalsteam/theme/snippets/srefalsteam-sections.liquid', 'utf8');

const specMatch = hero.match(/Specifications<\/span>[\s\S]*?<div class="collapsible-content[^"]*"[^>]*>([\s\S]*?)<\/div>/i);
if (specMatch) {
  console.log('SPEC CONTENT:\n', specMatch[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
} else {
  // Let's find "Power" or "Voltage" or "Capacity"
  const s2 = hero.match(/(?:Power|Capacity|Pressure|Voltage)[\s\S]{0,500}/i);
  if (s2) console.log('SPEC MATCH 2:', s2[0].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim());
}

const faqMatches = [...sections.matchAll(/<button[^>]*class="[^"]*accordionButtonStyle[^"]*"[^>]*>([\s\S]*?)<\/button>[\s\S]*?<div[^>]*class="[^"]*panelStyle[^"]*"[^>]*>([\s\S]*?)<\/div>/gi)];
console.log('FOUND FAQS:', faqMatches.length);
faqMatches.forEach((m, i) => {
  const q = m[1].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  const a = m[2].replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();
  console.log(`Q${i+1}: ${q}`);
  console.log(`A${i+1}: ${a}\n`);
});
