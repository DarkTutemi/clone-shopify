import fs from 'fs';

// Read original earthly-pdp-main.liquid backup or freshly read
const original = fs.readFileSync('Clone-earthlyderm/sections/earthly-pdp-main.liquid', 'utf8');

// Load accordions
const blackSoapAccData = JSON.parse(fs.readFileSync('black_soap_accordions.json', 'utf8'));

// Clean accordion contents: strip outer unclosed <div class="product__accordion__inner rte" ...> if present, or close it properly!
const cleanedAccordions = blackSoapAccData.map(a => {
  let c = a.content.trim();
  if (c.startsWith('<div class="product__accordion__inner rte" data-collapsible-content="">')) {
    c = c.slice('<div class="product__accordion__inner rte" data-collapsible-content="">'.length);
  }
  // Check if it ends with </div>
  return {
    title: a.title,
    body: c
  };
});

// Build clean accordions HTML
const blackSoapAccordionsHtml = cleanedAccordions.map((a, idx) => `
      <!-- Accordion ${idx + 1}: ${a.title} -->
      <div class="pdp-rich-acc-card">
        <button type="button" class="pdp-rich-acc-header" onclick="toggleRichAcc(this)">
          <span>${a.title}</span>
          <span class="pdp-acc-toggle-icon">+</span>
        </button>
        <div class="pdp-rich-acc-body">
          ${a.body}
        </div>
      </div>`).join('\n');

// Now let's fix earthly-pdp-main.liquid
// Find where the accordions conditional starts and ends
const startMark = `{% if product.handle contains 'african' or product.handle contains 'black' %}`;
const elseMark = `{% else %}\n<!-- Accordion: Why It Works -->`;

const sIdx = original.indexOf(startMark);
const eIdx = original.indexOf(elseMark);

let updated = original;
if (sIdx !== -1 && eIdx !== -1) {
  updated = original.slice(0, sIdx + startMark.length) + '\n' + blackSoapAccordionsHtml + '\n      ' + original.slice(eIdx);
}

fs.writeFileSync('Clone-earthlyderm/sections/earthly-pdp-main.liquid', updated);
console.log('Cleaned and balanced all accordions in earthly-pdp-main.liquid');
