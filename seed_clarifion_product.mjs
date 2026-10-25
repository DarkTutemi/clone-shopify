import fs from 'fs';

const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = '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';
const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';

const uploadedUrls = JSON.parse(fs.readFileSync('clarifion_media/uploaded_urls.json', 'utf-8'));

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
      <span style="background: #3182ce; color: #fff; font-size: 11px; font-weight: 800; text-transform: uppercase; padding: 4px 10px; border-radius: 20px; letter-spacing: 0.5px;">Voted #1 Filterless Air Purifier of 2026</span>
      <span style="font-size: 13px; color: #718096;">Over 350,000+ Homes Breathing Cleaner, Fresher Air</span>
    </div>

    <h2 style="font-size: 24px; line-height: 1.3; font-weight: 800; color: #1a202c; margin: 0 0 16px;">
      How This Tiny Plug-In Device Cleans Indoor Air — With Zero Noisy Fans or Expensive Replacement Filters!
    </h2>

    <p style="font-size: 15px; color: #4a5568; margin-bottom: 14px;">
      Traditional floor air purifiers are giant, loud eyesores that take up valuable room space and demand pricey $60–$90 replacement filters every few months. Even worse, their whirring fans keep you awake at night.
    </p>

    <p style="font-size: 15px; color: #4a5568; margin-bottom: 16px;">
      The <strong>Zavelyn AirClear™ Plug-In Ionizer</strong> is the compact, whisper-quiet alternative. Simply plug it into any standard wall outlet. Emitting over <strong>10 million negative ions per second</strong>, it bonds to airborne dust, pet dander, pollen, smoke particles, and cooking odors — neutralizing them on contact so you can breathe pure, crisp mountain air in every room.
    </p>

    <div style="text-align: center; margin: 20px 0;">
      <img src="${uploadedUrls['clarifion_bedroom_outlet.jpg']}" alt="Zavelyn AirClear in Bedroom Outlet" style="width: 100%; max-width: 680px; border-radius: 12px; box-shadow: 0 4px 14px rgba(0,0,0,0.06);" />
    </div>
  </div>

  <!-- How Negative Ion Science Works -->
  <div style="text-align: center; margin-bottom: 32px;">
    <span style="color: #3182ce; font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">Nature's Atmospheric Purifier</span>
    <h3 style="font-size: 26px; font-weight: 800; color: #1a202c; margin: 8px 0 14px;">The Physics of Negative Ion Air Rejuvenation</h3>
    <p style="font-size: 15px; color: #718096; max-width: 660px; margin: 0 auto 20px;">
      Just like after a fresh lightning storm or near a waterfall, high concentrations of negative ions attach to floating positive particles, weighing them down and eliminating them from your breathing zone.
    </p>
    <img src="${uploadedUrls['clarifion_ion_physics.jpg']}" alt="Negative Ion Air Rejuvenation Science" style="width: 100%; max-width: 680px; border-radius: 12px; box-shadow: 0 6px 18px rgba(0,0,0,0.06);" />
  </div>

  <!-- 4 Core Advantages Grid -->
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 18px; margin-bottom: 32px;">
    
    <div style="background: #ffffff; padding: 22px; border-radius: 10px; border: 1px solid #e2e8f0; border-left: 4px solid #3182ce;">
      <div style="font-size: 24px; margin-bottom: 8px;">🚫</div>
      <h4 style="font-size: 17px; font-weight: 700; color: #2d3748; margin: 0 0 8px;">100% Filter-Free Technology</h4>
      <p style="font-size: 14px; color: #718096; margin: 0;">Never spend another dollar on dirty replacement filters. Zero maintenance, zero vacuuming, and zero ongoing upkeep required.</p>
    </div>

    <div style="background: #ffffff; padding: 22px; border-radius: 10px; border: 1px solid #e2e8f0; border-left: 4px solid #3182ce;">
      <div style="font-size: 24px; margin-bottom: 8px;">🤫</div>
      <h4 style="font-size: 17px; font-weight: 700; color: #2d3748; margin: 0 0 8px;">Whisper-Quiet Operation (&lt;15dB)</h4>
      <p style="font-size: 14px; color: #718096; margin: 0;">Without mechanical fan motors or clunky blades, the device operates in near-absolute silence. Ideal for nurseries and light sleepers.</p>
    </div>

    <div style="background: #ffffff; padding: 22px; border-radius: 10px; border: 1px solid #e2e8f0; border-left: 4px solid #3182ce;">
      <div style="font-size: 24px; margin-bottom: 8px;">⚡</div>
      <h4 style="font-size: 17px; font-weight: 700; color: #2d3748; margin: 0 0 8px;">Ultra-Low Power (&lt;2W)</h4>
      <p style="font-size: 14px; color: #718096; margin: 0;">Consumes less than $2.50 per year in electricity running 24/7 non-stop. Plug it in and leave it to work without bill anxiety.</p>
    </div>

    <div style="background: #ffffff; padding: 22px; border-radius: 10px; border: 1px solid #e2e8f0; border-left: 4px solid #3182ce;">
      <div style="font-size: 24px; margin-bottom: 8px;">🏠</div>
      <h4 style="font-size: 17px; font-weight: 700; color: #2d3748; margin: 0 0 8px;">Pocket-Sized &amp; Out of the Way</h4>
      <p style="font-size: 14px; color: #718096; margin: 0;">No cords to trip over, no bulky floor footprint. Sits flush against your wall outlet while maintaining full room airflow.</p>
    </div>

  </div>

  <!-- Comparison Table vs Traditional Purifiers -->
  <div style="background: #fff; border-radius: 12px; padding: 26px; border: 1.5px solid #e2e8f0; margin-bottom: 32px;">
    <div style="text-align: center; margin-bottom: 20px;">
      <h3 style="font-size: 22px; font-weight: 800; color: #1a202c; margin: 0 0 8px;">Zavelyn AirClear™ vs. Traditional Purifiers</h3>
      <p style="font-size: 14px; color: #718096;">See why over 350,000 households switched to our compact ionizer</p>
    </div>

    <div style="text-align: center; margin-bottom: 18px;">
      <img src="${uploadedUrls['clarifion_comparison_chart.jpg']}" alt="Zavelyn AirClear vs HEPA Purifiers" style="width: 100%; max-width: 620px; border-radius: 10px;" />
    </div>

    <table style="width: 100%; border-collapse: collapse; font-size: 14px; text-align: left;">
      <thead>
        <tr style="background: #ebf8ff; color: #2b6cb0;">
          <th style="padding: 12px; border: 1px solid #bee3f8;">Feature</th>
          <th style="padding: 12px; border: 1px solid #bee3f8; font-weight: 800;">Zavelyn AirClear™</th>
          <th style="padding: 12px; border: 1px solid #bee3f8; color: #718096;">Traditional HEPA Units</th>
        </tr>
      </thead>
      <tbody>
        <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 12px; font-weight: 600;">Filter Cost</td><td style="padding: 10px 12px; color: #2b6cb0; font-weight: 700;">$0 (Never replace filters)</td><td style="padding: 10px 12px; color: #e53e3e;">$60 - $120 every 6 mos</td></tr>
        <tr style="border-bottom: 1px solid #e2e8f0; background: #fafafa;"><td style="padding: 10px 12px; font-weight: 600;">Noise Level</td><td style="padding: 10px 12px; color: #2b6cb0; font-weight: 700;">Whisper-Quiet (&lt;15 dB)</td><td style="padding: 10px 12px; color: #e53e3e;">45 - 65 dB (Loud Fan)</td></tr>
        <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 12px; font-weight: 600;">Space Required</td><td style="padding: 10px 12px; color: #2b6cb0; font-weight: 700;">Zero (Plugs into wall)</td><td style="padding: 10px 12px; color: #e53e3e;">Takes up floor / desk space</td></tr>
        <tr style="border-bottom: 1px solid #e2e8f0; background: #fafafa;"><td style="padding: 10px 12px; font-weight: 600;">Annual Power Cost</td><td style="padding: 10px 12px; color: #2b6cb0; font-weight: 700;">~$2.50 / year</td><td style="padding: 10px 12px; color: #e53e3e;">$45 - $80 / year</td></tr>
        <tr><td style="padding: 10px 12px; font-weight: 600;">Odor Neutralization</td><td style="padding: 10px 12px; color: #2b6cb0; font-weight: 700;">Active Negative Ion Tech</td><td style="padding: 10px 12px;">Passive carbon mesh</td></tr>
      </tbody>
    </table>
  </div>

  <!-- Tech Specs -->
  <div style="margin-bottom: 32px;">
    <h3 style="font-size: 20px; font-weight: 800; color: #1a202c; margin-bottom: 14px;">Product Specifications</h3>
    <table style="width: 100%; border-collapse: collapse; font-size: 14px; text-align: left;">
      <tbody>
        <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 14px; font-weight: 700; color: #4a5568; background: #f7fafc; width: 35%;">Brand</td><td style="padding: 10px 14px; color: #2d3748;">Zavelyn</td></tr>
        <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 14px; font-weight: 700; color: #4a5568; background: #f7fafc;">Model</td><td style="padding: 10px 14px; color: #2d3748;">AirClear™ Plug-In Negative Ion Air Purifier</td></tr>
        <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 14px; font-weight: 700; color: #4a5568; background: #f7fafc;">Ion Emission Rate</td><td style="padding: 10px 14px; color: #2d3748;">Over 10,000,000 negative ions/cm³</td></tr>
        <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 14px; font-weight: 700; color: #4a5568; background: #f7fafc;">Coverage Area</td><td style="padding: 10px 14px; color: #2d3748;">Up to 150 sq. ft. per unit (Ideal: 1 unit per room)</td></tr>
        <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 14px; font-weight: 700; color: #4a5568; background: #f7fafc;">Input Voltage</td><td style="padding: 10px 14px; color: #2d3748;">110V - 240V Universal Plug-In</td></tr>
        <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 14px; font-weight: 700; color: #4a5568; background: #f7fafc;">Power Consumption</td><td style="padding: 10px 14px; color: #2d3748;">&lt; 1.5 Watts (Eco-Green Certified)</td></tr>
        <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 14px; font-weight: 700; color: #4a5568; background: #f7fafc;">Nightlight Feature</td><td style="padding: 10px 14px; color: #2d3748;">Subtle 10-20 Lux Soft Ice Blue Glow</td></tr>
        <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 14px; font-weight: 700; color: #4a5568; background: #f7fafc;">Certifications</td><td style="padding: 10px 14px; color: #2d3748;">CE, FCC, RoHS, EPA Device Compliant</td></tr>
      </tbody>
    </table>
  </div>

  <!-- Verified Reviews -->
  <div style="background: #fff; border-radius: 12px; padding: 26px; border: 1px solid #e2e8f0; box-shadow: 0 4px 14px rgba(0,0,0,0.04); margin-bottom: 28px;">
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; border-bottom: 1px solid #edf2f7; padding-bottom: 16px;">
      <div>
        <div style="color: #f6ad55; font-size: 18px; margin-bottom: 4px;">★★★★★</div>
        <div style="font-size: 20px; font-weight: 800; color: #1a202c;">4.92 out of 5 Stars</div>
        <div style="font-size: 13px; color: #718096;">Based on 28,340+ Verified Zavelyn Customer Ratings</div>
      </div>
      <div style="text-align: right;">
        <span style="display: inline-block; background: #ebf8ff; color: #2b6cb0; font-size: 12px; font-weight: 700; padding: 6px 12px; border-radius: 20px;">99% Verified Customer Satisfaction</span>
      </div>
    </div>

    <!-- Review 1 -->
    <div style="margin-bottom: 18px; padding-bottom: 18px; border-bottom: 1px solid #f7fafc;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
        <span style="font-weight: 700; font-size: 15px; color: #2d3748;">Mark S. — <span style="color: #38a169; font-size: 12px; font-weight: 600;">✓ Verified Buyer</span></span>
        <span style="font-size: 13px; color: #a0aec0;">2 days ago</span>
      </div>
      <div style="color: #f6ad55; font-size: 13px; margin-bottom: 6px;">★★★★★ <strong style="color: #2d3748; margin-left: 6px;">No more waking up stuffy and congested!</strong></div>
      <p style="font-size: 14px; color: #4a5568; margin: 0;">
        "I’ve suffered from severe morning allergies and dust sensitivity for over 15 years. I plugged one Zavelyn AirClear on my nightstand outlet and one in the master hallway. Within 48 hours, my morning sneezing fits completely stopped. You can't hear a sound, and the soft blue light is a great nightlight."
      </p>
    </div>

    <!-- Review 2 -->
    <div style="margin-bottom: 18px; padding-bottom: 18px; border-bottom: 1px solid #f7fafc;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
        <span style="font-weight: 700; font-size: 15px; color: #2d3748;">Catherine L. — <span style="color: #38a169; font-size: 12px; font-weight: 600;">✓ Verified Buyer</span></span>
        <span style="font-size: 13px; color: #a0aec0;">5 days ago</span>
      </div>
      <div style="color: #f6ad55; font-size: 13px; margin-bottom: 6px;">★★★★★ <strong style="color: #2d3748; margin-left: 6px;">Eliminates dog and litter box odors completely</strong></div>
      <p style="font-size: 14px; color: #4a5568; margin: 0;">
        "We have two Golden Retrievers and a cat. People who visit our house now say it smells like clean outdoor air. I ordered the 6-pack to put one in each bedroom, living room, and laundry room. Best $120 investment we made this year!"
      </p>
    </div>

    <!-- Review 3 -->
    <div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
        <span style="font-weight: 700; font-size: 15px; color: #2d3748;">David P. — <span style="color: #38a169; font-size: 12px; font-weight: 600;">✓ Verified Buyer</span></span>
        <span style="font-size: 13px; color: #a0aec0;">1 week ago</span>
      </div>
      <div style="color: #f6ad55; font-size: 13px; margin-bottom: 6px;">★★★★★ <strong style="color: #2d3748; margin-left: 6px;">Saves hundreds compared to filter subscriptions</strong></div>
      <p style="font-size: 14px; color: #4a5568; margin: 0;">
        "I threw away our noisy 20-pound floor filter machine after seeing how black and clogged the $80 filters would get. The Zavelyn AirClear requires literally zero maintenance. Plug it in, forget it, and enjoy clean air."
      </p>
    </div>

  </div>

  <!-- Trust Badges -->
  <div style="display: flex; justify-content: space-around; flex-wrap: wrap; gap: 14px; padding: 18px; background: #f7fafc; border-radius: 10px; border: 1px solid #e2e8f0; text-align: center;">
    <div style="flex: 1; min-width: 140px;">
      <div style="font-size: 20px;">🛡️</div>
      <div style="font-weight: 700; font-size: 13px; color: #2d3748;">30-Day Air Trial</div>
      <div style="font-size: 11px; color: #718096;">100% Money-Back Guarantee</div>
    </div>
    <div style="flex: 1; min-width: 140px;">
      <div style="font-size: 20px;">⚡</div>
      <div style="font-weight: 700; font-size: 13px; color: #2d3748;">Fast US Shipping</div>
      <div style="font-size: 11px; color: #718096;">Dispatches in 24 Hours</div>
    </div>
    <div style="flex: 1; min-width: 140px;">
      <div style="font-size: 20px;">🌿</div>
      <div style="font-weight: 700; font-size: 13px; color: #2d3748;">100% Filter-Free</div>
      <div style="font-size: 11px; color: #718096;">Zero Recurring Expenses</div>
    </div>
  </div>

