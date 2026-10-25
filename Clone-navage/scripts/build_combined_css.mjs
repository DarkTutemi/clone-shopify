import fs from 'fs';

const headStyle = fs.readFileSync('Clone-navage/data/head_style_1.css', 'utf8');
const themeCss = fs.readFileSync('Clone-navage/data/navage-theme.css', 'utf8');

// Combine them into navage-sinusitis.css
const combinedCss = `/* Naväge Sinusitis Root Tokens & Typography */
${headStyle}

/* Naväge Sinusitis Banner Styles */
.ng-banner-anc {
  background: #0d1b2e !important;
  width: 100% !important;
  padding: 16px 24px !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  position: relative !important;
  box-sizing: border-box !important;
}
.ng-banner-anc__inner {
  display: flex !important;
  align-items: center !important;
  gap: 12px !important;
  flex-wrap: wrap !important;
  justify-content: center !important;
  max-width: 100% !important;
}
.ng-banner-anc__tag {
  background: #f5df4d !important;
  color: #0d1b2e !important;
  font-size: 11px !important;
  font-weight: 800 !important;
  text-transform: uppercase !important;
  letter-spacing: 0.06em !important;
  padding: 3px 8px !important;
  border-radius: 3px !important;
  white-space: nowrap !important;
  line-height: 1.4 !important;
  flex-shrink: 0 !important;
}
.ng-banner-anc__text {
  font-size: 18px !important;
  font-weight: 400 !important;
  color: rgba(255,255,255,0.85) !important;
  margin: 0 !important;
  line-height: 1.4 !important;
}
.ng-banner-anc__text strong {
  color: #ffffff !important;
  font-weight: 700 !important;
}
.ng-banner-anc__divider {
  width: 2px !important;
  height: 16px !important;
  background: rgba(255,255,255,0.2) !important;
  flex-shrink: 0 !important;
}
.ng-banner-anc__link {
  font-size: 18px !important;
  font-weight: 700 !important;
  color: #4fd7d8 !important;
  text-decoration: underline !important;
  text-underline-offset: 3px !important;
  white-space: nowrap !important;
  line-height: 1.4 !important;
}
.ng-banner-anc__link:hover {
  color: #ffffff !important;
}
.ng-banner-anc__dismiss {
  position: absolute !important;
  top: 50% !important;
  right: 20px !important;
  transform: translateY(-50%) !important;
  background: transparent !important;
  border: none !important;
  color: rgba(255,255,255,0.6) !important;
  font-size: 22px !important;
  line-height: 1 !important;
  cursor: pointer !important;
  padding: 4px 8px !important;
}
.ng-banner-anc__dismiss:hover {
  color: #ffffff !important;
}

/* Naväge Rich Text & Layout Overrides */
.content-box--large {
  max-width: 820px !important;
  margin-left: auto !important;
  margin-right: auto !important;
  padding: 0 16px !important;
}
.content-box--text-center {
  text-align: center !important;
}
.content-box--text-left {
  text-align: left !important;
}
.heading.h2 {
  font-family: 'Roboto Condensed', sans-serif !important;
  font-size: 34px !important;
  line-height: 1.25 !important;
  font-weight: 700 !important;
  color: #074174 !important;
  margin: 28px 0 16px 0 !important;
}
@media (max-width: 768px) {
  .heading.h2 {
    font-size: 26px !important;
  }
}
.text-container p {
  font-size: 17px !important;
  line-height: 1.65 !important;
  color: #333333 !important;
  margin-bottom: 18px !important;
}
.text-container p em {
  color: #074174 !important;
  font-size: 19px !important;
  display: block !important;
  margin-top: 8px !important;
}

/* Featured Products Grid in Advertorial */
.ai-featured-products__container-av3zuskjnwwhic3bttaigenblock445d9f7jpdp3w {
  display: grid !important;
  grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)) !important;
  gap: 24px !important;
  max-width: 1000px !important;
  margin: 0 auto !important;
  padding: 20px 16px !important;
}

/* Main theme styles */
${themeCss}
`;

fs.writeFileSync('Clone-navage/theme/assets/navage-sinusitis.css', combinedCss, 'utf8');
console.log('✔ Updated navage-sinusitis.css, total length:', Buffer.byteLength(combinedCss, 'utf8'));
console.log('Under 256 KB?', Buffer.byteLength(combinedCss, 'utf8') < 262144);
