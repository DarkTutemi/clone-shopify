import fs from 'fs';
import path from 'path';

const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = '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';
const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';

const uploadedUrls = JSON.parse(fs.readFileSync('dough_mixer_media/uploaded_urls.json', 'utf-8'));

async function getAccessToken() {
  const tokenRes = await fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  const data = await tokenRes.json();
  return data.access_token;
}

const bodyHtml = `
<div class="zavelyn-pdp-description-wrap" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #2d3748; line-height: 1.6; max-width: 860px; margin: 0 auto; padding: 20px 0;">
  
  <!-- Advertorial Editorial Intro -->
  <div style="background: #ffffff; border-radius: 12px; padding: 24px; border: 1px solid #edf2f7; box-shadow: 0 4px 14px rgba(0,0,0,0.04); margin-bottom: 28px;">
    <div style="display: flex; align-items: center; gap: 12px; margin-bottom: 16px; border-bottom: 1px solid #edf2f7; padding-bottom: 14px;">
      <span style="background: #8a2c13; color: #fff; font-size: 11px; font-weight: 800; text-transform: uppercase; padding: 4px 10px; border-radius: 20px; letter-spacing: 0.5px;">Baking Science & Insights</span>
      <span style="font-size: 13px; color: #718096;">By Sarah Mitchell | Home Baking Enthusiast & Food Science Writer</span>
    </div>
    
    <h2 style="font-size: 24px; line-height: 1.3; font-weight: 800; color: #1a202c; margin: 0 0 16px;">
      Why Thousands of Home Bakers Are Ditching the "Warm Towel Trick" After Learning the Real Reason Their Bread Never Rises
    </h2>

    <p style="font-size: 15px; color: #4a5568; margin-bottom: 14px;">
      How many times have you spent an hour making dough from scratch, only to pull back the towel and find it completely flat? For years, most bakers blamed their yeast, their flour, or their own kneading technique.
    </p>

    <p style="font-size: 15px; color: #4a5568; margin-bottom: 14px;">
      Here is the hard truth nobody in Instagram baking reels ever mentions: <strong>An ordinary home kitchen is one of the worst environments for dough fermentation.</strong> Drafts from central AC, shifting ambient temperatures, and uneven proofing cause yeast to go dormant or over-ferment, resulting in dense, brick-like loaves.
    </p>

    <div style="text-align: center; margin: 24px 0;">
      <img src="${uploadedUrls['dough_mixer_intro_compare.jpg']}" alt="Conventional Proofing vs Zavelyn Constant-Temperature Fermentation" style="width: 100%; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.08);" />
    </div>

    <p style="font-size: 15px; color: #4a5568; margin-bottom: 0;">
      The <strong>Zavelyn Automatic Dough Mixer With Ferment Function</strong> eliminates every variable. By combining hands-free 360° spiral kneading with a microprocessor-controlled <strong>77°F to 100°F constant-temperature fermentation chamber</strong>, it delivers consistent, bakery-grade pillowy dough every single time.
    </p>
  </div>

  <!-- 3-in-1 Powerhouse Feature -->
  <div style="text-align: center; margin-bottom: 32px;">
    <span style="color: #8a2c13; font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">All-In-One Baking Solution</span>
    <h3 style="font-size: 26px; font-weight: 800; color: #1a202c; margin: 8px 0 12px;">Mix. Knead. Ferment. Hand-Free Perfection.</h3>
    <p style="font-size: 15px; color: #718096; max-width: 650px; margin: 0 auto 20px;">
      One single countertop machine does the heavy lifting, saving your wrists, your time, and your kitchen countertops from sticky flour messes.
    </p>
    <img src="${uploadedUrls['dough_mixer_3in1_feature.jpg']}" alt="3-in-1 Mixing, Kneading and Fermenting in One Machine" style="width: 100%; border-radius: 12px; box-shadow: 0 6px 18px rgba(0,0,0,0.06);" />
  </div>

  <!-- Key Pillars Grid -->
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px; margin-bottom: 32px;">
    
    <div style="background: #f7fafc; padding: 22px; border-radius: 10px; border: 1px solid #e2e8f0;">
      <div style="font-size: 26px; margin-bottom: 8px;">🥖</div>
      <h4 style="font-size: 17px; font-weight: 700; color: #2d3748; margin: 0 0 8px;">Windowpane Gluten Development</h4>
      <p style="font-size: 14px; color: #718096; margin: 0;">The bi-directional S-shaped stainless steel blade stretches and folds the dough rhythmically, achieving the coveted translucent windowpane test in under 15 minutes.</p>
    </div>

    <div style="background: #f7fafc; padding: 22px; border-radius: 10px; border: 1px solid #e2e8f0;">
      <div style="font-size: 26px; margin-bottom: 8px;">🌡️</div>
      <h4 style="font-size: 17px; font-weight: 700; color: #2d3748; margin: 0 0 8px;">Precision Proofing (77°F - 100°F)</h4>
      <p style="font-size: 14px; color: #718096; margin: 0;">Gentle 360° constant bottom heating creates the microclimate yeast thrives in. Perfect rise in any kitchen, regardless of winter drafts or summer air conditioning.</p>
    </div>

    <div style="background: #f7fafc; padding: 22px; border-radius: 10px; border: 1px solid #e2e8f0;">
      <div style="font-size: 26px; margin-bottom: 8px;">🥣</div>
      <h4 style="font-size: 17px; font-weight: 700; color: #2d3748; margin: 0 0 8px;">Commercial 7L SUS 304 Bowl</h4>
      <p style="font-size: 14px; color: #718096; margin: 0;">Heavy-duty food-grade stainless steel bowl handles from 1 to 7 lbs of dough. Easily make a small artisan boule or batch-bake bread for the whole extended family.</p>
    </div>

    <div style="background: #f7fafc; padding: 22px; border-radius: 10px; border: 1px solid #e2e8f0;">
      <div style="font-size: 26px; margin-bottom: 8px;">⚡</div>
      <h4 style="font-size: 17px; font-weight: 700; color: #2d3748; margin: 0 0 8px;">250W Pure Copper High-Torque Motor</h4>
      <p style="font-size: 14px; color: #718096; margin: 0;">Industrial-grade pure copper motor drives through the densest whole wheat, rye, sourdough, and bagel doughs without stalling, overheating, or rocking.</p>
    </div>

  </div>

  <!-- Dynamic Demonstration GIFs -->
  <div style="margin-bottom: 32px;">
    <h3 style="font-size: 22px; font-weight: 800; color: #1a202c; text-align: center; margin-bottom: 20px;">See the Zavelyn DoughMaster™ in Action</h3>
    
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 16px;">
      <div style="text-align: center; background: #fff; padding: 14px; border-radius: 10px; border: 1px solid #e2e8f0;">
        <img src="${uploadedUrls['dough_mixer_knead_action.gif']}" alt="Hands-Free 360 Spiral Kneading" style="width: 100%; border-radius: 8px;" />
        <p style="font-size: 14px; font-weight: 700; color: #2d3748; margin-top: 10px;">Hands-Free 360° Spiral Kneading</p>
      </div>

      <div style="text-align: center; background: #fff; padding: 14px; border-radius: 10px; border: 1px solid #e2e8f0;">
        <img src="${uploadedUrls['dough_mixer_ferment_rise.gif']}" alt="Constant-Temperature Proofing & Rise" style="width: 100%; border-radius: 8px;" />
        <p style="font-size: 14px; font-weight: 700; color: #2d3748; margin-top: 10px;">Constant-Temperature Proofing & Rise</p>
      </div>
    </div>
  </div>

  <!-- Easy Cleanup Section -->
  <div style="display: flex; flex-direction: column; md-flex-direction: row; gap: 20px; align-items: center; background: #faf5ee; padding: 24px; border-radius: 12px; border: 1px solid #ecd9c6; margin-bottom: 32px;">
    <div style="flex: 1;">
      <span style="color: #8a2c13; font-size: 12px; font-weight: 800; text-transform: uppercase;">Mess-Free Baking</span>
      <h4 style="font-size: 20px; font-weight: 800; color: #2d3748; margin: 6px 0 10px;">30-Second Quick Rinse Cleanup</h4>
      <p style="font-size: 14px; color: #4a5568; line-height: 1.5; margin-bottom: 12px;">
        The non-stick electropolished SUS 304 stainless steel surface releases dough instantly. The removable bowl and blade are 100% dishwasher safe. No sticky dough crusted onto countertops, rolling pins, or fingers!
      </p>
      <div style="display: flex; gap: 12px; font-size: 13px; font-weight: 700; color: #16a34a;">
        <span>✓ Dishwasher Safe Bowl</span>
        <span>✓ BPA-Free Splash Lid</span>
        <span>✓ Removable Blade</span>
      </div>
    </div>
    <div style="flex: 1; max-width: 320px; text-align: center;">
      <img src="${uploadedUrls['dough_mixer_easy_clean.gif']}" alt="Easy Cleanup Demonstration" style="width: 100%; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.1);" />
    </div>
  </div>

  <!-- 4 Step Baking Guide -->
  <div style="background: #ffffff; border: 1.5px solid #edf2f7; border-radius: 12px; padding: 24px; margin-bottom: 32px;">
    <h3 style="font-size: 20px; font-weight: 800; color: #1a202c; text-align: center; margin-bottom: 20px;">4 Steps to Fresh Bakery Bread at Home</h3>
    
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(180px, 1fr)); gap: 16px; text-align: center;">
      <div style="padding: 12px;">
        <div style="width: 36px; height: 36px; line-height: 36px; border-radius: 50%; background: #8a2c13; color: #fff; font-weight: 800; margin: 0 auto 10px;">1</div>
        <strong style="display: block; font-size: 14px; color: #2d3748; margin-bottom: 4px;">Add Ingredients</strong>
        <span style="font-size: 12px; color: #718096;">Flour, water, yeast, and salt straight into the 7L bowl.</span>
      </div>

      <div style="padding: 12px;">
        <div style="width: 36px; height: 36px; line-height: 36px; border-radius: 50%; background: #8a2c13; color: #fff; font-weight: 800; margin: 0 auto 10px;">2</div>
        <strong style="display: block; font-size: 14px; color: #2d3748; margin-bottom: 4px;">Set Knead Time</strong>
        <span style="font-size: 12px; color: #718096;">Digital timer presets knead cycle (15-20 min) to form silky gluten.</span>
      </div>

      <div style="padding: 12px;">
        <div style="width: 36px; height: 36px; line-height: 36px; border-radius: 50%; background: #8a2c13; color: #fff; font-weight: 800; margin: 0 auto 10px;">3</div>
        <strong style="display: block; font-size: 14px; color: #2d3748; margin-bottom: 4px;">Warm Ferment</strong>
        <span style="font-size: 12px; color: #718096;">Constant 77°-100°F proofing chamber doubles dough volume uniformly.</span>
      </div>

      <div style="padding: 12px;">
        <div style="width: 36px; height: 36px; line-height: 36px; border-radius: 50%; background: #8a2c13; color: #fff; font-weight: 800; margin: 0 auto 10px;">4</div>
        <strong style="display: block; font-size: 14px; color: #2d3748; margin-bottom: 4px;">Bake & Enjoy</strong>
        <span style="font-size: 12px; color: #718096;">Shape your loaves, pizza, or brioche and bake golden-brown perfection.</span>
      </div>
    </div>
  </div>

  <!-- Technical Specifications Table -->
  <div style="margin-bottom: 32px;">
    <h3 style="font-size: 20px; font-weight: 800; color: #1a202c; margin-bottom: 14px;">Technical Specifications</h3>
    <table style="width: 100%; border-collapse: collapse; font-size: 14px; text-align: left;">
      <tbody>
        <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 14px; font-weight: 700; color: #4a5568; background: #f7fafc; width: 35%;">Brand</td><td style="padding: 10px 14px; color: #2d3748;">Zavelyn</td></tr>
        <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 14px; font-weight: 700; color: #4a5568; background: #f7fafc;">Model</td><td style="padding: 10px 14px; color: #2d3748;">DoughMaster™ 7L Multi-Function Automatic Mixer & Fermenter</td></tr>
        <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 14px; font-weight: 700; color: #4a5568; background: #f7fafc;">Bowl Capacity</td><td style="padding: 10px 14px; color: #2d3748;">7.0 Liters / 7.4 Quarts (Holds up to 7 lbs dough)</td></tr>
        <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 14px; font-weight: 700; color: #4a5568; background: #f7fafc;">Bowl Material</td><td style="padding: 10px 14px; color: #2d3748;">Food-Grade SUS 304 Stainless Steel (Dishwasher Safe)</td></tr>
        <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 14px; font-weight: 700; color: #4a5568; background: #f7fafc;">Motor Power</td><td style="padding: 10px 14px; color: #2d3748;">250W Pure Copper High-Torque Kneading Motor</td></tr>
        <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 14px; font-weight: 700; color: #4a5568; background: #f7fafc;">Proofing Temp</td><td style="padding: 10px 14px; color: #2d3748;">77°F to 100°F (25°C - 38°C) Constant Heat Chamber</td></tr>
        <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 14px; font-weight: 700; color: #4a5568; background: #f7fafc;">Control Panel</td><td style="padding: 10px 14px; color: #2d3748;">Digital Microcomputer Display with Touch Timing Buttons</td></tr>
        <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 14px; font-weight: 700; color: #4a5568; background: #f7fafc;">Voltage</td><td style="padding: 10px 14px; color: #2d3748;">110V - 120V Standard US Plug</td></tr>
        <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 14px; font-weight: 700; color: #4a5568; background: #f7fafc;">Safety Features</td><td style="padding: 10px 14px; color: #2d3748;">4 Non-Slip Silicone Suction Feet, Overheat Auto Shut-Off</td></tr>
      </tbody>
    </table>
  </div>

  <!-- What's in the Box -->
  <div style="background: #f7fafc; border-radius: 10px; padding: 20px; border: 1px solid #e2e8f0; margin-bottom: 32px;">
    <h4 style="font-size: 16px; font-weight: 800; color: #2d3748; margin: 0 0 10px;">📦 Complete Package Includes:</h4>
    <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #4a5568; line-height: 1.8;">
      <li>1x Zavelyn DoughMaster™ 7L Multi-Function Motor Base</li>
      <li>1x Food-Grade SUS 304 Stainless Steel 7L Bowl</li>
      <li>1x S-Shaped 360° Kneading Blade</li>
      <li>1x Transparent Splash-Proof Lid with Easy-Pour Add-In Cap</li>
      <li>1x Precision Measuring Cup & Spoon Set</li>
      <li>1x Quick-Start Instruction Manual & Master Artisan Recipe Booklet</li>
    </ul>
  </div>

  <!-- Verified Customer Reviews Section -->
  <div>
    <div style="text-align: center; margin-bottom: 24px;">
      <h3 style="font-size: 22px; font-weight: 800; color: #1a202c; margin-bottom: 6px;">Real Reviews from Passionate Home Bakers</h3>
      <div style="color: #f59e0b; font-size: 18px; margin-bottom: 4px;">★★★★★</div>
      <span style="font-size: 14px; color: #718096; font-weight: 600;">Rated 4.9 / 5.0 based on 1,240+ verified customer experiences</span>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 18px;">
      
      <!-- Review 1 -->
      <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 18px; box-shadow: 0 2px 8px rgba(0,0,0,0.03);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <strong style="color: #2d3748; font-size: 14px;">Kyle J.</strong>
          <span style="color: #16a34a; font-size: 12px; font-weight: 600;">✓ Verified Buyer</span>
        </div>
        <div style="color: #f59e0b; font-size: 13px; margin-bottom: 6px;">★★★★★</div>
        <p style="font-size: 13px; color: #4a5568; line-height: 1.5; margin: 0 0 10px;">
          "The wide lid is super convenient when I need to add flour or butter during mixing. The 7L bowl gives me plenty of room for double batches. The dough feels elastic, and the proofing function saves so much time."
        </p>
        <span style="font-size: 11px; color: #a0aec0;">Chicago, IL • Used for Sourdough & Sandwich Loaves</span>
      </div>

      <!-- Review 2 -->
      <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 18px; box-shadow: 0 2px 8px rgba(0,0,0,0.03);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <strong style="color: #2d3748; font-size: 14px;">Bobbie M.</strong>
          <span style="color: #16a34a; font-size: 12px; font-weight: 600;">✓ Verified Buyer</span>
        </div>
        <div style="color: #f59e0b; font-size: 13px; margin-bottom: 6px;">★★★★★</div>
        <p style="font-size: 13px; color: #4a5568; line-height: 1.5; margin: 0 0 10px;">
          "No more hand kneading until my arthritis hurts. Just put the ingredients in, press the button, and let it knead and rise. It comes out silky smooth and rises consistently every single time."
        </p>
        <span style="font-size: 11px; color: #a0aec0;">Austin, TX • Used for Artisan Boules</span>
      </div>

      <!-- Review 3 -->
      <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 18px; box-shadow: 0 2px 8px rgba(0,0,0,0.03);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <strong style="color: #2d3748; font-size: 14px;">Jerry T.</strong>
          <span style="color: #16a34a; font-size: 12px; font-weight: 600;">✓ Verified Buyer</span>
        </div>
        <div style="color: #f59e0b; font-size: 13px; margin-bottom: 6px;">★★★★★</div>
        <p style="font-size: 13px; color: #4a5568; line-height: 1.5; margin: 0 0 10px;">
          "I was worried it might be complicated, but it's remarkably intuitive. My pizza dough and cinnamon rolls turn out bakery-level soft. Clean up is a breeze since dough doesn't stick to the SUS 304 bowl."
        </p>
        <span style="font-size: 11px; color: #a0aec0;">Seattle, WA • Used for Neapolitan Pizza & Brioche</span>
      </div>

    </div>
  </div>

</div>
`;

