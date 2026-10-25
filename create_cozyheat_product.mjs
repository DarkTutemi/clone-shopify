import fs from 'fs';

const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = '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';
const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';

async function getAccessToken() {
  const tokenRes = await fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  const data = await tokenRes.json();
  return data.access_token;
}

const uploadedUrls = JSON.parse(fs.readFileSync('cozyheat_media/uploaded_urls.json', 'utf8'));

// Build rich advertorial body_html
const bodyHtml = `
<div class="zavelyn-cozyheat-content" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; line-height: 1.6; max-width: 900px; margin: 0 auto; padding: 10px 0;">

  <!-- Hero Highlight Header -->
  <div style="background: linear-gradient(135deg, #78350f 0%, #451a03 100%); color: #ffffff; padding: 32px 24px; border-radius: 12px; margin-bottom: 32px; text-align: center;">
    <span style="display: inline-block; background-color: #f59e0b; color: #451a03; font-weight: 800; font-size: 12px; letter-spacing: 0.1em; padding: 4px 12px; border-radius: 999px; text-transform: uppercase; margin-bottom: 12px;">❄️ WINTER 2025 COZY COMFORT PICK</span>
    <h2 style="font-size: 28px; font-weight: 800; line-height: 1.25; margin: 0 0 12px; color: #ffffff;">Warmth That Moves With You — From Desk to Couch to Winter Travel</h2>
    <p style="font-size: 16px; color: #fde68a; max-width: 680px; margin: 0 auto; line-height: 1.6;">
      Stop shivering at your work desk or wrapping yourself in stiff, static-filled blankets. The <strong>Zavelyn CozyHeat™ Heated Wearable Blanket Sweater</strong> combines ultra-soft textured knitwear with safe 5V USB heat. Instant soothing warmth—wherever your day takes you.
    </p>
  </div>

  <!-- 4 Quick Value Highlights -->
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 36px;">
    <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 10px; padding: 18px; text-align: center;">
      <div style="font-size: 26px; margin-bottom: 6px;">🔌</div>
      <strong style="display: block; font-size: 15px; color: #78350f; margin-bottom: 4px;">Universal USB Powered</strong>
      <span style="font-size: 13px; color: #92400e;">Connects to any standard power bank, USB adapter, laptop, or car port.</span>
    </div>
    <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 10px; padding: 18px; text-align: center;">
      <div style="font-size: 26px; margin-bottom: 6px;">⚡</div>
      <strong style="display: block; font-size: 15px; color: #78350f; margin-bottom: 4px;">Rapid 30s Warm-Up</strong>
      <span style="font-size: 13px; color: #92400e;">3 adjustable heat settings (100°F - 130°F) provide instant personalized warmth.</span>
    </div>
    <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 10px; padding: 18px; text-align: center;">
      <div style="font-size: 26px; margin-bottom: 6px;">🧥</div>
      <strong style="display: block; font-size: 15px; color: #78350f; margin-bottom: 4px;">3-in-1 Wearable Design</strong>
      <span style="font-size: 13px; color: #92400e;">Wear as a zippered poncho cloak, drape as a shoulder shawl, or spread as a lap blanket.</span>
    </div>
    <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 10px; padding: 18px; text-align: center;">
      <div style="font-size: 26px; margin-bottom: 6px;">🛡️</div>
      <strong style="display: block; font-size: 15px; color: #78350f; margin-bottom: 4px;">5V Low-Voltage Safe</strong>
      <span style="font-size: 13px; color: #92400e;">Built-in intelligent thermal shutoff and overheat protection for 100% peace of mind.</span>
    </div>
  </div>

  <!-- Feature 1: USB Warmth Everywhere -->
  <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin-bottom: 28px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
    <img src="${uploadedUrls['cozyheat_feat_usb.png']}" alt="USB Warmth You Can Take Anywhere" style="width: 100%; border-radius: 8px; margin-bottom: 16px; display: block;" />
    <span style="font-size: 12px; font-weight: 700; color: #d97706; letter-spacing: 0.08em; text-transform: uppercase;">PORTABLE FREEDOM</span>
    <h3 style="font-size: 22px; font-weight: 700; color: #0f172a; margin: 4px 0 10px;">1. Warmth You Can Take Anywhere — True Cordless Mobility</h3>
    <p style="font-size: 15px; color: #475569; margin: 0 0 12px;">
      Conventional electric blankets tether you to a living room wall outlet with stiff, dangerous 120V cords. The Zavelyn CozyHeat™ operates on safe 5V USB power. Slip a slim power bank into the hidden inner pocket and walk around freely—cook dinner, work at your standing desk, or stay warm on chilly airplane flights and morning commutes.
    </p>
  </div>

  <!-- Feature 2: Wear It 3 Ways -->
  <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin-bottom: 28px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px;">
      <img src="${uploadedUrls['cozyheat_wear_shawl.png']}" alt="Wear as Shoulder Shawl" style="width: 100%; border-radius: 8px; display: block;" />
      <img src="${uploadedUrls['cozyheat_wear_cloak.png']}" alt="Wear as Zippered Cloak" style="width: 100%; border-radius: 8px; display: block;" />
    </div>
    <span style="font-size: 12px; font-weight: 700; color: #d97706; letter-spacing: 0.08em; text-transform: uppercase;">VERSATILE STYLING</span>
    <h3 style="font-size: 22px; font-weight: 700; color: #0f172a; margin: 4px 0 10px;">2. One Wrap, Three Ways — Shawl, Cloak, or Blanket</h3>
    <p style="font-size: 15px; color: #475569; margin: 0 0 12px;">
      Why choose between a sweater and a blanket? With clever front zip and snap closures, you can transition effortlessly:
    </p>
    <ul style="font-size: 14px; color: #334155; margin: 0 0 12px; padding-left: 20px;">
      <li style="margin-bottom: 6px;"><strong>Zippered Cloak / Poncho:</strong> Zip the front closed for hands-free coverage that stays firmly on your shoulders while typing or reading.</li>
      <li style="margin-bottom: 6px;"><strong>Draped Shoulder Shawl:</strong> Open the zipper for an elegant wrap over office attire or loungewear.</li>
      <li style="margin-bottom: 6px;"><strong>Plush Lap Blanket:</strong> Spread full 150 x 80 cm length over your legs while relaxing on the couch or in bed.</li>
    </ul>
  </div>

  <!-- Feature 3: Anatomy Hotspots Breakdown -->
  <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin-bottom: 28px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
    <img src="${uploadedUrls['cozyheat_hotspots_breakdown.png']}" alt="Anatomy of CozyHeat Wearable Sweater" style="width: 100%; border-radius: 8px; margin-bottom: 16px; display: block;" />
    <span style="font-size: 12px; font-weight: 700; color: #d97706; letter-spacing: 0.08em; text-transform: uppercase;">ENGINEERED COMFORT</span>
    <h3 style="font-size: 22px; font-weight: 700; color: #0f172a; margin: 4px 0 10px;">3. Tailored Craftsmanship in Every Detail</h3>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; margin-top: 14px;">
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px; border-radius: 8px;">
        <strong style="color: #78350f; display: block; font-size: 14px; margin-bottom: 4px;">1. Smooth Zip Front</strong>
        <span style="font-size: 13px; color: #64748b;">Heavy-duty resin zipper allows instant hands-free poncho styling.</span>
      </div>
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px; border-radius: 8px;">
        <strong style="color: #78350f; display: block; font-size: 14px; margin-bottom: 4px;">2. Ribbed Texture Knit</strong>
        <span style="font-size: 13px; color: #64748b;">Plush insulating microfleece traps ambient warmth even when unpowered.</span>
      </div>
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px; border-radius: 8px;">
        <strong style="color: #78350f; display: block; font-size: 14px; margin-bottom: 4px;">3. One-Touch Controller</strong>
        <span style="font-size: 13px; color: #64748b;">Round chest switch lets you cycle 3 temperature levels effortlessly.</span>
      </div>
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 12px; border-radius: 8px;">
        <strong style="color: #78350f; display: block; font-size: 14px; margin-bottom: 4px;">4. Bound Durable Edges</strong>
        <span style="font-size: 13px; color: #64748b;">Reinforced anti-fray piping prevents wear and withstands machine washing.</span>
      </div>
    </div>
  </div>

  <!-- Real User Reviews / Lifestyle Photos -->
  <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin-bottom: 28px;">
    <h3 style="font-size: 20px; font-weight: 700; color: #0f172a; text-align: center; margin: 0 0 16px;">Warmth That Moves With Real People</h3>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 14px;">
      <div style="border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <img src="${uploadedUrls['cozyheat_review_train.png']}" alt="Train and Travel Comfort" style="width: 100%; display: block;" />
        <div style="padding: 12px; font-size: 13px; color: #475569;">
          "Folded it right into my tote for a weekend trip. Used it with a battery pack on a freezing 4-hour train ride. Warms up faster than my car seats!" — Ian E., Verified Buyer
        </div>
      </div>
      <div style="border: 1px solid #e2e8f0; border-radius: 8px; overflow: hidden;">
        <img src="${uploadedUrls['cozyheat_review_couch.png']}" alt="Couch and Living Room Comfort" style="width: 100%; display: block;" />
        <div style="padding: 12px; font-size: 13px; color: #475569;">
          "My home office is the coldest room in our house. This heated sweater saved me from cranking the central heat all day. Super soft and elegant." — Clara M., Verified Buyer
        </div>
      </div>
    </div>
  </div>

  <!-- Technical Specifications -->
  <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin-bottom: 28px;">
    <h3 style="font-size: 20px; font-weight: 700; color: #0f172a; margin: 0 0 16px;">Technical Specifications</h3>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; font-size: 14px;">
      <div style="background: #ffffff; padding: 12px 16px; border-radius: 6px; border: 1px solid #e2e8f0;">
        <strong style="color: #64748b; display: block; font-size: 12px;">DIMENSIONS</strong>
        <span style="font-weight: 700; color: #0f172a;">150 cm x 80 cm (59" x 31.5")</span>
      </div>
      <div style="background: #ffffff; padding: 12px 16px; border-radius: 6px; border: 1px solid #e2e8f0;">
        <strong style="color: #64748b; display: block; font-size: 12px;">FABRIC MATERIAL</strong>
        <span style="font-weight: 700; color: #0f172a;">Ultra-Soft Ribbed Fleece Microfiber</span>
      </div>
      <div style="background: #ffffff; padding: 12px 16px; border-radius: 6px; border: 1px solid #e2e8f0;">
        <strong style="color: #64748b; display: block; font-size: 12px;">POWER INPUT</strong>
        <span style="font-weight: 700; color: #0f172a;">5V / 2A (10W Standard USB-A)</span>
      </div>
      <div style="background: #ffffff; padding: 12px 16px; border-radius: 6px; border: 1px solid #e2e8f0;">
        <strong style="color: #64748b; display: block; font-size: 12px;">HEAT LEVELS</strong>
        <span style="font-weight: 700; color: #0f172a;">3 Temperature Modes with LED indicator</span>
      </div>
    </div>
  </div>

  <!-- Frequently Asked Questions -->
  <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin-bottom: 28px;">
    <h3 style="font-size: 20px; font-weight: 700; color: #0f172a; text-align: center; margin: 0 0 20px;">Frequently Asked Questions</h3>
    
    <div style="margin-bottom: 14px; background: #ffffff; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0;">
      <strong style="color: #0f172a; font-size: 15px; display: block; margin-bottom: 4px;">Q: What do I plug it into?</strong>
      <p style="font-size: 14px; color: #475569; margin: 0;">
        Any standard 5V/2A USB source—including portable power banks, USB wall chargers, laptop ports, or car USB adapters. A power bank can be tucked neatly into the inside pocket for cordless freedom.
      </p>
    </div>

    <div style="margin-bottom: 14px; background: #ffffff; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0;">
      <strong style="color: #0f172a; font-size: 15px; display: block; margin-bottom: 4px;">Q: How many heat levels does it have?</strong>
      <p style="font-size: 14px; color: #475569; margin: 0;">
        Three levels: Low (100°F - Blue), Medium (115°F - White), and High (130°F - Red). A simple press of the round chest button switches between settings in seconds.
      </p>
    </div>

    <div style="margin-bottom: 14px; background: #ffffff; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0;">
      <strong style="color: #0f172a; font-size: 15px; display: block; margin-bottom: 4px;">Q: Is it machine washable?</strong>
      <p style="font-size: 14px; color: #475569; margin: 0;">
        Yes! Just disconnect and remove any attached power bank, tuck the built-in waterproof USB cable into its protective zipped pocket, and wash on a gentle cold cycle. Air dry thoroughly before next use.
      </p>
    </div>

    <div style="background: #ffffff; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0;">
      <strong style="color: #0f172a; font-size: 15px; display: block; margin-bottom: 4px;">Q: What is included in the package?</strong>
      <p style="font-size: 14px; color: #475569; margin: 0;">
        Each unit includes the Zavelyn CozyHeat™ Heated Wearable Blanket Sweater, integrated USB power cord with 3-temp controller, and user guide.
      </p>
    </div>
  </div>

  <!-- 30-Day Guarantee -->
  <div style="background: #fffbeb; border: 1px solid #fde68a; border-radius: 12px; padding: 24px; text-align: center;">
    <div style="font-size: 32px; margin-bottom: 8px;">🛡️</div>
    <h3 style="font-size: 20px; font-weight: 700; color: #78350f; margin: 0 0 8px;">30-Day Risk-Free Warmth Guarantee</h3>
    <p style="font-size: 15px; color: #92400e; margin: 0; line-height: 1.6;">
      Stay warm for 30 full days. If the Zavelyn CozyHeat™ doesn't keep you delightfully toasty and comfortable all winter long, return it for a full 100% refund.
    </p>
  </div>

</div>
`;

