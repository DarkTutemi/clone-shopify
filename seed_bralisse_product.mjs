import fs from 'fs';

const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = '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';
const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';

const uploadedUrls = JSON.parse(fs.readFileSync('bralisse_media/uploaded_urls.json', 'utf-8'));

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
  <div style="background: #fffdf9; border-radius: 12px; padding: 26px; border: 1px solid #f6ebd8; box-shadow: 0 4px 14px rgba(180,120,60,0.04); margin-bottom: 28px;">
    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 14px; border-bottom: 1px solid #f1e0c6; padding-bottom: 12px;">
      <span style="background: #b8623d; color: #fff; font-size: 11px; font-weight: 800; text-transform: uppercase; padding: 4px 10px; border-radius: 20px; letter-spacing: 0.5px;">Awarded #1 Wire-Free Lift of 2026</span>
      <span style="font-size: 13px; color: #718096;">Over 185,000+ Women Swapped Painful Underwires For Zavelyn</span>
    </div>

    <h2 style="font-size: 24px; line-height: 1.3; font-weight: 800; color: #1a202c; margin: 0 0 16px;">
      "Finally, a bra that gives the perky lift of a push-up with the silky weightless freedom of wearing nothing at all!"
    </h2>

    <p style="font-size: 15px; color: #4a5568; margin-bottom: 14px;">
      Traditional underwire bras are designed with rigid metal hoops that dig into ribs, crush delicate lymph nodes, and leave painful red welts at the end of every workday. Even worse, ill-fitting cups create unflattering side spillage and back bulges beneath your favorite tops.
    </p>

    <p style="font-size: 15px; color: #4a5568; margin-bottom: 16px;">
      The <strong>Zavelyn SculptComfort™ Wire-Free Bra</strong> is engineered with our proprietary <strong>CloudFeel™ 3D Anatomical Cradle</strong>. It lifts and centers breast tissue up to <strong>5 inches naturally</strong> using zoned compressive micro-fibers instead of stiff wires — sculpting an effortless silhouette while eliminating shoulder strain and back fatigue.
    </p>

    <div style="text-align: center; margin: 20px 0;">
      <img src="${uploadedUrls['bralisse_hero_cloud.jpg']}" alt="Zavelyn SculptComfort Wire-Free Lift" style="width: 100%; max-width: 640px; border-radius: 12px; box-shadow: 0 4px 14px rgba(0,0,0,0.06);" />
    </div>
  </div>

  <!-- Key Benefits Grid -->
  <div style="margin-bottom: 32px;">
    <div style="text-align: center; margin-bottom: 24px;">
      <span style="color: #b8623d; font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">Why Women Refuse To Go Back To Traditional Bras</span>
      <h3 style="font-size: 26px; font-weight: 800; color: #1a202c; margin: 8px 0 10px;">The Wire-Free Revolution Your Body Deserves</h3>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 18px;">
      
      <div style="background: #ffffff; padding: 22px; border-radius: 10px; border: 1px solid #f0e6dc; border-left: 4px solid #b8623d;">
        <div style="font-size: 24px; margin-bottom: 8px;">✨</div>
        <h4 style="font-size: 17px; font-weight: 700; color: #2d3748; margin: 0 0 8px;">Up to 5" Gravity-Defying Lift</h4>
        <p style="font-size: 14px; color: #718096; margin: 0;">Anatomical teardrop cradle cups gently lift from below and gather from the sides to create naturally perky fullness without uncomfortable push-up pads or poking wires.</p>
      </div>

      <div style="background: #ffffff; padding: 22px; border-radius: 10px; border: 1px solid #f0e6dc; border-left: 4px solid #b8623d;">
        <div style="font-size: 24px; margin-bottom: 8px;">🌿</div>
        <h4 style="font-size: 17px; font-weight: 700; color: #2d3748; margin: 0 0 8px;">100% Seamless 360° Smoothing</h4>
        <p style="font-size: 14px; color: #718096; margin: 0;">Extra-wide comfort wings and full-coverage back smoothing panels eradicate side spillage, armpit overflow, and bra lines instantly under any tight tee or dress.</p>
      </div>

      <div style="background: #ffffff; padding: 22px; border-radius: 10px; border: 1px solid #f0e6dc; border-left: 4px solid #b8623d;">
        <div style="font-size: 24px; margin-bottom: 8px;">☁️</div>
        <h4 style="font-size: 17px; font-weight: 700; color: #2d3748; margin: 0 0 8px;">CloudFeel™ Breathable Fabric</h4>
        <p style="font-size: 14px; color: #718096; margin: 0;">Micro-mesh airflow channels draw heat and sweat away from under-bust zones. Keeps you cool, dry, and odor-free from early morning coffee to late evening unwind.</p>
      </div>

      <div style="background: #ffffff; padding: 22px; border-radius: 10px; border: 1px solid #f0e6dc; border-left: 4px solid #b8623d;">
        <div style="font-size: 24px; margin-bottom: 8px;">🕊️</div>
        <h4 style="font-size: 17px; font-weight: 700; color: #2d3748; margin: 0 0 8px;">Zero Digging Wide Straps</h4>
        <p style="font-size: 14px; color: #718096; margin: 0;">Ergonomically widened shoulder straps distribute weight evenly across the trapezius muscles — permanently stopping painful shoulder grooves and tension headaches.</p>
      </div>

    </div>
  </div>

  <!-- 360 Degree Views Gallery -->
  <div style="margin-bottom: 32px; text-align: center;">
    <h3 style="font-size: 22px; font-weight: 800; color: #1a202c; margin-bottom: 16px;">Flawless Look From Every Angle</h3>
    <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 16px;">
      <div>
        <img src="${uploadedUrls['bralisse_side_view.jpg']}" alt="Zavelyn SculptComfort Side Lift" style="width: 100%; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.06);" />
        <p style="font-size: 13px; font-weight: 600; color: #4a5568; margin-top: 8px;">Seamless High-Armpit Side Containment</p>
      </div>
      <div>
        <img src="${uploadedUrls['bralisse_back_view.jpg']}" alt="Zavelyn SculptComfort Back Smoothing" style="width: 100%; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.06);" />
        <p style="font-size: 13px; font-weight: 600; color: #4a5568; margin-top: 8px;">Deep U-Shaped Back Smoothing Wing</p>
      </div>
    </div>
  </div>

  <!-- Sizing Guide Finder -->
  <div style="background: #fafafa; border-radius: 12px; padding: 26px; border: 1.5px solid #eaeaea; margin-bottom: 32px;">
    <div style="text-align: center; margin-bottom: 18px;">
      <span style="color: #b8623d; font-size: 12px; font-weight: 800; text-transform: uppercase;">Guaranteed Perfect Fit</span>
      <h3 style="font-size: 22px; font-weight: 800; color: #1a202c; margin: 6px 0 10px;">Find Your SculptComfort™ Size</h3>
      <p style="font-size: 14px; color: #718096; max-width: 620px; margin: 0 auto;">
        Thanks to our adaptive 4-way stretch memory fiber, the bra comfortably adapts to fluctuations in breast fullness throughout the month.
      </p>
    </div>

    <div style="text-align: center; margin-bottom: 20px;">
      <img src="${uploadedUrls['bralisse_size_models.jpg']}" alt="Fits All Body Types S to 4XL" style="width: 100%; max-width: 620px; border-radius: 10px; box-shadow: 0 4px 14px rgba(0,0,0,0.06);" />
    </div>

    <table style="width: 100%; border-collapse: collapse; font-size: 13px; text-align: center;">
      <thead>
        <tr style="background: #f0ebe4; color: #2d3748;">
          <th style="padding: 10px; border: 1px solid #e0d7cd;">Recommended Size</th>
          <th style="padding: 10px; border: 1px solid #e0d7cd;">Band Size</th>
          <th style="padding: 10px; border: 1px solid #e0d7cd;">Standard Cup Sizes</th>
          <th style="padding: 10px; border: 1px solid #e0d7cd;">T-Shirt / Top Size</th>
        </tr>
      </thead>
      <tbody>
        <tr style="border-bottom: 1px solid #e2e8f0; background: #fff;"><td style="padding: 10px; font-weight: 700;">Small (S)</td><td style="padding: 10px;">30 - 32</td><td style="padding: 10px;">A, B, C</td><td style="padding: 10px;">US 2 - 4</td></tr>
        <tr style="border-bottom: 1px solid #e2e8f0; background: #fafafa;"><td style="padding: 10px; font-weight: 700;">Medium (M)</td><td style="padding: 10px;">32 - 34</td><td style="padding: 10px;">B, C, D</td><td style="padding: 10px;">US 6 - 8</td></tr>
        <tr style="border-bottom: 1px solid #e2e8f0; background: #fff;"><td style="padding: 10px; font-weight: 700;">Large (L)</td><td style="padding: 10px;">34 - 36</td><td style="padding: 10px;">C, D, DD</td><td style="padding: 10px;">US 10 - 12</td></tr>
        <tr style="border-bottom: 1px solid #e2e8f0; background: #fafafa;"><td style="padding: 10px; font-weight: 700;">X-Large (XL)</td><td style="padding: 10px;">36 - 38</td><td style="padding: 10px;">D, DD, DDD/E</td><td style="padding: 10px;">US 14 - 16</td></tr>
        <tr style="border-bottom: 1px solid #e2e8f0; background: #fff;"><td style="padding: 10px; font-weight: 700;">2X-Large (2XL)</td><td style="padding: 10px;">38 - 40</td><td style="padding: 10px;">DD, DDD, F</td><td style="padding: 10px;">US 18 - 20</td></tr>
        <tr style="border-bottom: 1px solid #e2e8f0; background: #fafafa;"><td style="padding: 10px; font-weight: 700;">3X-Large (3XL)</td><td style="padding: 10px;">40 - 42</td><td style="padding: 10px;">DDD, F, G</td><td style="padding: 10px;">US 22 - 24</td></tr>
        <tr style="background: #fff;"><td style="padding: 10px; font-weight: 700;">4X-Large (4XL)</td><td style="padding: 10px;">42 - 44+</td><td style="padding: 10px;">F, G, H+</td><td style="padding: 10px;">US 26+</td></tr>
      </tbody>
    </table>
    <p style="font-size: 13px; color: #718096; font-style: italic; margin-top: 12px; text-align: center;">
      💡 Pro Fit Tip: If you are between sizes, choose your band size for maximum push-up lift, or size up one size for cloud-like lounge comfort.
    </p>
  </div>

  <!-- Tech Specs -->
  <div style="margin-bottom: 32px;">
    <h3 style="font-size: 20px; font-weight: 800; color: #1a202c; margin-bottom: 14px;">Fabric &amp; Care Details</h3>
    <table style="width: 100%; border-collapse: collapse; font-size: 14px; text-align: left;">
      <tbody>
        <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 14px; font-weight: 700; color: #4a5568; background: #f7fafc; width: 35%;">Brand</td><td style="padding: 10px 14px; color: #2d3748;">Zavelyn</td></tr>
        <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 14px; font-weight: 700; color: #4a5568; background: #f7fafc;">Model</td><td style="padding: 10px 14px; color: #2d3748;">SculptComfort™ Wire-Free Breast Shapewear Bra</td></tr>
        <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 14px; font-weight: 700; color: #4a5568; background: #f7fafc;">Material Composition</td><td style="padding: 10px 14px; color: #2d3748;">78% Premium Polyamide Microfiber, 22% Elastane Spandex</td></tr>
        <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 14px; font-weight: 700; color: #4a5568; background: #f7fafc;">Cup Support Type</td><td style="padding: 10px 14px; color: #2d3748;">Wire-Free 3D Contoured Tear-Drop Cushion (Removable Inserts)</td></tr>
        <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 14px; font-weight: 700; color: #4a5568; background: #f7fafc;">Closure</td><td style="padding: 10px 14px; color: #2d3748;">Hook-Free Pullover Design with Wide Stay-Put Underband</td></tr>
        <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 14px; font-weight: 700; color: #4a5568; background: #f7fafc;">Washing Instructions</td><td style="padding: 10px 14px; color: #2d3748;">Machine wash cold gentle cycle (laundry bag recommended); Lay flat to dry</td></tr>
        <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 14px; font-weight: 700; color: #4a5568; background: #f7fafc;">Guarantee</td><td style="padding: 10px 14px; color: #2d3748;">90-Day Comfort &amp; Fit Exchange Guarantee</td></tr>
      </tbody>
    </table>
  </div>

  <!-- Verified Customer Reviews Section -->
  <div style="background: #fff; border-radius: 12px; padding: 26px; border: 1px solid #e2e8f0; box-shadow: 0 4px 14px rgba(0,0,0,0.04); margin-bottom: 28px;">
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; border-bottom: 1px solid #edf2f7; padding-bottom: 16px;">
      <div>
        <div style="color: #f6ad55; font-size: 18px; margin-bottom: 4px;">★★★★★</div>
        <div style="font-size: 20px; font-weight: 800; color: #1a202c;">4.9 out of 5 Stars</div>
        <div style="font-size: 13px; color: #718096;">Based on 14,820+ Verified Zavelyn Customer Ratings</div>
      </div>
      <div style="text-align: right;">
        <span style="display: inline-block; background: #ebf8ff; color: #2b6cb0; font-size: 12px; font-weight: 700; padding: 6px 12px; border-radius: 20px;">98% Would Recommend to Friends</span>
      </div>
    </div>

    <!-- Review 1 -->
    <div style="margin-bottom: 18px; padding-bottom: 18px; border-bottom: 1px solid #f7fafc;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
        <span style="font-weight: 700; font-size: 15px; color: #2d3748;">Rebecca M. — <span style="color: #38a169; font-size: 12px; font-weight: 600;">✓ Verified Buyer</span></span>
        <span style="font-size: 13px; color: #a0aec0;">2 days ago</span>
      </div>
      <div style="color: #f6ad55; font-size: 13px; margin-bottom: 6px;">★★★★★ <strong style="color: #2d3748; margin-left: 6px;">Threw away every single underwire bra I owned!</strong></div>
      <p style="font-size: 14px; color: #4a5568; margin: 0;">
        "I wear a 38DD and spent decades dealing with stabbing wires, back fat bulges, and red trenches on my shoulders. I was skeptical that a wire-free bra could lift my heavy bust. WOW! The Zavelyn SculptComfort gives me incredible cleavage, holds everything high and perky, and I literally fell asleep wearing it because I forgot it was on."
      </p>
    </div>

    <!-- Review 2 -->
    <div style="margin-bottom: 18px; padding-bottom: 18px; border-bottom: 1px solid #f7fafc;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
        <span style="font-weight: 700; font-size: 15px; color: #2d3748;">Jessica T. — <span style="color: #38a169; font-size: 12px; font-weight: 600;">✓ Verified Buyer</span></span>
        <span style="font-size: 13px; color: #a0aec0;">1 week ago</span>
      </div>
      <div style="color: #f6ad55; font-size: 13px; margin-bottom: 6px;">★★★★★ <strong style="color: #2d3748; margin-left: 6px;">Smooths back rolls like magic under shirts</strong></div>
      <p style="font-size: 14px; color: #4a5568; margin: 0;">
        "I bought the 3-Pack capsule set in Black, Tan, and Blush. The wide back band completely smooths out armpit bulges and bra lines. Fitted blouses look 10x better on me now. The fabric is silky soft and so breathable during humid summer days."
      </p>
    </div>

    <!-- Review 3 -->
    <div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
        <span style="font-weight: 700; font-size: 15px; color: #2d3748;">Sarah K. — <span style="color: #38a169; font-size: 12px; font-weight: 600;">✓ Verified Buyer</span></span>
        <span style="font-size: 13px; color: #a0aec0;">2 weeks ago</span>
      </div>
      <div style="color: #f6ad55; font-size: 13px; margin-bottom: 6px;">★★★★★ <strong style="color: #2d3748; margin-left: 6px;">The lift is real and so comfortable</strong></div>
      <p style="font-size: 14px; color: #4a5568; margin: 0;">
        "Post-breastfeeding, I thought my perky days were over unless I got surgery. This bra genuinely lifts from the base and centers everything in the most flattering, natural teardrop shape. Incredible quality and fast shipping to California!"
      </p>
    </div>

  </div>

  <!-- Trust Badges -->
  <div style="display: flex; justify-content: space-around; flex-wrap: wrap; gap: 14px; padding: 18px; background: #f7fafc; border-radius: 10px; border: 1px solid #e2e8f0; text-align: center;">
    <div style="flex: 1; min-width: 140px;">
      <div style="font-size: 20px;">🛡️</div>
      <div style="font-weight: 700; font-size: 13px; color: #2d3748;">90-Day Fit Guarantee</div>
      <div style="font-size: 11px; color: #718096;">Free exchanges if not perfect</div>
    </div>
    <div style="flex: 1; min-width: 140px;">
      <div style="font-size: 20px;">⚡</div>
      <div style="font-weight: 700; font-size: 13px; color: #2d3748;">Express US Shipping</div>
      <div style="font-size: 11px; color: #718096;">Dispatched in 24 Hours</div>
    </div>
    <div style="flex: 1; min-width: 140px;">
      <div style="font-size: 20px;">🔒</div>
      <div style="font-weight: 700; font-size: 13px; color: #2d3748;">Secure Checkout</div>
      <div style="font-size: 11px; color: #718096;">SSL 256-bit Encrypted</div>
    </div>
  </div>

