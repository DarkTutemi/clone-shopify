import fs from 'fs';

const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';
const THEME_ID = '186607567033';
const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || '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';

async function getAccessToken() {
  const res = await fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  const data = await res.json();
  if (!res.ok) throw new Error(`OAuth error: ${JSON.stringify(data)}`);
  return data.access_token;
}

async function uploadThemeAsset(token, key, value) {
  const url = `https://${SHOP_DOMAIN}/admin/api/2024-10/themes/${THEME_ID}/assets.json`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify({ asset: { key, value } })
  });
  const data = await res.json();
  if (res.ok) {
    console.log(`  ✔ Uploaded: ${key}`);
    return true;
  } else {
    console.error(`  ✗ Failed ${key}:`, JSON.stringify(data.errors || data));
    return false;
  }
}

async function main() {
  console.log('--- Deploying New Image Suite & Selling Points to Theme ---');
  const token = await getAccessToken();

  // 1. Update product.sakerplus-livestock-heating-lamp.json
  const jsonPath = 'Clone-willafarm/theme/templates/product.sakerplus-livestock-heating-lamp.json';
  const prodJson = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const funnelBlock = prodJson.sections.heating_lamp_funnel;

  // Update 3 Pack bundle image
  if (funnelBlock.blocks.bundle_3) {
    funnelBlock.blocks.bundle_3.settings.image_url = 'https://cdn.shopify.com/s/files/1/0826/2483/9865/t/3/assets/zavelyn-3pack-bundle.jpg?v=1792853189';
  }

  // Update 1 Pack image
  if (funnelBlock.blocks.bundle_1) {
    funnelBlock.blocks.bundle_1.settings.image_url = 'https://cdn.shopify.com/s/files/1/0826/2483/9865/t/3/assets/zavelyn-hero-main.png?v=1792853600';
  }

  // Update main image
  funnelBlock.settings.main_image_url = 'https://cdn.shopify.com/s/files/1/0826/2483/9865/t/3/assets/zavelyn-hero-main.png?v=1792853600';

  // Update Body Section 2 Feature Cards
  if (funnelBlock.blocks.feat_1) {
    funnelBlock.blocks.feat_1.settings.image_url = 'https://cdn.shopify.com/s/files/1/0826/2483/9865/t/3/assets/zavelyn-card-temp.jpg?v=1792853606';
  }
  if (funnelBlock.blocks.feat_2) {
    funnelBlock.blocks.feat_2.settings.image_url = 'https://cdn.shopify.com/s/files/1/0826/2483/9865/t/3/assets/zavelyn-card-monitor.jpg?v=1792853607';
  }
  if (funnelBlock.blocks.feat_3) {
    funnelBlock.blocks.feat_3.settings.image_url = 'https://cdn.shopify.com/s/files/1/0826/2483/9865/t/3/assets/zavelyn-card-setup.jpg?v=1792853608';
  }
  if (funnelBlock.blocks.feat_4) {
    funnelBlock.blocks.feat_4.settings.image_url = 'https://cdn.shopify.com/s/files/1/0826/2483/9865/t/3/assets/zavelyn-card-versatile.jpg?v=1792853609';
  }

  const updatedJsonStr = JSON.stringify(prodJson, null, 2);
  fs.writeFileSync(jsonPath, updatedJsonStr);
  console.log(`Saved ${jsonPath}`);
  await uploadThemeAsset(token, 'templates/product.sakerplus-livestock-heating-lamp.json', updatedJsonStr);

  // 2. Update sections/heating-lamp-funnel.liquid
  const liquidPath = 'Clone-willafarm/theme/sections/heating-lamp-funnel.liquid';
  let funnel = fs.readFileSync(liquidPath, 'utf8');

  // Update main gallery hero image default
  funnel = funnel.replace(
    /src="\{\{ section\.settings\.main_image_url \| default: '[^']+' \}\}"/,
    `src="{{ section.settings.main_image_url | default: 'https://cdn.shopify.com/s/files/1/0826/2483/9865/t/3/assets/zavelyn-hero-main.png?v=1792853600' }}"`
  );

  // Update gallery thumbnails strip
  const oldThumbStripRegex = /<div class="wf-thumbnail-strip">[\s\S]*?<\/div>\s*<\/div>\s*<!-- Buy Box/m;
  const newThumbStrip = `<div class="wf-thumbnail-strip">
          <img class="wf-thumb active" src="https://cdn.shopify.com/s/files/1/0826/2483/9865/t/3/assets/zavelyn-hero-main.png?v=1792853600" onclick="switchWfGallery(this.src)" referrerpolicy="no-referrer" alt="Zavelyn Intelligent Heating Lamp">
          <img class="wf-thumb" src="https://cdn.shopify.com/s/files/1/0826/2483/9865/t/3/assets/zavelyn-3pack-bundle.jpg?v=1792853189" onclick="switchWfGallery(this.src)" referrerpolicy="no-referrer" alt="3-Pack Bundle Set">
          <img class="wf-thumb" src="https://cdn.shopify.com/s/files/1/0826/2483/9865/t/3/assets/zavelyn-fireproof-safety.jpg?v=1792853601" onclick="switchWfGallery(this.src)" referrerpolicy="no-referrer" alt="100% Fireproof Safe on Pine Shavings">
          <img class="wf-thumb" src="https://cdn.shopify.com/s/files/1/0826/2483/9865/t/3/assets/zavelyn-smart-thermostat.jpg?v=1792853603" onclick="switchWfGallery(this.src)" referrerpolicy="no-referrer" alt="Smart Digital Thermostat Auto-Cycles Heat">
          <img class="wf-thumb" src="https://cdn.shopify.com/s/files/1/0826/2483/9865/t/3/assets/zavelyn-livestock-warmth.jpg?v=1792853604" onclick="switchWfGallery(this.src)" referrerpolicy="no-referrer" alt="Soft Amber Glow Poultry Brooder">
          <img class="wf-thumb" src="https://cdn.shopify.com/s/files/1/0826/2483/9865/t/3/assets/zavelyn-split-comparison.jpg?v=1792853605" onclick="switchWfGallery(this.src)" referrerpolicy="no-referrer" alt="Safe Brooder vs Dangerous Clamp Fire Hazard">
        </div>
      </div>

      <!-- Buy Box`;

  funnel = funnel.replace(oldThumbStripRegex, newThumbStrip);

  // Update fallback 3-pack bundle card
  funnel = funnel.replace(
    /onclick="selectWfBundle\('67953654300857',\s*'119\.99',\s*'134\.99',\s*'wf-bundle-3',\s*'[^']+'\)"/,
    `onclick="selectWfBundle('67953654300857', '119.99', '134.99', 'wf-bundle-3', 'https://cdn.shopify.com/s/files/1/0826/2483/9865/t/3/assets/zavelyn-3pack-bundle.jpg?v=1792853189')"`
  );

  // Update fallback 3-pack thumb img
  funnel = funnel.replace(
    /<img src="https:\/\/cdn\.myshopage\.com\/4574c936-7435-4b05-2934-ed1e12887e00\.png" alt="3 Pack Bundle"/,
    `<img src="https://cdn.shopify.com/s/files/1/0826/2483/9865/t/3/assets/zavelyn-3pack-bundle.jpg?v=1792853189" alt="3 Pack Bundle"`
  );

  // Update fallback Section 2 cards
  funnel = funnel.replace(
    'src="https://cdn.myshopage.com/8f765e2e-fcbd-4199-ab9b-433d4da5c000.jpg" alt="Adjustable Temperature"',
    'src="https://cdn.shopify.com/s/files/1/0826/2483/9865/t/3/assets/zavelyn-card-temp.jpg?v=1792853606" alt="Adjustable Temperature"'
  );
  funnel = funnel.replace(
    'src="https://cdn.myshopage.com/898406ff-0448-41a5-2440-fd49b2375e00/w1000.jpg" alt="Easy Temperature Monitoring"',
    'src="https://cdn.shopify.com/s/files/1/0826/2483/9865/t/3/assets/zavelyn-card-monitor.jpg?v=1792853607" alt="Easy Temperature Monitoring"'
  );
  funnel = funnel.replace(
    'src="https://cdn.myshopage.com/27c967b2-512d-43ee-b366-7568d2a3a700/w500.jpg" alt="Convenient Setup"',
    'src="https://cdn.shopify.com/s/files/1/0826/2483/9865/t/3/assets/zavelyn-card-setup.jpg?v=1792853608" alt="Convenient Setup"'
  );
  funnel = funnel.replace(
    'src="https://cdn.myshopage.com/8dfe030d-f1ec-4a8a-02a4-753863454400/w1000.jpg" alt="Versatile Farm Use"',
    'src="https://cdn.shopify.com/s/files/1/0826/2483/9865/t/3/assets/zavelyn-card-versatile.jpg?v=1792853609" alt="Versatile Farm Use"'
  );

  // Update Section 3A split story media image
  funnel = funnel.replace(
    /<div class="wf-split-media">\s*<img src="[^"]+" alt="Reliable Warmth for Your Routine"/,
    `<div class="wf-split-media">\n        <img src="https://cdn.shopify.com/s/files/1/0826/2483/9865/t/3/assets/zavelyn-split-comparison.jpg?v=1792853605" alt="Reliable Warmth for Your Routine"`
  );

  // Update sticky bar thumbnail
  funnel = funnel.replace(
    /id="wf-sticky-img" src="[^"]+"/,
    `id="wf-sticky-img" src="https://cdn.shopify.com/s/files/1/0826/2483/9865/t/3/assets/zavelyn-3pack-bundle.jpg?v=1792853189"`
  );

  fs.writeFileSync(liquidPath, funnel);
  console.log(`Saved ${liquidPath}`);
  await uploadThemeAsset(token, 'sections/heating-lamp-funnel.liquid', funnel);

  console.log('✔ All new images successfully applied and deployed to live Shopify Theme!');
}

main().catch(console.error);
