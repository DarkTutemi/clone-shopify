import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
import fs from 'fs';
import { getAccessToken, SHOP } from './batch1_config.mjs';

const API_VERSION = '2026-10';
const DEV_THEME_ID = '187736654009';
const LIVE_THEME_ID = '187597717689';

export function generatePatchedPdpMain(sourceContent) {
  let content = sourceContent;

  // 1. Set default variant to 3 Pack for livestock-heating-lamp
  const targetCurrentVariant = `{%- assign current_variant = product.selected_or_first_available_variant -%}`;
  const replacementCurrentVariant = `{%- assign current_variant = product.selected_or_first_available_variant -%}
{%- if product.handle == 'livestock-heating-lamp' -%}
  {%- assign default_variant = product.variants | where: 'title', '3 Pack' | first -%}
  {%- if default_variant -%}
    {%- assign current_variant = default_variant -%}
  {%- endif -%}
{%- endif -%}`;

  if (!content.includes(targetCurrentVariant)) {
    throw new Error('Could not find targetCurrentVariant in source content');
  }
  content = content.replace(targetCurrentVariant, replacementCurrentVariant);

  // 2. Add product-specific bundle card ordering and badges for livestock-heating-lamp
  const targetBundleBlock = `            {% if bundle_opt_idx > -1 %}
              <!-- DYNAMIC NATIVE BUNDLE VARIANTS (e.g. ThermoGlove) -->
              {% assign bundle_option = product.options_with_values[bundle_opt_idx] %}
              {% for val in bundle_option.values limit: 3 %}
                {% assign card_tier = forloop.index %}
                {% assign val_parts = val | split: ' (' %}
                {% assign clean_title = val_parts[0] %}
                {% assign clean_sub = val_parts[1] | remove: ')' | default: 'Complete Set' %}
                
                <label class="kc-offer" data-tier="{{ card_tier }}" data-bundle-val="{{ val | escape }}">
                  <input class="kc-offer__input" type="radio" name="zv_offer_tier" value="{{ card_tier }}" {% if card_tier == 2 %}checked{% endif %}>
                  <span class="kc-offer__card">
                    {% if card_tier == 2 %}<span class="kc-offer__badge">MOST POPULAR</span>{% endif %}
                    {% if card_tier == 3 %}<span class="kc-offer__badge">BEST VALUE</span>{% endif %}
                    <span class="kc-offer__body">
                      <span class="kc-offer__radio" aria-hidden="true"></span>
                      <span class="kc-offer__copy">
                        <strong>{{ clean_title }}</strong>
                        <small>{{ clean_sub }}</small>
                      </span>
                      <span class="kc-offer__prices">
                        <strong class="zv-tier-price" data-tier-idx="{{ card_tier }}">—</strong>
                        <s class="zv-tier-compare" data-tier-idx="{{ card_tier }}"></s>
                      </span>
                    </span>
                  </span>
                </label>
              {% endfor %}`;

  const replacementBundleBlock = `            {% if bundle_opt_idx > -1 %}
              {% if product.handle == 'livestock-heating-lamp' %}
                <!-- SCOPED BUNDLE CONFIGURATION: LIVESTOCK HEATING LAMP (BUY 3 -> BUY 2 -> BUY 1) -->
                <!-- BUNDLE 1: BUY 3 (DEFAULT SELECTED) -->
                <label class="kc-offer" data-tier="3" data-bundle-val="3 Pack">
                  <input class="kc-offer__input" type="radio" name="zv_offer_tier" value="3" checked>
                  <span class="kc-offer__card">
                    <span class="kc-offer__badge">BEST VALUE · FREE SHIPPING · EXTRA 10% OFF</span>
                    <span class="kc-offer__body">
                      <span class="kc-offer__radio" aria-hidden="true"></span>
                      <span class="kc-offer__copy">
                        <strong>3 Packs</strong>
                        <small>Complete Set</small>
                      </span>
                      <span class="kc-offer__prices">
                        <strong class="zv-tier-price" data-tier-idx="3">$107.99</strong>
                        <s class="zv-tier-compare" data-tier-idx="3">$269.99</s>
                      </span>
                    </span>
                  </span>
                </label>

                <!-- BUNDLE 2: BUY 2 (NO PROMOTIONAL BADGES) -->
                <label class="kc-offer" data-tier="2" data-bundle-val="2 Pack">
                  <input class="kc-offer__input" type="radio" name="zv_offer_tier" value="2">
                  <span class="kc-offer__card">
                    <span class="kc-offer__body">
                      <span class="kc-offer__radio" aria-hidden="true"></span>
                      <span class="kc-offer__copy">
                        <strong>2 Packs</strong>
                        <small>Complete Set</small>
                      </span>
                      <span class="kc-offer__prices">
                        <strong class="zv-tier-price" data-tier-idx="2">$89.99</strong>
                        <s class="zv-tier-compare" data-tier-idx="2">$179.99</s>
                      </span>
                    </span>
                  </span>
                </label>

                <!-- BUNDLE 3: BUY 1 (SHIPPING +$4.95) -->
                <label class="kc-offer" data-tier="1" data-bundle-val="1 Pack">
                  <input class="kc-offer__input" type="radio" name="zv_offer_tier" value="1">
                  <span class="kc-offer__card">
                    <span class="kc-offer__badge">SHIPPING +$4.95</span>
                    <span class="kc-offer__body">
                      <span class="kc-offer__radio" aria-hidden="true"></span>
                      <span class="kc-offer__copy">
                        <strong>1 Pack</strong>
                        <small>Complete Set</small>
                      </span>
                      <span class="kc-offer__prices">
                        <strong class="zv-tier-price" data-tier-idx="1">$49.99</strong>
                        <s class="zv-tier-compare" data-tier-idx="1">$99.99</s>
                      </span>
                    </span>
                  </span>
                </label>

              {% else %}
                <!-- DYNAMIC NATIVE BUNDLE VARIANTS (OTHER PRODUCTS) -->
                {% assign bundle_option = product.options_with_values[bundle_opt_idx] %}
                {% for val in bundle_option.values limit: 3 %}
                  {% assign card_tier = forloop.index %}
                  {% assign val_parts = val | split: ' (' %}
                  {% assign clean_title = val_parts[0] %}
                  {% assign clean_sub = val_parts[1] | remove: ')' | default: 'Complete Set' %}
                  
                  <label class="kc-offer" data-tier="{{ card_tier }}" data-bundle-val="{{ val | escape }}">
                    <input class="kc-offer__input" type="radio" name="zv_offer_tier" value="{{ card_tier }}" {% if card_tier == 2 %}checked{% endif %}>
                    <span class="kc-offer__card">
                      {% if card_tier == 2 %}<span class="kc-offer__badge">MOST POPULAR</span>{% endif %}
                      {% if card_tier == 3 %}<span class="kc-offer__badge">BEST VALUE</span>{% endif %}
                      <span class="kc-offer__body">
                        <span class="kc-offer__radio" aria-hidden="true"></span>
                        <span class="kc-offer__copy">
                          <strong>{{ clean_title }}</strong>
                          <small>{{ clean_sub }}</small>
                        </span>
                        <span class="kc-offer__prices">
                          <strong class="zv-tier-price" data-tier-idx="{{ card_tier }}">—</strong>
                          <s class="zv-tier-compare" data-tier-idx="{{ card_tier }}"></s>
                        </span>
                      </span>
                    </span>
                  </label>
                {% endfor %}
              {% endif %}`;

  if (!content.includes(targetBundleBlock)) {
    throw new Error('Could not find targetBundleBlock in source content');
  }
  content = content.replace(targetBundleBlock, replacementBundleBlock);

  // 3. Set activeTier default in JavaScript
  const targetActiveTier = `  let activeTier = 2; // Default to Tier 2 (Most Popular)`;
  const replacementActiveTier = `  let activeTier = ({{ product.handle | json }} === 'livestock-heating-lamp') ? 3 : 2;`;

  if (!content.includes(targetActiveTier)) {
    throw new Error('Could not find targetActiveTier in source content');
  }
  content = content.replace(targetActiveTier, replacementActiveTier);

  // 4. Set currentOptions from current_variant
  const targetCurrentOptions = `  let currentOptions = {{ product.selected_or_first_available_variant.options | json }};`;
  const replacementCurrentOptions = `  let currentOptions = {{ current_variant.options | json }};`;

  if (!content.includes(targetCurrentOptions)) {
    throw new Error('Could not find targetCurrentOptions in source content');
  }
  content = content.replace(targetCurrentOptions, replacementCurrentOptions);

  return content;
}

