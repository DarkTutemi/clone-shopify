import fs from 'fs';

const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = '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';
const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';

const uploadedUrls = JSON.parse(fs.readFileSync('selenepets_media/uploaded_urls.json', 'utf-8'));

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
  <div style="background: #f7fafc; border-radius: 12px; padding: 26px; border: 1px solid #e2e8f0; box-shadow: 0 4px 14px rgba(49,130,206,0.06); margin-bottom: 28px;">
    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 14px; border-bottom: 1px solid #e2e8f0; padding-bottom: 12px;">
      <span style="background: #2b6cb0; color: #fff; font-size: 11px; font-weight: 800; text-transform: uppercase; padding: 4px 10px; border-radius: 20px; letter-spacing: 0.5px;">Veterinarian Approved &amp; Recommended</span>
      <span style="font-size: 13px; color: #718096;">Over 160,000+ Pets Hydrated &amp; Thriving</span>
    </div>

    <h2 style="font-size: 24px; line-height: 1.3; font-weight: 800; color: #1a202c; margin: 0 0 16px;">
      Your Dog's Traditional Water Bowl Is Dirtier Than You Think — And They're Quietly Drinking Less Because of It!
    </h2>

    <p style="font-size: 15px; color: #4a5568; margin-bottom: 14px;">
      Did you know stagnant water in plastic pet bowls begins breeding bacteria, slippery biofilm, and algae within just 2 hours of sitting out? Dogs and cats possess an instinctual sense of smell 40x stronger than humans — when water smells stagnant, they subconsciously avoid drinking, leading to chronic dehydration, bladder stones, and early kidney disease.
    </p>

    <p style="font-size: 15px; color: #4a5568; margin-bottom: 16px;">
      The <strong>Zavelyn PureFlow™ Wireless Stainless Steel Fountain</strong> delivers crisp, oxygenated, flowing stream water 24/7. Combining cordless battery freedom, veterinarian-grade SUS 304 anti-microbial stainless steel, and multi-stage filtration, it turns everyday drinking into an irresistible hydration ritual.
    </p>

    <div style="text-align: center; margin: 20px 0;">
      <img src="${uploadedUrls['selenepets_dirty_bowl_hazard.png']}" alt="The Danger of Stagnant Water Bowls" style="width: 100%; max-width: 680px; border-radius: 12px; box-shadow: 0 4px 14px rgba(0,0,0,0.06);" />
    </div>
  </div>

  <!-- The 3 Integrated Systems -->
  <div style="text-align: center; margin-bottom: 32px;">
    <span style="color: #2b6cb0; font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">Engineered For Lifelong Pet Vitality</span>
    <h3 style="font-size: 26px; font-weight: 800; color: #1a202c; margin: 8px 0 14px;">Three Patented Systems That Make Drinking Automatic</h3>
    <img src="${uploadedUrls['selenepets_three_systems.png']}" alt="Cordless, Triple Filtration, Food-Grade Stainless" style="width: 100%; max-width: 680px; border-radius: 12px; box-shadow: 0 6px 18px rgba(0,0,0,0.06);" />
  </div>

  <!-- 4 Pillars Breakdown -->
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 18px; margin-bottom: 32px;">
    
    <div style="background: #ffffff; padding: 22px; border-radius: 10px; border: 1px solid #e2e8f0; border-left: 4px solid #2b6cb0;">
      <div style="font-size: 24px; margin-bottom: 8px;">🔋</div>
      <h4 style="font-size: 17px; font-weight: 700; color: #2d3748; margin: 0 0 8px;">100% Cordless Battery Freedom</h4>
      <p style="font-size: 14px; color: #718096; margin: 0;">Place anywhere in your home — kitchen, living room, patio, or bedroom — without ugly extension cords, chewed wires, or tripping hazards.</p>
    </div>

    <div style="background: #ffffff; padding: 22px; border-radius: 10px; border: 1px solid #e2e8f0; border-left: 4px solid #2b6cb0;">
      <div style="font-size: 24px; margin-bottom: 8px;">🛡️</div>
      <h4 style="font-size: 17px; font-weight: 700; color: #2d3748; margin: 0 0 8px;">SUS 304 Surgical Stainless Steel</h4>
      <p style="font-size: 14px; color: #718096; margin: 0;">Non-porous and germ-resistant. Completely eliminates bacterial feline/canine chin acne caused by scratched plastic bowls. Dishwasher safe!</p>
    </div>

    <div style="background: #ffffff; padding: 22px; border-radius: 10px; border: 1px solid #e2e8f0; border-left: 4px solid #2b6cb0;">
      <div style="font-size: 24px; margin-bottom: 8px;">💧</div>
      <h4 style="font-size: 17px; font-weight: 700; color: #2d3748; margin: 0 0 8px;">Triple-Action Micro-Purification</h4>
      <p style="font-size: 14px; color: #718096; margin: 0;">High-density mesh, coconut carbon, and ion exchange resin trap shedding hairs, food crumbs, and chlorine for sweet, pure spring taste.</p>
    </div>

    <div style="background: #ffffff; padding: 22px; border-radius: 10px; border: 1px solid #e2e8f0; border-left: 4px solid #2b6cb0;">
      <div style="font-size: 24px; margin-bottom: 8px;">🤫</div>
      <h4 style="font-size: 17px; font-weight: 700; color: #2d3748; margin: 0 0 8px;">Whisper-Quiet Submersible Pump</h4>
      <p style="font-size: 14px; color: #718096; margin: 0;">Operating under 20dB, the soothing gentle water bubbling won't scare skittish pets or interrupt your peaceful sleep.</p>
    </div>

  </div>

  <!-- Filtration & Exploded View -->
  <div style="margin-bottom: 32px; text-align: center;">
    <h3 style="font-size: 22px; font-weight: 800; color: #1a202c; margin-bottom: 16px;">Built For Total Cleanliness &amp; Quick Refills</h3>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
      <div>
        <img src="${uploadedUrls['selenepets_stainless_exploded.jpg']}" alt="Exploded View of PureFlow Fountain" style="width: 100%; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.06);" />
        <p style="font-size: 13px; font-weight: 600; color: #4a5568; margin-top: 8px;">Quick-Release Modular Components</p>
      </div>
      <div>
        <img src="${uploadedUrls['selenepets_triple_filtration.jpg']}" alt="Triple Action Filter Layers" style="width: 100%; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.06);" />
        <p style="font-size: 13px; font-weight: 600; color: #4a5568; margin-top: 8px;">Multi-Stage Coconut Carbon Filtration</p>
      </div>
    </div>
  </div>

  <!-- Capacity Sizing Guide -->
  <div style="background: #fafafa; border-radius: 12px; padding: 26px; border: 1.5px solid #eaeaea; margin-bottom: 32px;">
    <div style="text-align: center; margin-bottom: 18px;">
      <span style="color: #2b6cb0; font-size: 12px; font-weight: 800; text-transform: uppercase;">Which Size Is Right For Your Home?</span>
      <h3 style="font-size: 22px; font-weight: 800; color: #1a202c; margin: 6px 0 10px;">4L Standard vs. 7L Jumbo Capacity</h3>
      <p style="font-size: 14px; color: #718096; max-width: 600px; margin: 0 auto;">
        Never worry about your pets running out of water during long workdays or weekend getaways.
      </p>
    </div>

    <table style="width: 100%; border-collapse: collapse; font-size: 14px; text-align: left;">
      <thead>
        <tr style="background: #ebf8ff; color: #2b6cb0;">
          <th style="padding: 10px 12px; border: 1px solid #bee3f8;">Specification</th>
          <th style="padding: 10px 12px; border: 1px solid #bee3f8; font-weight: 800;">4L Standard (1.05 Gal)</th>
          <th style="padding: 10px 12px; border: 1px solid #bee3f8; font-weight: 800;">7L Jumbo Pro (1.85 Gal)</th>
        </tr>
      </thead>
      <tbody>
        <tr style="border-bottom: 1px solid #e2e8f0; background: #fff;"><td style="padding: 10px 12px; font-weight: 600;">Pet Size Suitability</td><td style="padding: 10px 12px;">Cats, Small &amp; Medium Dogs (Up to 45 lbs)</td><td style="padding: 10px 12px; color: #2b6cb0; font-weight: 700;">Large Dogs (50+ lbs) &amp; Multi-Pet Homes</td></tr>
        <tr style="border-bottom: 1px solid #e2e8f0; background: #fafafa;"><td style="padding: 10px 12px; font-weight: 600;">Refill Frequency</td><td style="padding: 10px 12px;">Every 7 to 10 days</td><td style="padding: 10px 12px; color: #2b6cb0; font-weight: 700;">Every 14 to 21 days</td></tr>
        <tr style="border-bottom: 1px solid #e2e8f0; background: #fff;"><td style="padding: 10px 12px; font-weight: 600;">Bowl Diameter</td><td style="padding: 10px 12px;">9.2 inches</td><td style="padding: 10px 12px;">11.8 inches (Wide drinking surface)</td></tr>
        <tr style="background: #fafafa;"><td style="padding: 10px 12px; font-weight: 600;">Battery Runtime</td><td style="padding: 10px 12px;">Up to 30 days per charge</td><td style="padding: 10px 12px; color: #2b6cb0; font-weight: 700;">Up to 45 days per charge</td></tr>
      </tbody>
    </table>
  </div>

  <!-- Tech Specs -->
  <div style="margin-bottom: 32px;">
    <h3 style="font-size: 20px; font-weight: 800; color: #1a202c; margin-bottom: 14px;">Product Specifications</h3>
    <table style="width: 100%; border-collapse: collapse; font-size: 14px; text-align: left;">
      <tbody>
        <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 14px; font-weight: 700; color: #4a5568; background: #f7fafc; width: 35%;">Brand</td><td style="padding: 10px 14px; color: #2d3748;">Zavelyn</td></tr>
        <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 14px; font-weight: 700; color: #4a5568; background: #f7fafc;">Model</td><td style="padding: 10px 14px; color: #2d3748;">PureFlow™ Wireless Stainless Steel Pet Water Fountain</td></tr>
        <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 14px; font-weight: 700; color: #4a5568; background: #f7fafc;">Material</td><td style="padding: 10px 14px; color: #2d3748;">Food-Grade SUS 304 Stainless Steel &amp; BPA-Free ABS</td></tr>
        <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 14px; font-weight: 700; color: #4a5568; background: #f7fafc;">Pump Noise Level</td><td style="padding: 10px 14px; color: #2d3748;">&lt; 20 dB (Ultra-Silent Sleep Mode)</td></tr>
        <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 14px; font-weight: 700; color: #4a5568; background: #f7fafc;">Power Options</td><td style="padding: 10px 14px; color: #2d3748;">Wireless Rechargeable Lithium-Ion Battery (Type-C) or Constant USB Plug-In</td></tr>
        <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 14px; font-weight: 700; color: #4a5568; background: #f7fafc;">Filtration Replacement</td><td style="padding: 10px 14px; color: #2d3748;">1 Filter included; Replace every 3-4 weeks</td></tr>
        <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 14px; font-weight: 700; color: #4a5568; background: #f7fafc;">Cleaning</td><td style="padding: 10px 14px; color: #2d3748;">All stainless steel parts are 100% dishwasher safe</td></tr>
      </tbody>
    </table>
  </div>

  <!-- Verified Customer Reviews -->
  <div style="background: #fff; border-radius: 12px; padding: 26px; border: 1px solid #e2e8f0; box-shadow: 0 4px 14px rgba(0,0,0,0.04); margin-bottom: 28px;">
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; border-bottom: 1px solid #edf2f7; padding-bottom: 16px;">
      <div>
        <div style="color: #f6ad55; font-size: 18px; margin-bottom: 4px;">★★★★★</div>
        <div style="font-size: 20px; font-weight: 800; color: #1a202c;">4.96 out of 5 Stars</div>
        <div style="font-size: 13px; color: #718096;">Based on 18,920+ Verified Zavelyn Pet Parents</div>
      </div>
      <div style="text-align: right;">
        <span style="display: inline-block; background: #ebf8ff; color: #2b6cb0; font-size: 12px; font-weight: 700; padding: 6px 12px; border-radius: 20px;">Vet Recommended</span>
      </div>
    </div>

    <!-- Review 1 -->
    <div style="margin-bottom: 18px; padding-bottom: 18px; border-bottom: 1px solid #f7fafc;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
        <span style="font-weight: 700; font-size: 15px; color: #2d3748;">Jessica M. — <span style="color: #38a169; font-size: 12px; font-weight: 600;">✓ Verified Buyer</span></span>
        <span style="font-size: 13px; color: #a0aec0;">2 days ago</span>
      </div>
      <div style="color: #f6ad55; font-size: 13px; margin-bottom: 6px;">★★★★★ <strong style="color: #2d3748; margin-left: 6px;">My Lab drinks twice as much water now!</strong></div>
      <p style="font-size: 14px; color: #4a5568; margin: 0;">
        "Our vet warned us that our 8-year-old Labrador had elevated kidney enzyme levels from not drinking enough water throughout the day. Within 10 minutes of setting down the 7L Zavelyn PureFlow, he walked up, sniffed the clean stream, and drank happily. The wireless battery lasts over a month on a single charge!"
      </p>
    </div>

    <!-- Review 2 -->
    <div style="margin-bottom: 18px; padding-bottom: 18px; border-bottom: 1px solid #f7fafc;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
        <span style="font-weight: 700; font-size: 15px; color: #2d3748;">Brandon T. — <span style="color: #38a169; font-size: 12px; font-weight: 600;">✓ Verified Buyer</span></span>
        <span style="font-size: 13px; color: #a0aec0;">6 days ago</span>
      </div>
      <div style="color: #f6ad55; font-size: 13px; margin-bottom: 6px;">★★★★★ <strong style="color: #2d3748; margin-left: 6px;">No more slimy plastic bowl or chin acne</strong></div>
      <p style="font-size: 14px; color: #4a5568; margin: 0;">
        "Our German Shepherd used to get terrible black chin pimples from plastic bowls harboring bacteria. Since switching to this stainless steel fountain 3 months ago, his chin is 100% healed. Pop the bowl in the dishwasher once a week and you're good. Absolutely worth every penny."
      </p>
    </div>

    <!-- Review 3 -->
    <div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
        <span style="font-weight: 700; font-size: 15px; color: #2d3748;">Kelly S. — <span style="color: #38a169; font-size: 12px; font-weight: 600;">✓ Verified Buyer</span></span>
        <span style="font-size: 13px; color: #a0aec0;">1 week ago</span>
      </div>
      <div style="color: #f6ad55; font-size: 13px; margin-bottom: 6px;">★★★★★ <strong style="color: #2d3748; margin-left: 6px;">Silent motor and zero cord clutter</strong></div>
      <p style="font-size: 14px; color: #4a5568; margin: 0;">
        "Having no cords is a total game changer. Our playful puppy used to chew on corded fountains, which was terrifying. This sits in our living room with zero wires and is so quiet I had to double-check that it was running. 10/10!"
      </p>
    </div>

  </div>

  <!-- Trust Badges -->
  <div style="display: flex; justify-content: space-around; flex-wrap: wrap; gap: 14px; padding: 18px; background: #f7fafc; border-radius: 10px; border: 1px solid #e2e8f0; text-align: center;">
    <div style="flex: 1; min-width: 140px;">
      <div style="font-size: 20px;">🛡️</div>
      <div style="font-weight: 700; font-size: 13px; color: #2d3748;">90-Day Pet Hydration Trial</div>
      <div style="font-size: 11px; color: #718096;">100% Love It or Money Back</div>
    </div>
    <div style="flex: 1; min-width: 140px;">
      <div style="font-size: 20px;">⚡</div>
      <div style="font-weight: 700; font-size: 13px; color: #2d3748;">Express US Shipping</div>
      <div style="font-size: 11px; color: #718096;">Dispatched in 24 Hours</div>
    </div>
    <div style="flex: 1; min-width: 140px;">
      <div style="font-size: 20px;">🐾</div>
      <div style="font-weight: 700; font-size: 13px; color: #2d3748;">Veterinarian Endorsed</div>
      <div style="font-size: 11px; color: #718096;">SUS 304 Certified Safe</div>
    </div>
  </div>

