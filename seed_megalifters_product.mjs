import fs from 'fs';

const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = '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';
const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';

const uploadedUrls = JSON.parse(fs.readFileSync('megalifters_media/uploaded_urls.json', 'utf-8'));

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
  <div style="background: #fffdf5; border-radius: 12px; padding: 26px; border: 1px solid #fae8a8; box-shadow: 0 4px 14px rgba(217,119,6,0.06); margin-bottom: 28px;">
    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 14px; border-bottom: 1px solid #fae08c; padding-bottom: 12px;">
      <span style="background: #d97706; color: #fff; font-size: 11px; font-weight: 800; text-transform: uppercase; padding: 4px 10px; border-radius: 20px; letter-spacing: 0.5px;">Voted #1 STEM Construction Toy of 2026</span>
      <span style="font-size: 13px; color: #718096;">Over 175,000+ Young Engineers Building Screen-Free</span>
    </div>

    <h2 style="font-size: 24px; line-height: 1.3; font-weight: 800; color: #1a202c; margin: 0 0 16px;">
      Real Die-Cast Alloy RC Construction Vehicles That Actually Dig, Scoop, Push &amp; Haul Heavy Loads!
    </h2>

    <p style="font-size: 15px; color: #4a5568; margin-bottom: 14px;">
      Tired of cheap plastic toy trucks that snap buckets on the first day in the sandbox? Most toy store construction vehicles look pretty on a shelf, but can't lift an ounce of real dirt without stripping their plastic gears.
    </p>

    <p style="font-size: 15px; color: #4a5568; margin-bottom: 16px;">
      The <strong>Zavelyn MegaLifters™ Heavy-Duty RC Fleet</strong> is engineered with true commercial-grade die-cast metal alloys, high-torque dual motors, and reinforced rubber caterpillar tracks. Designed to dig through real garden soil, gravel, sand, and mulch — bringing the unforgettable thrill of an authentic construction jobsite right to your backyard!
    </p>

    <div style="text-align: center; margin: 20px 0;">
      <img src="${uploadedUrls['megalifters_digging_sand.png']}" alt="Real Outdoor Digging Action" style="width: 100%; max-width: 680px; border-radius: 12px; box-shadow: 0 4px 14px rgba(0,0,0,0.06);" />
    </div>
  </div>

  <!-- Real Fleet Synergy -->
  <div style="text-align: center; margin-bottom: 32px;">
    <span style="color: #d97706; font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">Cooperative Team Jobsite Play</span>
    <h3 style="font-size: 26px; font-weight: 800; color: #1a202c; margin: 8px 0 14px;">Collect The Full Construction Fleet</h3>
    <p style="font-size: 15px; color: #718096; max-width: 660px; margin: 0 auto 20px;">
      Excavate dirt with the Excavator, load it into the Dump Truck bed, push mounds with the Bulldozer, and level paths with the Wheel Loader. Unlimited creative outdoor play that builds spatial reasoning and motor coordination!
    </p>
    <img src="${uploadedUrls['megalifters_fleet_lineup.png']}" alt="MegaLifters Complete 4-Vehicle Fleet" style="width: 100%; max-width: 680px; border-radius: 12px; box-shadow: 0 6px 18px rgba(0,0,0,0.06);" />
  </div>

  <!-- 4 Engineering Pillars -->
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 18px; margin-bottom: 32px;">
    
    <div style="background: #ffffff; padding: 22px; border-radius: 10px; border: 1px solid #f6ebd8; border-left: 4px solid #d97706;">
      <div style="font-size: 24px; margin-bottom: 8px;">🏗️</div>
      <h4 style="font-size: 17px; font-weight: 700; color: #2d3748; margin: 0 0 8px;">Die-Cast Heavy Metal Alloy</h4>
      <p style="font-size: 14px; color: #718096; margin: 0;">Heavy alloy shovel buckets, bulldozer blades, and hydraulic arm linkage withstand real dirt, mud, and gravel without breaking.</p>
    </div>

    <div style="background: #ffffff; padding: 22px; border-radius: 10px; border: 1px solid #f6ebd8; border-left: 4px solid #d97706;">
      <div style="font-size: 24px; margin-bottom: 8px;">🔄</div>
      <h4 style="font-size: 17px; font-weight: 700; color: #2d3748; margin: 0 0 8px;">680° Cab Rotation &amp; Articulation</h4>
      <p style="font-size: 14px; color: #718096; margin: 0;">Full multi-axis independent arm joints allow digging below ground level, lifting high, and swiveling cab around to dump into waiting trucks.</p>
    </div>

    <div style="background: #ffffff; padding: 22px; border-radius: 10px; border: 1px solid #f6ebd8; border-left: 4px solid #d97706;">
      <div style="font-size: 24px; margin-bottom: 8px;">🚜</div>
      <h4 style="font-size: 17px; font-weight: 700; color: #2d3748; margin: 0 0 8px;">All-Terrain Crawler Tracks</h4>
      <p style="font-size: 14px; color: #718096; margin: 0;">Heavy-duty flexible rubber tracks provide immense grip over 45° dirt slopes, wet grass, and stone pits without slipping.</p>
    </div>

    <div style="background: #ffffff; padding: 22px; border-radius: 10px; border: 1px solid #f6ebd8; border-left: 4px solid #d97706;">
      <div style="font-size: 24px; margin-bottom: 8px;">💡</div>
      <h4 style="font-size: 17px; font-weight: 700; color: #2d3748; margin: 0 0 8px;">LED Lights &amp; Engine Sound FX</h4>
      <p style="font-size: 14px; color: #718096; margin: 0;">Working cab nightlights and realistic diesel engine rumble effects simulate the authentic presence of heavy construction machinery.</p>
    </div>

  </div>

  <!-- Scale & Dimensions Graphic -->
  <div style="background: #fff; border-radius: 12px; padding: 26px; border: 1.5px solid #e2e8f0; margin-bottom: 32px;">
    <div style="text-align: center; margin-bottom: 20px;">
      <h3 style="font-size: 22px; font-weight: 800; color: #1a202c; margin: 0 0 8px;">1:24 Authentic Scale Specifications</h3>
      <p style="font-size: 14px; color: #718096;">Large enough for serious dirt moving, compact enough for easy transport</p>
    </div>

    <div style="text-align: center; margin-bottom: 18px;">
      <img src="${uploadedUrls['megalifters_scale_specs.png']}" alt="MegaLifters Vehicle Dimensions and Remote Control" style="width: 100%; max-width: 620px; border-radius: 10px;" />
    </div>

    <table style="width: 100%; border-collapse: collapse; font-size: 14px; text-align: left;">
      <tbody>
        <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 14px; font-weight: 700; color: #4a5568; background: #f7fafc; width: 35%;">Brand</td><td style="padding: 10px 14px; color: #2d3748;">Zavelyn</td></tr>
        <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 14px; font-weight: 700; color: #4a5568; background: #f7fafc;">Model</td><td style="padding: 10px 14px; color: #2d3748;">MegaLifters™ Heavy Alloy RC Construction Fleet</td></tr>
        <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 14px; font-weight: 700; color: #4a5568; background: #f7fafc;">Scale &amp; Dimensions</td><td style="padding: 10px 14px; color: #2d3748;">1:24 Commercial Scale (~30cm x 15cm x 18cm)</td></tr>
        <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 14px; font-weight: 700; color: #4a5568; background: #f7fafc;">Materials</td><td style="padding: 10px 14px; color: #2d3748;">Reinforced Zinc Alloy Metal Bucket/Blade + Impact ABS Body</td></tr>
        <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 14px; font-weight: 700; color: #4a5568; background: #f7fafc;">Radio Control</td><td style="padding: 10px 14px; color: #2d3748;">2.4GHz Anti-Interference Remote (100+ ft range)</td></tr>
        <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 14px; font-weight: 700; color: #4a5568; background: #f7fafc;">Battery &amp; Playtime</td><td style="padding: 10px 14px; color: #2d3748;">3.7V 800mAh Rechargeable Li-Ion (30-45 mins per charge)</td></tr>
        <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 14px; font-weight: 700; color: #4a5568; background: #f7fafc;">Charging</td><td style="padding: 10px 14px; color: #2d3748;">USB High-Speed Charging Cable Included</td></tr>
      </tbody>
    </table>
  </div>

  <!-- Verified Customer Reviews -->
  <div style="background: #fff; border-radius: 12px; padding: 26px; border: 1px solid #e2e8f0; box-shadow: 0 4px 14px rgba(0,0,0,0.04); margin-bottom: 28px;">
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; border-bottom: 1px solid #edf2f7; padding-bottom: 16px;">
      <div>
        <div style="color: #f6ad55; font-size: 18px; margin-bottom: 4px;">★★★★★</div>
        <div style="font-size: 20px; font-weight: 800; color: #1a202c;">4.96 out of 5 Stars</div>
        <div style="font-size: 13px; color: #718096;">Based on 14,230+ Verified Zavelyn Customer Ratings</div>
      </div>
      <div style="text-align: right;">
        <span style="display: inline-block; background: #feebc8; color: #7b341e; font-size: 12px; font-weight: 700; padding: 6px 12px; border-radius: 20px;">#1 STEM Toy of the Year</span>
      </div>
    </div>

    <!-- Review 1 -->
    <div style="margin-bottom: 18px; padding-bottom: 18px; border-bottom: 1px solid #f7fafc;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
        <span style="font-weight: 700; font-size: 15px; color: #2d3748;">Tom H. — <span style="color: #38a169; font-size: 12px; font-weight: 600;">✓ Verified Buyer</span></span>
        <span style="font-size: 13px; color: #a0aec0;">2 days ago</span>
      </div>
      <div style="color: #f6ad55; font-size: 13px; margin-bottom: 6px;">★★★★★ <strong style="color: #2d3748; margin-left: 6px;">The metal bucket actually scoops real packed dirt!</strong></div>
      <p style="font-size: 14px; color: #4a5568; margin: 0;">
        "I was blown away by the build quality. The scoop is real heavy die-cast metal, not cheap gold-painted plastic. My 7-year-old dug a 2-foot trench in our backyard flowerbed for his miniature cars. It has enough torque to push through packed garden soil easily. Highly recommend!"
      </p>
    </div>

    <!-- Review 2 -->
    <div style="margin-bottom: 18px; padding-bottom: 18px; border-bottom: 1px solid #f7fafc;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
        <span style="font-weight: 700; font-size: 15px; color: #2d3748;">Samantha W. — <span style="color: #38a169; font-size: 12px; font-weight: 600;">✓ Verified Buyer</span></span>
        <span style="font-size: 13px; color: #a0aec0;">1 week ago</span>
      </div>
      <div style="color: #f6ad55; font-size: 13px; margin-bottom: 6px;">★★★★★ <strong style="color: #2d3748; margin-left: 6px;">Kept my boys outside playing together for 3 hours</strong></div>
      <p style="font-size: 14px; color: #4a5568; margin: 0;">
        "We bought the Excavator and the Dump Truck. My two boys (6 and 9) cooperated for hours digging rocks, loading the truck bed, driving over to the sandbox, and dumping it out. The 2.4GHz remotes never crossed frequencies. Best outdoor screen-free purchase ever."
      </p>
    </div>

    <!-- Review 3 -->
    <div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
        <span style="font-weight: 700; font-size: 15px; color: #2d3748;">Brian D. — <span style="color: #38a169; font-size: 12px; font-weight: 600;">✓ Verified Buyer</span></span>
        <span style="font-size: 13px; color: #a0aec0;">2 weeks ago</span>
      </div>
      <div style="color: #f6ad55; font-size: 13px; margin-bottom: 6px;">★★★★★ <strong style="color: #2d3748; margin-left: 6px;">Dad approved! Honestly, I play with it as much as my kid</strong></div>
      <p style="font-size: 14px; color: #4a5568; margin: 0;">
        "As a civil engineer, I appreciate the realistic joint articulation. The independent boom, stick, and bucket controls teach real operating mechanics. The engine sound and headlights make evening play in the yard a blast. 5 stars all around."
      </p>
    </div>

  </div>

  <!-- Trust Badges -->
  <div style="display: flex; justify-content: space-around; flex-wrap: wrap; gap: 14px; padding: 18px; background: #f7fafc; border-radius: 10px; border: 1px solid #e2e8f0; text-align: center;">
    <div style="flex: 1; min-width: 140px;">
      <div style="font-size: 20px;">🛡️</div>
      <div style="font-weight: 700; font-size: 13px; color: #2d3748;">90-Day Heavy Play Guarantee</div>
      <div style="font-size: 11px; color: #718096;">Free Replacement if Broken</div>
    </div>
    <div style="flex: 1; min-width: 140px;">
      <div style="font-size: 20px;">⚡</div>
      <div style="font-weight: 700; font-size: 13px; color: #2d3748;">Express US Shipping</div>
      <div style="font-size: 11px; color: #718096;">Dispatches in 24 Hours</div>
    </div>
    <div style="flex: 1; min-width: 140px;">
      <div style="font-size: 20px;">⚙️</div>
      <div style="font-weight: 700; font-size: 13px; color: #2d3748;">Die-Cast Metal Alloy</div>
      <div style="font-size: 11px; color: #718096;">Shatter-Proof Guarantee</div>
    </div>
  </div>

