import fs from 'fs';

const html = fs.readFileSync('Clone-navage/data/sinusitis_page.html', 'utf8');

const bannerIdx = html.indexOf('ng-banner-anc');
if (bannerIdx !== -1) {
  const start = html.lastIndexOf('<div', bannerIdx);
  const end = html.indexOf('</div>', bannerIdx + 500);
  console.log('Banner snippet:\n', html.substring(start, end + 6));
} else {
  console.log('No ng-banner-anc found');
}
