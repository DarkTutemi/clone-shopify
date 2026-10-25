import fs from 'fs';

const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = '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';
const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';

const urls = JSON.parse(fs.readFileSync('blower_media/uploaded_urls.json', 'utf8'));

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
<div class="zavelyn-blower-desc" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1f2937; line-height: 1.6; max-width: 900px; margin: 0 auto;">

  <!-- Hero Intro Banner -->
  <div style="background: linear-gradient(135deg, #111827 0%, #1f2937 100%); color: #ffffff; padding: 28px 24px; border-radius: 14px; margin-bottom: 28px; text-align: center; box-shadow: 0 4px 14px rgba(0,0,0,0.08);">
    <span style="display: inline-block; background: #eab308; color: #111827; font-weight: 800; font-size: 12px; text-transform: uppercase; letter-spacing: 1px; padding: 4px 12px; border-radius: 9999px; margin-bottom: 12px;">★ 180,000 RPM Micro-Turbine</span>
    <h2 style="color: #ffffff; font-size: 26px; font-weight: 800; line-height: 1.3; margin: 0 0 10px 0;">Why 50,000+ Americans Ditched Their Heavy Gas Blowers for This Cordless “Air Blade”</h2>
    <p style="color: #d1d5db; font-size: 15px; margin: 0 auto; max-width: 680px;">Forget dragging out a 40-pound gas blower. Forget destroying your car’s clear coat with grit-filled towels. The <strong>Zavelyn® Cordless Turbo Leaf Blower</strong> generates 500G of hurricane-force wind at 180,000 RPM without the cords, gas fumes, or back strain.</p>
  </div>

  <!-- Key Highlights Grid -->
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px; margin-bottom: 32px;">
    <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 10px; padding: 18px; text-align: center;">
      <div style="font-size: 24px; margin-bottom: 6px;">🌀</div>
      <div style="font-weight: 800; font-size: 15px; color: #111827;">180,000 RPM Blast</div>
      <div style="font-size: 13px; color: #6b7280; margin-top: 4px;">Delivers 500G hyper-stream wind force in a flashlight-sized tool</div>
    </div>
    <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 10px; padding: 18px; text-align: center;">
      <div style="font-size: 24px; margin-bottom: 6px;">🎛️</div>
      <div style="font-weight: 800; font-size: 15px; color: #111827;">Stepless Speed Control</div>
      <div style="font-size: 13px; color: #6b7280; margin-top: 4px;">From whisper-soft electronics dusting to Category 5 storm power</div>
    </div>
    <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 10px; padding: 18px; text-align: center;">
      <div style="font-size: 24px; margin-bottom: 6px;">🔋</div>
      <div style="font-weight: 800; font-size: 15px; color: #111827;">21V High-Drain Battery</div>
      <div style="font-size: 13px; color: #6b7280; margin-top: 4px;">Up to 47 mins continuous runtime with fast 60-min recharge</div>
    </div>
  </div>

  <!-- REASON 1 WITH GIF 1 (TOUCHLESS CAR DRYING) -->
  <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; margin-bottom: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.03);">
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <div style="text-align: center;">
        <img src="${urls['blower_dry_car.gif']}" alt="Touchless Car Drying with Zavelyn Cordless Turbo Blower" style="width: 100%; max-width: 520px; height: auto; border-radius: 10px; border: 1px solid #e5e7eb; box-shadow: 0 4px 12px rgba(0,0,0,0.08); display: inline-block;" loading="lazy">
      </div>
      <div>
        <div style="display: inline-block; background: #fee2e2; color: #991b1b; font-weight: 800; font-size: 11px; padding: 3px 10px; border-radius: 9999px; margin-bottom: 8px;">ZERO-CONTACT CLEANING</div>
        <h3 style="font-size: 20px; font-weight: 800; color: #111827; margin: 0 0 10px 0;">1. Kills Debris &amp; Water Instantly — Without Ever Touching Your Surfaces</h3>
        <p style="font-size: 15px; color: #4b5563; margin: 0 0 12px 0;">Here’s what nobody tells you about drying your car with a towel: Even the “softest microfiber” traps microscopic grit. Every wipe grinds dirt into your clear coat at 1,000+ PSI, leaving permanent swirl marks under the sun.</p>
        <p style="font-size: 15px; color: #4b5563; margin: 0 0 14px 0;">The <strong>Zavelyn Cordless Turbo Blower</strong> solves this with pure physics. Its 180,000 RPM motor generates an invisible high-speed air blade that lifts water out of door jambs, mirrors, grilles, and glass in 90 seconds without a single point of friction.</p>
        <div style="border-left: 3px solid #2563eb; background: #eff6ff; padding: 12px 16px; border-radius: 0 8px 8px 0;">
          <p style="margin: 0; font-size: 14px; font-style: italic; color: #1e40af;">“I’ve been detailing cars for 15 years. This thing blew my mind. Dried my entire truck in 90 seconds, zero towels, zero water spots. My paint has never looked cleaner.”</p>
          <p style="margin: 4px 0 0 0; font-size: 13px; font-weight: 700; color: #1e3a8a;">— Marcus L., Professional Auto Detailer</p>
        </div>
      </div>
    </div>
  </div>

  <!-- REASON 2 WITH GIF 2 (BLASTING WET LEAVES) -->
  <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <div style="text-align: center;">
        <img src="${urls['blower_clear_leaves.gif']}" alt="Clearing wet heavy leaves and patio debris" style="width: 100%; max-width: 520px; height: auto; border-radius: 10px; border: 1px solid #e5e7eb; box-shadow: 0 4px 12px rgba(0,0,0,0.08); display: inline-block;" loading="lazy">
      </div>
      <div>
        <div style="display: inline-block; background: #fef3c7; color: #92400e; font-weight: 800; font-size: 11px; padding: 3px 10px; border-radius: 9999px; margin-bottom: 8px;">UNRIVALED POWER-TO-WEIGHT</div>
        <h3 style="font-size: 20px; font-weight: 800; color: #111827; margin: 0 0 10px 0;">2. 73% More Force Than Gas Blowers — Weighs Under 2 Pounds</h3>
        <p style="font-size: 15px; color: #4b5563; margin: 0 0 12px 0;">Traditional blowers move air wide and diffuse power. Zavelyn compresses airflow into a concentrated 500G hyper-stream — like putting your thumb over a high-pressure firehose. It punches straight through soaked autumn maple leaves, sticky mud, gravel, and sawdust.</p>
        <p style="font-size: 15px; color: #4b5563; margin: 0 0 14px 0;">Best of all? It weighs under 1.8 lbs. You can clear entire driveways, decks, gutters, and patios with one hand without fatigue or back pain.</p>
        <div style="border-left: 3px solid #10b981; background: #ecfdf5; padding: 12px 16px; border-radius: 0 8px 8px 0;">
          <p style="margin: 0; font-size: 14px; font-style: italic; color: #065f46;">“I live in Oregon where fall = 6 inches of wet maple leaves. My gas blower died, so I tried this out of desperation. HOLY COW. It moved everything in 4 minutes. I’m never dragging out gas again.”</p>
          <p style="margin: 4px 0 0 0; font-size: 13px; font-weight: 700; color: #047857;">— Brenda P., Verified Homeowner</p>
        </div>
      </div>
    </div>
  </div>

  <!-- REASON 3 WITH GIF 3 (STEPLESS PRECISION DUSTING) -->
  <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; margin-bottom: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.03);">
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <div style="text-align: center;">
        <img src="${urls['blower_blast_pc.gif']}" alt="Precision dusting gaming PC and electronics" style="width: 100%; max-width: 520px; height: auto; border-radius: 10px; border: 1px solid #e5e7eb; box-shadow: 0 4px 12px rgba(0,0,0,0.08); display: inline-block;" loading="lazy">
      </div>
      <div>
        <div style="display: inline-block; background: #e0e7ff; color: #3730a3; font-weight: 800; font-size: 11px; padding: 3px 10px; border-radius: 9999px; margin-bottom: 8px;">STEPLESS TRIGGER</div>
        <h3 style="font-size: 20px; font-weight: 800; color: #111827; margin: 0 0 10px 0;">3. Precision Variable Trigger: Gentle for Keyboards, Brutal for Wet Leaves</h3>
        <p style="font-size: 15px; color: #4b5563; margin: 0 0 12px 0;">Unlike cheap on/off blowers, Zavelyn gives you infinite analog control. Lightly press the throttle for anti-static dusting of camera lenses, motherboards, air vents, and car interiors. Pull back fully to release a 500G hurricane.</p>
        <p style="font-size: 15px; color: #4b5563; margin: 0 0 14px 0;">Say goodbye to $8 disposable canned air that freezes up after 15 seconds. This one tool handles delicate hobby cleaning and heavy industrial garage blowouts with ease.</p>
        <div style="border-left: 3px solid #6366f1; background: #eef2ff; padding: 12px 16px; border-radius: 0 8px 8px 0;">
          <p style="margin: 0; font-size: 14px; font-style: italic; color: #3730a3;">“Used it on my son’s custom gaming PC (low speed, zero static) and then blew out the woodshop sawdust in 3 minutes. The trigger control is pure genius.”</p>
          <p style="margin: 4px 0 0 0; font-size: 13px; font-weight: 700; color: #312e81;">— James H., PC Builder &amp; DIYer</p>
        </div>
      </div>
    </div>
  </div>

  <!-- REASON 4 WITH GIF 4 (CHARCOAL STOKER & MULTIPURPOSE) -->
  <div style="background: #f9fafb; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <div style="text-align: center;">
        <img src="${urls['blower_fire_charcoal.gif']}" alt="Stoking BBQ coals to white-hot in 15 seconds" style="width: 100%; max-width: 520px; height: auto; border-radius: 10px; border: 1px solid #e5e7eb; box-shadow: 0 4px 12px rgba(0,0,0,0.08); display: inline-block;" loading="lazy">
      </div>
      <div>
        <div style="display: inline-block; background: #fef2f2; color: #b91c1c; font-weight: 800; font-size: 11px; padding: 3px 10px; border-radius: 9999px; margin-bottom: 8px;">REPLACES $746+ IN TOOLS</div>
        <h3 style="font-size: 20px; font-weight: 800; color: #111827; margin: 0 0 10px 0;">4. Stokes BBQ Coals to White-Hot in 15 Seconds &amp; Clears Winter Snow</h3>
        <p style="font-size: 15px; color: #4b5563; margin: 0 0 12px 0;">Need to get your barbecue or campfire raging? 15 seconds with the turbo air stream turns dormant lump charcoal glowing white-hot. No lighter fluid chemical smell or frantic fan waving.</p>
        <p style="font-size: 15px; color: #4b5563; margin: 0 0 14px 0;">In winter, blast fresh snow off windshields, truck beds, and porch steps in seconds before it turns to ice. One tool replaces your gas blower ($200), shop vac ($150), air compressor ($300), and canned air ($96/yr).</p>
      </div>
    </div>
  </div>

  <!-- REASON 5 WITH GIF 5 (SNOW CLEARING) -->
  <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 12px; padding: 24px; margin-bottom: 24px; box-shadow: 0 2px 8px rgba(0,0,0,0.03);">
    <div style="display: flex; flex-direction: column; gap: 16px;">
      <div style="text-align: center;">
        <img src="${urls['blower_clear_snow.gif']}" alt="Clearing snow off car without scratching paint" style="width: 100%; max-width: 520px; height: auto; border-radius: 10px; border: 1px solid #e5e7eb; box-shadow: 0 4px 12px rgba(0,0,0,0.08); display: inline-block;" loading="lazy">
      </div>
      <div>
        <div style="display: inline-block; background: #f0fdf4; color: #15803d; font-weight: 800; font-size: 11px; padding: 3px 10px; border-radius: 9999px; margin-bottom: 8px;">ALL-SEASON TOOL</div>
        <h3 style="font-size: 20px; font-weight: 800; color: #111827; margin: 0 0 10px 0;">5. Winter Snow &amp; Frost Defense: Clear Windshields in 30 Seconds</h3>
        <p style="font-size: 15px; color: #4b5563; margin: 0 0 12px 0;">Tired of freezing your fingers scraping snow off your car with plastic blades that scratch glass? Simply blow it off with 500G of high-velocity airflow. Perfect for clearing truck beds, tonneau covers, steps, and door locks.</p>
        <div style="border-left: 3px solid #0284c7; background: #f0f9ff; padding: 12px 16px; border-radius: 0 8px 8px 0;">
          <p style="margin: 0; font-size: 14px; font-style: italic; color: #0369a1;">“Minnesota winters are brutal. I keep this in my truck. Blows 3 inches of powdery snow off in 30 seconds without freezing my hands or scratching the paint.”</p>
          <p style="margin: 4px 0 0 0; font-size: 13px; font-weight: 700; color: #075985;">— Kyle J., Verified Minnesota Buyer</p>
        </div>
      </div>
    </div>
  </div>

  <!-- 3-Step Simple Usage -->
  <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 14px; padding: 26px; margin-bottom: 28px;">
    <h3 style="font-size: 20px; font-weight: 800; color: #0f172a; text-align: center; margin: 0 0 20px 0;">How to Use in 3 Simple Steps</h3>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 16px;">
      <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 18px; text-align: center;">
        <div style="font-size: 11px; font-weight: 800; color: #b45309; background: #fef3c7; display: inline-block; padding: 2px 8px; border-radius: 9999px; margin-bottom: 8px;">STEP 01</div>
        <div style="font-weight: 800; font-size: 15px; color: #0f172a;">Snap in the Battery</div>
        <p style="font-size: 13px; color: #64748b; margin: 6px 0 0 0;">Takes 2 seconds. Quick 21V slide-lock connection with LED charge indicator.</p>
      </div>
      <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 18px; text-align: center;">
        <div style="font-size: 11px; font-weight: 800; color: #b45309; background: #fef3c7; display: inline-block; padding: 2px 8px; border-radius: 9999px; margin-bottom: 8px;">STEP 02</div>
        <div style="font-weight: 800; font-size: 15px; color: #0f172a;">Aim at the Mess</div>
        <p style="font-size: 13px; color: #64748b; margin: 6px 0 0 0;">Point the precision nozzle at water, wet leaves, dust, snow, or sawdust.</p>
      </div>
      <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 10px; padding: 18px; text-align: center;">
        <div style="font-size: 11px; font-weight: 800; color: #b45309; background: #fef3c7; display: inline-block; padding: 2px 8px; border-radius: 9999px; margin-bottom: 8px;">STEP 03</div>
        <div style="font-weight: 800; font-size: 15px; color: #0f172a;">Squeeze the Trigger</div>
        <p style="font-size: 13px; color: #64748b; margin: 6px 0 0 0;">Dial in your exact wind force with stepless finger pressure. Done!</p>
      </div>
    </div>
  </div>

  <!-- Tech Specs Matrix -->
  <div style="background: #ffffff; border: 1px solid #e5e7eb; border-radius: 14px; padding: 24px; margin-bottom: 28px;">
    <h3 style="font-size: 18px; font-weight: 800; color: #111827; margin: 0 0 16px 0; text-align: center;">Technical Specifications</h3>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; font-size: 13px;">
      <div style="background: #f9fafb; padding: 12px 14px; border-radius: 8px; border: 1px solid #f3f4f6;">
        <span style="color: #6b7280; display: block; font-size: 11px; text-transform: uppercase; font-weight: 700;">Motor Speed</span>
        <strong style="color: #111827; font-size: 14px;">180,000 RPM Brushless</strong>
      </div>
      <div style="background: #f9fafb; padding: 12px 14px; border-radius: 8px; border: 1px solid #f3f4f6;">
        <span style="color: #6b7280; display: block; font-size: 11px; text-transform: uppercase; font-weight: 700;">Peak Wind Force</span>
        <strong style="color: #111827; font-size: 14px;">500G Hyper-Stream</strong>
      </div>
      <div style="background: #f9fafb; padding: 12px 14px; border-radius: 8px; border: 1px solid #f3f4f6;">
        <span style="color: #6b7280; display: block; font-size: 11px; text-transform: uppercase; font-weight: 700;">Battery Pack</span>
        <strong style="color: #111827; font-size: 14px;">21V 3000mAh High-Drain Li-Ion</strong>
      </div>
      <div style="background: #f9fafb; padding: 12px 14px; border-radius: 8px; border: 1px solid #f3f4f6;">
        <span style="color: #6b7280; display: block; font-size: 11px; text-transform: uppercase; font-weight: 700;">Continuous Runtime</span>
        <strong style="color: #111827; font-size: 14px;">Up to 47 Minutes</strong>
      </div>
      <div style="background: #f9fafb; padding: 12px 14px; border-radius: 8px; border: 1px solid #f3f4f6;">
        <span style="color: #6b7280; display: block; font-size: 11px; text-transform: uppercase; font-weight: 700;">Tool Weight</span>
        <strong style="color: #111827; font-size: 14px;">1.8 lbs (Under 2 lbs)</strong>
      </div>
      <div style="background: #f9fafb; padding: 12px 14px; border-radius: 8px; border: 1px solid #f3f4f6;">
        <span style="color: #6b7280; display: block; font-size: 11px; text-transform: uppercase; font-weight: 700;">Warranty</span>
        <strong style="color: #111827; font-size: 14px;">90-Day Money-Back Guarantee</strong>
      </div>
    </div>
  </div>

  <!-- Guarantee & Shipping Trust Banner -->
  <div style="background: #fdfbf9; border: 1px solid #e7e4df; border-radius: 12px; padding: 20px; text-align: center;">
    <div style="font-weight: 800; font-size: 15px; color: #1f2937; margin-bottom: 6px;">🛡️ 90-Day Risk-Free Trial &amp; Fast Domestic Dispatch</div>
    <p style="font-size: 13px; color: #6b7280; margin: 0;">Try the Zavelyn Cordless Turbo Leaf Blower in your yard, garage, and vehicle for 90 days. If it doesn't outperform your old gas blower, return it for a 100% full refund with zero restocking fees.</p>
  </div>

