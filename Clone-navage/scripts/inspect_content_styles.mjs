import fs from 'fs';

const rawHtml = fs.readFileSync('Clone-navage/data/sinusitis_page.html', 'utf8');

// Check all <style> tags between firstContentSection and footerPos
const firstContentSection = rawHtml.indexOf('id="shopify-section-template--27702861398296__rich_text_bEickp"');
const footerPos = rawHtml.indexOf('id="shopify-section-sections--27702862315800__footer"');
const contentSnippet = rawHtml.substring(firstContentSection, footerPos);

const innerStyles = [...contentSnippet.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi)].map(m => m[1]);
console.log('Inner styles count inside content:', innerStyles.length);
console.log('Total inner styles length:', innerStyles.reduce((acc, s) => acc + s.length, 0));

// Let's check max-width or width rules in these styles
const widthRules = innerStyles.filter(s => s.includes('max-width') || s.includes('width') || s.includes('margin'));
console.log('Styles with width/max-width/margin:', widthRules.length);
widthRules.forEach((s, idx) => {
  console.log(`\n[Style ${idx + 1}] snippet:`, s.substring(0, 300));
});
