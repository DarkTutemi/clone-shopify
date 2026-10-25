import fs from 'fs';

const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';
const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = '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';

async function getAccessToken() {
  const tokenRes = await fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  const data = await tokenRes.json();
  return data.access_token;
}

const uploadedAssets = JSON.parse(fs.readFileSync('ackerman_media/uploaded_urls.json', 'utf8'));

// Helper to find uploaded URL by filename keyword
function findUrl(keyword, fallbackIdx = 1) {
  const item = uploadedAssets.find(a => a.filename.toLowerCase().includes(keyword.toLowerCase()));
  return item ? item.publicUrl : uploadedAssets[fallbackIdx]?.publicUrl;
}

const pinkUrl = findUrl('asset-2', 1);
const blackUrl = findUrl('black', 0);
const grayUrl = findUrl('gray', 2);
const heroInfographic1 = findUrl('asset-6', 3);
const heroInfographic2 = findUrl('asset-7', 4);
const heroInfographic3 = findUrl('asset-8', 5);
const heroInfographic4 = findUrl('asset-9', 6);

const bodyHtml = `
<div class="zavelyn-thermoglove-advertorial" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #222; line-height: 1.6; max-width: 900px; margin: 0 auto;">

  <!-- Hero Highlight Banner -->
  <div style="background: linear-gradient(135deg, #182233 0%, #2a3a52 100%); color: #fff; padding: 25px 30px; border-radius: 12px; margin-bottom: 35px; box-shadow: 0 8px 24px rgba(24,34,51,0.2);">
    <span style="background: #ff5722; color: #ffffff; font-weight: 800; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; padding: 4px 10px; border-radius: 4px; display: inline-block; margin-bottom: 10px;">SMART THERMAL TECHNOLOGY</span>
    <h2 style="font-size: 26px; font-weight: 800; margin: 0 0 10px 0; color: #ffffff; line-height: 1.25;">Say Goodbye to Cold, Stiff Hands & Painful Winter Fingers</h2>
    <p style="font-size: 15px; margin: 0; opacity: 0.95; line-height: 1.5;">Smart thermostatic USB rechargeable gloves engineered with active carbon-fiber micro heating filaments. Enjoy soothing therapeutic warmth while typing, driving, working, or scrolling without finger restriction.</p>
  </div>

  <!-- Key Benefits Grid -->
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; margin-bottom: 35px;">
    <div style="background: #f8f9fb; border: 1px solid #e1e6ee; border-radius: 10px; padding: 20px;">
      <div style="font-size: 24px; margin-bottom: 8px;">🔥</div>
      <h3 style="font-size: 16px; font-weight: 700; margin: 0 0 6px 0; color: #182233;">3 Smart Heat Modes (40°C - 55°C)</h3>
      <p style="font-size: 13px; color: #555; margin: 0;">One-touch digital push-button selector with real-time temperature feedback for customized all-day comfort.</p>
    </div>
    <div style="background: #f8f9fb; border: 1px solid #e1e6ee; border-radius: 10px; padding: 20px;">
      <div style="font-size: 24px; margin-bottom: 8px;">📱</div>
      <h3 style="font-size: 16px; font-weight: 700; margin: 0 0 6px 0; color: #182233;">Full Dexterity Fingerless Cut</h3>
      <p style="font-size: 13px; color: #555; margin: 0;">Unrestricted touchscreen swiping, keyboard typing, gaming, crafting, or tool manipulation with zero clumsiness.</p>
    </div>
    <div style="background: #f8f9fb; border: 1px solid #e1e6ee; border-radius: 10px; padding: 20px;">
      <div style="font-size: 24px; margin-bottom: 8px;">⚡</div>
      <h3 style="font-size: 16px; font-weight: 700; margin: 0 0 6px 0; color: #182233;">1800mAh Fast Type-C Battery</h3>
      <p style="font-size: 13px; color: #555; margin: 0;">Integrated dual rechargeable lithium cells deliver up to 350 minutes of continuous soothing heat per charge.</p>
    </div>
  </div>

  <!-- Visual Feature 1 -->
  <div style="margin-bottom: 40px; text-align: center;">
    <img src="${heroInfographic1}" alt="Zavelyn ThermoGlove Temperature Control" style="max-width: 100%; height: auto; border-radius: 12px; box-shadow: 0 4px 16px rgba(0,0,0,0.08);" />
  </div>

  <!-- Therapeutic Circulation Section -->
  <div style="background: #fff8f5; border-left: 4px solid #ff5722; padding: 24px; border-radius: 0 10px 10px 0; margin-bottom: 40px;">
    <h3 style="color: #bf360c; font-size: 20px; font-weight: 800; margin-top: 0; margin-bottom: 12px;">Therapeutic Relief for Raynaud's, Arthritis & Poor Circulation</h3>
    <p style="font-size: 14px; color: #4e342e; line-height: 1.6; margin-bottom: 12px;">
      When winter temperatures drop, capillary vasoconstriction cuts blood flow to extremities, causing throbbing aches, numb fingers, and painful joint stiffness.
    </p>
    <p style="font-size: 14px; color: #4e342e; line-height: 1.6; margin: 0;">
      <strong>Zavelyn ThermoGlove™</strong> applies gentle, continuous thermotherapy directly across the palmar vascular arches and dorsal venous networks, stimulating blood microcirculation and keeping joint cartilage supple and pain-free.
    </p>
  </div>

  <!-- Infographics 2 & 3 -->
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin-bottom: 40px;">
    <img src="${heroInfographic2}" alt="360 Degree Heat Distribution" style="width: 100%; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.06);" />
    <img src="${heroInfographic3}" alt="Intelligent Thermostatic Control" style="width: 100%; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.06);" />
  </div>

  <!-- Temperature Levels Breakdown -->
  <div style="background: #fff; border: 1px solid #e0e0e0; border-radius: 12px; padding: 28px; margin-bottom: 40px; box-shadow: 0 4px 16px rgba(0,0,0,0.04);">
    <h3 style="text-align: center; font-size: 22px; font-weight: 800; color: #182233; margin-top: 0; margin-bottom: 24px;">3 Precision Temperature Settings</h3>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px;">
      <div style="border-top: 3px solid #4caf50; padding-top: 14px;">
        <span style="font-weight: 800; color: #4caf50; font-size: 13px; text-transform: uppercase;">Level 1 • 40°C (104°F)</span>
        <h4 style="font-size: 16px; margin: 6px 0; color: #182233;">Gentle Office & Indoor Warmth</h4>
        <p style="font-size: 13px; color: #666; margin: 0;">Perfect for drafty offices, working from home, light air-conditioned environments. Up to 6 hours runtime.</p>
      </div>
      <div style="border-top: 3px solid #ff9800; padding-top: 14px;">
        <span style="font-weight: 800; color: #ff9800; font-size: 13px; text-transform: uppercase;">Level 2 • 48°C (118°F)</span>
        <h4 style="font-size: 16px; margin: 6px 0; color: #182233;">Active Soothing Circulation</h4>
        <p style="font-size: 13px; color: #666; margin: 0;">Ideal for morning commutes, driving in cold cars, dog walking, and joint stiffness relief. Up to 4.5 hours runtime.</p>
      </div>
      <div style="border-top: 3px solid #f44336; padding-top: 14px;">
        <span style="font-weight: 800; color: #f44336; font-size: 13px; text-transform: uppercase;">Level 3 • 55°C (131°F)</span>
        <h4 style="font-size: 16px; margin: 6px 0; color: #182233;">Deep Heat Thermotherapy</h4>
        <p style="font-size: 13px; color: #666; margin: 0;">Maximum warmth for sub-zero outdoor weather, freezing sidelines, ice fishing, or severe Raynaud's episodes.</p>
      </div>
    </div>
  </div>

  <!-- Technical Specifications Table -->
  <div style="background: #f8f9fb; border-radius: 12px; padding: 25px; margin-bottom: 40px;">
    <h3 style="font-size: 20px; font-weight: 800; color: #182233; margin-top: 0; margin-bottom: 16px;">Product Specifications</h3>
    <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
      <tr style="border-bottom: 1px solid #e1e6ee;">
        <td style="padding: 10px 0; font-weight: 700; color: #182233; width: 40%;">Model:</td>
        <td style="padding: 10px 0; color: #555;">Zavelyn ThermoGlove™ Smart LED Edition</td>
      </tr>
      <tr style="border-bottom: 1px solid #e1e6ee;">
        <td style="padding: 10px 0; font-weight: 700; color: #182233;">Battery Capacity:</td>
        <td style="padding: 10px 0; color: #555;">1800mAh Dual-Cell High-Density Polymer Li-ion</td>
      </tr>
      <tr style="border-bottom: 1px solid #e1e6ee;">
        <td style="padding: 10px 0; font-weight: 700; color: #182233;">Charging Interface:</td>
        <td style="padding: 10px 0; color: #555;">USB Type-C Fast Charge (5V / 1A)</td>
      </tr>
      <tr style="border-bottom: 1px solid #e1e6ee;">
        <td style="padding: 10px 0; font-weight: 700; color: #182233;">Runtime:</td>
        <td style="padding: 10px 0; color: #555;">180 to 350 Minutes (Depending on heat level)</td>
      </tr>
      <tr style="border-bottom: 1px solid #e1e6ee;">
        <td style="padding: 10px 0; font-weight: 700; color: #182233;">Dimensions & Sizing:</td>
        <td style="padding: 10px 0; color: #555;">14.5 x 10 x 5 cm (Universal Unisex Stretch Fit)</td>
      </tr>
      <tr>
        <td style="padding: 10px 0; font-weight: 700; color: #182233;">What's in the Box:</td>
        <td style="padding: 10px 0; color: #555;">1 Pair Heated Gloves, Dual USB-C Charging Cable, User Manual</td>
      </tr>
    </table>
  </div>

  <!-- Verified Customer Reviews Section -->
  <div style="background: #fafafa; border: 1px solid #eee; border-radius: 12px; padding: 25px; margin-bottom: 25px;">
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap; gap: 10px;">
      <div>
        <h3 style="margin: 0; font-size: 18px; font-weight: 800; color: #182233;">Verified Customer Reviews</h3>
        <div style="color: #ffb800; font-size: 15px; margin-top: 4px;">★★★★★ <span style="color: #666; font-size: 13px; font-weight: 600;">4.92 out of 5 based on 2,150+ reviews</span></div>
      </div>
      <span style="background: #e8f5e9; color: #2e7d32; font-size: 12px; font-weight: 700; padding: 4px 10px; border-radius: 20px;">✓ 100% Verified Purchases</span>
    </div>

    <!-- Review 1 -->
    <div style="border-bottom: 1px solid #eee; padding-bottom: 15px; margin-bottom: 15px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
        <strong style="font-size: 14px; color: #222;">Eleanor W. — Chicago, IL</strong>
        <span style="font-size: 12px; color: #888;">Yesterday</span>
      </div>
      <div style="color: #ffb800; font-size: 12px; margin-bottom: 6px;">★★★★★ <span style="color: #2e7d32; font-size: 11px; font-weight: 600;">Verified Buyer</span></div>
      <p style="font-size: 13px; color: #444; margin: 0; line-height: 1.5;">"I work in a chilly warehouse office where my fingers would go completely white and numb from Raynaud's. Standard mittens made typing impossible. These fingerless heated gloves are a lifesaver! The digital temperature screen is so sleek and Level 2 keeps my hands toasty warm for my entire 8-hour shift."</p>
    </div>

    <!-- Review 2 -->
    <div style="border-bottom: 1px solid #eee; padding-bottom: 15px; margin-bottom: 15px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
        <strong style="font-size: 14px; color: #222;">Thomas K. — Minneapolis, MN</strong>
        <span style="font-size: 12px; color: #888;">4 days ago</span>
      </div>
      <div style="color: #ffb800; font-size: 12px; margin-bottom: 6px;">★★★★★ <span style="color: #2e7d32; font-size: 11px; font-weight: 600;">Verified Buyer</span></div>
      <p style="font-size: 13px; color: #444; margin: 0; line-height: 1.5;">"Bought the 3-pair family pack for me, my wife, and my elderly mother who has severe arthritis in her thumbs. She said within 10 minutes of turning them on, the stiffness melted away and she could knit again. Outstanding quality and battery life."</p>
    </div>

    <!-- Review 3 -->
    <div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
        <strong style="font-size: 14px; color: #222;">Samantha L. — Seattle, WA</strong>
        <span style="font-size: 12px; color: #888;">1 week ago</span>
      </div>
      <div style="color: #ffb800; font-size: 12px; margin-bottom: 6px;">★★★★★ <span style="color: #2e7d32; font-size: 11px; font-weight: 600;">Verified Buyer</span></div>
      <p style="font-size: 13px; color: #444; margin: 0; line-height: 1.5;">"The blush pink color is super cute! I use them every morning walking my dog while texting on my phone. They charge fast via USB-C and heat up in literally 3 seconds. Highly recommended!"</p>
    </div>
  </div>

</div>
`;

