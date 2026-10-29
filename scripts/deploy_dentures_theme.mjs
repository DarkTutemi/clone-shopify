import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
import fs from 'fs';
import { getAccessToken, SHOP } from './batch1_config.mjs';

const API_VERSION = '2026-10';
const DEV_THEME_ID = '187736654009';
const LIVE_THEME_ID = '187597717689';

export function patchPdpMainForDentures(sourceContent) {
  let content = sourceContent;

  // 1. Current variant override
  const targetCurrentVariant = `{%- if product.handle == 'livestock-heating-lamp' -%}
  {%- assign default_variant = product.variants | where: 'title', '3 Pack' | first -%}
  {%- if default_variant -%}
    {%- assign current_variant = default_variant -%}
  {%- endif -%}
{%- endif -%}`;

  const replacementCurrentVariant = `{%- if product.handle == 'livestock-heating-lamp' -%}
  {%- assign default_variant = product.variants | where: 'title', '3 Pack' | first -%}
  {%- if default_variant -%}
    {%- assign current_variant = default_variant -%}
  {%- endif -%}
{%- elsif product.handle == 'zavelyn-custom-fit-home-dentures' -%}
  {%- assign default_variant = product.variants | where: 'title', '3 Complete Sets' | first -%}
  {%- if default_variant -%}
    {%- assign current_variant = default_variant -%}
  {%- endif -%}
{%- endif -%}`;

  if (!content.includes(targetCurrentVariant)) {
    throw new Error('Could not find targetCurrentVariant in zavelyn-pdp-main');
  }
  content = content.replace(targetCurrentVariant, replacementCurrentVariant);

  // 2. Buybox copy & bullet highlights
  const targetBulletsFallback = `            {% elsif product.handle == 'zavelyn-botanaroots-organic-batana-hair-growth-oil' %}`;
  const replacementBulletsFallback = `            {% elsif product.handle == 'zavelyn-custom-fit-home-dentures' %}
              <p class="zv-lead-prop">
                A removable denture kit designed for at-home fitting, with a natural-looking appearance and an adjustable molding process.
              </p>
              <div class="zv-bullet-list">
                <div class="zv-bullet-item"><span class="zv-bullet-icon">🦷</span><span><strong>Natural-Looking Smile</strong> — designed to resemble the appearance of natural teeth and realistic gum tones</span></div>
                <div class="zv-bullet-item"><span class="zv-bullet-icon">✨</span><span><strong>At-Home Fitting</strong> — adjustable thermal molding system for a personalized suction fit</span></div>
                <div class="zv-bullet-item"><span class="zv-bullet-icon">💧</span><span><strong>Removable & Easy to Maintain</strong> — designed for everyday removal, hygienic soaking, and simple cleaning</span></div>
                <div class="zv-bullet-item"><span class="zv-bullet-icon">🚚</span><span><strong>Tracked US Shipping</strong> — dispatched within 24–48h from US fulfillment hubs</span></div>
                <div class="zv-bullet-item"><span class="zv-bullet-icon">🛡️</span><span><strong>30-Day Returns</strong> — backed by Zavelyn customer protection (unopened/sealed oral hygiene items eligible)</span></div>
              </div>
            {% elsif product.handle == 'zavelyn-botanaroots-organic-batana-hair-growth-oil' %}`;

  if (!content.includes(targetBulletsFallback)) {
    throw new Error('Could not find targetBulletsFallback in zavelyn-pdp-main');
  }
  content = content.replace(targetBulletsFallback, replacementBulletsFallback);

  // 3. Bundle selector scoped cards
  const targetBundleBranch = `            {% if bundle_opt_idx > -1 %}
              {% if product.handle == 'livestock-heating-lamp' %}`;
  const replacementBundleBranch = `            {% if bundle_opt_idx > -1 %}
              {% if product.handle == 'zavelyn-custom-fit-home-dentures' %}
                <!-- SCOPED BUNDLE CONFIGURATION: ZAVELYN CUSTOM-FIT HOME DENTURES (BUY 3 -> BUY 2 -> BUY 1) -->
                <!-- BUNDLE 1: BUY 3 (DEFAULT SELECTED) -->
                <label class="kc-offer" data-tier="3" data-bundle-val="3 Complete Sets">
                  <input class="kc-offer__input" type="radio" name="zv_offer_tier" value="3" checked>
                  <span class="kc-offer__card">
                    <span class="kc-offer__badge">BEST VALUE · FREE SHIPPING · EXTRA 10% OFF</span>
                    <span class="kc-offer__body">
                      <span class="kc-offer__radio" aria-hidden="true"></span>
                      <span class="kc-offer__copy">
                        <strong>3 Complete Sets</strong>
                        <small>Full Kit · Free Shipping</small>
                      </span>
                      <span class="kc-offer__prices">
                        <strong class="zv-tier-price" data-tier-idx="3">$107.97</strong>
                        <s class="zv-tier-compare" data-tier-idx="3">$239.94</s>
                      </span>
                    </span>
                  </span>
                </label>

                <!-- BUNDLE 2: BUY 2 (NO PROMOTIONAL BADGES) -->
                <label class="kc-offer" data-tier="2" data-bundle-val="2 Complete Sets">
                  <input class="kc-offer__input" type="radio" name="zv_offer_tier" value="2">
                  <span class="kc-offer__card">
                    <span class="kc-offer__body">
                      <span class="kc-offer__radio" aria-hidden="true"></span>
                      <span class="kc-offer__copy">
                        <strong>2 Complete Sets</strong>
                        <small>Full Kit · Free Shipping</small>
                      </span>
                      <span class="kc-offer__prices">
                        <strong class="zv-tier-price" data-tier-idx="2">$79.98</strong>
                        <s class="zv-tier-compare" data-tier-idx="2">$159.96</s>
                      </span>
                    </span>
                  </span>
                </label>

                <!-- BUNDLE 3: BUY 1 (SHIPPING +$4.95) -->
                <label class="kc-offer" data-tier="1" data-bundle-val="1 Complete Set">
                  <input class="kc-offer__input" type="radio" name="zv_offer_tier" value="1">
                  <span class="kc-offer__card">
                    <span class="kc-offer__badge">SHIPPING +$4.95</span>
                    <span class="kc-offer__body">
                      <span class="kc-offer__radio" aria-hidden="true"></span>
                      <span class="kc-offer__copy">
                        <strong>1 Complete Set</strong>
                        <small>Full Kit · Standard Delivery</small>
                      </span>
                      <span class="kc-offer__prices">
                        <strong class="zv-tier-price" data-tier-idx="1">$39.99</strong>
                        <s class="zv-tier-compare" data-tier-idx="1">$79.98</s>
                      </span>
                    </span>
                  </span>
                </label>

              {% elsif product.handle == 'livestock-heating-lamp' %}`;

  if (!content.includes(targetBundleBranch)) {
    throw new Error('Could not find targetBundleBranch in zavelyn-pdp-main');
  }
  content = content.replace(targetBundleBranch, replacementBundleBranch);

  // 4. JavaScript activeTier default
  const targetActiveTier = `  let activeTier = ({{ product.handle | json }} === 'livestock-heating-lamp') ? 3 : 2;`;
  const replacementActiveTier = `  let activeTier = ({{ product.handle | json }} === 'livestock-heating-lamp' || {{ product.handle | json }} === 'zavelyn-custom-fit-home-dentures') ? 3 : 2;`;

  if (!content.includes(targetActiveTier)) {
    throw new Error('Could not find targetActiveTier in zavelyn-pdp-main');
  }
  content = content.replace(targetActiveTier, replacementActiveTier);

  return content;
}