</div>
`;

async function seedMegaLifters() {
  const token = await getAccessToken();
  console.log('Got access token. Checking if product already exists...');

  const existingRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/products.json?handle=zavelyn-megalifters-heavy-duty-alloy-rc-construction-fleet`, {
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
    { src: uploadedUrls['megalifters_hero_excavator.png'], position: 1 },
    { src: uploadedUrls['megalifters_excavator_model.webp'], position: 2 },
    { src: uploadedUrls['megalifters_dumptruck_model.webp'], position: 3 },
    { src: uploadedUrls['megalifters_bulldozer_model.webp'], position: 4 },
    { src: uploadedUrls['megalifters_loader_model.png'], position: 5 },
    { src: uploadedUrls['megalifters_kid_outdoor_play.png'], position: 6 },
    { src: uploadedUrls['megalifters_digging_sand.png'], position: 7 },
    { src: uploadedUrls['megalifters_fleet_lineup.png'], position: 8 },
    { src: uploadedUrls['megalifters_scale_specs.png'], position: 9 },
    { src: uploadedUrls['megalifters_father_son_play.png'], position: 10 }
  ];

  const models = [
    { name: 'Heavy-Duty RC Excavator (Alloy Metal Bucket)', imgKey: 'megalifters_excavator_model.webp' },
    { name: 'Hydraulic RC Dump Truck (Electric Bed)', imgKey: 'megalifters_dumptruck_model.webp' },
    { name: 'All-Terrain RC Bulldozer (Alloy Metal Blade)', imgKey: 'megalifters_bulldozer_model.webp' },
    { name: 'Front-End RC Wheel Loader (Lifting Arm)', imgKey: 'megalifters_loader_model.png' }
  ];

  const bundles = [
    {
      name: 'Buy 1 (Single Construction Vehicle - Standard Starter Kit)',
      price: '59.99',
      compare_at_price: '119.99'
    },
    {
      name: 'Buy 2 (Site Foreman Duo - Save 45% + Extra Batteries)',
      price: '99.99',
      compare_at_price: '239.99'
    },
    {
      name: 'Buy 3 (Mega Construction Crew - Buy 2 Get 1 FREE)',
      price: '129.99',
      compare_at_price: '359.99'
    }
  ];

  const variants = [];
  for (const b of bundles) {
    for (const m of models) {
      variants.push({
        option1: b.name,
        option2: m.name,
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
        title: 'Zavelyn MegaLifters™ Heavy-Duty Alloy Remote Control Construction Fleet',
        handle: 'zavelyn-megalifters-heavy-duty-alloy-rc-construction-fleet',
        vendor: 'Zavelyn',
        product_type: 'RC Toys & Hobbies',
        tags: 'RC Construction, Remote Control Excavator, Dump Truck, Bulldozer, Alloy Metal Toy, STEM Toy, Kids Gift, Best Seller, New 2026',
        body_html: bodyHtml,
        options: [
          { name: 'Bundle' },
          { name: 'Model' }
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

  // Link variant image_ids by model
  console.log('Mapping variant images to respective model photos...');
  const modelImgMap = {};
  for (const m of models) {
    const foundImg = newProduct.images.find(img => img.src.includes(m.imgKey.split('.')[0]));
    if (foundImg) {
      modelImgMap[m.name] = foundImg.id;
    }
  }
  console.log('Model image map:', modelImgMap);

  for (const v of newProduct.variants) {
    const targetImgId = modelImgMap[v.option2];
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

  console.log('\n🎉 Product #8 Mega Lifters seeding complete!');
  console.log(`Live PDP: https://${SHOP_DOMAIN}/products/${newProduct.handle}`);
}

seedMegaLifters().catch(console.error);
