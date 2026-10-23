import fs from 'fs';

const html = fs.readFileSync('Clone-earthlyderm/data/homepage.html', 'utf8');
const lines = html.split('\n');

// Find start and end of reviews slider
const startIdx = lines.findIndex(l => l.includes('id="shopify-section-template--19526977814662__section_reviews_slider_UQ3V97"'));
let endIdx = -1;
for (let i = startIdx; i < lines.length; i++) {
  if (lines[i].includes('</script>') && lines[i-1].includes('})();')) {
    endIdx = i;
    break;
  }
}

console.log('Found indices:', startIdx, endIdx);

if (startIdx === -1 || endIdx === -1) {
  throw new Error('Could not find reviews slider section boundaries');
}

const sectionContent = lines.slice(startIdx, endIdx + 1).join('\n');

const fullLiquid = `{% schema %}
{
  "name": "Earthly Reviews Slider",
  "settings": []
}
{% endschema %}

${sectionContent}
`;

fs.writeFileSync('Clone-earthlyderm/sections/earthly-reviews-slider.liquid', fullLiquid);
console.log('Wrote Clone-earthlyderm/sections/earthly-reviews-slider.liquid, length:', fullLiquid.length);
