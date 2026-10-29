import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
import fs from 'fs';
import { getAccessToken, SHOP } from './batch1_config.mjs';

const API_VERSION = '2026-10';
const LIVE_THEME_ID = '187597717689';
const DEV_THEME_ID = '187736654009';

export function patchPdpMainForStorageBins(sourceContent) {
  let content = sourceContent;

  // 1. Current variant override
  const targetCurrentVariant = `{%- elsif product.handle == 'zavelyn-custom-fit-home-dentures' -%}
  {%- assign default_variant = product.variants | where: 'title', '3 Complete Sets' | first -%}
  {%- if default_variant -%}
    {%- assign current_variant = default_variant -%}
  {%- endif -%}
{%- endif -%}`;

  const replacementCurrentVariant = `{%- elsif product.handle == 'zavelyn-custom-fit-home-dentures' -%}
  {%- assign default_variant = product.variants | where: 'title', '3 Complete Sets' | first -%}
  {%- if default_variant -%}
    {%- assign current_variant = default_variant -%}
  {%- endif -%}
{%- elsif product.handle == 'zavelyn-foldable-zippered-storage-bins' -%}
  {%- assign default_variant = product.variants | where: 'title', '6 Storage Bins' | first -%}
  {%- if default_variant -%}
    {%- assign current_variant = default_variant -%}
  {%- endif -%}
{%- endif -%}`;

  if (!content.includes(targetCurrentVariant)) {
    throw new Error('Could not find targetCurrentVariant in zavelyn-pdp-main');
  }
  content = content.replace(targetCurrentVariant, replacementCurrentVariant);

  // 2. Buybox copy & bullet highlights
  const targetBulletsAnchor = `            {% elsif product.handle == 'zavelyn-custom-fit-home-dentures' %}`;
  const replacementBulletsAnchor = `            {% elsif product.handle == 'zavelyn-foldable-zippered-storage-bins' %}
              <p class="zv-lead-prop">
                An extra-large foldable storage container engineered for bulky quilts, blankets, winter coats, and seasonal linens.
              </p>
              <div class="zv-bullet-list">
                <div class="zv-bullet-item"><span class="zv-bullet-icon">🧺</span><span><strong>XXL 210L Capacity</strong> — effortlessly stores 3 thick comforters or up to 200 seasonal garments</span></div>
                <div class="zv-bullet-item"><span class="zv-bullet-icon">🧵</span><span><strong>Reinforced Carrying Handles</strong> — cross-stitched webbing handles for secure, balanced lifting</span></div>
                <div class="zv-bullet-item"><span class="zv-bullet-icon">🔒</span><span><strong>Smooth Dual Zippers</strong> — robust two-way stainless steel zippers for wide, hassle-free packing</span></div>
                <div class="zv-bullet-item"><span class="zv-bullet-icon">🌿</span><span><strong>Breathable Dust Protection</strong> — premium fabric shields linens while keeping airflow fresh</span></div>
                <div class="zv-bullet-item"><span class="zv-bullet-icon">📐</span><span><strong>Collapsible Space Saver</strong> — folds completely flat into a slim profile when not in use</span></div>
              </div>
            {% elsif product.handle == 'zavelyn-custom-fit-home-dentures' %}`;

  if (!content.includes(targetBulletsAnchor)) {
    throw new Error('Could not find targetBulletsAnchor in zavelyn-pdp-main');
  }
  content = content.replace(targetBulletsAnchor, replacementBulletsAnchor);

  // 3. Bundle selector scoped cards
  const targetBundleBranch = `            {% if bundle_opt_idx > -1 %}
              {% if product.handle == 'zavelyn-custom-fit-home-dentures' %}`;

  const replacementBundleBranch = `            {% if bundle_opt_idx > -1 %}
              {% if product.handle == 'zavelyn-foldable-zippered-storage-bins' %}
                <!-- SCOPED BUNDLE CONFIGURATION: ZAVELYN FOLDABLE STORAGE BINS (BUY 6 -> BUY 4 -> BUY 2) -->
                <!-- BUNDLE 1: BUY 6 (HERO CARD - DEFAULT SELECTED) -->
                <label class="kc-offer zv-storage-bin-card" data-tier="6" data-bundle-val="6 Storage Bins">
                  <input class="kc-offer__input" type="radio" name="zv_offer_tier" value="6" checked>
                  <span class="kc-offer__card">
                    <span class="kc-offer__badge">👑 BEST VALUE · FREE SHIPPING · EXTRA 15% OFF</span>
                    <span class="kc-offer__body">
                      <span class="kc-offer__radio" aria-hidden="true"></span>
                      <span class="zv-card-thumb-wrap">
                        <img src="https://cdn.shopify.com/s/files/1/0826/2483/9865/files/zavelyn-storage-bins-buy6-thumb.jpg?v=1793289989" alt="Buy 6 Storage Bins" width="60" height="60" loading="eager" class="zv-card-thumb-img">
                      </span>
                      <span class="kc-offer__copy">
                        <strong>Buy 6</strong>
                        <small>6 × XXL Storage Bins</small>
                        <span class="zv-card-badges-row-mini">
                          <span class="zv-badge-chip-green">FREE SHIPPING</span>
                          <span class="zv-badge-chip-green">EXTRA 15% OFF</span>
                        </span>
                      </span>
                      <span class="kc-offer__prices">
                        <strong class="zv-tier-price" data-tier-idx="6">$101.95</strong>
                        <span class="zv-unit-pill-warm">~$16.99 / bin</span>
                        <s class="zv-tier-compare" data-tier-idx="6">$239.88</s>
                      </span>
                    </span>
                  </span>
                </label>

                <!-- BUNDLE 2: BUY 4 (CLEAN CARD - FREE SHIPPING) -->
                <label class="kc-offer zv-storage-bin-card" data-tier="4" data-bundle-val="4 Storage Bins">
                  <input class="kc-offer__input" type="radio" name="zv_offer_tier" value="4">
                  <span class="kc-offer__card">
                    <span class="kc-offer__body">
                      <span class="kc-offer__radio" aria-hidden="true"></span>
                      <span class="zv-card-thumb-wrap">
                        <img src="https://cdn.shopify.com/s/files/1/0826/2483/9865/files/zavelyn-storage-bins-buy4-thumb.jpg?v=1793289996" alt="Buy 4 Storage Bins" width="60" height="60" loading="eager" class="zv-card-thumb-img">
                      </span>
                      <span class="kc-offer__copy">
                        <strong>Buy 4</strong>
                        <small>4 × XXL Storage Bins</small>
                      </span>
                      <span class="kc-offer__prices">
                        <strong class="zv-tier-price" data-tier-idx="4">$79.96</strong>
                        <span class="zv-unit-pill-warm">$19.99 / bin</span>
                        <s class="zv-tier-compare" data-tier-idx="4">$159.92</s>
                      </span>
                    </span>
                  </span>
                </label>

                <!-- BUNDLE 3: BUY 2 (SHIPPING +$4.95) -->
                <label class="kc-offer zv-storage-bin-card" data-tier="2" data-bundle-val="2 Storage Bins">
                  <input class="kc-offer__input" type="radio" name="zv_offer_tier" value="2">
                  <span class="kc-offer__card">
                    <span class="kc-offer__badge zv-badge-orange-header">SHIPPING +$4.95</span>
                    <span class="kc-offer__body">
                      <span class="kc-offer__radio" aria-hidden="true"></span>
                      <span class="zv-card-thumb-wrap">
                        <img src="https://cdn.shopify.com/s/files/1/0826/2483/9865/files/zavelyn-storage-bins-buy2-thumb.jpg?v=1793290000" alt="Buy 2 Storage Bins" width="60" height="60" loading="eager" class="zv-card-thumb-img">
                      </span>
                      <span class="kc-offer__copy">
                        <strong>Buy 2</strong>
                        <small>2 × XXL Storage Bins</small>
                      </span>
                      <span class="kc-offer__prices">
                        <strong class="zv-tier-price" data-tier-idx="2">$39.98</strong>
                        <span class="zv-unit-pill-warm">$19.99 / bin</span>
                        <s class="zv-tier-compare" data-tier-idx="2">$79.96</s>
                      </span>
                    </span>
                  </span>
                </label>

              {% elsif product.handle == 'zavelyn-custom-fit-home-dentures' %}`;

  if (!content.includes(targetBundleBranch)) {
    throw new Error('Could not find targetBundleBranch in zavelyn-pdp-main');
  }
  content = content.replace(targetBundleBranch, replacementBundleBranch);

  // 4. JavaScript activeTier default
  const targetActiveTier = `  let activeTier = ({{ product.handle | json }} === 'livestock-heating-lamp' || {{ product.handle | json }} === 'zavelyn-custom-fit-home-dentures') ? 3 : 2;`;
  const replacementActiveTier = `  let activeTier = ({{ product.handle | json }} === 'zavelyn-foldable-zippered-storage-bins') ? 6 : (({{ product.handle | json }} === 'livestock-heating-lamp' || {{ product.handle | json }} === 'zavelyn-custom-fit-home-dentures') ? 3 : 2);`;

  if (!content.includes(targetActiveTier)) {
    throw new Error('Could not find targetActiveTier in zavelyn-pdp-main');
  }
  content = content.replace(targetActiveTier, replacementActiveTier);

  // 5. Add custom CSS styles for storage bin bundle cards
  const targetCssAnchor = `/* BUNDLE OFFERS (.kc-offers) */`;
  const customCss = `/* STORAGE BINS BUNDLE SELECTOR STYLES */
.zv-storage-bin-card .zv-card-thumb-wrap {
  width: 58px;
  height: 58px;
  flex: 0 0 58px;
  border-radius: 8px;
  overflow: hidden;
  background: #f7f9f8;
  border: 1px solid rgba(23, 67, 60, 0.1);
  display: flex;
  align-items: center;
  justify-content: center;
}
.zv-storage-bin-card .zv-card-thumb-img {
  width: 100%;
  height: 100%;
  object-fit: contain;
  display: block;
}
.zv-storage-bin-card .zv-badge-orange-header {
  background: #D97706 !important;
  color: #FFFFFF !important;
}
.zv-card-badges-row-mini {
  display: flex;
  align-items: center;
  gap: 5px;
  margin-top: 4px;
}
.zv-badge-chip-green {
  display: inline-block;
  font-size: 10px;
  font-weight: 800;
  color: #15803D;
  background: #F0FDF4;
  border: 1px solid #DCFCE7;
  padding: 2px 6px;
  border-radius: 4px;
  line-height: 1.1;
  letter-spacing: 0.2px;
}
`;

  if (!content.includes(targetCssAnchor)) {
    throw new Error('Could not find targetCssAnchor in zavelyn-pdp-main');
  }
  content = content.replace(targetCssAnchor, customCss + '\n' + targetCssAnchor);

  return content;
}