async function seedProduct() {
  const token = await getAccessToken();
  console.log('Got access token. Checking existing products...');

  // 1. Check if product already exists
  const existingRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/products.json?handle=zavelyn-automatic-dough-mixer-with-ferment-function`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const existingData = await existingRes.json();
  if (existingData.products && existingData.products.length > 0) {
    for (const p of existingData.products) {
      console.log(`Deleting existing product ${p.id}...`);
      await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/products/${p.id}.json`, {
        method: 'DELETE',
        headers: { 'X-Shopify-Access-Token': token }
      });
    }
  }

  // 2. Prepare images
  const images = [
    { src: uploadedUrls['dough_mixer_red_card.jpg'], alt: 'Zavelyn Automatic Dough Mixer 7L - Crimson Red' },
    { src: uploadedUrls['dough_mixer_white_card.jpg'], alt: 'Zavelyn Automatic Dough Mixer 7L - Classic White' },
    { src: uploadedUrls['dough_mixer_hero_banner.jpg'], alt: 'Zavelyn Automatic Dough Mixer with Ferment Function' },
    { src: uploadedUrls['dough_mixer_intro_compare.jpg'], alt: 'Conventional Proofing vs Fermentation Chamber' },
    { src: uploadedUrls['dough_mixer_3in1_feature.jpg'], alt: '3-in-1 Mixing, Kneading and Fermenting' },
    { src: uploadedUrls['dough_mixer_bowl_capacity.jpg'], alt: '7L Large SUS 304 Stainless Steel Bowl' },
    { src: uploadedUrls['dough_mixer_motor_power.jpg'], alt: '250W Pure Copper High-Torque Motor' },
    { src: uploadedUrls['dough_mixer_temperature_control.jpg'], alt: 'Constant Temperature Fermentation 77-100F' }
  ];

  // 3. Prepare variants
  const variants = [
    // Buy 1
    {
      option1: 'Buy 1 (Single Kitchen Master - Save 50%)',
      option2: 'Classic Red',
      price: '169.99',
      compare_at_price: '339.99',
      inventory_policy: 'continue',
      inventory_management: null,
      requires_shipping: true
    },
    {
      option1: 'Buy 1 (Single Kitchen Master - Save 50%)',
      option2: 'Modern White',
      price: '169.99',
      compare_at_price: '339.99',
      inventory_policy: 'continue',
      inventory_management: null,
      requires_shipping: true
    },
    // Buy 2
    {
      option1: 'Buy 2 (Double Baker Set - Save 55%)',
      option2: 'Classic Red',
      price: '299.99',
      compare_at_price: '679.98',
      inventory_policy: 'continue',
      inventory_management: null,
      requires_shipping: true
    },
    {
      option1: 'Buy 2 (Double Baker Set - Save 55%)',
      option2: 'Modern White',
      price: '299.99',
      compare_at_price: '679.98',
      inventory_policy: 'continue',
      inventory_management: null,
      requires_shipping: true
    },
    // Buy 3
    {
      option1: 'Buy 3 (The Ultimate Bakery Bundle - Save 60%)',
      option2: 'Classic Red',
      price: '399.99',
      compare_at_price: '1019.97',
      inventory_policy: 'continue',
      inventory_management: null,
      requires_shipping: true
    },
    {
      option1: 'Buy 3 (The Ultimate Bakery Bundle - Save 60%)',
      option2: 'Modern White',
      price: '399.99',
      compare_at_price: '1019.97',
      inventory_policy: 'continue',
      inventory_management: null,
      requires_shipping: true
    }
  ];

  console.log('Creating new product on Shopify API...');
  const createRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/products.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify({
      product: {
        title: 'Zavelyn Automatic Dough Mixer With Ferment Function',
        handle: 'zavelyn-automatic-dough-mixer-with-ferment-function',
        vendor: 'Zavelyn',
        product_type: 'Kitchen Appliances',
        tags: 'Dough Mixer, Kitchen, Baking, Best Seller, New 2026, Appliances, Fermenter',
        body_html: bodyHtml,
        options: [
          { name: 'Bundle' },
          { name: 'Color' }
        ],
        images: images,
        variants: variants
      }
    })
  });

  const createData = await createRes.json();
  if (!createData.product) {
    console.error('Failed to create product:', JSON.stringify(createData));
    return;
  }

  const newProduct = createData.product;
  console.log(`✔ Created product ${newProduct.id}: ${newProduct.title}`);

  // Link variant images
  const redImg = newProduct.images.find(img => img.alt.includes('Crimson Red') || img.position === 1);
  const whiteImg = newProduct.images.find(img => img.alt.includes('Classic White') || img.position === 2);

  console.log('Linking variant images...');
  for (const v of newProduct.variants) {
    const isRed = v.option2 === 'Classic Red';
    const targetImg = isRed ? redImg : whiteImg;
    if (targetImg) {
      await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/variants/${v.id}.json`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
        body: JSON.stringify({
          variant: {
            id: v.id,
            image_id: targetImg.id,
            inventory_policy: 'continue'
          }
        })
      });
    }
  }
  console.log('✔ Linked all variant images & verified inventory_policy: continue');

  // Add to collections
  const collections = [510391353529, 510391156921, 510391222457];
  for (const cId of collections) {
    try {
      await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/collects.json`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
        body: JSON.stringify({
          collect: {
            product_id: newProduct.id,
            collection_id: cId
          }
        })
      });
      console.log(`✔ Added to collection ${cId}`);
    } catch (e) {
      console.warn(`Could not add to collection ${cId}:`, e.message);
    }
  }

  console.log('\n🎉 Product seeding complete!');
  console.log(`URL: https://${SHOP_DOMAIN}/products/${newProduct.handle}`);
}

seedProduct().catch(console.error);
