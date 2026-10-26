const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = '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';
const SHOP = 'dsdujr-vn.myshopify.com';
const DRAFT_THEME_ID = '187597717689';

async function getAccessToken() {
  const tRes = await fetch(`https://${SHOP}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  const data = await tRes.json();
  return data.access_token;
}

const updatedCategoriesLiquid = `{% schema %}
{
  "name": "Zavelyn Categories Grid",
  "settings": [],
  "presets": [{ "name": "Zavelyn Categories Grid" }]
}
{% endschema %}

<section class="zv-cat-grid-section">
  <div class="zv-section-header">
    <h2>Curated Collections</h2>
    <p>Discover specialized innovations engineered for personal wellness, smart home comfort, and heavy-duty reliability.</p>
  </div>

  <div class="zv-cat-cards-grid">
    <!-- Card 1: Best Sellers -->
    <a href="/collections/best-sellers" class="zv-card-item">
      <div class="zv-card-img-wrap">
        <img src="https://cdn.shopify.com/s/files/1/0826/2483/9865/files/package_1_battery.jpg?v=1792915513" alt="Best Sellers" loading="lazy">
      </div>
      <div class="zv-card-body">
        <span class="zv-card-badge">★ TOP RATED</span>
        <h3>Best Sellers</h3>
        <p>Customer favorites with verified 4.9-star ratings and proven track records.</p>
        <span class="zv-card-link">Shop Collection →</span>
      </div>
    </a>

    <!-- Card 2: Smart Heated Gear -->
    <a href="/collections/all-products" class="zv-card-item">
      <div class="zv-card-img-wrap">
        <img src="https://cdn.shopify.com/s/files/1/0826/2483/9865/files/zavelyn-thermoglove-black.jpg?v=1792936861" alt="Smart Gadgets & Heated Gear" loading="lazy">
      </div>
      <div class="zv-card-body">
        <span class="zv-card-badge">SMART TECH</span>
        <h3>Smart Gadgets & Heated Gear</h3>
        <p>Thermostatic heated gloves, CozyHeat blankets & ultrasonic precision tools.</p>
        <span class="zv-card-link">Discover Gear →</span>
      </div>
    </a>

    <!-- Card 3: Wellness & Personal Care -->
    <a href="/collections/all-products" class="zv-card-item">
      <div class="zv-card-img-wrap">
        <img src="https://cdn.shopify.com/s/files/1/0826/2483/9865/files/zavelyn-botana-asset-1.jpg?v=1792936448" alt="Personal Care & Wellness" loading="lazy">
      </div>
      <div class="zv-card-body">
        <span class="zv-card-badge">WELLNESS</span>
        <h3>Personal Care & Wellness</h3>
        <p>100% Organic Honduran Batana scalp oil, vFit rejuvenation & sculptwear.</p>
        <span class="zv-card-link">Explore Wellness →</span>
      </div>
    </a>

    <!-- Card 4: Heavy Duty & Farm Tools -->
    <a href="/collections/fence-and-farm" class="zv-card-item">
      <div class="zv-card-img-wrap">
        <img src="https://cdn.shopify.com/s/files/1/0826/2483/9865/files/megalifters_hero_excavator.png?v=1792936057" alt="Power & Heavy Duty Tools" loading="lazy">
      </div>
      <div class="zv-card-body">
        <span class="zv-card-badge">HEAVY DUTY</span>
        <h3>Power & Farm Tools</h3>
        <p>High-torque cordless blowers, alloy RC fleets & fence post repair kits.</p>
        <span class="zv-card-link">Shop Heavy Duty →</span>
      </div>
    </a>

    <!-- Card 5: Smart Pet Essentials -->
    <a href="/collections/all-products" class="zv-card-item">
      <div class="zv-card-img-wrap">
        <img src="https://cdn.shopify.com/s/files/1/0826/2483/9865/files/selenepets_hero_fountain.jpg?v=1792935435" alt="Smart Pet Essentials" loading="lazy">
      </div>
      <div class="zv-card-body">
        <span class="zv-card-badge">PET ESSENTIALS</span>
        <h3>Smart Pet Essentials</h3>
        <p>Ultra-quiet wireless stainless water fountains & feeder solutions.</p>
        <span class="zv-card-link">Shop Pet Care →</span>
      </div>
    </a>

    <!-- Card 6: Handpan Drums -->
    <a href="/collections/zavelyn-handpans" class="zv-card-item">
      <div class="zv-card-img-wrap">
        <img src="https://cdn.shopify.com/s/files/1/0826/2483/9865/files/PandaDrumPro_White.webp?v=1792868508" alt="Handpan Drums" loading="lazy">
      </div>
      <div class="zv-card-body">
        <span class="zv-card-badge">ACOUSTIC WELLNESS</span>
        <h3>Handpan & Tongue Drums</h3>
        <p>Hand-tuned 432Hz meditative steel drums for stress relief and musical expression.</p>
        <span class="zv-card-link">Explore Handpans →</span>
      </div>
    </a>
  </div>
</section>
`;

async function updateCategories() {
  const token = await getAccessToken();
  console.log(`Uploading updated sections/zavelyn-categories.liquid to Draft Theme ${DRAFT_THEME_ID}...`);
  const res = await fetch(`https://${SHOP}/admin/api/2024-10/themes/${DRAFT_THEME_ID}/assets.json`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify({
      asset: {
        key: 'sections/zavelyn-categories.liquid',
        value: updatedCategoriesLiquid
      }
    })
  });
  if (!res.ok) {
    throw new Error(await res.text());
  }
  console.log('✔ Updated sections/zavelyn-categories.liquid with verified image URLs!');
}

updateCategories();
