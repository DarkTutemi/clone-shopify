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

const uploadedUrls = JSON.parse(fs.readFileSync('grater_media/uploaded_urls.json', 'utf8'));

// Build rich advertorial body_html
const bodyHtml = `
<div class="zavelyn-grater-desc" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; line-height: 1.6; max-width: 900px; margin: 0 auto; padding: 20px 0;">

  <!-- Hero Highlight Header -->
  <div style="background: linear-gradient(135deg, #1e3a8a 0%, #0f172a 100%); color: #ffffff; padding: 32px 24px; border-radius: 12px; margin-bottom: 32px; text-align: center;">
    <span style="display: inline-block; background-color: #f59e0b; color: #000000; font-weight: 800; font-size: 12px; letter-spacing: 0.1em; padding: 4px 12px; border-radius: 999px; text-transform: uppercase; margin-bottom: 12px;">🏆 TOP PICK 2025 KITCHEN ESSENTIAL</span>
    <h2 style="font-size: 28px; font-weight: 800; line-height: 1.25; margin: 0 0 12px; color: #ffffff;">Faster Prep, Safer Hands & Beautiful Textures for Every Meal</h2>
    <p style="font-size: 16px; color: #cbd5e1; max-width: 680px; margin: 0 auto; line-height: 1.6;">
      Say goodbye to hazardous box graters, band-aids on your knuckles, and sore wrists. The <strong>Zavelyn® 5-in-1 Rotary Cheese Grater & Shredder</strong> transforms block cheese, crisp veggies, and nuts into chef-grade shreds in seconds—100% finger-safe.
    </p>
  </div>

  <!-- 3 Quick Value Cards -->
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(240px, 1fr)); gap: 16px; margin-bottom: 36px;">
    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 20px; text-align: center;">
      <div style="font-size: 28px; margin-bottom: 8px;">🛡️</div>
      <strong style="display: block; font-size: 16px; color: #0f172a; margin-bottom: 4px;">Zero Finger Contact</strong>
      <span style="font-size: 14px; color: #64748b;">Enclosed rotating drum with ergonomic pusher protects your hands completely.</span>
    </div>
    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 20px; text-align: center;">
      <div style="font-size: 28px; margin-bottom: 8px;">⚡</div>
      <strong style="display: block; font-size: 16px; color: #0f172a; margin-bottom: 4px;">18x Faster Rotation</strong>
      <span style="font-size: 14px; color: #64748b;">One 360° handle crank equals 18 manual strokes. Grate 1 lb of cheese in 30 seconds.</span>
    </div>
    <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 10px; padding: 20px; text-align: center;">
      <div style="font-size: 28px; margin-bottom: 8px;">🔒</div>
      <strong style="display: block; font-size: 16px; color: #0f172a; margin-bottom: 4px;">Heavy-Duty Suction Lock</strong>
      <span style="font-size: 14px; color: #64748b;">Vacuum-seal base anchors firmly to quartz, marble, laminate, or stainless counters.</span>
    </div>
  </div>

  <!-- Feature 1: Finger-Safe Hopper -->
  <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin-bottom: 28px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
    <img src="${uploadedUrls['grater_feat_safe_hopper.png']}" alt="Enclosed Finger-Safe Hopper" style="width: 100%; border-radius: 8px; margin-bottom: 16px; display: block;" />
    <span style="font-size: 12px; font-weight: 700; color: #0284c7; letter-spacing: 0.08em; text-transform: uppercase;">SAFETY INNOVATION</span>
    <h3 style="font-size: 22px; font-weight: 700; color: #0f172a; margin: 4px 0 10px;">1. Enclosed Finger-Safe Hopper — No More Knuckle Scrapes</h3>
    <p style="font-size: 15px; color: #475569; margin: 0 0 12px;">
      Traditional upright box graters are notorious for slipping and catching fingertips. Zavelyn encloses all 430 stainless steel blades inside a durable barrel. You feed ingredients into the top hopper and gently press with the food pusher—your fingers never get within inches of the cutting edges.
    </p>
    <div style="background: #f0fdf4; border-left: 3px solid #16a34a; padding: 12px 16px; border-radius: 4px; font-size: 14px; color: #166534; font-style: italic;">
      "I used to dread grating cheese because of past knuckle injuries. With Zavelyn, I let my 10-year-old help prepare taco night safely. Pure peace of mind." — Sarah M., Verified Home Cook
    </div>
  </div>

  <!-- Feature 2: 360 Rotary Power -->
  <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin-bottom: 28px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
    <img src="${uploadedUrls['grater_feat_rotary_power.png']}" alt="360 Degree Rotary Power" style="width: 100%; border-radius: 8px; margin-bottom: 16px; display: block;" />
    <span style="font-size: 12px; font-weight: 700; color: #0284c7; letter-spacing: 0.08em; text-transform: uppercase;">EFFORTLESS PREP</span>
    <h3 style="font-size: 22px; font-weight: 700; color: #0f172a; margin: 4px 0 10px;">2. 360° Rotary Power & Precision Drums — Done in Seconds</h3>
    <p style="font-size: 15px; color: #475569; margin: 0;">
      Why strain your shoulder pushing cheese up and down? Simply turn the ergonomic crank handle. The diagonal cylinder design feeds shreds straight into your bowl with zero clogging. Prepare hash browns, pizza mozzarella, coleslaw, or zucchini noodles in a fraction of the time.
    </p>
  </div>

  <!-- Feature 3: Suction Lock Base -->
  <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin-bottom: 28px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
    <img src="${uploadedUrls['grater_feat_suction_lock.png']}" alt="Locking Suction Base" style="width: 100%; border-radius: 8px; margin-bottom: 16px; display: block;" />
    <span style="font-size: 12px; font-weight: 700; color: #0284c7; letter-spacing: 0.08em; text-transform: uppercase;">STABLE COUNTERTOP GRIP</span>
    <h3 style="font-size: 22px; font-weight: 700; color: #0f172a; margin: 4px 0 10px;">3. Turn-to-Lock Suction Base — Zero Wobble, Zero Slips</h3>
    <p style="font-size: 15px; color: #475569; margin: 0;">
      A single twist of the dial engages a powerful silicone suction foot that bonds tightly to any non-porous countertop. The unit remains solidly in place even when tackling tough root vegetables like sweet potatoes and carrots or hard parmesan blocks.
    </p>
  </div>

  <!-- Feature 4: Easy Rinse Clean -->
  <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin-bottom: 28px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
    <img src="${uploadedUrls['grater_feat_easy_rinse.png']}" alt="Easy Rinse Clean Design" style="width: 100%; border-radius: 8px; margin-bottom: 16px; display: block;" />
    <span style="font-size: 12px; font-weight: 700; color: #0284c7; letter-spacing: 0.08em; text-transform: uppercase;">EFFORTLESS CLEANUP</span>
    <h3 style="font-size: 22px; font-weight: 700; color: #0f172a; margin: 4px 0 10px;">4. 1-Click Disassembly & Dishwasher Safe</h3>
    <p style="font-size: 15px; color: #475569; margin: 0;">
      Cleaning bulky food processors takes longer than cooking. Zavelyn detaches in seconds into 4 simple parts. Rinse under warm running water or place the stainless drums on the top rack of your dishwasher.
    </p>
  </div>

  <!-- 5 Interchangeable Drums Section -->
  <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin-bottom: 28px;">
    <h3 style="font-size: 20px; font-weight: 700; color: #0f172a; text-align: center; margin: 0 0 20px;">5 Interchangeable Stainless Steel Drums Included</h3>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(150px, 1fr)); gap: 16px; text-align: center;">
      <div style="background: #ffffff; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0;">
        <img src="${uploadedUrls['grater_drum_slice.png']}" alt="Slice Drum" style="width: 70px; height: 70px; object-fit: contain; margin: 0 auto 8px; display: block;" />
        <strong style="display: block; font-size: 14px; color: #0f172a;">Uniform Slicer</strong>
        <span style="font-size: 12px; color: #64748b;">Cucumbers, potatoes, radishes</span>
      </div>
      <div style="background: #ffffff; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0;">
        <img src="${uploadedUrls['grater_drum_coarse.png']}" alt="Coarse Shred Drum" style="width: 70px; height: 70px; object-fit: contain; margin: 0 auto 8px; display: block;" />
        <strong style="display: block; font-size: 14px; color: #0f172a;">Coarse Shredder</strong>
        <span style="font-size: 12px; color: #64748b;">Cheddar, mozzarella, cabbage</span>
      </div>
      <div style="background: #ffffff; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0;">
        <img src="${uploadedUrls['grater_drum_fine.png']}" alt="Fine Shred Drum" style="width: 70px; height: 70px; object-fit: contain; margin: 0 auto 8px; display: block;" />
        <strong style="display: block; font-size: 14px; color: #0f172a;">Fine Shredder</strong>
        <span style="font-size: 12px; color: #64748b;">Carrots, chocolate, parmesan</span>
      </div>
      <div style="background: #ffffff; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0;">
        <img src="${uploadedUrls['grater_drum_waffle.png']}" alt="Waffle Drum" style="width: 70px; height: 70px; object-fit: contain; margin: 0 auto 8px; display: block;" />
        <strong style="display: block; font-size: 14px; color: #0f172a;">Waffle Slicer</strong>
        <span style="font-size: 12px; color: #64748b;">Crinkle cuts, decorative chips</span>
      </div>
      <div style="background: #ffffff; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0;">
        <div style="font-size: 32px; height: 70px; display: flex; align-items: center; justify-content: center;">🥜</div>
        <strong style="display: block; font-size: 14px; color: #0f172a;">Grind / Powder</strong>
        <span style="font-size: 12px; color: #64748b;">Walnuts, crackers, garlic</span>
      </div>
    </div>
  </div>

  <!-- Comparison Table -->
  <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin-bottom: 28px;">
    <h3 style="font-size: 20px; font-weight: 700; color: #0f172a; text-align: center; margin: 0 0 16px;">Traditional Box Grater vs. Zavelyn 5-in-1 Grater</h3>
    <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
      <thead>
        <tr style="border-bottom: 2px solid #e2e8f0; text-align: left;">
          <th style="padding: 10px 8px; color: #64748b;">Feature</th>
          <th style="padding: 10px 8px; color: #dc2626;">Box Grater</th>
          <th style="padding: 10px 8px; color: #16a34a; font-weight: 800;">Zavelyn 5-in-1</th>
        </tr>
      </thead>
      <tbody>
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 10px 8px; font-weight: 600;">Safety</td>
          <td style="padding: 10px 8px; color: #dc2626;">High cut/scrape risk</td>
          <td style="padding: 10px 8px; color: #16a34a; font-weight: 700;">100% Finger-Safe Enclosed</td>
        </tr>
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 10px 8px; font-weight: 600;">Speed</td>
          <td style="padding: 10px 8px; color: #64748b;">Slow, tiring arm motion</td>
          <td style="padding: 10px 8px; color: #16a34a; font-weight: 700;">18x Faster Rotary Crank</td>
        </tr>
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 10px 8px; font-weight: 600;">Stability</td>
          <td style="padding: 10px 8px; color: #dc2626;">Slips across cutting board</td>
          <td style="padding: 10px 8px; color: #16a34a; font-weight: 700;">Vacuum Suction Lock Base</td>
        </tr>
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 10px 8px; font-weight: 600;">Versatility</td>
          <td style="padding: 10px 8px; color: #64748b;">Fixed dull blades</td>
          <td style="padding: 10px 8px; color: #16a34a; font-weight: 700;">5 Interchangeable 430 SS Drums</td>
        </tr>
        <tr>
          <td style="padding: 10px 8px; font-weight: 600;">Cleaning</td>
          <td style="padding: 10px 8px; color: #dc2626;">Food gets trapped inside</td>
          <td style="padding: 10px 8px; color: #16a34a; font-weight: 700;">Quick-Release, Dishwasher Safe</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Tech Specs -->
  <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin-bottom: 28px;">
    <h3 style="font-size: 20px; font-weight: 700; color: #0f172a; margin: 0 0 16px;">Technical Specifications</h3>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 12px; font-size: 14px;">
      <div style="background: #ffffff; padding: 12px 16px; border-radius: 6px; border: 1px solid #e2e8f0;">
        <strong style="color: #64748b; display: block; font-size: 12px;">BLADE MATERIAL</strong>
        <span style="font-weight: 700; color: #0f172a;">Food-Grade 430 Stainless Steel</span>
      </div>
      <div style="background: #ffffff; padding: 12px 16px; border-radius: 6px; border: 1px solid #e2e8f0;">
        <strong style="color: #64748b; display: block; font-size: 12px;">BODY HOUSING</strong>
        <span style="font-weight: 700; color: #0f172a;">BPA-Free Heavy Duty ABS</span>
      </div>
      <div style="background: #ffffff; padding: 12px 16px; border-radius: 6px; border: 1px solid #e2e8f0;">
        <strong style="color: #64748b; display: block; font-size: 12px;">SUCTION BASE</strong>
        <span style="font-weight: 700; color: #0f172a;">Twist-Lock Vacuum Silicone</span>
      </div>
      <div style="background: #ffffff; padding: 12px 16px; border-radius: 6px; border: 1px solid #e2e8f0;">
        <strong style="color: #64748b; display: block; font-size: 12px;">INCLUDED DRUMS</strong>
        <span style="font-weight: 700; color: #0f172a;">5 Interchangeable Barrels</span>
      </div>
    </div>
  </div>

  <!-- 90-Day Guarantee -->
  <div style="background: #eff6ff; border: 1px solid #bfdbfe; border-radius: 12px; padding: 24px; text-align: center;">
    <div style="font-size: 32px; margin-bottom: 8px;">🛡️</div>
    <h3 style="font-size: 20px; font-weight: 700; color: #1e3a8a; margin: 0 0 8px;">90-Day Risk-Free Kitchen Trial</h3>
    <p style="font-size: 15px; color: #1e40af; margin: 0; line-height: 1.6;">
      Try the Zavelyn 5-in-1 Rotary Grater in your kitchen for 90 days. If it doesn't dramatically speed up your prep work, keep your hands safe, and clean easily, simply contact us for a full 100% refund with zero hassle.
    </p>
  </div>

</div>
`;

