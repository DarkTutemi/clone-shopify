import fs from 'fs';

let content = fs.readFileSync('snippets/botanaroots-bundle-upsell.liquid', 'utf8');

// Inject effective image assignments at the top after stylesheet_tag
const needle = "{{ 'botanaroots-bundle.css' | asset_url | stylesheet_tag }}\n";
const insertion = `{{ 'botanaroots-bundle.css' | asset_url | stylesheet_tag }}

{%- assign effective_img_buy3 = img_buy3 | default: section.settings.botana_img_buy3 -%}
{%- assign effective_img_buy2 = img_buy2 | default: section.settings.botana_img_buy2 -%}
{%- assign effective_img_buy1 = img_buy1 | default: section.settings.botana_img_buy1 -%}
{%- assign effective_img_upsell = img_upsell | default: section.settings.botana_img_upsell -%}
{%- assign u_width = section.settings.upsell_img_width | default: 135 -%}
{%- assign u_mob_width = section.settings.upsell_mobile_img_width | default: 115 -%}
{%- assign u_fit = section.settings.upsell_img_fit | default: 'contain' -%}

<style>
  #zvBotanaBundleComponent .zv-upsell-img-wrap {
    width: {{ u_width }}px !important;
  }
  #zvBotanaBundleComponent .zv-upsell-img {
    object-fit: {{ u_fit }} !important;
  }
  @media (max-width: 640px) {
    #zvBotanaBundleComponent .zv-upsell-img-wrap {
      width: {{ u_mob_width }}px !important;
    }
  }
</style>
`;

content = content.replace(needle, insertion);

// Replace img_buy3 with effective_img_buy3
content = content.replaceAll('img_buy3', 'effective_img_buy3');
content = content.replaceAll('img_buy2', 'effective_img_buy2');
content = content.replaceAll('img_buy1', 'effective_img_buy1');
content = content.replaceAll('img_upsell', 'effective_img_upsell');

// Ensure banners use section.settings with fallbacks
content = content.replace(
  'BEST VALUE &middot; FREE SHIPPING &middot; <strong class="zv-highlight-lime">EXTRA 20% OFF</strong>',
  `{{ section.settings.buy3_badge | default: 'BEST VALUE · FREE SHIPPING · EXTRA 20% OFF' }}`
);

content = content.replace(
  '<span>🔥 MOST POPULAR</span>',
  `<span>{{ section.settings.buy2_badge | default: '🔥 MOST POPULAR' }}</span>`
);

content = content.replace(
  'Shipping +$4.95\n          </span>',
  `{{ section.settings.buy1_badge | default: 'Shipping +$4.95' }}\n          </span>`
);

fs.writeFileSync('draft_working/snippets_botanaroots-bundle-upsell-refactored.liquid', content);
console.log('✓ Successfully generated draft_working/snippets_botanaroots-bundle-upsell-refactored.liquid');
