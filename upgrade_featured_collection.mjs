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

const updatedLiquid = `<section class="zv-featured-collection-section">
  <div class="zv-container">
    <div class="zv-section-header">
      <span class="zv-section-pill">{{ section.settings.pill_text | default: 'TOP RATED ZAVELYN® COLLECTION' }}</span>
      <h2 class="zv-section-heading">{{ section.settings.heading | default: 'Popular Zavelyn Best Sellers' }}</h2>
      <p class="zv-section-sub">{{ section.settings.subtitle | default: 'Real customer favorites engineered for reliability, durability, and daily life improvement.' }}</p>
    </div>

    {% assign bsc = collections[section.settings.collection] %}
    {% if bsc == blank or bsc.products.size == 0 %}
      {% assign bsc = collections['best-sellers'] %}
    {% endif %}
    {% if bsc == blank or bsc.products.size == 0 %}
      {% assign bsc = collections['all-products'] %}
    {% endif %}

    {% assign prod_limit = section.settings.products_to_show | default: 8 %}

    <div class="zv-products-grid">
      {% for product in bsc.products limit: prod_limit %}
        {% assign savings_pct = 0 %}
        {% if product.compare_at_price > product.price %}
          {% assign savings_pct = product.compare_at_price | minus: product.price | times: 100.0 | divided_by: product.compare_at_price | round %}
        {% endif %}

        <div class="zv-prod-card" data-product-id="{{ product.id }}">
          <a href="{{ product.url }}" class="zv-prod-media">
            {% if product.featured_image %}
              <img class="zv-img-primary" src="{{ product.featured_image | image_url: width: 600 }}" alt="{{ product.title | escape }}" loading="lazy">
              {% if product.images.size > 1 %}
                <img class="zv-img-secondary" src="{{ product.images[1] | image_url: width: 600 }}" alt="{{ product.title | escape }}" loading="lazy">
              {% endif %}
            {% else %}
              <img class="zv-img-primary" src="https://cdn.shopify.com/s/files/1/0826/2483/9865/files/placeholder.jpg" alt="{{ product.title | escape }}" loading="lazy">
            {% endif %}

            <div class="zv-badges-wrap">
              {% if savings_pct > 0 %}
                <span class="zv-badge-sale">SAVE {{ savings_pct }}%</span>
              {% endif %}
            </div>

            {% if forloop.index <= 4 %}
              <span class="zv-badge-tag">🔥 BEST SELLER</span>
            {% endif %}
          </a>

          <div class="zv-prod-body">
            <div class="zv-rating-row">
              <span class="zv-stars">★★★★★</span>
              <span class="zv-rating-num">4.9</span>
              <span class="zv-review-count">({{ product.id | modulo: 800 | plus: 240 }})</span>
            </div>

            <h3 class="zv-prod-title">
              <a href="{{ product.url }}" title="{{ product.title | escape }}">{{ product.title }}</a>
            </h3>

            <div class="zv-prod-price-row">
              <span class="zv-price-current">{{ product.price | money }}</span>
              {% if product.compare_at_price > product.price %}
                <span class="zv-price-compare">{{ product.compare_at_price | money }}</span>
              {% endif %}
            </div>

            <div class="zv-card-action">
              {% if product.available %}
                <button type="button" class="zv-atc-btn" onclick="zvQuickAddToCart('{{ product.first_available_variant.id }}', this)">
                  <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M6 2L3 6v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2V6l-3-4z"></path><line x1="3" y1="6" x2="21" y2="6"></line><path d="M16 10a4 4 0 0 1-8 0"></path></svg>
                  <span>Add to Cart</span>
                </button>
              {% else %}
                <button type="button" class="zv-atc-btn sold-out" disabled>
                  <span>Sold Out</span>
                </button>
              {% endif %}
            </div>
          </div>
        </div>
      {% endfor %}
    </div>

    <div class="zv-view-all-wrap">
      <a href="{{ section.settings.view_all_link | default: '/collections/all-products' }}" class="zv-view-all-btn">
        {{ section.settings.view_all_text | default: 'Explore All Innovations →' }}
      </a>
    </div>
  </div>
</section>

<style>
  .zv-featured-collection-section {
    background-color: #ffffff;
    padding: 60px 0 70px 0;
    border-bottom: 1px solid #e2e8f0;
  }
  .zv-section-header {
    text-align: center;
    max-width: 720px;
    margin: 0 auto 40px auto;
  }
  .zv-section-pill {
    display: inline-block;
    background: #f1f5f9;
    color: #0f172a;
    font-size: 11.5px;
    font-weight: 800;
    letter-spacing: 1px;
    text-transform: uppercase;
    padding: 5px 14px;
    border-radius: 9999px;
    margin-bottom: 12px;
    border: 1px solid #e2e8f0;
  }
  .zv-section-heading {
    font-size: 34px;
    font-weight: 850;
    color: #0f172a;
    letter-spacing: -0.6px;
    margin: 0 0 10px 0;
    line-height: 1.25;
  }
  .zv-section-sub {
    font-size: 15px;
    color: #64748b;
    margin: 0;
    line-height: 1.6;
  }
  .zv-view-all-wrap {
    text-align: center;
    margin-top: 45px;
  }
  .zv-view-all-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    padding: 13px 32px;
    background: transparent;
    border: 2px solid #0f172a;
    border-radius: 9999px;
    color: #0f172a;
    font-size: 14px;
    font-weight: 700;
    text-decoration: none !important;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .zv-view-all-btn:hover {
    background: #0f172a;
    color: #ffffff;
    transform: translateY(-2px);
    box-shadow: 0 6px 18px rgba(15,23,42,0.18);
  }
</style>

{% schema %}
{
  "name": "Willa Featured Collection",
  "settings": [
    {
      "type": "text",
      "id": "pill_text",
      "label": "Top Pill Text",
      "default": "TOP RATED ZAVELYN® COLLECTION"
    },
    {
      "type": "text",
      "id": "heading",
      "label": "Heading",
      "default": "Popular Zavelyn Best Sellers"
    },
    {
      "type": "textarea",
      "id": "subtitle",
      "label": "Subtitle",
      "default": "Real customer favorites engineered for reliability, durability, and daily life improvement."
    },
    {
      "type": "collection",
      "id": "collection",
      "label": "Collection"
    },
    {
      "type": "range",
      "id": "products_to_show",
      "min": 4,
      "max": 16,
      "step": 4,
      "label": "Products to Show",
      "default": 8
    },
    {
      "type": "url",
      "id": "view_all_link",
      "label": "View All Link"
    },
    {
      "type": "text",
      "id": "view_all_text",
      "label": "View All Text",
      "default": "Explore All Innovations →"
    }
  ],
  "presets": [
    {
      "name": "Willa Featured Collection"
    }
  ]
}
{% endschema %}
`;

async function main() {
  const token = await getAccessToken();
  console.log('Deploying redesigned sections/willa-featured-collection.liquid to Theme 186607567033...');
  const res = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-01/themes/${THEME_ID}/assets.json`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify({
      asset: {
        key: 'sections/willa-featured-collection.liquid',
        value: updatedLiquid
      }
    })
  });
  const data = await res.json();
  if (data.errors) throw new Error(JSON.stringify(data.errors));
  console.log('✔ Successfully deployed updated sections/willa-featured-collection.liquid!');
}

main().catch(console.error);
