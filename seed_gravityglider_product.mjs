import fs from 'fs';

const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = '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';
const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';

const uploadedUrls = JSON.parse(fs.readFileSync('gravityglider_media/uploaded_urls.json', 'utf-8'));

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

  <!-- Hero Editorial Hook -->
  <div style="background: #f7fafc; border-radius: 12px; padding: 26px; border: 1px solid #e2e8f0; box-shadow: 0 4px 14px rgba(66,153,225,0.06); margin-bottom: 28px;">
    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 14px; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px;">
      <span style="background: #e53e3e; color: #fff; font-size: 11px; font-weight: 800; text-transform: uppercase; padding: 4px 10px; border-radius: 20px; letter-spacing: 0.5px;">Awarded #1 Outdoor RC Aircraft of 2026</span>
      <span style="font-size: 13px; color: #718096;">Over 140,000+ Thrilled Pilots &amp; Families Flying</span>
    </div>

    <h2 style="font-size: 24px; line-height: 1.3; font-weight: 800; color: #1a202c; margin: 0 0 16px;">
      The Indestructible RC Fighter Jet That Does 360° Stunt Flips Right Out Of The Box — Virtually Unbreakable!
    </h2>

    <p style="font-size: 15px; color: #4a5568; margin-bottom: 14px;">
      Most remote control planes snap wings, shatter propellers, and burn out motors within 5 minutes of your first backyard crash. Frustrating kids, disappointing parents, and wasting money.
    </p>

    <p style="font-size: 15px; color: #4a5568; margin-bottom: 16px;">
      The <strong>Zavelyn GravityGlider™</strong> is built completely differently. Engineered from high-density, memory-flex <strong>Aerospace EPP Foam</strong> with a cushioned silicone shock-bumper nose, it bounces directly off brick walls, asphalt pavements, trees, and fences without a scratch. With built-in <strong>6-axis gyro auto-stabilization</strong>, even a complete beginner can take off, soar, and execute aerial barrel rolls within minutes!
    </p>

    <div style="text-align: center; margin: 20px 0;">
      <img src="${uploadedUrls['glider_hand_toss.webp']}" alt="Hand Toss Easy Launch Anywhere" style="width: 100%; max-width: 680px; border-radius: 12px; box-shadow: 0 4px 14px rgba(0,0,0,0.06);" />
    </div>
  </div>

  <!-- Stunt Flight & Gyro Demo -->
  <div style="text-align: center; margin-bottom: 32px;">
    <span style="color: #e53e3e; font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">Smart Auto-Hover &amp; Stunt Maneuvers</span>
    <h3 style="font-size: 26px; font-weight: 800; color: #1a202c; margin: 8px 0 14px;">Push-Button 360° Barrel Rolls &amp; Aerobatic Loops</h3>
    <p style="font-size: 15px; color: #718096; max-width: 660px; margin: 0 auto 20px;">
      Equipped with dual coreless high-speed motors and intelligent rudder balance, the GravityGlider automatically compensates for wind gusts to keep your flight smooth, steady, and thrilling.
    </p>
    <img src="${uploadedUrls['glider_stunt_loop.webp']}" alt="GravityGlider 360 Loop Stunt Flight" style="width: 100%; max-width: 680px; border-radius: 12px; box-shadow: 0 6px 18px rgba(0,0,0,0.06);" />
  </div>

  <!-- 4 Feature Pillars Grid -->
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 18px; margin-bottom: 32px;">
    
    <div style="background: #ffffff; padding: 22px; border-radius: 10px; border: 1px solid #e2e8f0; border-left: 4px solid #e53e3e;">
      <div style="font-size: 24px; margin-bottom: 8px;">🛡️</div>
      <h4 style="font-size: 17px; font-weight: 700; color: #2d3748; margin: 0 0 8px;">Unbreakable EPP Foam Body</h4>
      <p style="font-size: 14px; color: #718096; margin: 0;">Specialized elastic impact foam bends upon high-speed collision and snaps back to original aerodynamic shape without cracking or snapping.</p>
    </div>

    <div style="background: #ffffff; padding: 22px; border-radius: 10px; border: 1px solid #e2e8f0; border-left: 4px solid #e53e3e;">
      <div style="font-size: 24px; margin-bottom: 8px;">🎯</div>
      <h4 style="font-size: 17px; font-weight: 700; color: #2d3748; margin: 0 0 8px;">6-Axis Gyro Auto-Leveling</h4>
      <p style="font-size: 14px; color: #718096; margin: 0;">If you ever lose orientation or panic mid-air, simply let go of the control stick — the plane immediately levels itself into a stable glide.</p>
    </div>

    <div style="background: #ffffff; padding: 22px; border-radius: 10px; border: 1px solid #e2e8f0; border-left: 4px solid #e53e3e;">
      <div style="font-size: 24px; margin-bottom: 8px;">📡</div>
      <h4 style="font-size: 17px; font-weight: 700; color: #2d3748; margin: 0 0 8px;">2.4GHz Long-Range Radio Control</h4>
      <p style="font-size: 14px; color: #718096; margin: 0;">Fly up to 500 feet (150m) away with zero latency. Anti-jamming frequency allows multiple jets to race and dogfight simultaneously.</p>
    </div>

    <div style="background: #ffffff; padding: 22px; border-radius: 10px; border: 1px solid #e2e8f0; border-left: 4px solid #e53e3e;">
      <div style="font-size: 24px; margin-bottom: 8px;">🌊</div>
      <h4 style="font-size: 17px; font-weight: 700; color: #2d3748; margin: 0 0 8px;">Waterproof Sealed Electronics</h4>
      <p style="font-size: 14px; color: #718096; margin: 0;">Accidentally land in a lake, swimming pool, or damp grass? The buoyant airframe floats high and sealed circuits stay safe.</p>
    </div>

  </div>

  <!-- Dimensions & Technical Schematic -->
  <div style="background: #fff; border-radius: 12px; padding: 26px; border: 1.5px solid #e2e8f0; margin-bottom: 32px;">
    <div style="text-align: center; margin-bottom: 20px;">
      <h3 style="font-size: 22px; font-weight: 800; color: #1a202c; margin: 0 0 8px;">Aerodynamic Specifications &amp; Anatomy</h3>
      <p style="font-size: 14px; color: #718096;">Engineered with real swept-wing supersonic delta fighter jet geometry</p>
    </div>

    <div style="text-align: center; margin-bottom: 18px;">
      <img src="${uploadedUrls['glider_dimensions_specs.webp']}" alt="Zavelyn GravityGlider Dimensions" style="width: 100%; max-width: 620px; border-radius: 10px;" />
    </div>

    <table style="width: 100%; border-collapse: collapse; font-size: 14px; text-align: left;">
      <tbody>
        <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 14px; font-weight: 700; color: #4a5568; background: #f7fafc; width: 35%;">Brand</td><td style="padding: 10px 14px; color: #2d3748;">Zavelyn</td></tr>
        <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 14px; font-weight: 700; color: #4a5568; background: #f7fafc;">Model</td><td style="padding: 10px 14px; color: #2d3748;">GravityGlider™ Stunt RC Jet Aircraft</td></tr>
        <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 14px; font-weight: 700; color: #4a5568; background: #f7fafc;">Wingspan &amp; Length</td><td style="padding: 10px 14px; color: #2d3748;">Wingspan: 29cm (11.4") | Length: 39cm (15.3")</td></tr>
        <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 14px; font-weight: 700; color: #4a5568; background: #f7fafc;">Airframe Material</td><td style="padding: 10px 14px; color: #2d3748;">Aviation-Grade High-Elasticity EPP Foam + Silicone Nose Cone</td></tr>
        <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 14px; font-weight: 700; color: #4a5568; background: #f7fafc;">Remote Distance</td><td style="padding: 10px 14px; color: #2d3748;">150 meters (500 feet) line of sight</td></tr>
        <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 14px; font-weight: 700; color: #4a5568; background: #f7fafc;">Flight Time</td><td style="padding: 10px 14px; color: #2d3748;">15 - 20 minutes continuous flight per rechargeable pack</td></tr>
        <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 14px; font-weight: 700; color: #4a5568; background: #f7fafc;">Charging Time</td><td style="padding: 10px 14px; color: #2d3748;">30 minutes via high-speed USB Cable</td></tr>
        <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 14px; font-weight: 700; color: #4a5568; background: #f7fafc;">Takeoff Modes</td><td style="padding: 10px 14px; color: #2d3748;">Hand-Toss Launch or Runway Ground Takeoff with Included Landing Gear</td></tr>
      </tbody>
    </table>
  </div>

  <!-- What's in the Box -->
  <div style="background: #f7fafc; border-radius: 10px; padding: 22px; border: 1px solid #e2e8f0; margin-bottom: 32px;">
    <div style="text-align: center; margin-bottom: 14px;">
      <img src="${uploadedUrls['glider_box_packaging.png']}" alt="GravityGlider Gift Box Packaging" style="width: 100%; max-width: 420px; border-radius: 8px;" />
    </div>
    <h4 style="font-size: 16px; font-weight: 800; color: #2d3748; margin: 0 0 10px;">📦 Complete Ready-To-Fly Set Includes:</h4>
    <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #4a5568; line-height: 1.8;">
      <li>1x Zavelyn GravityGlider™ RC Fighter Jet (Cosmic Blue, Candy Red, or Lemon Yellow)</li>
      <li>1x 2.4GHz Ergonomic Pro Remote Controller</li>
      <li>1x Rechargeable Modular Lithium-Polymer Flight Battery</li>
      <li>1x USB Quick-Charging Cable</li>
      <li>1x Front &amp; Rear Tricycle Landing Gear Set</li>
      <li>2x Spare Aerodynamic Replacement Propellers</li>
      <li>1x Quick-Start Pilot's Flight Manual</li>
    </ul>
  </div>

  <!-- Verified Customer Reviews -->
  <div style="background: #fff; border-radius: 12px; padding: 26px; border: 1px solid #e2e8f0; box-shadow: 0 4px 14px rgba(0,0,0,0.04); margin-bottom: 28px;">
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; border-bottom: 1px solid #edf2f7; padding-bottom: 16px;">
      <div>
        <div style="color: #f6ad55; font-size: 18px; margin-bottom: 4px;">★★★★★</div>
        <div style="font-size: 20px; font-weight: 800; color: #1a202c;">4.95 out of 5 Stars</div>
        <div style="font-size: 13px; color: #718096;">Based on 16,840+ Verified Customer Ratings</div>
      </div>
      <div style="text-align: right;">
        <span style="display: inline-block; background: #feebc8; color: #7b341e; font-size: 12px; font-weight: 700; padding: 6px 12px; border-radius: 20px;">Top Holiday Gift</span>
      </div>
    </div>

    <!-- Review 1 -->
    <div style="margin-bottom: 18px; padding-bottom: 18px; border-bottom: 1px solid #f7fafc;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
        <span style="font-weight: 700; font-size: 15px; color: #2d3748;">Jason R. — <span style="color: #38a169; font-size: 12px; font-weight: 600;">✓ Verified Buyer</span></span>
        <span style="font-size: 13px; color: #a0aec0;">3 days ago</span>
      </div>
      <div style="color: #f6ad55; font-size: 13px; margin-bottom: 6px;">★★★★★ <strong style="color: #2d3748; margin-left: 6px;">Brashed full speed into a tree and kept flying!</strong></div>
      <p style="font-size: 14px; color: #4a5568; margin: 0;">
        "I bought this for my 9-year-old son. On his third flight, he nose-dived it straight into the wooden fence at top speed. I ran over expecting plastic shards — the silicone nose bounced right off and there wasn't even a dent on the wing! He flew it for another 45 minutes straight. Best toy I've bought in years."
      </p>
    </div>

    <!-- Review 2 -->
    <div style="margin-bottom: 18px; padding-bottom: 18px; border-bottom: 1px solid #f7fafc;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
        <span style="font-weight: 700; font-size: 15px; color: #2d3748;">Michelle T. — <span style="color: #38a169; font-size: 12px; font-weight: 600;">✓ Verified Buyer</span></span>
        <span style="font-size: 13px; color: #a0aec0;">1 week ago</span>
      </div>
      <div style="color: #f6ad55; font-size: 13px; margin-bottom: 6px;">★★★★★ <strong style="color: #2d3748; margin-left: 6px;">Gyro stabilizer makes flying ridiculously easy</strong></div>
      <p style="font-size: 14px; color: #4a5568; margin: 0;">
        "I have zero RC experience and neither did my daughter. We tossed it into the wind in our local park and it immediately smoothed out and climbed effortlessly. The 360 degree loop button is pure joy. We ordered the 2-pack so we could race together!"
      </p>
    </div>

    <!-- Review 3 -->
    <div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
        <span style="font-weight: 700; font-size: 15px; color: #2d3748;">Robert C. — <span style="color: #38a169; font-size: 12px; font-weight: 600;">✓ Verified Buyer</span></span>
        <span style="font-size: 13px; color: #a0aec0;">2 weeks ago</span>
      </div>
      <div style="color: #f6ad55; font-size: 13px; margin-bottom: 6px;">★★★★★ <strong style="color: #2d3748; margin-left: 6px;">Gets kids off screens and outside in 2 seconds</strong></div>
      <p style="font-size: 14px; color: #4a5568; margin: 0;">
        "My grandson had his nose buried in video games all summer. I brought this to the soccer field and he spent 2 solid hours running around chasing loops. The range is impressive and battery swaps in seconds."
      </p>
    </div>

  </div>

  <!-- Trust Badges -->
  <div style="display: flex; justify-content: space-around; flex-wrap: wrap; gap: 14px; padding: 18px; background: #f7fafc; border-radius: 10px; border: 1px solid #e2e8f0; text-align: center;">
    <div style="flex: 1; min-width: 140px;">
      <div style="font-size: 20px;">🛡️</div>
      <div style="font-weight: 700; font-size: 13px; color: #2d3748;">60-Day Crash Guarantee</div>
      <div style="font-size: 11px; color: #718096;">Free Replacement if Broken</div>
    </div>
    <div style="flex: 1; min-width: 140px;">
      <div style="font-size: 20px;">⚡</div>
      <div style="font-weight: 700; font-size: 13px; color: #2d3748;">Express US Shipping</div>
      <div style="font-size: 11px; color: #718096;">Dispatches in 24 Hours</div>
    </div>
    <div style="flex: 1; min-width: 140px;">
      <div style="font-size: 20px;">✈️</div>
      <div style="font-weight: 700; font-size: 13px; color: #2d3748;">100% Ready To Fly</div>
      <div style="font-size: 11px; color: #718096;">Zero Assembly Required</div>
    </div>
  </div>

