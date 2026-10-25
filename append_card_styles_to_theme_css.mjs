import fs from 'fs';

const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';
const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = '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';
const THEME_ID = '186607567033';

async function getAccessToken() {
  const tokenRes = await fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  const data = await tokenRes.json();
  return data.access_token;
}

const globalCardCss = `
/* ==========================================================================
   ZAVELYN GLOBAL PRODUCT CARD & COLLECTION GRID DESIGN SYSTEM
   ========================================================================== */
.zv-products-grid,
.product-grid,
.willa-products-grid {
  display: grid !important;
  grid-template-columns: repeat(4, 1fr) !important;
  gap: 24px !important;
  margin-bottom: 30px !important;
}

.zv-prod-card,
.willa-prod-card,
.product-card {
  background: #ffffff !important;
  border: 1px solid #e2e8f0 !important;
  border-radius: 16px !important;
  overflow: hidden !important;
  display: flex !important;
  flex-direction: column !important;
  transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.25s ease !important;
  position: relative !important;
  box-shadow: 0 1px 3px rgba(0,0,0,0.02) !important;
  text-decoration: none !important;
}

.zv-prod-card:hover,
.willa-prod-card:hover,
.product-card:hover {
  transform: translateY(-5px) !important;
  box-shadow: 0 16px 36px rgba(0,0,0,0.08) !important;
  border-color: #cbd5e1 !important;
}

.zv-prod-media,
.willa-prod-img-wrap,
.product-card__media {
  position: relative !important;
  width: 100% !important;
  aspect-ratio: 1 / 1 !important;
  background: #f8fafc !important;
  overflow: hidden !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  text-decoration: none !important;
}

.zv-img-primary,
.willa-prod-img-wrap img,
.product-card__media img {
  width: 100% !important;
  height: 100% !important;
  object-fit: contain !important;
  padding: 14px !important;
  box-sizing: border-box !important;
  transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease !important;
}

.zv-img-secondary {
  position: absolute !important;
  inset: 0 !important;
  width: 100% !important;
  height: 100% !important;
  object-fit: contain !important;
  padding: 14px !important;
  opacity: 0 !important;
  box-sizing: border-box !important;
  transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease !important;
}

.zv-prod-card:hover .zv-img-primary,
.willa-prod-card:hover .willa-prod-img-wrap img {
  transform: scale(1.05) !important;
}

.zv-prod-card:hover .zv-img-secondary {
  opacity: 1 !important;
  transform: scale(1.05) !important;
}

.zv-badges-wrap {
  position: absolute !important;
  top: 12px !important;
  left: 12px !important;
  z-index: 5 !important;
  display: flex !important;
  flex-direction: column !important;
  gap: 6px !important;
}

.zv-badge-sale,
.willa-sale-tag,
.badge--sale {
  background: #e11d48 !important;
  color: #ffffff !important;
  font-size: 11px !important;
  font-weight: 800 !important;
  letter-spacing: 0.5px !important;
  padding: 4px 8px !important;
  border-radius: 6px !important;
  text-transform: uppercase !important;
  box-shadow: 0 2px 8px rgba(225,29,72,0.3) !important;
  line-height: 1.2 !important;
  display: inline-block !important;
}

.zv-badge-tag {
  position: absolute !important;
  top: 12px !important;
  right: 12px !important;
  z-index: 5 !important;
  background: rgba(255,255,255,0.92) !important;
  backdrop-filter: blur(4px) !important;
  color: #0f172a !important;
  font-size: 10.5px !important;
  font-weight: 700 !important;
  padding: 4px 8px !important;
  border-radius: 6px !important;
  border: 1px solid rgba(0,0,0,0.06) !important;
  box-shadow: 0 2px 6px rgba(0,0,0,0.04) !important;
}

.zv-prod-body,
.willa-prod-card-body,
.product-card__info {
  padding: 16px !important;
  display: flex !important;
  flex-direction: column !important;
  flex-grow: 1 !important;
  box-sizing: border-box !important;
}

.zv-rating-row,
.willa-stars {
  display: flex !important;
  align-items: center !important;
  gap: 5px !important;
  font-size: 12.5px !important;
  margin-bottom: 6px !important;
}

.zv-stars {
  color: #f59e0b !important;
  font-size: 13px !important;
  letter-spacing: 1px !important;
}

.zv-rating-num {
  font-weight: 700 !important;
  color: #0f172a !important;
}

.zv-review-count {
  color: #64748b !important;
  font-size: 12px !important;
}

.zv-prod-title,
.willa-prod-title,
.product-card__title {
  margin: 0 0 10px 0 !important;
  font-size: 14.5px !important;
  font-weight: 700 !important;
  line-height: 1.4 !important;
  height: 40px !important;
  display: -webkit-box !important;
  -webkit-line-clamp: 2 !important;
  -webkit-box-orient: vertical !important;
  overflow: hidden !important;
}

.zv-prod-title a,
.willa-prod-title a,
.product-card__title {
  color: #0f172a !important;
  text-decoration: none !important;
  transition: color 0.2s !important;
}

.zv-prod-title a:hover,
.willa-prod-title a:hover,
.product-card__title:hover {
  color: #2563eb !important;
  text-decoration: none !important;
}

.zv-prod-price-row,
.willa-prod-pricing {
  display: flex !important;
  align-items: baseline !important;
  gap: 8px !important;
  margin-bottom: 14px !important;
}

.zv-price-current,
.price-active {
  font-size: 19px !important;
  font-weight: 800 !important;
  color: #0f172a !important;
  letter-spacing: -0.3px !important;
}

.zv-price-compare,
.price-compare {
  font-size: 13.5px !important;
  color: #94a3b8 !important;
  text-decoration: line-through !important;
  font-weight: 500 !important;
}

.zv-card-action {
  margin-top: auto !important;
}

.zv-atc-btn,
.willa-quick-atc-btn {
  width: 100% !important;
  background: #0f172a !important;
  color: #ffffff !important;
  border: none !important;
  border-radius: 10px !important;
  padding: 11px 16px !important;
  font-size: 13.5px !important;
  font-weight: 700 !important;
  letter-spacing: 0.2px !important;
  cursor: pointer !important;
  display: flex !important;
  align-items: center !important;
  justify-content: center !important;
  gap: 8px !important;
  transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1) !important;
  box-shadow: 0 2px 6px rgba(15,23,42,0.1) !important;
  text-decoration: none !important;
}

.zv-atc-btn:hover,
.willa-quick-atc-btn:hover {
  background: #1e293b !important;
  transform: translateY(-1px) !important;
  box-shadow: 0 4px 14px rgba(15,23,42,0.2) !important;
  color: #ffffff !important;
}

.zv-atc-btn:active,
.willa-quick-atc-btn:active {
  transform: scale(0.98) !important;
}

@media (max-width: 1200px) {
  .zv-products-grid,
  .product-grid,
  .willa-products-grid {
    grid-template-columns: repeat(3, 1fr) !important;
    gap: 18px !important;
  }
}

@media (max-width: 768px) {
  .zv-products-grid,
  .product-grid,
  .willa-products-grid {
    grid-template-columns: repeat(2, 1fr) !important;
    gap: 10px !important;
  }
  .zv-prod-card,
  .willa-prod-card,
  .product-card {
    border-radius: 12px !important;
  }
  .zv-prod-body,
  .willa-prod-card-body,
  .product-card__info {
    padding: 12px !important;
  }
  .zv-prod-title,
  .willa-prod-title,
  .product-card__title {
    font-size: 13px !important;
    height: 36px !important;
    margin-bottom: 6px !important;
  }
  .zv-price-current,
  .price-active {
    font-size: 16px !important;
  }
  .zv-price-compare,
  .price-compare {
    font-size: 12px !important;
  }
  .zv-atc-btn,
  .willa-quick-atc-btn {
    padding: 9px 12px !important;
    font-size: 12.5px !important;
    border-radius: 8px !important;
  }
}
`;

async function main() {
  const token = await getAccessToken();
  const currentCss = fs.readFileSync('willafarm-theme.css', 'utf8');

  // Check if already appended
  let newCss = currentCss;
  if (!newCss.includes('ZAVELYN GLOBAL PRODUCT CARD')) {
    newCss += '\n\n' + globalCardCss;
  } else {
    // Replace the section
    const idx = newCss.indexOf('/* ==========================================================================\n   ZAVELYN GLOBAL PRODUCT CARD');
    newCss = newCss.substring(0, idx) + globalCardCss;
  }

  console.log('Uploading updated assets/willafarm-theme.css to Theme 186607567033...');
  const res = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-01/themes/${THEME_ID}/assets.json`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify({
      asset: {
        key: 'assets/willafarm-theme.css',
        value: newCss
      }
    })
  });
  const data = await res.json();
  if (data.errors) throw new Error(JSON.stringify(data.errors));
  console.log('✔ Successfully deployed global product card styles to assets/willafarm-theme.css!');
}

main().catch(console.error);