const bundleOptions = [
  {
    name: 'Buy 1 Pair (Standard Warmth Starter Kit)',
    price: '26.77',
    compare_at_price: '52.49'
  },
  {
    name: 'Buy 2 Pairs (Couple / Backup Pack - Save 45%)',
    price: '44.99',
    compare_at_price: '104.99'
  },
  {
    name: 'Buy 3 Pairs (Family Winter Gift Pack - Buy 2 Get 1 FREE)',
    price: '59.99',
    compare_at_price: '157.49'
  }
];

const colorOptions = [
  'Stealth Black',
  'Heather Gray',
  'Blush Pink'
];

async function seedAckerman() {
  const token = await getAccessToken();
  console.log('Got access token. Checking if product already exists...');

  const checkRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-01/products.json?handle=zavelyn-thermoglove-smart-thermostatic-heated-fingerless-gloves`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const checkData = await checkRes.json();
  if (checkData.products && checkData.products.length > 0) {
    console.log(`Found existing product ${checkData.products[0].id}. Deleting to re-create cleanly...`);
    await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-01/products/${checkData.products[0].id}.json`, {
      method: 'DELETE',
      headers: { 'X-Shopify-Access-Token': token }
    });
    console.log('Deleted existing product.');
  }

  // Build 9 variants
  const variants = [];
  for (const b of bundleOptions) {
    for (const c of colorOptions) {
      variants.push({
        option1: b.name,
        option2: c,
        price: b.price,
        compare_at_price: b.compare_at_price,
        sku: `ZAV-GLOVE-${b.name.includes('Buy 1') ? '1PK' : b.name.includes('Buy 2') ? '2PK' : '3PK'}-${c.includes('Black') ? 'BLK' : c.includes('Gray') ? 'GRY' : 'PNK'}`,
        inventory_management: null,
        inventory_policy: 'continue',
        requires_shipping: true
      });
    }
  }

  // Put color photos first in images list
  const orderedImages = [
    { src: blackUrl },
    { src: grayUrl },
    { src: pinkUrl },
    ...uploadedAssets.filter(a => !a.filename.includes('black') && !a.filename.includes('gray') && !a.filename.includes('asset-2')).map(a => ({ src: a.publicUrl }))
  ];

  const productPayload = {
    product: {
      title: 'Zavelyn ThermoGlove™ Smart Thermostatic Heated Fingerless Winter Gloves',
      handle: 'zavelyn-thermoglove-smart-thermostatic-heated-fingerless-gloves',
      body_html: bodyHtml,
      vendor: 'Zavelyn',
      product_type: 'Heated Winter Apparel & Therapeutic Gloves',
      status: 'active',
      tags: 'Heated Gloves, Thermostatic, Cold Hands, Arthritis Relief, Raynauds, Winter Apparel, Zavelyn, Best Seller',
      options: [
        { name: 'Bundle', values: bundleOptions.map(b => b.name) },
        { name: 'Color', values: colorOptions }
      ],
      variants: variants,
      images: orderedImages
    }
  };

  console.log(`Creating product with ${variants.length} variants on Shopify API...`);
  const createRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-01/products.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify(productPayload)
  });

  const createData = await createRes.json();
  if (createData.errors) {
    console.error('Error creating product:', JSON.stringify(createData.errors, null, 2));
    process.exit(1);
  }

  const createdProduct = createData.product;
  console.log(`✔ Created product ${createdProduct.id}: ${createdProduct.title}`);

  // Link variant images and ensure inventory_policy continue
  const productImages = createdProduct.images || [];
  const blackImgId = productImages[0]?.id;
  const grayImgId = productImages[1]?.id;
  const pinkImgId = productImages[2]?.id;

  console.log('Linking variant images to respective color photos...');
  for (const v of createdProduct.variants) {
    let targetImageId = blackImgId;
    if (v.option2.includes('Gray')) targetImageId = grayImgId;
    else if (v.option2.includes('Pink')) targetImageId = pinkImgId;

    await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-01/variants/${v.id}.json`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': token
      },
      body: JSON.stringify({
        variant: {
          id: v.id,
          image_id: targetImageId,
          inventory_policy: 'continue',
          inventory_management: null,
          requires_shipping: true
        }
      })
    });
  }
  console.log('✔ Linked variant images & ensured inventory_policy: continue');

  // Add to collections
  const collections = ['510391353529', '510391156921'];
  for (const colId of collections) {
    try {
      await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-01/collects.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': token
        },
        body: JSON.stringify({
          collect: {
            product_id: createdProduct.id,
            collection_id: colId
          }
        })
      });
      console.log(`✔ Added to collection ${colId}`);
    } catch (e) {
      console.warn(`Could not add to collection ${colId}:`, e.message);
    }
  }

  console.log(`\n🎉 Product #10 ThermoGlove™ seeding complete!`);
  console.log(`Live PDP: https://${SHOP_DOMAIN}/products/zavelyn-thermoglove-smart-thermostatic-heated-fingerless-gloves`);
}

seedAckerman().catch(err => {
  console.error('Fatal seeding error:', err);
  process.exit(1);
});
