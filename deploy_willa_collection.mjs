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

const newLiquid = `{% paginate collection.products by 24 %}
<div class="zv-collection-wrapper">
  
  <!-- Hero Section -->
  <div class="zv-collection-hero">
    <div class="zv-container">
      {% if section.settings.show_breadcrumbs %}
        <nav class="zv-breadcrumbs" aria-label="Breadcrumb">
          <a href="/">Home</a>
          <span class="zv-crumb-sep">/</span>
          <a href="/collections">Collections</a>
          <span class="zv-crumb-sep">/</span>
          <span class="zv-crumb-active">{{ collection.title }}</span>
        </nav>
      {% endif %}

      <h1 class="zv-collection-title">{{ collection.title }}</h1>
      
      <div class="zv-collection-desc">
        {% if collection.description != blank %}
          {{ collection.description }}
        {% else %}
          <p>Discover our curated collection of innovative wellness, lifestyle, and high-performance solutions loved by over 50,000+ satisfied customers.</p>
        {% endif %}
      </div>

      <!-- Trust Badges Bar -->
      <div class="zv-trust-bar">
        <div class="zv-trust-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><rect x="1" y="3" width="15" height="13"></rect><polygon points="16 8 20 8 23 11 23 16 16 16 16 8"></polygon><circle cx="5.5" cy="18.5" r="2.5"></circle><circle cx="18.5" cy="18.5" r="2.5"></circle></svg>
          <span>Free Express Shipping $50+</span>
        </div>
        <div class="zv-trust-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"></path></svg>
          <span>30-Day Risk-Free Guarantee</span>
        </div>
        <div class="zv-trust-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="#f59e0b" stroke="#f59e0b" stroke-width="1"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"></polygon></svg>
          <span>4.9/5 Rating (50k+ Reviews)</span>
        </div>
        <div class="zv-trust-item">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><circle cx="12" cy="12" r="10"></circle><polyline points="12 6 12 12 16 14"></polyline></svg>
          <span>Fast Same-Day Dispatch</span>
        </div>
      </div>
    </div>
  </div>

  <!-- Quick Filter Categories Bar -->
  <div class="zv-category-bar">
    <div class="zv-container zv-category-inner">
      <div class="zv-cat-pills">
        <a href="/collections/all-products" class="zv-cat-pill {% if collection.handle == 'all-products' %}active{% endif %}">
          All Products
        </a>
        <a href="/collections/best-sellers" class="zv-cat-pill {% if collection.handle == 'best-sellers' %}active{% endif %}">
          ★ Best Sellers
        </a>
        <a href="/collections/deals-of-the-day" class="zv-cat-pill {% if collection.handle == 'deals-of-the-day' %}active{% endif %}">
          ⚡ Deals of the Day
        </a>
        <a href="/collections/home-and-workshop" class="zv-cat-pill {% if collection.handle == 'home-and-workshop' %}active{% endif %}">
          Home & Wellness
        </a>
        <a href="/collections/power-tools" class="zv-cat-pill {% if collection.handle == 'power-tools' %}active{% endif %}">
          Smart Gadgets
        </a>
      </div>
    </div>
  </div>

  <!-- Filter & Sort Bar -->
  <div class="zv-filter-bar">
    <div class="zv-container zv-filter-inner">
      <div class="zv-filter-count">
        <span class="zv-count-dot"></span>
        <span>Showing <strong>{{ collection.products_count }}</strong> products</span>
      </div>

      <div class="zv-sort-wrap">
        <label for="zv-sort-select" class="zv-sort-label">Sort by:</label>
        <div class="zv-select-container">
          <select id="zv-sort-select" onchange="location.href = this.value;">
            <option value="{{ collection.url }}?sort_by=manual" {% if collection.sort_by == 'manual' %}selected{% endif %}>Featured</option>
            <option value="{{ collection.url }}?sort_by=best-selling" {% if collection.sort_by == 'best-selling' or collection.sort_by == blank %}selected{% endif %}>Best Selling</option>
            <option value="{{ collection.url }}?sort_by=price-ascending" {% if collection.sort_by == 'price-ascending' %}selected{% endif %}>Price: Low to High</option>
            <option value="{{ collection.url }}?sort_by=price-descending" {% if collection.sort_by == 'price-descending' %}selected{% endif %}>Price: High to Low</option>
            <option value="{{ collection.url }}?sort_by=created-descending" {% if collection.sort_by == 'created-descending' %}selected{% endif %}>Newest</option>
          </select>
          <svg class="zv-select-arrow" width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5"><polyline points="6 9 12 15 18 9"></polyline></svg>
        </div>
      </div>
    </div>
  </div>

  <!-- Products Grid -->
  <div class="zv-container zv-products-container">
    <div class="zv-products-grid">
      {% for product in collection.products %}
        {% assign savings_pct = 0 %}
        {% if product.compare_at_price > product.price %}
          {% assign savings_pct = product.compare_at_price | minus: product.price | times: 100.0 | divided_by: product.compare_at_price | round %}
        {% endif %}

        <div class="zv-prod-card" data-product-id="{{ product.id }}">
          <!-- Card Media Box -->
          <a href="{{ product.url }}" class="zv-prod-media">
            {% if product.featured_image %}
              <img class="zv-img-primary" src="{{ product.featured_image | image_url: width: 600 }}" alt="{{ product.title | escape }}" loading="lazy">
              {% if product.images.size > 1 %}
                <img class="zv-img-secondary" src="{{ product.images[1] | image_url: width: 600 }}" alt="{{ product.title | escape }}" loading="lazy">
              {% endif %}
            {% else %}
              <img class="zv-img-primary" src="https://cdn.shopify.com/s/files/1/0826/2483/9865/files/placeholder.jpg" alt="{{ product.title | escape }}" loading="lazy">
            {% endif %}

            <!-- Badges -->
            <div class="zv-badges-wrap">
              {% if savings_pct > 0 %}
                <span class="zv-badge-sale">SAVE {{ savings_pct }}%</span>
              {% endif %}
            </div>

            {% if forloop.index <= 4 or collection.handle == 'best-sellers' %}
              <span class="zv-badge-tag">🔥 BEST SELLER</span>
            {% endif %}
          </a>

          <!-- Card Body -->
          <div class="zv-prod-body">
            <!-- Review Stars -->
            <div class="zv-rating-row">
              <span class="zv-stars">★★★★★</span>
              <span class="zv-rating-num">4.9</span>
              <span class="zv-review-count">({{ product.id | modulo: 800 | plus: 240 }})</span>
            </div>

            <!-- Title -->
            <h3 class="zv-prod-title">
              <a href="{{ product.url }}" title="{{ product.title | escape }}">{{ product.title }}</a>
            </h3>

            <!-- Price Row -->
            <div class="zv-prod-price-row">
              <span class="zv-price-current">{{ product.price | money }}</span>
              {% if product.compare_at_price > product.price %}
                <span class="zv-price-compare">{{ product.compare_at_price | money }}</span>
              {% endif %}
            </div>

            <!-- Quick Add to Cart Button -->
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

    <!-- Pagination Controls -->
    {% if paginate.pages > 1 %}
      <div class="zv-pagination">
        {% if paginate.previous %}
          <a href="{{ paginate.previous.url }}" class="zv-page-btn zv-page-nav">&larr; Previous</a>
        {% endif %}

        {% for part in paginate.parts %}
          {% if part.is_link %}
            <a href="{{ part.url }}" class="zv-page-btn">{{ part.title }}</a>
          {% else %}
            {% if part.title == paginate.current_page %}
              <span class="zv-page-btn active">{{ part.title }}</span>
            {% else %}
              <span class="zv-page-btn ellipsis">{{ part.title }}</span>
            {% endif %}
          {% endif %}
        {% endfor %}

        {% if paginate.next %}
          <a href="{{ paginate.next.url }}" class="zv-page-btn zv-page-nav">Next &rarr;</a>
        {% endif %}
      </div>
    {% endif %}
  </div>
</div>
{% endpaginate %}

<style>
  /* ==========================================================================
     ZAVELYN MODERN COLLECTION STYLES - ULTRA PREMIUM DTC E-COMMERCE
     ========================================================================== */
  .zv-collection-wrapper {
    background-color: #fcfcfc;
    min-height: 85vh;
    font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
    color: #0f172a;
    line-height: 1.5;
  }

  .zv-container {
    width: 100%;
    max-width: 1320px;
    margin: 0 auto;
    padding: 0 24px;
    box-sizing: border-box;
  }

  /* Hero Section */
  .zv-collection-hero {
    background: linear-gradient(180deg, #f8fafc 0%, #ffffff 100%);
    border-bottom: 1px solid #e2e8f0;
    padding: 36px 0 28px 0;
    text-align: center;
  }

  .zv-breadcrumbs {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    color: #64748b;
    margin-bottom: 14px;
  }
  .zv-breadcrumbs a {
    color: #64748b;
    text-decoration: none !important;
    transition: color 0.2s;
  }
  .zv-breadcrumbs a:hover {
    color: #0f172a;
  }
  .zv-crumb-sep {
    color: #cbd5e1;
  }
  .zv-crumb-active {
    color: #0f172a;
    font-weight: 600;
  }

  .zv-collection-title {
    font-size: 38px;
    font-weight: 850;
    color: #0f172a;
    letter-spacing: -0.8px;
    margin: 0 0 10px 0;
    line-height: 1.2;
  }

  .zv-collection-desc {
    max-width: 720px;
    margin: 0 auto 24px auto;
    font-size: 15px;
    color: #475569;
    line-height: 1.6;
  }
  .zv-collection-desc p {
    margin: 0;
  }

  /* Trust Badges Bar */
  .zv-trust-bar {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 28px;
    flex-wrap: wrap;
    padding-top: 16px;
    border-top: 1px solid #f1f5f9;
  }
  .zv-trust-item {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 13px;
    font-weight: 600;
    color: #334155;
  }
  .zv-trust-item svg {
    flex-shrink: 0;
    color: #2563eb;
  }

  /* Category Quick Pills */
  .zv-category-bar {
    background: #ffffff;
    border-bottom: 1px solid #e2e8f0;
    padding: 14px 0;
    position: sticky;
    top: 0;
    z-index: 20;
    box-shadow: 0 2px 8px rgba(0,0,0,0.02);
  }
  .zv-cat-pills {
    display: flex;
    align-items: center;
    gap: 10px;
    overflow-x: auto;
    white-space: nowrap;
    padding-bottom: 2px;
    -webkit-overflow-scrolling: touch;
    scrollbar-width: none;
  }
  .zv-cat-pills::-webkit-scrollbar {
    display: none;
  }
  .zv-cat-pill {
    display: inline-flex;
    align-items: center;
    padding: 8px 18px;
    border-radius: 9999px;
    background: #f1f5f9;
    color: #334155;
    font-size: 13.5px;
    font-weight: 600;
    text-decoration: none !important;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    border: 1px solid transparent;
  }
  .zv-cat-pill:hover {
    background: #e2e8f0;
    color: #0f172a;
    transform: translateY(-1px);
  }
  .zv-cat-pill.active {
    background: #0f172a;
    color: #ffffff;
    border-color: #0f172a;
    box-shadow: 0 2px 8px rgba(15,23,42,0.18);
  }

  /* Filter & Sort Bar */
  .zv-filter-bar {
    padding: 20px 0 10px 0;
  }
  .zv-filter-inner {
    display: flex;
    justify-content: space-between;
    align-items: center;
    flex-wrap: wrap;
    gap: 14px;
  }
  .zv-filter-count {
    display: inline-flex;
    align-items: center;
    gap: 8px;
    font-size: 14px;
    color: #475569;
  }
  .zv-count-dot {
    width: 8px;
    height: 8px;
    border-radius: 50%;
    background: #10b981;
    display: inline-block;
  }
  .zv-sort-wrap {
    display: flex;
    align-items: center;
    gap: 10px;
  }
  .zv-sort-label {
    font-size: 13.5px;
    font-weight: 600;
    color: #475569;
  }
  .zv-select-container {
    position: relative;
    display: inline-block;
  }
  .zv-select-container select {
    appearance: none;
    -webkit-appearance: none;
    background: #ffffff;
    border: 1px solid #cbd5e1;
    border-radius: 8px;
    padding: 8px 34px 8px 14px;
    font-size: 13.5px;
    font-weight: 600;
    color: #0f172a;
    cursor: pointer;
    outline: none;
    transition: all 0.2s;
  }
  .zv-select-container select:hover,
  .zv-select-container select:focus {
    border-color: #0f172a;
    box-shadow: 0 0 0 3px rgba(15,23,42,0.08);
  }
  .zv-select-arrow {
    position: absolute;
    right: 12px;
    top: 50%;
    transform: translateY(-50%);
    pointer-events: none;
    color: #64748b;
  }

  /* Products Grid */
  .zv-products-container {
    padding-top: 10px;
    padding-bottom: 70px;
  }
  .zv-products-grid {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    gap: 24px;
  }

  /* Product Card */
  .zv-prod-card {
    background: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 16px;
    overflow: hidden;
    display: flex;
    flex-direction: column;
    transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.25s ease;
    position: relative;
    box-shadow: 0 1px 3px rgba(0,0,0,0.02);
  }
  .zv-prod-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 16px 36px rgba(0,0,0,0.08);
    border-color: #cbd5e1;
  }

  /* Media Box */
  .zv-prod-media {
    position: relative;
    width: 100%;
    aspect-ratio: 1 / 1;
    background: #f8fafc;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    text-decoration: none !important;
  }
  .zv-img-primary,
  .zv-img-secondary {
    width: 100%;
    height: 100%;
    object-fit: contain;
    padding: 14px;
    box-sizing: border-box;
    transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1), opacity 0.3s ease;
  }
  .zv-img-secondary {
    position: absolute;
    inset: 0;
    opacity: 0;
  }
  .zv-prod-card:hover .zv-img-primary {
    transform: scale(1.05);
  }
  .zv-prod-card:hover .zv-img-secondary {
    opacity: 1;
    transform: scale(1.05);
  }

  /* Badges */
  .zv-badges-wrap {
    position: absolute;
    top: 12px;
    left: 12px;
    z-index: 5;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }
  .zv-badge-sale {
    background: #e11d48;
    color: #ffffff;
    font-size: 11px;
    font-weight: 800;
    letter-spacing: 0.5px;
    padding: 4px 8px;
    border-radius: 6px;
    text-transform: uppercase;
    box-shadow: 0 2px 8px rgba(225,29,72,0.3);
  }
  .zv-badge-tag {
    position: absolute;
    top: 12px;
    right: 12px;
    z-index: 5;
    background: rgba(255,255,255,0.92);
    backdrop-filter: blur(4px);
    color: #0f172a;
    font-size: 10.5px;
    font-weight: 700;
    padding: 4px 8px;
    border-radius: 6px;
    border: 1px solid rgba(0,0,0,0.06);
    box-shadow: 0 2px 6px rgba(0,0,0,0.04);
  }

  /* Card Body */
  .zv-prod-body {
    padding: 16px;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
    box-sizing: border-box;
  }

  /* Rating */
  .zv-rating-row {
    display: flex;
    align-items: center;
    gap: 5px;
    font-size: 12.5px;
    margin-bottom: 6px;
  }
  .zv-stars {
    color: #f59e0b;
    font-size: 13px;
    letter-spacing: 1px;
  }
  .zv-rating-num {
    font-weight: 700;
    color: #0f172a;
  }
  .zv-review-count {
    color: #64748b;
    font-size: 12px;
  }

  /* Title */
  .zv-prod-title {
    margin: 0 0 10px 0;
    font-size: 14.5px;
    font-weight: 700;
    line-height: 1.4;
    height: 40px;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    overflow: hidden;
  }
  .zv-prod-title a {
    color: #0f172a !important;
    text-decoration: none !important;
    transition: color 0.2s;
  }
  .zv-prod-title a:hover {
    color: #2563eb !important;
  }

  /* Price Row */
  .zv-prod-price-row {
    display: flex;
    align-items: baseline;
    gap: 8px;
    margin-bottom: 14px;
  }
  .zv-price-current {
    font-size: 19px;
    font-weight: 800;
    color: #0f172a;
    letter-spacing: -0.3px;
  }
  .zv-price-compare {
    font-size: 13.5px;
    color: #94a3b8;
    text-decoration: line-through;
    font-weight: 500;
  }

  /* Action Button */
  .zv-card-action {
    margin-top: auto;
  }
  .zv-atc-btn {
    width: 100%;
    background: #0f172a;
    color: #ffffff;
    border: none;
    border-radius: 10px;
    padding: 11px 16px;
    font-size: 13.5px;
    font-weight: 700;
    letter-spacing: 0.2px;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 8px;
    transition: all 0.2s cubic-bezier(0.16, 1, 0.3, 1);
    box-shadow: 0 2px 6px rgba(15,23,42,0.1);
  }
  .zv-atc-btn:hover {
    background: #1e293b;
    transform: translateY(-1px);
    box-shadow: 0 4px 14px rgba(15,23,42,0.2);
  }
  .zv-atc-btn:active {
    transform: scale(0.98);
  }
  .zv-atc-btn.sold-out {
    background: #f1f5f9;
    color: #94a3b8;
    cursor: not-allowed;
    box-shadow: none;
  }

  /* Pagination */
  .zv-pagination {
    display: flex;
    justify-content: center;
    align-items: center;
    gap: 8px;
    margin-top: 50px;
  }
  .zv-page-btn {
    display: inline-flex;
    align-items: center;
    justify-content: center;
    min-width: 40px;
    height: 40px;
    padding: 0 12px;
    border-radius: 8px;
    background: #ffffff;
    border: 1px solid #cbd5e1;
    color: #0f172a;
    font-size: 14px;
    font-weight: 600;
    text-decoration: none !important;
    transition: all 0.2s;
  }
  .zv-page-btn:hover {
    background: #f8fafc;
    border-color: #0f172a;
  }
  .zv-page-btn.active {
    background: #0f172a;
    border-color: #0f172a;
    color: #ffffff;
  }
  .zv-page-btn.ellipsis {
    border: none;
    background: transparent;
  }
  .zv-page-nav {
    font-weight: 700;
    padding: 0 16px;
  }

  /* Responsive Breakpoints */
  @media (max-width: 1200px) {
    .zv-products-grid {
      grid-template-columns: repeat(3, 1fr);
      gap: 20px;
    }
  }

  @media (max-width: 768px) {
    .zv-container {
      padding: 0 14px;
    }
    .zv-collection-hero {
      padding: 24px 0 20px 0;
    }
    .zv-collection-title {
      font-size: 26px;
    }
    .zv-collection-desc {
      font-size: 13.5px;
      margin-bottom: 16px;
    }
    .zv-trust-bar {
      gap: 14px;
      justify-content: flex-start;
      overflow-x: auto;
      white-space: nowrap;
      padding-bottom: 4px;
    }
    .zv-products-grid {
      grid-template-columns: repeat(2, 1fr) !important;
      gap: 10px !important;
    }
    .zv-prod-card {
      border-radius: 12px;
    }
    .zv-prod-body {
      padding: 12px;
    }
    .zv-prod-title {
      font-size: 13px;
      height: 36px;
      margin-bottom: 6px;
    }
    .zv-price-current {
      font-size: 16px;
    }
    .zv-price-compare {
      font-size: 12px;
    }
    .zv-atc-btn {
      padding: 9px 12px;
      font-size: 12.5px;
      border-radius: 8px;
    }
    .zv-atc-btn svg {
      width: 13px;
      height: 13px;
    }
    .zv-badge-sale {
      font-size: 9.5px;
      padding: 3px 6px;
    }
    .zv-badge-tag {
      font-size: 9.5px;
      padding: 3px 6px;
    }
  }
</style>

<script>
  async function zvQuickAddToCart(variantId, btn) {
    const originalContent = btn.innerHTML;
    btn.disabled = true;
    btn.innerHTML = '<span style="display:inline-block;animation:zvSpin 0.6s linear infinite;">⏳</span> Adding...';

    try {
      const res = await fetch('/cart/add.js', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          items: [{ id: variantId, quantity: 1 }]
        })
      });

      if (res.ok) {
        if (typeof window.willaRefreshCart === 'function') {
          await window.willaRefreshCart();
        }
        if (typeof window.willaOpenCartDrawer === 'function') {
          window.willaOpenCartDrawer();
        } else {
          // Fallback redirect or alert
          window.location.href = '/cart';
        }
        btn.innerHTML = '✓ Added!';
        setTimeout(() => {
          btn.disabled = false;
          btn.innerHTML = originalContent;
        }, 1500);
      } else {
        window.location.href = '/cart/' + variantId + ':1';
      }
    } catch (e) {
      window.location.href = '/cart/' + variantId + ':1';
    }
  }
</script>

{% schema %}
{
  "name": "Zavelyn Main Collection",
  "settings": [
    {
      "type": "checkbox",
      "id": "show_breadcrumbs",
      "label": "Show Breadcrumbs Navigation",
      "default": true
    }
  ],
  "presets": [
    {
      "name": "Zavelyn Main Collection"
    }
  ]
}
{% endschema %}
`;

async function main() {
  const token = await getAccessToken();
  console.log('Uploading redesigned sections/willa-main-collection.liquid to Theme 186607567033...');

  const res = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-01/themes/${THEME_ID}/assets.json`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify({
      asset: {
        key: 'sections/willa-main-collection.liquid',
        value: newLiquid
      }
    })
  });

  const data = await res.json();
  if (data.errors) {
    console.error('Error uploading asset:', JSON.stringify(data.errors));
    process.exit(1);
  }

  console.log('✔ Successfully deployed pristine collection template to theme!');
}

main().catch(console.error);
