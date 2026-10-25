import fs from 'fs';

const liquid = fs.readFileSync('Clone-navage/theme/templates/page.sinusitis-sufferer.liquid', 'utf8');

const bannerPos = liquid.indexOf('ng-banner-anc');
console.log('Banner pos in liquid:', bannerPos);
if (bannerPos !== -1) {
  console.log('Snippet around banner pos:\n', liquid.substring(bannerPos - 100, bannerPos + 500));
}
