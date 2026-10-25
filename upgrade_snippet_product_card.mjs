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

const updatedSnippet = `{%- liquid
  assign card_product = product
  assign savings_pct = 0
  if card_product.compare_at_price > card_product.price
    assign savings_pct = card_product.compare_at_price | minus: card_product.price | times: 100.0 | divided_by: card_product.compare_at_price | round
  endif
-%}

<div class="zv-prod-card" data-product-id="{{ card_product.id }}">
  <a href="{{ card_product.url }}" class="zv-prod-media">
    {%- if card_product.featured_image -%}
      <img class="zv-img-primary" src="{{ card_product.featured_image | image_url: width: 600 }}" alt="{{ card_product.title | escape }}" loading="lazy">
      {%- if card_product.images.size > 1 -%}
        <img class="zv-img-secondary" src="{{ card_product.images[1] | image_url: width: 600 }}" alt="{{ card_product.title | escape }}" loading="lazy">
      {%- endif -%}
    {%- else -%}
      <img class="zv-img-primary" src="https://cdn.shopify.com/s/files/1/0826/2483/9865/files/placeholder.jpg" alt="{{ card_product.title | escape }}" loading="lazy">
    {%- endif -%}

    <div class="zv-badges-wrap">
      {%- if savings_pct > 0 -%}
        <span class="zv-badge-sale">SAVE {{ savings_pct }}%</span>
      {%- endif -%}
    </div>

    <span class="zv-badge-tag">★ TOP RATED</span>
  </a>

  <div class="zv-prod-body">
    <div class="zv-rating-row">
      <span class="zv-stars">★★★★★</span>
      <span class="zv-rating-num">4.9</span>
      <span class="zv-review-count">({{ card_product.id | modulo: 800 | plus: 240 }})</span>
    </div>

    <h3 class="zv-prod-title">
      <a href="{{ card_product.url }}" title="{{ card_product.title | escape }}">{{ card_product.title }}</a>
    </h3>

    <div class="zv-prod-price-row">
      <span class="zv-price-current">{{ card_product.price | money }}</span>
      {%- if card_product.compare_at_price > card_product.price -%}
        <span class="zv-price-compare">{{ card_product.compare_at_price | money }}</span>
      {%- endif -%}
    </div>

    <div class="zv-card-action">
      {%- if card_product.available -%}
        <button type="button" class="zv-atc-btn" onclick="zvQuickAddToCart('{{ card_product.first_available_variant.id }}', this)">
          <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
          <span>Add to Cart</span>
        </button>
      {%- else -%}
        <button type="button" class="zv-atc-btn sold-out" disabled>
          <span>Sold Out</span>
        </button>
      {%- endif -%}
    </div>
  </div>
</div>
`;

async function main() {
  const token = await getAccessToken();
  console.log('Deploying modern snippets/product-card.liquid to Theme 186607567033...');
  const res = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-01/themes/${THEME_ID}/assets.json`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify({
      asset: {
        key: 'snippets/product-card.liquid',
        value: updatedSnippet
      }
    })
  });
  const data = await res.json();
  if (data.errors) throw new Error(JSON.stringify(data.errors));
  console.log('✔ Successfully deployed updated snippets/product-card.liquid!');
}

main().catch(console.error);