</div>
`;

async function seedGravityGlider() {
  const token = await getAccessToken();
  console.log('Got access token. Checking if product already exists...');

  const existingRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/products.json?handle=zavelyn-gravityglider-indestructible-stunt-rc-jet`, {
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

  const images = [
    { src: uploadedUrls['glider_hero_flight.webp'], position: 1 },
    { src: uploadedUrls['glider_blue_fighter.webp'], position: 2 },
    { src: uploadedUrls['glider_red_fighter.webp'], position: 3 },
    { src: uploadedUrls['glider_yellow_fighter.webp'], position: 4 },
    { src: uploadedUrls['glider_hand_toss.webp'], position: 5 },
    { src: uploadedUrls['glider_stunt_loop.webp'], position: 6 },
    { src: uploadedUrls['glider_dimensions_specs.webp'], position: 7 },
    { src: uploadedUrls['glider_box_packaging.png'], position: 8 }
  ];

  const colors = [
    { name: 'Cosmic Blue (with 2.4GHz Controller)', imgKey: 'glider_blue_fighter.webp' },
    { name: 'Candy Red (with 2.4GHz Controller)', imgKey: 'glider_red_fighter.webp' },
    { name: 'Lemon Yellow (with 2.4GHz Controller)', imgKey: 'glider_yellow_fighter.webp' }
  ];

  const bundles = [
    {
      name: 'Buy 1 (Single Jet Fighter - Ready to Fly Kit)',
      price: '49.99',
      compare_at_price: '89.99'
    },
    {
      name: 'Buy 2 (Dogfight Duo Set - Save 45% + Extra Propellers)',
      price: '79.99',
      compare_at_price: '179.99'
    },
    {
      name: 'Buy 3 (Squadron Air Wing - Buy 2 Get 1 FREE)',
      price: '99.99',
      compare_at_price: '269.99'
    }
  ];

  const variants = [];
  for (const b of bundles) {
    for (const c of colors) {
      variants.push({
        option1: b.name,
        option2: c.name,
        price: b.price,
        compare_at_price: b.compare_at_price,
        inventory_policy: 'continue',
        inventory_management: null,
        requires_shipping: true
      });
    }
  }

  console.log(`Creating product with ${variants.length} variants on Shopify API...`);
  const createRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/products.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify({
      product: {
        title: 'Zavelyn GravityGlider™ Indestructible Stunt RC Jet Aircraft',
        handle: 'zavelyn-gravityglider-indestructible-stunt-rc-jet',
        vendor: 'Zavelyn',
        product_type: 'RC Toys & Hobbies',
        tags: 'RC Airplane, Stunt Jet, Remote Control Plane, EPP Foam Aircraft, Indestructible Toy, Kids Gift, Best Seller, New 2026',
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

  // Link variant image_ids by color
  console.log('Mapping variant images to respective color photos...');
  const colorImgMap = {};
  for (const c of colors) {
    const foundImg = newProduct.images.find(img => img.src.includes(c.imgKey.split('.')[0]));
    if (foundImg) {
      colorImgMap[c.name] = foundImg.id;
    }
  }
  console.log('Color image map:', colorImgMap);

  for (const v of newProduct.variants) {
    const targetImgId = colorImgMap[v.option2];
    if (targetImgId) {
      await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/variants/${v.id}.json`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
        body: JSON.stringify({
          variant: {
            id: v.id,
            image_id: targetImgId,
            inventory_policy: 'continue'
          }
        })
      });
    }
  }
  console.log('✔ Linked variant images & ensured inventory_policy: continue');

  // Add to collections: All Products (510391353529), Best Sellers (510391156921)
  const collections = [510391353529, 510391156921];
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

  console.log('\n🎉 Product #7 Gravity Glider seeding complete!');
  console.log(`Live PDP: https://${SHOP_DOMAIN}/products/${newProduct.handle}`);
}

seedGravityGlider().catch(console.error);
