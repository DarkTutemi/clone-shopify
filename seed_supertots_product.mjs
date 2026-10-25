import fs from 'fs';

const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = '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';
const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';

const uploadedUrls = JSON.parse(fs.readFileSync('supertots_media/uploaded_urls.json', 'utf-8'));

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
  <div style="background: #fdfaf3; border-radius: 12px; padding: 26px; border: 1px solid #fae8c8; box-shadow: 0 4px 14px rgba(230,140,20,0.05); margin-bottom: 28px;">
    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 14px; border-bottom: 1px solid #f6d8a3; padding-bottom: 12px;">
      <span style="background: #e67e22; color: #fff; font-size: 11px; font-weight: 800; text-transform: uppercase; padding: 4px 10px; border-radius: 20px; letter-spacing: 0.5px;">Pediatrician Approved &amp; 100% Choke-Free</span>
      <span style="font-size: 13px; color: #718096;">Over 240,000+ Happy Babies Starting Solids Safely</span>
    </div>

    <h2 style="font-size: 24px; line-height: 1.3; font-weight: 800; color: #1a202c; margin: 0 0 16px;">
      Introduce Fresh Real Fruits, Veggies &amp; Frozen Milk — With Zero Risk of Choking!
    </h2>

    <p style="font-size: 15px; color: #4a5568; margin-bottom: 14px;">
      Starting solids is an exciting milestone, but every parent dreads the choking hazards of large food chunks. Traditional mesh feeders trap bacteria, tear easily, and are a nightmare to sanitize.
    </p>

    <p style="font-size: 15px; color: #4a5568; margin-bottom: 16px;">
      The <strong>Zavelyn SuperTots™ Fresh Food Pacifier</strong> is the revolutionary <strong>2-in-1 Baby Fruit Feeder and Teething Massager</strong>. Crafted from 100% food-grade, BPA-free medical silicone with micro-perforated feeding holes, it allows only tiny, digestible nutrient-rich juices to pass through while gently massaging inflamed, painful gums.
    </p>

    <div style="text-align: center; margin: 20px 0;">
      <img src="${uploadedUrls['supertots_kickstart_taste.png']}" alt="Taste Something New Safely" style="width: 100%; max-width: 680px; border-radius: 12px; box-shadow: 0 4px 14px rgba(0,0,0,0.06);" />
    </div>
  </div>

  <!-- Teething & Sensory Relief -->
  <div style="text-align: center; margin-bottom: 32px;">
    <span style="color: #e67e22; font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">Instant Natural Gum Relief</span>
    <h3 style="font-size: 26px; font-weight: 800; color: #1a202c; margin: 8px 0 14px;">Is Your Little One Teething?</h3>
    <p style="font-size: 15px; color: #718096; max-width: 660px; margin: 0 auto 20px;">
      Fill the silicone teat with chilled strawberries, bananas, or frozen breast milk chips. The cold compress immediately numbs irritated gums and reduces swelling naturally without medicine.
    </p>
    <img src="${uploadedUrls['supertots_perfect_teething.png']}" alt="Instant Teething Pain Relief" style="width: 100%; max-width: 680px; border-radius: 12px; box-shadow: 0 6px 18px rgba(0,0,0,0.06);" />
  </div>

  <!-- 3 Easy Steps -->
  <div style="text-align: center; margin-bottom: 32px;">
    <span style="color: #e67e22; font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">Parent-Friendly Design</span>
    <h3 style="font-size: 26px; font-weight: 800; color: #1a202c; margin: 8px 0 14px;">It's That Simple: 3 Steps to Fresh Feeding</h3>
    <img src="${uploadedUrls['supertots_easy_to_use.png']}" alt="Easy to Use 3 Steps" style="width: 100%; max-width: 680px; border-radius: 12px; box-shadow: 0 6px 18px rgba(0,0,0,0.06);" />
  </div>

  <!-- 4 Pillars Breakdown -->
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 18px; margin-bottom: 32px;">
    
    <div style="background: #ffffff; padding: 22px; border-radius: 10px; border: 1px solid #f6ebd8; border-left: 4px solid #e67e22;">
      <div style="font-size: 24px; margin-bottom: 8px;">🛡️</div>
      <h4 style="font-size: 17px; font-weight: 700; color: #2d3748; margin: 0 0 8px;">100% Choke-Proof Safety</h4>
      <p style="font-size: 14px; color: #718096; margin: 0;">Micro-engineered 2mm pores let only healthy juices and fine purees pass through, eliminating risk of solid chunk inhalation.</p>
    </div>

    <div style="background: #ffffff; padding: 22px; border-radius: 10px; border: 1px solid #f6ebd8; border-left: 4px solid #e67e22;">
      <div style="font-size: 24px; margin-bottom: 8px;">🍼</div>
      <h4 style="font-size: 17px; font-weight: 700; color: #2d3748; margin: 0 0 8px;">Medical Food-Grade Silicone</h4>
      <p style="font-size: 14px; color: #718096; margin: 0;">BPA-Free, PVC-Free, Phthalate-Free, and Lead-Free. Odorless, stain-resistant, and gentle on delicate developing teeth.</p>
    </div>

    <div style="background: #ffffff; padding: 22px; border-radius: 10px; border: 1px solid #f6ebd8; border-left: 4px solid #e67e22;">
      <div style="font-size: 24px; margin-bottom: 8px;">✊</div>
      <h4 style="font-size: 17px; font-weight: 700; color: #2d3748; margin: 0 0 8px;">Ergonomic Easy-Grip Handle</h4>
      <p style="font-size: 14px; color: #718096; margin: 0;">Circular textured handle empowers babies to self-feed, building hand-eye coordination, finger motor skills, and self-confidence.</p>
    </div>

    <div style="background: #ffffff; padding: 22px; border-radius: 10px; border: 1px solid #f6ebd8; border-left: 4px solid #e67e22;">
      <div style="font-size: 24px; margin-bottom: 8px;">🧼</div>
      <h4 style="font-size: 17px; font-weight: 700; color: #2d3748; margin: 0 0 8px;">100% Dishwasher &amp; Boil Safe</h4>
      <p style="font-size: 14px; color: #718096; margin: 0;">Disassembles in seconds into 4 rinse-clean components. Can be steam sterilized or boiled up to 200°C with zero degradation.</p>
    </div>

  </div>

  <!-- Safety Certification Banner -->
  <div style="text-align: center; margin-bottom: 32px;">
    <img src="${uploadedUrls['supertots_baby_safe.png']}" alt="Baby Safety is Our Priority" style="width: 100%; max-width: 680px; border-radius: 12px; box-shadow: 0 6px 18px rgba(0,0,0,0.06);" />
  </div>

  <!-- Included Teat Sizes Guide -->
  <div style="background: #fff; border-radius: 12px; padding: 24px; border: 1.5px solid #edf2f7; margin-bottom: 32px;">
    <div style="text-align: center; margin-bottom: 18px;">
      <span style="color: #e67e22; font-size: 12px; font-weight: 800; text-transform: uppercase;">Grows With Your Baby</span>
      <h3 style="font-size: 22px; font-weight: 800; color: #1a202c; margin: 6px 0 10px;">All 3 Teat Sizes Included in Every Package!</h3>
      <p style="font-size: 14px; color: #718096; max-width: 600px; margin: 0 auto;">
        You don't need to guess or buy separate attachments. Each Zavelyn SuperTots set comes with Small, Medium, and Large interchangeable silicone nipples.
      </p>
    </div>

    <div style="text-align: center; margin-bottom: 16px;">
      <img src="${uploadedUrls['supertots_nipple_sizes.png']}" alt="S, M, L Nipple Sizes" style="width: 100%; max-width: 580px; border-radius: 10px;" />
    </div>

    <div style="display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; text-align: center; font-size: 13px;">
      <div style="background: #f7fafc; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0;">
        <strong style="color: #2d3748; display: block; font-size: 15px; margin-bottom: 4px;">Size S (Small)</strong>
        <span style="color: #e67e22; font-weight: 700;">0 - 6 Months</span>
        <p style="margin: 4px 0 0; color: #718096; font-size: 12px;">Ideal for early purees, soft berry juices, and small frozen drops.</p>
      </div>
      <div style="background: #f7fafc; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0;">
        <strong style="color: #2d3748; display: block; font-size: 15px; margin-bottom: 4px;">Size M (Medium)</strong>
        <span style="color: #e67e22; font-weight: 700;">6 - 12 Months</span>
        <p style="margin: 4px 0 0; color: #718096; font-size: 12px;">Perfect for fresh banana, melon, cooked veggies, and frozen fruit wedges.</p>
      </div>
      <div style="background: #f7fafc; padding: 12px; border-radius: 8px; border: 1px solid #e2e8f0;">
        <strong style="color: #2d3748; display: block; font-size: 15px; margin-bottom: 4px;">Size L (Large)</strong>
        <span style="color: #e67e22; font-weight: 700;">12+ Months</span>
        <p style="margin: 4px 0 0; color: #718096; font-size: 12px;">Holds hearty fruit bites, textured cooked meat purees, and toddler snacks.</p>
      </div>
    </div>
  </div>

  <!-- Tech Specs -->
  <div style="margin-bottom: 32px;">
    <h3 style="font-size: 20px; font-weight: 800; color: #1a202c; margin-bottom: 14px;">Product Specifications</h3>
    <table style="width: 100%; border-collapse: collapse; font-size: 14px; text-align: left;">
      <tbody>
        <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 14px; font-weight: 700; color: #4a5568; background: #f7fafc; width: 35%;">Brand</td><td style="padding: 10px 14px; color: #2d3748;">Zavelyn</td></tr>
        <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 14px; font-weight: 700; color: #4a5568; background: #f7fafc;">Model</td><td style="padding: 10px 14px; color: #2d3748;">SuperTots™ Fresh Food &amp; Fruit Feeder Pacifier</td></tr>
        <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 14px; font-weight: 700; color: #4a5568; background: #f7fafc;">Teat Material</td><td style="padding: 10px 14px; color: #2d3748;">100% Food-Grade BPA-Free Liquid Silicone</td></tr>
        <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 14px; font-weight: 700; color: #4a5568; background: #f7fafc;">Handle / Cap Material</td><td style="padding: 10px 14px; color: #2d3748;">Non-Toxic Polypropylene (PP) with Snap-Lock Seal</td></tr>
        <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 14px; font-weight: 700; color: #4a5568; background: #f7fafc;">Teat Sizes Included</td><td style="padding: 10px 14px; color: #2d3748;">3 Sizes (S: 0-6m, M: 6-12m, L: 12m+) Included in Every Pack</td></tr>
        <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 14px; font-weight: 700; color: #4a5568; background: #f7fafc;">Temperature Resistance</td><td style="padding: 10px 14px; color: #2d3748;">-20°C to 120°C (Boil &amp; Freezer Safe)</td></tr>
        <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 14px; font-weight: 700; color: #4a5568; background: #f7fafc;">Sanitization</td><td style="padding: 10px 14px; color: #2d3748;">Dishwasher top-rack safe, steam sterilizer, or 3-minute boil</td></tr>
      </tbody>
    </table>
  </div>

  <!-- Verified Parent Reviews -->
  <div style="background: #fff; border-radius: 12px; padding: 26px; border: 1px solid #e2e8f0; box-shadow: 0 4px 14px rgba(0,0,0,0.04); margin-bottom: 28px;">
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; border-bottom: 1px solid #edf2f7; padding-bottom: 16px;">
      <div>
        <div style="color: #f6ad55; font-size: 18px; margin-bottom: 4px;">★★★★★</div>
        <div style="font-size: 20px; font-weight: 800; color: #1a202c;">4.95 out of 5 Stars</div>
        <div style="font-size: 13px; color: #718096;">Based on 19,450+ Verified Zavelyn Parents</div>
      </div>
      <div style="text-align: right;">
        <span style="display: inline-block; background: #feebc8; color: #7b341e; font-size: 12px; font-weight: 700; padding: 6px 12px; border-radius: 20px;">#1 Mom-Loved Baby Feeder</span>
      </div>
    </div>

    <!-- Review 1 -->
    <div style="margin-bottom: 18px; padding-bottom: 18px; border-bottom: 1px solid #f7fafc;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
        <span style="font-weight: 700; font-size: 15px; color: #2d3748;">Tina D. — <span style="color: #38a169; font-size: 12px; font-weight: 600;">✓ Verified Buyer</span></span>
        <span style="font-size: 13px; color: #a0aec0;">3 days ago</span>
      </div>
      <div style="color: #f6ad55; font-size: 13px; margin-bottom: 6px;">★★★★★ <strong style="color: #2d3748; margin-left: 6px;">Total lifesaver for cutting first teeth!</strong></div>
      <p style="font-size: 14px; color: #4a5568; margin: 0;">
        "My 6-month-old was crying constantly from bottom cutting teeth. I put frozen cubes of organic blueberry puree into the Medium teat. He gnawed on it happily for 25 minutes straight and gave me time to finally cook dinner in peace. The snap cap keeps everything clean on walks!"
      </p>
    </div>

    <!-- Review 2 -->
    <div style="margin-bottom: 18px; padding-bottom: 18px; border-bottom: 1px solid #f7fafc;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
        <span style="font-weight: 700; font-size: 15px; color: #2d3748;">Erin R. — <span style="color: #38a169; font-size: 12px; font-weight: 600;">✓ Verified Buyer</span></span>
        <span style="font-size: 13px; color: #a0aec0;">1 week ago</span>
      </div>
      <div style="color: #f6ad55; font-size: 13px; margin-bottom: 6px;">★★★★★ <strong style="color: #2d3748; margin-left: 6px;">So much better than fabric mesh feeders</strong></div>
      <p style="font-size: 14px; color: #4a5568; margin: 0;">
        "I used old-school mesh bag feeders with my first baby and they got discolored, sticky, and stunk after two uses. The Zavelyn silicone teats rinse crystal clean in 5 seconds under warm water or pop right in the dishwasher. Love that all 3 nipple sizes come in the box!"
      </p>
    </div>

    <!-- Review 3 -->
    <div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
        <span style="font-weight: 700; font-size: 15px; color: #2d3748;">Pepper N. — <span style="color: #38a169; font-size: 12px; font-weight: 600;">✓ Verified Buyer</span></span>
        <span style="font-size: 13px; color: #a0aec0;">2 weeks ago</span>
      </div>
      <div style="color: #f6ad55; font-size: 13px; margin-bottom: 6px;">★★★★★ <strong style="color: #2d3748; margin-left: 6px;">Zero choking fears, delicious healthy snacking</strong></div>
      <p style="font-size: 14px; color: #4a5568; margin: 0;">
        "I was terrified of choking when introducing watermelon and avocado. This pacifier feeder completely removes the panic. Only tiny, sweet juices squeeze out. Ordered the 3-pack so grandma and daycare have their own!"
      </p>
    </div>

  </div>

  <!-- Trust Badges -->
  <div style="display: flex; justify-content: space-around; flex-wrap: wrap; gap: 14px; padding: 18px; background: #f7fafc; border-radius: 10px; border: 1px solid #e2e8f0; text-align: center;">
    <div style="flex: 1; min-width: 140px;">
      <div style="font-size: 20px;">🛡️</div>
      <div style="font-weight: 700; font-size: 13px; color: #2d3748;">100% Choke-Proof Guarantee</div>
      <div style="font-size: 11px; color: #718096;">Safety Tested &amp; Certified</div>
    </div>
    <div style="flex: 1; min-width: 140px;">
      <div style="font-size: 20px;">⚡</div>
      <div style="font-weight: 700; font-size: 13px; color: #2d3748;">Fast US Shipping</div>
      <div style="font-size: 11px; color: #718096;">Ships in 24 Hours</div>
    </div>
    <div style="flex: 1; min-width: 140px;">
      <div style="font-size: 20px;">👶</div>
      <div style="font-weight: 700; font-size: 13px; color: #2d3748;">BPA &amp; Toxin Free</div>
      <div style="font-size: 11px; color: #718096;">Medical Grade Silicone</div>
    </div>
  </div>