</div>
`;

async function main() {
  const token = await getAccessToken();
  console.log('Got access token. Creating product...');

  const productPayload = {
    product: {
      title: "Zavelyn Cordless Turbo Leaf Blower",
      handle: "saker-cordless-turbo-leaf-blower",
      body_html: bodyHtml,
      vendor: "Zavelyn",
      product_type: "Power Tools",
      tags: "Cleaning Tools, Power Tools, Cordless Leaf Blower, Best Seller, New Arrival, Outdoor",
      options: [
        { name: "Package" }
      ],
      variants: [
        {
          option1: "Portable Blower with 1 Battery",
          price: "75.99",
          compare_at_price: "151.99",
          inventory_policy: "continue",
          inventory_management: "shopify",
          inventory_quantity: 999
        },
        {
          option1: "Portable Blower with 2 Batteries + Toolbox",
          price: "95.99",
          compare_at_price: "191.99",
          inventory_policy: "continue",
          inventory_management: "shopify",
          inventory_quantity: 999
        },
        {
          option1: "Maxpower Blower Kit – 2 Batteries + 2 Power Nozzles",
          price: "91.99",
          compare_at_price: "183.99",
          inventory_policy: "continue",
          inventory_management: "shopify",
          inventory_quantity: 999
        },
        {
          option1: "Maxpower Blower Kit – 2 Batteries + 2 Power Nozzles + Toolbox",
          price: "105.99",
          compare_at_price: "211.99",
          inventory_policy: "continue",
          inventory_management: "shopify",
          inventory_quantity: 999
        }
      ],
      images: [
        { src: urls['blower_hero_main.jpg'] },
        { src: urls['package_1_battery.png'] },
        { src: urls['package_2_batteries_toolbox.jpg'] },
        { src: urls['package_2_batteries_2_nozzles.jpg'] },
        { src: urls['package_maxpower_pro_toolbox.jpg'] },
        { src: urls['blower_feat_car_dry.png'] },
        { src: urls['blower_feat_multipurpose.png'] },
        { src: urls['blower_feat_stepless.png'] },
        { src: urls['blower_feat_battery.png'] },
        { src: urls['blower_feat_air_blade.png'] }
      ]
    }
  };

  const res = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/products.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify(productPayload)
  });

  const data = await res.json();
  if (data.product) {
    console.log(`🎉 Successfully created product! ID: ${data.product.id}`);
    console.log(`URL: https://tryzavelyn.com/products/${data.product.handle}`);
    console.log(`Admin URL: https://admin.shopify.com/store/dsdujr-vn/products/${data.product.id}`);
    fs.writeFileSync('created_blower_product.json', JSON.stringify(data.product, null, 2));

    // Now link each variant to its respective image
    const p = data.product;
    const img1 = p.images.find(img => img.src.includes('package_1_battery'));
    const img2 = p.images.find(img => img.src.includes('package_2_batteries_toolbox'));
    const img3 = p.images.find(img => img.src.includes('package_2_batteries_2_nozzles'));
    const img4 = p.images.find(img => img.src.includes('package_maxpower_pro_toolbox'));

    const variantImageMap = [
      { variantId: p.variants[0]?.id, imageId: img1?.id },
      { variantId: p.variants[1]?.id, imageId: img2?.id },
      { variantId: p.variants[2]?.id, imageId: img3?.id },
      { variantId: p.variants[3]?.id, imageId: img4?.id }
    ];

    for (const item of variantImageMap) {
      if (item.variantId && item.imageId) {
        await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/variants/${item.variantId}.json`, {
          method: 'PUT',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': token
          },
          body: JSON.stringify({
            variant: {
              id: item.variantId,
              image_id: item.imageId,
              inventory_policy: 'continue'
            }
          })
        });
        console.log(`  ✔ Linked variant ${item.variantId} to image ${item.imageId}`);
      }
    }

  } else {
    console.error('✗ Failed to create product:', JSON.stringify(data));
  }
}

main().catch(console.error);