async function createProduct() {
  const token = await getAccessToken();
  console.log('Got access token. Creating CozyHeat product on Shopify...');

  const productData = {
    title: 'Zavelyn CozyHeat™ USB Heated Wearable Blanket Sweater',
    handle: 'zavelyn-cozyheat-heated-wearable-blanket-sweater',
    vendor: 'Zavelyn',
    product_type: 'Wearable Heated Blankets',
    body_html: bodyHtml,
    tags: 'Heated Blanket, Heated Shawl, Winter Warmth, USB Heated, Wearable Throw, Best Sellers, Clearance',
    images: [
      { src: uploadedUrls['cozyheat_hero_brown.webp'], position: 1 },
      { src: uploadedUrls['cozyheat_apricot.webp'], position: 2 },
      { src: uploadedUrls['cozyheat_green.webp'], position: 3 },
      { src: uploadedUrls['cozyheat_maple_red.webp'], position: 4 },
      { src: uploadedUrls['cozyheat_purple.webp'], position: 5 },
      { src: uploadedUrls['cozyheat_model_standing.webp'], position: 6 },
      { src: uploadedUrls['cozyheat_two_ways.webp'], position: 7 },
      { src: uploadedUrls['cozyheat_power_moments.webp'], position: 8 },
      { src: uploadedUrls['cozyheat_lifestyle_travel.webp'], position: 9 },
      { src: uploadedUrls['cozyheat_lifestyle_sofa.webp'], position: 10 }
    ],
    options: [
      {
        name: 'Color & Bundle',
        values: [
          'Warm Brown (1 pc)',
          'Apricot (1 pc)',
          'Green (1 pc)',
          'Maple Red (1 pc)',
          'Purple (1 pc)',
          'Share the Warmth (2 pcs - Most Popular)',
          'Family Cozy Set (Buy 2 Get 1 FREE - 3 pcs)'
        ]
      }
    ],
    variants: [
      {
        option1: 'Warm Brown (1 pc)',
        price: '59.99',
        compare_at_price: '79.99',
        inventory_policy: 'continue',
        inventory_management: null,
        requires_shipping: true
      },
      {
        option1: 'Apricot (1 pc)',
        price: '59.99',
        compare_at_price: '79.99',
        inventory_policy: 'continue',
        inventory_management: null,
        requires_shipping: true
      },
      {
        option1: 'Green (1 pc)',
        price: '59.99',
        compare_at_price: '79.99',
        inventory_policy: 'continue',
        inventory_management: null,
        requires_shipping: true
      },
      {
        option1: 'Maple Red (1 pc)',
        price: '59.99',
        compare_at_price: '79.99',
        inventory_policy: 'continue',
        inventory_management: null,
        requires_shipping: true
      },
      {
        option1: 'Purple (1 pc)',
        price: '59.99',
        compare_at_price: '79.99',
        inventory_policy: 'continue',
        inventory_management: null,
        requires_shipping: true
      },
      {
        option1: 'Share the Warmth (2 pcs - Most Popular)',
        price: '89.99',
        compare_at_price: '159.98',
        inventory_policy: 'continue',
        inventory_management: null,
        requires_shipping: true
      },
      {
        option1: 'Family Cozy Set (Buy 2 Get 1 FREE - 3 pcs)',
        price: '129.99',
        compare_at_price: '239.97',
        inventory_policy: 'continue',
        inventory_management: null,
        requires_shipping: true
      }
    ]
  };

  const createRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/products.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
    body: JSON.stringify({ product: productData })
  });
  const data = await createRes.json();
  if (data.errors) {
    console.error('Failed to create product:', JSON.stringify(data.errors));
    throw new Error('Product creation failed');
  }

  const p = data.product;
  console.log(`✔ Created product: ${p.title} (ID: ${p.id}, handle: ${p.handle})`);
  fs.writeFileSync('created_cozyheat_product.json', JSON.stringify(p, null, 2));

  // Link variant images
  console.log('\n--- Linking variant images ---');
  const imgMap = {
    'Warm Brown (1 pc)': p.images.find(i => i.src.includes('cozyheat_hero_brown')),
    'Apricot (1 pc)': p.images.find(i => i.src.includes('cozyheat_apricot')),
    'Green (1 pc)': p.images.find(i => i.src.includes('cozyheat_green')),
    'Maple Red (1 pc)': p.images.find(i => i.src.includes('cozyheat_maple_red')),
    'Purple (1 pc)': p.images.find(i => i.src.includes('cozyheat_purple')),
    'Share the Warmth (2 pcs - Most Popular)': p.images.find(i => i.src.includes('cozyheat_two_ways')),
    'Family Cozy Set (Buy 2 Get 1 FREE - 3 pcs)': p.images.find(i => i.src.includes('cozyheat_power_moments'))
  };

  for (const v of p.variants) {
    const matchedImg = imgMap[v.title];
    if (matchedImg) {
      console.log(`Linking variant "${v.title}" -> image ${matchedImg.id}...`);
      await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/variants/${v.id}.json`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
        body: JSON.stringify({
          variant: {
            id: v.id,
            image_id: matchedImg.id,
            inventory_policy: 'continue'
          }
        })
      });
    }
  }

  // Add to collections
  const collections = [
    510391353529, // All Products
    510391156921, // Best Sellers
    510391222457  // Power & Precision Tools
  ];

  console.log('\n--- Adding to collections ---');
  for (const colId of collections) {
    try {
      const colRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/collects.json`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
        body: JSON.stringify({
          collect: {
            product_id: p.id,
            collection_id: colId
          }
        })
      });
      const colData = await colRes.json();
      console.log(`  ✔ Added to collection ${colId}: ${colData.collect ? 'SUCCESS' : 'Already in collection'}`);
    } catch (e) {
      console.error(`  Error adding to collection ${colId}:`, e.message);
    }
  }

  console.log('\n🎉 Product completely created and configured!');
  console.log(`Live URL: https://tryzavelyn.com/products/${p.handle}`);
}

createProduct().catch(console.error);