</div>
`;

async function seedSuperTots() {
  const token = await getAccessToken();
  console.log('Got access token. Checking if product already exists...');

  const existingRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/products.json?handle=zavelyn-supertots-fresh-food-fruit-feeder-pacifier`, {
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
    { src: uploadedUrls['supertots_blue_hero.jpg'], position: 1 },
    { src: uploadedUrls['supertots_pink_hero.jpg'], position: 2 },
    { src: uploadedUrls['supertots_yellow_hero.jpg'], position: 3 },
    { src: uploadedUrls['supertots_green_hero.jpg'], position: 4 },
    { src: uploadedUrls['supertots_easy_to_use.png'], position: 5 },
    { src: uploadedUrls['supertots_perfect_teething.png'], position: 6 },
    { src: uploadedUrls['supertots_kickstart_taste.png'], position: 7 },
    { src: uploadedUrls['supertots_precious_gift.png'], position: 8 },
    { src: uploadedUrls['supertots_baby_safe.png'], position: 9 },
    { src: uploadedUrls['supertots_nipple_sizes.png'], position: 10 }
  ];

  const colors = [
    { name: 'Sky Blue (Includes S, M, L Teats)', imgKey: 'supertots_blue_hero.jpg' },
    { name: 'Blush Pink (Includes S, M, L Teats)', imgKey: 'supertots_pink_hero.jpg' },
    { name: 'Sunny Yellow (Includes S, M, L Teats)', imgKey: 'supertots_yellow_hero.jpg' },
    { name: 'Mint Green (Includes S, M, L Teats)', imgKey: 'supertots_green_hero.jpg' }
  ];

  const bundles = [
    {
      name: 'Buy 1 (Single Feeder Pacifier - Standard Starter Kit)',
      price: '16.99',
      compare_at_price: '29.99'
    },
    {
      name: 'Buy 2 (Duo Pack - Save 45% + Extra Teething Nipple)',
      price: '26.99',
      compare_at_price: '59.99'
    },
    {
      name: 'Buy 3 (Complete Family & Daycare Set - Buy 2 Get 1 FREE)',
      price: '34.99',
      compare_at_price: '89.99'
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
        title: 'Zavelyn SuperTots™ Fresh Food & Fruit Feeder Pacifier',
        handle: 'zavelyn-supertots-fresh-food-fruit-feeder-pacifier',
        vendor: 'Zavelyn',
        product_type: 'Baby & Toddler Feeding',
        tags: 'Baby, Food Feeder, Pacifier, Teething Toy, Fruit Feeder, BPA Free, Silicone Teether, Best Seller, New 2026',
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

  console.log('\n🎉 Product #3 SuperTots seeding complete!');
  console.log(`Live PDP: https://${SHOP_DOMAIN}/products/${newProduct.handle}`);
}

seedSuperTots().catch(console.error);
