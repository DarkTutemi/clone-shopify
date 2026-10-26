import fs from 'fs';

const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || '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';
const SHOP = 'dsdujr-vn.myshopify.com';
const THEME_ID = '186607567033';

async function getAccessToken() {
  const tRes = await fetch(`https://${SHOP}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  const data = await tRes.json();
  return data.access_token;
}

async function uploadAsset(key, value, token) {
  const res = await fetch(`https://${SHOP}/admin/api/2024-10/themes/${THEME_ID}/assets.json`, {
    method: 'PUT',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
    body: JSON.stringify({ asset: { key, value } })
  });
  const json = await res.json();
  if (json.asset) {
    console.log(`✔ Successfully deployed: ${key}`);
  } else {
    console.error(`❌ Failed to deploy ${key}:`, JSON.stringify(json));
  }
}

async function fetchAsset(key, token) {
  const res = await fetch(`https://${SHOP}/admin/api/2024-10/themes/${THEME_ID}/assets.json?asset[key]=${encodeURIComponent(key)}`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const json = await res.json();
  return json.asset?.value || '';
}

async function main() {
  const token = await getAccessToken();

  // 1. Re-deploy sections/willa-collections-grid.liquid with double quotes
  const upgradedCategoriesLiquid = `<section class="zv-collections-section">
  <div class="zv-container">
    <div class="zv-section-header">
      <span class="zv-section-pill">{{ section.settings.pill_text | default: "CURATED COLLECTIONS" }}</span>
      <h2 class="zv-section-heading">{{ section.settings.heading | default: "Explore by Category" }}</h2>
      <p class="zv-section-sub">{{ section.settings.subtitle | default: "Discover Zavelyn specialized innovations engineered for personal wellness, smart home living, and heavy-duty reliability." }}</p>
    </div>

    <div class="zv-categories-grid">
      <!-- Card 1: Best Sellers -->
      <a href="/collections/best-sellers" class="zv-cat-card">
        <div class="zv-cat-img-wrap">
          <img src="https://cdn.shopify.com/s/files/1/0826/2483/9865/files/glider_hero_flight.webp?v=1792935712" alt="Best Sellers" loading="lazy">
        </div>
        <div class="zv-cat-info">
          <span class="zv-cat-badge">★ TOP RATED</span>
          <h3>Best Sellers</h3>
          <p>Customer favorites with verified 4.9-star ratings.</p>
          <span class="zv-cat-link">Shop Collection &rarr;</span>
        </div>
      </a>

      <!-- Card 2: Personal Care & Wellness -->
      <a href="/collections/all-products" class="zv-cat-card">
        <div class="zv-cat-img-wrap">
          <img src="https://cdn.shopify.com/s/files/1/0826/2483/9865/files/joylux_vfit_starter_kit.jpg?v=1792932963" alt="Personal Care &amp; Wellness" loading="lazy">
        </div>
        <div class="zv-cat-info">
          <span class="zv-cat-badge">WELLNESS</span>
          <h3>Personal Care &amp; Wellness</h3>
          <p>vFit rejuvenation, organic Batana hair oil &amp; comfort shapewear.</p>
          <span class="zv-cat-link">Explore Wellness &rarr;</span>
        </div>
      </a>

      <!-- Card 3: Smart Heated Gear & Gadgets -->
      <a href="/collections/all-products" class="zv-cat-card">
        <div class="zv-cat-img-wrap">
          <img src="https://cdn.shopify.com/s/files/1/0826/2483/9865/files/zavelyn-thermoglove-black.jpg?v=1792936861" alt="Smart Gadgets &amp; Heated Gear" loading="lazy">
        </div>
        <div class="zv-cat-info">
          <span class="zv-cat-badge">SMART TECH</span>
          <h3>Smart Gadgets &amp; Heated Gear</h3>
          <p>Thermostatic heated gloves, CozyHeat blankets &amp; ultrasonic tech.</p>
          <span class="zv-cat-link">Discover Gadgets &rarr;</span>
        </div>
      </a>

      <!-- Card 4: Pet Care Innovations -->
      <a href="/collections/all-products" class="zv-cat-card">
        <div class="zv-cat-img-wrap">
          <img src="https://cdn.shopify.com/s/files/1/0826/2483/9865/files/selenepets_hero_fountain.jpg?v=1792935435" alt="Smart Pet Essentials" loading="lazy">
        </div>
        <div class="zv-cat-info">
          <span class="zv-cat-badge">PET ESSENTIALS</span>
          <h3>Smart Pet Essentials</h3>
          <p>Ultra-quiet wireless stainless water fountains &amp; feeder solutions.</p>
          <span class="zv-cat-link">Shop Pet Care &rarr;</span>
        </div>
      </a>

      <!-- Card 5: Kitchen & Home Solutions -->
      <a href="/collections/home-and-workshop" class="zv-cat-card">
        <div class="zv-cat-img-wrap">
          <img src="https://cdn.shopify.com/s/files/1/0826/2483/9865/files/dough_mixer_red_card.jpg?v=1792922475" alt="Kitchen &amp; Home" loading="lazy">
        </div>
        <div class="zv-cat-info">
          <span class="zv-cat-badge">HOME INNOVATION</span>
          <h3>Kitchen &amp; Home Solutions</h3>
          <p>Automatic dough ferment mixers, 5-in-1 rotary shredders &amp; purifiers.</p>
          <span class="zv-cat-link">Shop Kitchen &rarr;</span>
        </div>
      </a>

      <!-- Card 6: Farm & Power Tools -->
      <a href="/collections/fence-and-farm" class="zv-cat-card">
        <div class="zv-cat-img-wrap">
          <img src="https://cdn.shopify.com/s/files/1/0826/2483/9865/files/megalifters_hero_excavator.png?v=1792936057" alt="Power &amp; Heavy Duty Tools" loading="lazy">
        </div>
        <div class="zv-cat-info">
          <span class="zv-cat-badge">HEAVY DUTY</span>
          <h3>Power &amp; Farm Tools</h3>
          <p>High-torque cordless blowers, alloy RC fleets &amp; post repair kits.</p>
          <span class="zv-cat-link">Shop Heavy Duty &rarr;</span>
        </div>
      </a>
    </div>
  </div>
</section>

<style>
  .zv-collections-section {
    background-color: #f8fafc;
    padding: 65px 0 75px 0;
    border-bottom: 1px solid #e2e8f0;
  }
  .zv-categories-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;
  }
  @media (max-width: 900px) {
    .zv-categories-grid {
      grid-template-columns: repeat(2, 1fr);
      gap: 16px;
    }
  }
  @media (max-width: 600px) {
    .zv-categories-grid {
      grid-template-columns: 1fr;
      gap: 14px;
    }
  }
  .zv-cat-card {
    background-color: #ffffff;
    border: 1px solid #e2e8f0;
    border-radius: 18px;
    overflow: hidden;
    text-decoration: none !important;
    color: #0f172a !important;
    display: flex;
    flex-direction: column;
    transition: transform 0.25s cubic-bezier(0.16, 1, 0.3, 1), box-shadow 0.25s cubic-bezier(0.16, 1, 0.3, 1), border-color 0.2s ease;
    box-shadow: 0 2px 6px rgba(0,0,0,0.02);
  }
  .zv-cat-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 16px 36px rgba(15,23,42,0.08);
    border-color: #cbd5e1;
  }
  .zv-cat-img-wrap {
    width: 100%;
    aspect-ratio: 16 / 10;
    background: #f1f5f9;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
  }
  .zv-cat-img-wrap img {
    width: 100%;
    height: 100%;
    object-fit: cover;
    transition: transform 0.45s cubic-bezier(0.16, 1, 0.3, 1);
  }
  .zv-cat-card:hover .zv-cat-img-wrap img {
    transform: scale(1.06);
  }
  .zv-cat-info {
    padding: 20px 22px;
    display: flex;
    flex-direction: column;
    flex-grow: 1;
  }
  .zv-cat-badge {
    align-self: flex-start;
    background: #f1f5f9;
    color: #0f172a;
    font-size: 10px;
    font-weight: 800;
    letter-spacing: 0.8px;
    text-transform: uppercase;
    padding: 3px 8px;
    border-radius: 6px;
    margin-bottom: 8px;
    border: 1px solid #e2e8f0;
  }
  .zv-cat-info h3 {
    margin: 0 0 6px 0;
    font-size: 18px;
    font-weight: 800;
    color: #0f172a;
    line-height: 1.3;
  }
  .zv-cat-info p {
    margin: 0 0 16px 0;
    font-size: 13.5px;
    color: #64748b;
    line-height: 1.5;
    flex-grow: 1;
  }
  .zv-cat-link {
    font-size: 13px;
    font-weight: 700;
    color: #0284c7;
    transition: color 0.15s ease;
  }
  .zv-cat-card:hover .zv-cat-link {
    color: #0369a1;
    text-decoration: underline;
  }
</style>

{% schema %}
{
  "name": "Willa Collections Grid",
  "settings": [
    {
      "type": "text",
      "id": "pill_text",
      "label": "Badge Pill Text",
      "default": "CURATED COLLECTIONS"
    },
    {
      "type": "text",
      "id": "heading",
      "label": "Heading",
      "default": "Explore by Category"
    },
    {
      "type": "textarea",
      "id": "subtitle",
      "label": "Subtitle",
      "default": "Discover Zavelyn specialized innovations engineered for personal wellness, smart home living, and heavy-duty reliability."
    }
  ],
  "presets": [
    {
      "name": "Willa Collections Grid"
    }
  ]
}
{% endschema %}
`;

  await uploadAsset('sections/willa-collections-grid.liquid', upgradedCategoriesLiquid, token);

  // 2. Fetch fresh willa-hero.liquid and cleanly update with double quotes
  let heroLiquid = await fetchAsset('sections/willa-hero.liquid', token);
  heroLiquid = heroLiquid.replace(
    /{{ section\.settings\.desc \| default: '[^']*' }}/,
    `{{ section.settings.desc | default: "Discover Zavelyn curated collection of smart heated gear, intimate wellness devices, kitchen innovations, and heavy-duty home essentials trusted by over 100,000+ happy customers." }}`
  );
  heroLiquid = heroLiquid.replace(
    /{{ section\.settings\.heading \| default: '[^']*' }}/,
    `{{ section.settings.heading | default: "Smart Lifestyle Innovations & Heavy-Duty Essentials" }}`
  );
  await uploadAsset('sections/willa-hero.liquid', heroLiquid, token);

  console.log('✔ Retried liquid sections successfully!');
}

main().catch(console.error);
