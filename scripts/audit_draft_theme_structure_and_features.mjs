import fs from 'fs';
import { getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';

const DRAFT_THEME_ID = '187597717689';

async function fetchAsset(key, token) {
  const getUrl = `https://${SHOP}/admin/api/${API_VERSION}/themes/${DRAFT_THEME_ID}/assets.json?asset[key]=${encodeURIComponent(key)}`;
  const res = await fetch(getUrl, { headers: { 'X-Shopify-Access-Token': token } });
  const data = await res.json();
  return data.asset?.value || '';
}

async function auditStructure() {
  console.log('=== AUDITING DRAFT THEME 187597717689 STRUCTURE & FEATURES ===\n');
  const token = await getAccessToken();

  const auditReport = {
    settingsData: {},
    layoutTheme: {},
    cartDrawer: {},
    header: {},
    homepage: {},
    productTemplates: {},
    trackingIntegrations: {}
  };

  // 1. Settings Data
  console.log('1. Auditing config/settings_data.json...');
  const settingsJsonStr = await fetchAsset('config/settings_data.json', token);
  try {
    const settings = JSON.parse(settingsJsonStr);
    const current = settings.current || {};
    auditReport.settingsData = {
      freeShippingThreshold: current.free_shipping_threshold || current.shipping_threshold || 'NOT_FOUND',
      cartType: current.cart_type || 'NOT_FOUND',
      currencyCodeEnabled: current.currency_code_enabled,
      rawKeys: Object.keys(current).filter(k => k.includes('shipping') || k.includes('cart') || k.includes('guarantee'))
    };
    console.log('   Settings findings:', auditReport.settingsData);
  } catch (e) {
    console.warn('   Could not parse settings_data.json:', e.message);
  }

  // 2. Layout theme.liquid
  console.log('2. Auditing layout/theme.liquid...');
  const themeLiquid = await fetchAsset('layout/theme.liquid', token);
  auditReport.layoutTheme = {
    length: themeLiquid.length,
    hasMetaPixel: /fbevents\.js|fbq\(/i.test(themeLiquid),
    hasGoogleAnalytics: /googletagmanager|gtag\(/i.test(themeLiquid),
    hasTikTokPixel: /analytics\.tiktok\.com|ttq\./i.test(themeLiquid),
    hasLoox: /loox/i.test(themeLiquid),
    hasCartDrawer: /cart-drawer|willa-cart-drawer/i.test(themeLiquid),
    hasElixirCss: /zavelyn-elixir/i.test(themeLiquid)
  };
  console.log('   layout/theme.liquid findings:', auditReport.layoutTheme);

  // 3. Header & Announcement Bar
  console.log('3. Auditing Header & Announcement Bar...');
  const headerLiquid = await fetchAsset('sections/willa-header.liquid', token);
  const headerGroup = await fetchAsset('sections/header-group.json', token);
  auditReport.header = {
    hasWillaHeader: headerLiquid.length > 0,
    announcementTextInHeader: (headerLiquid.match(/announcement[^>]*>([^<]+)/i) || [])[1] || 'DYNAMIC',
    headerGroupContentSnippet: headerGroup.slice(0, 300)
  };
  console.log('   Header findings:', auditReport.header);

  // 4. Cart Drawer
  console.log('4. Auditing Cart Drawer...');
  const cartDrawerLiquid = await fetchAsset('sections/willa-cart-drawer.liquid', token);
  auditReport.cartDrawer = {
    length: cartDrawerLiquid.length,
    hasFreeShippingBar: /free[-_ ]shipping/i.test(cartDrawerLiquid),
    thresholdValueDetected: (cartDrawerLiquid.match(/(\$49|4900|49)/) || [])[0] || 'NOT_FOUND',
    hasCheckoutForm: /action=["']\/checkout["']|href=["']\/checkout["']/i.test(cartDrawerLiquid),
    hasTermsBadge: /guarantee|security|protection/i.test(cartDrawerLiquid)
  };
  console.log('   Cart Drawer findings:', auditReport.cartDrawer);

  // 5. Product Templates (Universal vs Custom)
  console.log('5. Auditing Product Templates...');
  const universalProductTemplate = await fetchAsset('templates/product.json', token);
  const pdpMainSection = await fetchAsset('sections/zavelyn-pdp-main.liquid', token);
  auditReport.productTemplates = {
    universalTemplateLength: universalProductTemplate.length,
    pdpMainLength: pdpMainSection.length,
    hasStickyAtc: /sticky[-_ ]atc|sticky[-_ ]cart|fixed[-_ ]bottom/i.test(pdpMainSection) || /sticky/i.test(universalProductTemplate),
    pricingLogicUsesShopifyMoney: /\{\{\s*product\.selected_or_first_available_variant\.price\s*\|\s*money/i.test(pdpMainSection) || /variant\.price\s*\|\s*money/i.test(pdpMainSection),
    hasFakeHardcodedPrice: /\$\d+\.\d{2}/.test(pdpMainSection.replace(/\{\{[^}]+\}\}/g, ''))
  };
  console.log('   Product Templates findings:', auditReport.productTemplates);

  fs.writeFileSync('scripts/draft_theme_features_audit.json', JSON.stringify(auditReport, null, 2), 'utf8');
  console.log('\nAudit complete! Output saved to scripts/draft_theme_features_audit.json');
}

auditStructure().catch(console.error);