async function deployThemeAssets(themeId, themeName) {
  const token = await getAccessToken();
  console.log(`\n========================================================================`);
  console.log(`DEPLOYING DENTURES ASSETS TO ${themeName} (${themeId})`);
  console.log(`========================================================================\n`);

  // 1. Upload sections/zavelyn-dentures-body.liquid
  console.log('1. Uploading sections/zavelyn-dentures-body.liquid...');
  const bodyContent = fs.readFileSync('./sections/zavelyn-dentures-body.liquid', 'utf8');
  const resBody = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/${themeId}/assets.json`, {
    method: 'PUT',
    headers: { 'X-Shopify-Access-Token': token, 'Content-Type': 'application/json' },
    body: JSON.stringify({ asset: { key: 'sections/zavelyn-dentures-body.liquid', value: bodyContent } })
  });
  const dataBody = await resBody.json();
  if (dataBody.asset) console.log('✓ sections/zavelyn-dentures-body.liquid uploaded!');
  else throw new Error('Failed to upload dentures body: ' + JSON.stringify(dataBody));

  // 2. Upload templates/product.dentures.json
  console.log('2. Uploading templates/product.dentures.json...');
  const templateContent = fs.readFileSync('./templates/product.dentures.json', 'utf8');
  const resTpl = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/${themeId}/assets.json`, {
    method: 'PUT',
    headers: { 'X-Shopify-Access-Token': token, 'Content-Type': 'application/json' },
    body: JSON.stringify({ asset: { key: 'templates/product.dentures.json', value: templateContent } })
  });
  const dataTpl = await resTpl.json();
  if (dataTpl.asset) console.log('✓ templates/product.dentures.json uploaded!');
  else throw new Error('Failed to upload dentures template: ' + JSON.stringify(dataTpl));

  // 3. Fetch current live zavelyn-pdp-main.liquid, patch it, and upload
  console.log('3. Fetching and patching sections/zavelyn-pdp-main.liquid...');
  const resCurPdp = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/${themeId}/assets.json?asset[key]=sections/zavelyn-pdp-main.liquid`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const curPdpData = await resCurPdp.json();
  const currentPdpContent = curPdpData.asset?.value;
  if (!currentPdpContent) throw new Error('Could not fetch current zavelyn-pdp-main');

  const patchedPdp = patchPdpMainForDentures(currentPdpContent);

  const resPutPdp = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/${themeId}/assets.json`, {
    method: 'PUT',
    headers: { 'X-Shopify-Access-Token': token, 'Content-Type': 'application/json' },
    body: JSON.stringify({ asset: { key: 'sections/zavelyn-pdp-main.liquid', value: patchedPdp } })
  });
  const dataPutPdp = await resPutPdp.json();
  if (dataPutPdp.asset) console.log('✓ sections/zavelyn-pdp-main.liquid patched and uploaded!');
  else throw new Error('Failed to upload patched pdp-main: ' + JSON.stringify(dataPutPdp));
}