export function generatePatchedFunnel(sourceContent) {
  // Replace fallback 119.99 with 107.99 in heating-lamp-funnel.liquid
  return sourceContent
    .replaceAll("'119.99'", "'107.99'")
    .replaceAll('119.99', '107.99')
    .replaceAll('$119.99', '$107.99');
}

export async function deployToTheme(themeId, themeName) {
  const token = await getAccessToken();
  console.log(`\n========================================================================`);
  console.log(`DEPLOYING LIVESTOCK BUNDLE PATCH TO ${themeName} (${themeId})`);
  console.log(`========================================================================\n`);

  // 1. Read base zavelyn-pdp-main.liquid from live backup
  const rawPdp = fs.readFileSync('./backups/zavelyn-pdp-main.live.backup.liquid', 'utf8');
  const patchedPdp = generatePatchedPdpMain(rawPdp);

  console.log('1. Uploading patched sections/zavelyn-pdp-main.liquid...');
  const res1 = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/${themeId}/assets.json`, {
    method: 'PUT',
    headers: {
      'X-Shopify-Access-Token': token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      asset: {
        key: 'sections/zavelyn-pdp-main.liquid',
        value: patchedPdp
      }
    })
  });
  const data1 = await res1.json();
  if (data1.asset) {
    console.log(`✓ Successfully updated sections/zavelyn-pdp-main.liquid on theme ${themeId}!`);
  } else {
    throw new Error('Failed to upload zavelyn-pdp-main: ' + JSON.stringify(data1));
  }

  // 2. Read base heating-lamp-funnel.liquid from live backup
  const rawFunnel = fs.readFileSync('./backups/heating-lamp-funnel.live.backup.liquid', 'utf8');
  const patchedFunnel = generatePatchedFunnel(rawFunnel);

  console.log('2. Uploading patched sections/heating-lamp-funnel.liquid...');
  const res2 = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/${themeId}/assets.json`, {
    method: 'PUT',
    headers: {
      'X-Shopify-Access-Token': token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      asset: {
        key: 'sections/heating-lamp-funnel.liquid',
        value: patchedFunnel
      }
    })
  });
  const data2 = await res2.json();
  if (data2.asset) {
    console.log(`✓ Successfully updated sections/heating-lamp-funnel.liquid on theme ${themeId}!`);
  } else {
    throw new Error('Failed to upload heating-lamp-funnel: ' + JSON.stringify(data2));
  }
}

async function main() {
  const isLive = process.argv.includes('--live');
  if (isLive) {
    await deployToTheme(LIVE_THEME_ID, 'LIVE THEME (Zavelyn 2.0)');
  } else {
    await deployToTheme(DEV_THEME_ID, 'DEV THEME (Zavelyn 2.0 Dev/Test BOGO)');
  }
}

if (process.argv[1] && process.argv[1].endsWith('patch_livestock_bundle.mjs')) {
  main().catch(console.error);
}
