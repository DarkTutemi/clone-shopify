import fs from 'fs';

const products = JSON.parse(fs.readFileSync('scripts/audit_products_summary.json', 'utf8'));
const templates = JSON.parse(fs.readFileSync('scripts/audit_templates_content.json', 'utf8'));

console.log("=================================================");
console.log("1. PRODUCT TEMPLATE SUFFIX BREAKDOWN (83 Products)");
console.log("=================================================");

const suffixCount = {};
const suffixToProducts = {};

for (const p of products) {
  const s = p.template_suffix || 'DEFAULT (templates/product.json)';
  suffixCount[s] = (suffixCount[s] || 0) + 1;
  if (!suffixToProducts[s]) suffixToProducts[s] = [];
  suffixToProducts[s].push({ id: p.id, title: p.title, handle: p.handle, status: p.status, body_len: p.body_html_length });
}

console.log("Template Suffix Distribution:");
for (const [k, v] of Object.entries(suffixCount)) {
  console.log(`  - ${k}: ${v} products`);
}

console.log("\n=================================================");
console.log("2. ANALYZING UNIVERSAL TEMPLATE: templates/product.json");
console.log("=================================================");
const universalTemplate = JSON.parse(templates['templates/product.json']);
console.log("Sections in templates/product.json:");
console.log("Order:", universalTemplate.order);
for (const k of universalTemplate.order) {
  console.log(`  - Section [${k}] type: ${universalTemplate.sections[k]?.type}`);
}

console.log("\n=================================================");
console.log("3. ANALYZING CUSTOM PRODUCT TEMPLATES");
console.log("=================================================");
const customProductTemplates = Object.keys(templates).filter(k => k.startsWith('templates/product.') && k !== 'templates/product.json');
console.log(`Total custom product templates found: ${customProductTemplates.length}`);
for (const cpt of customProductTemplates) {
  try {
    const parsed = JSON.parse(templates[cpt]);
    console.log(`\nTemplate: ${cpt}`);
    console.log(`  Sections order:`, parsed.order);
    const types = (parsed.order || []).map(o => parsed.sections[o]?.type);
    console.log(`  Section types:`, types.join(', '));
  } catch (e) {
    console.log(`  Error parsing ${cpt}:`, e.message);
  }
}

// Write detailed report
fs.writeFileSync('scripts/audit_template_breakdown.json', JSON.stringify({
  suffixCount,
  suffixToProducts,
  universalTemplateSections: universalTemplate
}, null, 2));

console.log("\nSaved audit_template_breakdown.json");