async function setSeoMetafields(productId) {
  const token = await getAccessToken();
  console.log(`\nSetting SEO Metafields for Product ${productId}...`);

  const metafields = [
    {
      namespace: 'global',
      key: 'title_tag',
      value: 'Zavelyn Custom-Fit Home Dentures | At-Home Denture Kit',
      type: 'single_line_text_field'
    },
    {
      namespace: 'global',
      key: 'description_tag',
      value: 'Explore Zavelyn Custom-Fit Home Dentures, a removable denture kit designed for at-home fitting. Shop single sets or bundle offers with tracked US delivery.',
      type: 'multi_line_text_field'
    }
  ];

  for (const m of metafields) {
    const res = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/products/${productId}/metafields.json`, {
      method: 'POST',
      headers: { 'X-Shopify-Access-Token': token, 'Content-Type': 'application/json' },
      body: JSON.stringify({ metafield: m })
    });
    const d = await res.json();
    if (d.metafield) {
      console.log(`✓ Set metafield ${m.namespace}.${m.key}`);
    } else {
      console.log(`Note on metafield ${m.key}:`, JSON.stringify(d));
    }
  }
}

async function main() {
  const prodData = JSON.parse(fs.readFileSync('./scratch/created_dentures_product.json', 'utf8'));

  // 1. Set SEO Metafields
  await setSeoMetafields(prodData.id);

  // 2. Deploy to Dev Theme first
  await deployThemeAssets(DEV_THEME_ID, 'DEV THEME');

  // 3. Deploy to Live Theme
  await deployThemeAssets(LIVE_THEME_ID, 'LIVE THEME');
}

main().catch(console.error);
