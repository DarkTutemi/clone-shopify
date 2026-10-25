import fs from 'fs';

const html = fs.readFileSync('Clone-navage/data/sinusitis_page.html', 'utf8');

// Find start of content: either banner or first template section
const bannerStart = html.indexOf('ng-banner-anc');
const firstTemplateSection = html.indexOf('shopify-section-template--27702861398296__rich_text_bEickp');
const lastTemplateSection = html.indexOf('shopify-section-template--27702861398296__c7fc11f5-ca04-4627-8967-049e83cafebe');

console.log('bannerStart pos:', bannerStart);
console.log('firstTemplateSection pos:', firstTemplateSection);
console.log('lastTemplateSection pos:', lastTemplateSection);

// Find end of last section
const afterLast = html.indexOf('<!-- END sections: template--27702861398296__c7fc11f5-ca04-4627-8967-049e83cafebe', lastTemplateSection);
console.log('afterLast pos:', afterLast);

// Let's inspect where header starts and ends
const headerStart = html.indexOf('shopify-section--header');
const headerEnd = html.indexOf('<!-- END sections: sections--27702862348568__header', headerStart);
console.log('headerStart pos:', headerStart, 'headerEnd pos:', headerEnd);

// Let's inspect footer start and end
const footerStart = html.indexOf('shopify-section--footer');
const footerEnd = html.indexOf('<!-- END sections: sections--27702862315800__footer', footerStart);
console.log('footerStart pos:', footerStart, 'footerEnd pos:', footerEnd);
