import fs from 'fs';
import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
import { getAccessToken, SHOP } from './batch1_config.mjs';

const API_VERSION = '2026-10';
const THEME_ID = '187736654009'; // Unpublished Development Theme

async function uploadBogoCss() {
  const token = await getAccessToken();

  // Read bogo-bundle.css
  const bundleCss = fs.readFileSync('prototypes/botanaroots-bogo-test/bogo-bundle.css', 'utf-8');

  // Read index.html style block
  const indexHtml = fs.readFileSync('prototypes/botanaroots-bogo-test/index.html', 'utf-8');
  const styleMatch = indexHtml.match(/<style>([\s\S]*?)<\/style>/);
  const pageCss = styleMatch ? styleMatch[1] : '';

  // Combine and prefix with strong checkmark rules
  const fullCss = `/**
 * ZAVELYN BOTANAROOTS — BOGO LANDING PAGE STYLES
 * Theme Asset: assets/botanaroots-bogo.css
 * Unpublished Theme ID: ${THEME_ID}
 */

${pageCss}

${bundleCss}

/* ==========================================================================
   UPGRADE CHECKBOX & CARD ACTIVE STATE (BULLETPROOF FIX)
   ========================================================================== */
.zv-upsell-card {
  user-select: none;
  cursor: pointer;
  transition: all 0.22s ease !important;
}

.zv-upsell-card.active,
.zv-upsell-card:has(.zv-upsell-checkbox:checked) {
  background: #F0FDF4 !important;
  border: 1.5px solid #16A34A !important;
  box-shadow: 0 2px 10px rgba(22, 163, 74, 0.08) !important;
}

.zv-upsell-checkbox-wrap {
  cursor: pointer;
}

.zv-custom-check {
  width: 22px !important;
  height: 22px !important;
  border: 2px solid #D1D5DB !important;
  border-radius: 5px !important;
  background: #FFFFFF !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  transition: all 0.18s ease !important;
}

.zv-custom-check svg {
  display: block !important;
  opacity: 0 !important;
  stroke: #FFFFFF !important;
  transition: opacity 0.18s ease !important;
}

/* Checked / Active State: Dark green background & white checkmark */
.zv-upsell-checkbox:checked + .zv-custom-check,
.zv-upsell-card.active .zv-custom-check,
.zv-upsell-card:has(.zv-upsell-checkbox:checked) .zv-custom-check {
  background: #17433C !important;
  border-color: #17433C !important;
  color: #FFFFFF !important;
}

.zv-upsell-checkbox:checked + .zv-custom-check svg,
.zv-upsell-card.active .zv-custom-check svg,
.zv-upsell-card:has(.zv-upsell-checkbox:checked) .zv-custom-check svg {
  opacity: 1 !important;
  stroke: #FFFFFF !important;
}

/* Spinner & Utility styles */
.zv-spinner {
  display: inline-block;
  width: 14px;
  height: 14px;
  border: 2px solid rgba(23,67,60,0.3);
  border-radius: 50%;
  border-top-color: #17433C;
  animation: zvSpin 0.7s linear infinite;
  vertical-align: middle;
  margin-right: 6px;
}
@keyframes zvSpin {
  to { transform: rotate(360deg); }
}

.zv-sub-note {
  font-size: 11px;
  color: #15803D;
  font-weight: 700;
  display: block;
}

.zv-bogo-landing-page {
  width: 100%;
  max-width: 100vw;
  overflow-x: hidden;
}
`;

  console.log(`Uploading updated assets/botanaroots-bogo.css (${fullCss.length} chars) to Theme ${THEME_ID}...`);
  const res = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/${THEME_ID}/assets.json`, {
    method: 'PUT',
    headers: {
      'X-Shopify-Access-Token': token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      asset: {
        key: 'assets/botanaroots-bogo.css',
        value: fullCss
      }
    })
  });
  const data = await res.json();
  if (data.asset?.key) {
    console.log(`✔ Successfully updated assets/botanaroots-bogo.css on Theme ${THEME_ID}`);
  } else {
    console.error('Upload Error:', JSON.stringify(data));
  }
}

uploadBogoCss().catch(console.error);