async function createProduct() {
  const token = await getAccessToken();
  console.log('Got access token. Creating Shopify product...');

  const productData = {
    title: 'Zavelyn 5-in-1 Rotary Cheese Grater & Shredder',
    handle: 'zavelyn-5-in-1-rotary-cheese-grater-shredder',
    vendor: 'Zavelyn',
    product_type: 'Kitchen Tools',
    body_html: bodyHtml,
    tags: 'Kitchen Tools, Cheese Grater, Rotary Shredder, Best Sellers, Clearance',
    images: [
      { src: uploadedUrls['pkg_white_1pc.jpg'], position: 1 },
      { src: uploadedUrls['pkg_green_1pc.jpg'], position: 2 },
      { src: uploadedUrls['pkg_white_2pcs.jpg'], position: 3 },
      { src: uploadedUrls['pkg_green_2pcs.jpg'], position: 4 },
      { src: uploadedUrls['grater_hero_banner.jpg'], position: 5 },
      { src: uploadedUrls['grater_feat_safe_hopper.png'], position: 6 },
      { src: uploadedUrls['grater_feat_rotary_power.png'], position: 7 },
      { src: uploadedUrls['grater_feat_suction_lock.png'], position: 8 },
      { src: uploadedUrls['grater_feat_easy_rinse.png'], position: 9 },
      { src: uploadedUrls['grater_prep_holiday.png'], position: 10 }
    ],
    options: [
      {
        name: 'Color & Quantity',
        values: [
          'White (1 pc)',
          'Green (1 pc)',
          'White (2 pcs) - Best Seller',
          'Green (2 pcs) - Hot Sale'
        ]
      }
    ],
    variants: [
      {
        option1: 'White (1 pc)',
        price: '55.99',
        compare_at_price: '111.99',
        inventory_policy: 'continue',
        inventory_management: null,
        requires_shipping: true
      },
      {
        option1: 'Green (1 pc)',
        price: '55.99',
        compare_at_price: '111.99',
        inventory_policy: 'continue',
        inventory_management: null,
        requires_shipping: true
      },
      {
        option1: 'White (2 pcs) - Best Seller',
        price: '96.99',
        compare_at_price: '193.99',
        inventory_policy: 'continue',
        inventory_management: null,
        requires_shipping: true
      },
      {
        option1: 'Green (2 pcs) - Hot Sale',
        price: '96.99',
        compare_at_price: '193.99',
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
  fs.writeFileSync('created_grater_product.json', JSON.stringify(p, null, 2));

  // Link variant images
  console.log('\n--- Linking variant images ---');
  const imgMap = {
    'White (1 pc)': p.images.find(i => i.src.includes('pkg_white_1pc')),
    'Green (1 pc)': p.images.find(i => i.src.includes('pkg_green_1pc')),
    'White (2 pcs) - Best Seller': p.images.find(i => i.src.includes('pkg_white_2pcs')),
    'Green (2 pcs) - Hot Sale': p.images.find(i => i.src.includes('pkg_green_2pcs'))
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