async function deployToTheme(themeId, themeName) {
  const token = await getAccessToken();
  console.log(`\n========================================================================`);
  console.log(`DEPLOYING STORAGE BINS ASSETS TO ${themeName} (${themeId})`);
  console.log(`========================================================================\n`);

  // 1. Upload sections/zavelyn-storage-bins-body.liquid
  console.log('1. Uploading sections/zavelyn-storage-bins-body.liquid...');
  const bodyContent = fs.readFileSync('./sections/zavelyn-storage-bins-body.liquid', 'utf8');
  const resBody = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/${themeId}/assets.json`, {
    method: 'PUT',
    headers: { 'X-Shopify-Access-Token': token, 'Content-Type': 'application/json' },
    body: JSON.stringify({ asset: { key: 'sections/zavelyn-storage-bins-body.liquid', value: bodyContent } })
  });
  const dataBody = await resBody.json();
  if (dataBody.asset) console.log('✓ sections/zavelyn-storage-bins-body.liquid uploaded!');
  else throw new Error('Failed to upload storage bins body: ' + JSON.stringify(dataBody));

  // 2. Upload templates/product.storage-bins.json
  console.log('2. Uploading templates/product.storage-bins.json...');
  const templateContent = fs.readFileSync('./templates/product.storage-bins.json', 'utf8');
  const resTpl = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/${themeId}/assets.json`, {
    method: 'PUT',
    headers: { 'X-Shopify-Access-Token': token, 'Content-Type': 'application/json' },
    body: JSON.stringify({ asset: { key: 'templates/product.storage-bins.json', value: templateContent } })
  });
  const dataTpl = await resTpl.json();
  if (dataTpl.asset) console.log('✓ templates/product.storage-bins.json uploaded!');
  else throw new Error('Failed to upload storage bins template: ' + JSON.stringify(dataTpl));

  // 3. Fetch current live zavelyn-pdp-main.liquid, patch it, and upload
  console.log('3. Fetching and patching sections/zavelyn-pdp-main.liquid...');
  const resCurPdp = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/${themeId}/assets.json?asset[key]=sections/zavelyn-pdp-main.liquid`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const curPdpData = await resCurPdp.json();
  const currentPdpContent = curPdpData.asset?.value;
  if (!currentPdpContent) throw new Error('Could not fetch current zavelyn-pdp-main');

  const patchedPdp = patchPdpMainForStorageBins(currentPdpContent);

  const resPutPdp = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/${themeId}/assets.json`, {
    method: 'PUT',
    headers: { 'X-Shopify-Access-Token': token, 'Content-Type': 'application/json' },
    body: JSON.stringify({ asset: { key: 'sections/zavelyn-pdp-main.liquid', value: patchedPdp } })
  });
  const dataPutPdp = await resPutPdp.json();
  if (dataPutPdp.asset) console.log('✓ sections/zavelyn-pdp-main.liquid patched and uploaded!');
  else throw new Error('Failed to upload patched pdp-main: ' + JSON.stringify(dataPutPdp));
}

async function main() {
  // Deploy to Dev Theme first
  await deployToTheme(DEV_THEME_ID, 'DEV THEME');

  // Deploy to Live Theme
  await deployToTheme(LIVE_THEME_ID, 'LIVE THEME');

  console.log('\n✓ ALL THEME ASSETS DEPLOYED SUCCESSFULLY TO DEV AND LIVE THEMES!');
}

main().catch(console.error);