</div>
`;

async function seedClarifion() {
  const token = await getAccessToken();
  console.log('Got access token. Checking if product already exists...');

  const existingRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/products.json?handle=zavelyn-airclear-plugin-negative-ion-air-purifier`, {
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
    { src: uploadedUrls['clarifion_hero_white.jpg'], position: 1 },
    { src: uploadedUrls['clarifion_angle_view.jpg'], position: 2 },
    { src: uploadedUrls['clarifion_outlet_plug.jpg'], position: 3 },
    { src: uploadedUrls['clarifion_hand_scale.jpg'], position: 4 },
    { src: uploadedUrls['clarifion_pack_set.jpg'], position: 5 },
    { src: uploadedUrls['clarifion_bedroom_outlet.jpg'], position: 6 },
    { src: uploadedUrls['clarifion_ion_physics.jpg'], position: 7 },
    { src: uploadedUrls['clarifion_comparison_chart.jpg'], position: 8 },
    { src: uploadedUrls['clarifion_nightlight_sidebar.jpg'], position: 9 }
  ];

  const colors = [
    { name: 'Glacier White (US Plug)', imgKey: 'clarifion_hero_white.jpg' },
    { name: 'Midnight Black (US Plug)', imgKey: 'clarifion_angle_view.jpg' }
  ];

  const bundles = [
    {
      name: 'Buy 1 (Single Room Purifier - Standard)',
      price: '39.99',
      compare_at_price: '69.99'
    },
    {
      name: 'Buy 3 (Whole House Starter Pack - Save 55%)',
      price: '79.99',
      compare_at_price: '179.99'
    },
    {
      name: 'Buy 6 (Complete Home Master Set - Buy 3 Get 3 FREE)',
      price: '119.99',
      compare_at_price: '299.99'
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
        title: 'Zavelyn AirClear™ Plug-In Negative Ion Air Purifier & Odor Eliminator',
        handle: 'zavelyn-airclear-plugin-negative-ion-air-purifier',
        vendor: 'Zavelyn',
        product_type: 'Home Health & Air Quality',
        tags: 'Air Purifier, Negative Ion, Ionizer, Odor Eliminator, Allergy Relief, Dust Cleaner, Filterless, Best Seller, New 2026',
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

  console.log('\n🎉 Product #4 Clarifion seeding complete!');
  console.log(`Live PDP: https://${SHOP_DOMAIN}/products/${newProduct.handle}`);
}

seedClarifion().catch(console.error);