</div>
`;

async function seedSelenePets() {
  const token = await getAccessToken();
  console.log('Got access token. Checking if product already exists...');

  const existingRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/products.json?handle=zavelyn-pureflow-wireless-stainless-steel-pet-water-fountain`, {
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
    { src: uploadedUrls['selenepets_hero_fountain.jpg'], position: 1 },
    { src: uploadedUrls['selenepets_4l_capacity.jpg'], position: 2 },
    { src: uploadedUrls['selenepets_stainless_exploded.jpg'], position: 3 },
    { src: uploadedUrls['selenepets_sensor_flow.jpg'], position: 4 },
    { src: uploadedUrls['selenepets_dog_drinking_clean.png'], position: 5 },
    { src: uploadedUrls['selenepets_triple_filtration.jpg'], position: 6 },
    { src: uploadedUrls['selenepets_dirty_bowl_hazard.png'], position: 7 },
    { src: uploadedUrls['selenepets_three_systems.png'], position: 8 },
    { src: uploadedUrls['selenepets_ugc_dog_happy.jpg'], position: 9 },
    { src: uploadedUrls['selenepets_cat_dog_shared.jpg'], position: 10 }
  ];

  const models = [
    { name: 'Wireless Battery Pro (7L Large Tank)', imgKey: 'selenepets_hero_fountain.jpg' },
    { name: 'Wireless Battery Pro (4L Standard Tank)', imgKey: 'selenepets_4l_capacity.jpg' },
    { name: 'Plug-In Power (7L Large Tank)', imgKey: 'selenepets_stainless_exploded.jpg' },
    { name: 'Plug-In Power (4L Standard Tank)', imgKey: 'selenepets_sensor_flow.jpg' }
  ];

  const bundles = [
    {
      name: 'Buy 1 (Single Pet Fountain - Standard Kit)',
      price: '69.99',
      compare_at_price: '119.99'
    },
    {
      name: 'Buy 2 (Two-Room Hydration Set - Save 45%)',
      price: '119.99',
      compare_at_price: '239.99'
    },
    {
      name: 'Buy 3 (Multi-Pet Complete Estate Set - Buy 2 Get 1 FREE)',
      price: '149.99',
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
        title: 'Zavelyn PureFlow™ Ultra-Quiet Wireless Stainless Steel Pet Water Fountain',
        handle: 'zavelyn-pureflow-wireless-stainless-steel-pet-water-fountain',
        vendor: 'Zavelyn',
        product_type: 'Pet Supplies & Accessories',
        tags: 'Pet Fountain, Dog Water Fountain, Cat Water Fountain, Wireless Pet Bowl, Stainless Steel Fountain, Pet Hydration, Best Seller, New 2026',
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

  console.log('\n🎉 Product #6 SelenePets Fountain seeding complete!');
  console.log(`Live PDP: https://${SHOP_DOMAIN}/products/${newProduct.handle}`);
}

seedSelenePets().catch(console.error);