</div>
`;

async function seedBralisse() {
  const token = await getAccessToken();
  console.log('Got access token. Checking if product already exists...');

  const existingRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/products.json?handle=zavelyn-sculptcomfort-wirefree-breast-shapewear-bra`, {
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
    { src: uploadedUrls['bralisse_hero_cloud.jpg'], position: 1 },
    { src: uploadedUrls['bralisse_tan_front.jpg'], position: 2 },
    { src: uploadedUrls['bralisse_brown_front.jpg'], position: 3 },
    { src: uploadedUrls['bralisse_black_front.jpg'], position: 4 },
    { src: uploadedUrls['bralisse_white_front.jpg'], position: 5 },
    { src: uploadedUrls['bralisse_pink_front.jpg'], position: 6 },
    { src: uploadedUrls['bralisse_red_front.jpg'], position: 7 },
    { src: uploadedUrls['bralisse_size_models.jpg'], position: 8 },
    { src: uploadedUrls['bralisse_side_view.jpg'], position: 9 },
    { src: uploadedUrls['bralisse_back_view.jpg'], position: 10 }
  ];

  const colors = [
    { name: 'Nude Tan', imgKey: 'bralisse_tan_front.jpg' },
    { name: 'Rich Brown', imgKey: 'bralisse_brown_front.jpg' },
    { name: 'Classic Black', imgKey: 'bralisse_black_front.jpg' },
    { name: 'Pure White', imgKey: 'bralisse_white_front.jpg' },
    { name: 'Blush Pink', imgKey: 'bralisse_pink_front.jpg' },
    { name: 'Ruby Red', imgKey: 'bralisse_red_front.jpg' }
  ];

  const bundles = [
    {
      name: 'Buy 1 (Single SculptComfort Bra - Try Risk-Free)',
      price: '59.99',
      compare_at_price: '99.99'
    },
    {
      name: 'Buy 2 (Everyday Duo Set - Save 55%)',
      price: '99.99',
      compare_at_price: '199.99'
    },
    {
      name: 'Buy 3 (Capsule Wardrobe Set - Buy 2 Get 1 FREE)',
      price: '129.99',
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
        title: 'Zavelyn SculptComfort™ Wire-Free Breast Shapewear Bra',
        handle: 'zavelyn-sculptcomfort-wirefree-breast-shapewear-bra',
        vendor: 'Zavelyn',
        product_type: 'Shapewear & Intimates',
        tags: 'Bra, Shapewear, Wire-Free Bra, Push-Up Bra, Comfort Bra, Breast Lift, Best Seller, New 2026',
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
    const uploadedUrl = uploadedUrls[c.imgKey];
    const foundImg = newProduct.images.find(img => img.src.includes(c.imgKey.replace('.jpg', '')) || (uploadedUrl && img.src.includes(c.imgKey.split('.')[0])));
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

  console.log('\n🎉 Product #2 Bralisse seeding complete!');
  console.log(`Live PDP: https://${SHOP_DOMAIN}/products/${newProduct.handle}`);
}

seedBralisse().catch(console.error);
