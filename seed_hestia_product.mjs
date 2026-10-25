import fs from 'fs';

const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = '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';
const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';

const uploadedUrls = JSON.parse(fs.readFileSync('hestia_media/uploaded_urls.json', 'utf-8'));

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
  <div style="background: #fffdfb; border-radius: 12px; padding: 26px; border: 1px solid #f6ebe4; box-shadow: 0 4px 14px rgba(210,130,110,0.05); margin-bottom: 28px;">
    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 14px; border-bottom: 1px solid #f1ded5; padding-bottom: 12px;">
      <span style="background: #c26d53; color: #fff; font-size: 11px; font-weight: 800; text-transform: uppercase; padding: 4px 10px; border-radius: 20px; letter-spacing: 0.5px;">Awarded #1 Anti-Aging Foundation Stick of 2026</span>
      <span style="font-size: 13px; color: #718096;">Over 195,000+ Women Tossed Their Heavy Liquid Foundations</span>
    </div>

    <h2 style="font-size: 24px; line-height: 1.3; font-weight: 800; color: #1a202c; margin: 0 0 16px;">
      The Foundation That Finds You — Adapts in 60 Seconds to Your Exact Skin Tone With Zero Oxidation!
    </h2>

    <p style="font-size: 15px; color: #4a5568; margin-bottom: 14px;">
      How many foundation bottles have you thrown away because the shade looked great in store lighting, but turned chalky, ghostly, or orange as soon as you stepped outside?
    </p>

    <p style="font-size: 15px; color: #4a5568; margin-bottom: 16px;">
      The <strong>Zavelyn FlawlessBlend™ Self-Adjusting Foundation Stick</strong> eliminates shade matching forever. It glides on as a silky white cream, and as you blend, patented Korean <strong>ChromAdapt™ Micro-Pigment Spheres</strong> burst open to read your unique skin temperature and undertone — flawlessly adapting in under 60 seconds into your custom second-skin match.
    </p>

    <div style="text-align: center; margin: 20px 0;">
      <img src="${uploadedUrls['hestia_swipe_blend.jpg']}" alt="Swipe, Blend, and Reveal Flawless Skin" style="width: 100%; max-width: 680px; border-radius: 12px; box-shadow: 0 4px 14px rgba(0,0,0,0.06);" />
    </div>
  </div>

  <!-- Built-In Luxury Brush & Clean Application -->
  <div style="text-align: center; margin-bottom: 32px;">
    <span style="color: #c26d53; font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">All-In-One Dual-Ended Wand</span>
    <h3 style="font-size: 26px; font-weight: 800; color: #1a202c; margin: 8px 0 14px;">Built-In High-Density Kabuki Blending Brush</h3>
    <p style="font-size: 15px; color: #718096; max-width: 660px; margin: 0 auto 20px;">
      No messy beauty sponges, no dirty finger blending, no carrying extra tools. The ultra-soft angled synthetic bristles buff the formula seamlessly into every curve and crease for an airbrushed finish anywhere.
    </p>
    <img src="${uploadedUrls['hestia_shade_adaptation.jpg']}" alt="60-Second Instant Shade Adaptation" style="width: 100%; max-width: 680px; border-radius: 12px; box-shadow: 0 6px 18px rgba(0,0,0,0.06);" />
  </div>

  <!-- Skincare-First Formula Pillars -->
  <div style="margin-bottom: 32px;">
    <div style="text-align: center; margin-bottom: 24px;">
      <span style="color: #c26d53; font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">Korean Skincare Meets Clinical Makeup</span>
      <h3 style="font-size: 26px; font-weight: 800; color: #1a202c; margin: 8px 0 10px;">More Than Makeup: Active Skin Treatment</h3>
    </div>

    <div style="text-align: center; margin-bottom: 20px;">
      <img src="${uploadedUrls['hestia_korean_ingredients.jpg']}" alt="Collagen, Niacinamide, Peptides, Sea Buckthorn" style="width: 100%; max-width: 680px; border-radius: 12px; box-shadow: 0 4px 14px rgba(0,0,0,0.06);" />
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 18px;">
      
      <div style="background: #ffffff; padding: 22px; border-radius: 10px; border: 1px solid #f6ebd8; border-left: 4px solid #c26d53;">
        <div style="font-size: 24px; margin-bottom: 8px;">💧</div>
        <h4 style="font-size: 17px; font-weight: 700; color: #2d3748; margin: 0 0 8px;">Hydrolyzed Marine Collagen</h4>
        <p style="font-size: 14px; color: #718096; margin: 0;">Plumps sunken dehydration lines and locks in dewiness, giving mature skin a bouncy, youthful vitality that lasts 16+ hours.</p>
      </div>

      <div style="background: #ffffff; padding: 22px; border-radius: 10px; border: 1px solid #f6ebd8; border-left: 4px solid #c26d53;">
        <div style="font-size: 24px; margin-bottom: 8px;">✨</div>
        <h4 style="font-size: 17px; font-weight: 700; color: #2d3748; margin: 0 0 8px;">Niacinamide (Vitamin B3)</h4>
        <p style="font-size: 14px; color: #718096; margin: 0;">Visibly diminishes dark sun spots, age spots, and redness while refining enlarged pores over time with continuous daily wear.</p>
      </div>

      <div style="background: #ffffff; padding: 22px; border-radius: 10px; border: 1px solid #f6ebd8; border-left: 4px solid #c26d53;">
        <div style="font-size: 24px; margin-bottom: 8px;">🌿</div>
        <h4 style="font-size: 17px; font-weight: 700; color: #2d3748; margin: 0 0 8px;">Volufiline &amp; Peptides</h4>
        <p style="font-size: 14px; color: #718096; margin: 0;">Clinically studied botanical lipo-filler that stimulates adipocyte volume to gently fill crow's feet and smile lines without botox.</p>
      </div>

      <div style="background: #ffffff; padding: 22px; border-radius: 10px; border: 1px solid #f6ebd8; border-left: 4px solid #c26d53;">
        <div style="font-size: 24px; margin-bottom: 8px;">🫐</div>
        <h4 style="font-size: 17px; font-weight: 700; color: #2d3748; margin: 0 0 8px;">Sea Buckthorn &amp; Blueberry</h4>
        <p style="font-size: 14px; color: #718096; margin: 0;">Rich in Vitamins C &amp; E, these super-antioxidants shield your skin from blue light and environmental pollution oxidation.</p>
      </div>

    </div>
  </div>

  <!-- Real Before and After Results -->
  <div style="margin-bottom: 32px; text-align: center;">
    <h3 style="font-size: 22px; font-weight: 800; color: #1a202c; margin-bottom: 16px;">Real Transformations: Never Settles Into Wrinkles</h3>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px;">
      <div>
        <img src="${uploadedUrls['hestia_before_after_light.jpg']}" alt="Light Complexion Before and After" style="width: 100%; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.06);" />
        <p style="font-size: 13px; font-weight: 600; color: #4a5568; margin-top: 8px;">Fair/Light: Erases Rosacea &amp; Broken Capillaries</p>
      </div>
      <div>
        <img src="${uploadedUrls['hestia_before_after_mature.jpg']}" alt="Mature Skin Wrinkle Coverage" style="width: 100%; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.06);" />
        <p style="font-size: 13px; font-weight: 600; color: #4a5568; margin-top: 8px;">Mature Skin: Smooths Crows Feet &amp; Texture</p>
      </div>
      <div>
        <img src="${uploadedUrls['hestia_before_after_medium.jpg']}" alt="Medium Olive Complexion" style="width: 100%; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.06);" />
        <p style="font-size: 13px; font-weight: 600; color: #4a5568; margin-top: 8px;">Medium/Golden: Blurs Melasma &amp; Sun Damage</p>
      </div>
    </div>
  </div>

  <!-- Shade Guide -->
  <div style="background: #faf8f5; border-radius: 12px; padding: 26px; border: 1.5px solid #eae5dc; margin-bottom: 32px;">
    <div style="text-align: center; margin-bottom: 18px;">
      <span style="color: #c26d53; font-size: 12px; font-weight: 800; text-transform: uppercase;">Guaranteed Color Match</span>
      <h3 style="font-size: 22px; font-weight: 800; color: #1a202c; margin: 6px 0 10px;">Select Your Adaptive Tone Base</h3>
      <p style="font-size: 14px; color: #718096; max-width: 600px; margin: 0 auto;">
        Because each stick automatically micro-adapts up to 3 shades up or down, selecting your shade is foolproof!
      </p>
    </div>

    <div style="text-align: center; margin-bottom: 16px;">
      <img src="${uploadedUrls['hestia_lineup_trio.jpg']}" alt="Shade Range Lineup" style="width: 100%; max-width: 580px; border-radius: 10px;" />
    </div>

    <table style="width: 100%; border-collapse: collapse; font-size: 13px; text-align: left;">
      <thead>
        <tr style="background: #f1ede6; color: #2d3748;">
          <th style="padding: 10px; border: 1px solid #e0d7cd;">Shade</th>
          <th style="padding: 10px; border: 1px solid #e0d7cd;">Best For</th>
          <th style="padding: 10px; border: 1px solid #e0d7cd;">Undertones</th>
        </tr>
      </thead>
      <tbody>
        <tr style="border-bottom: 1px solid #e2e8f0; background: #fff;"><td style="padding: 10px; font-weight: 700;">#201 Light Ivory</td><td style="padding: 10px;">Fair, Porcelain, Light Ivory complexions that burn easily in sun</td><td style="padding: 10px;">Cool pink, neutral peach</td></tr>
        <tr style="border-bottom: 1px solid #e2e8f0; background: #fafafa;"><td style="padding: 10px; font-weight: 700;">#202 Natural Radiance (★ Safest Choice)</td><td style="padding: 10px;">Light-medium, beige, neutral, and light olive skin (fits 75% of women)</td><td style="padding: 10px;">Neutral beige, golden sand</td></tr>
        <tr style="background: #fff;"><td style="padding: 10px; font-weight: 700;">#203 Warm Medium</td><td style="padding: 10px;">Medium, honey tan, deep olive, and sun-kissed golden complexions</td><td style="padding: 10px;">Warm honey, rich caramel</td></tr>
      </tbody>
    </table>
  </div>

  <!-- Tech Specs -->
  <div style="margin-bottom: 32px;">
    <h3 style="font-size: 20px; font-weight: 800; color: #1a202c; margin-bottom: 14px;">Product Specifications</h3>
    <table style="width: 100%; border-collapse: collapse; font-size: 14px; text-align: left;">
      <tbody>
        <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 14px; font-weight: 700; color: #4a5568; background: #f7fafc; width: 35%;">Brand</td><td style="padding: 10px 14px; color: #2d3748;">Zavelyn</td></tr>
        <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 14px; font-weight: 700; color: #4a5568; background: #f7fafc;">Model</td><td style="padding: 10px 14px; color: #2d3748;">FlawlessBlend™ Self-Adjusting Foundation Stick</td></tr>
        <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 14px; font-weight: 700; color: #4a5568; background: #f7fafc;">Coverage &amp; Finish</td><td style="padding: 10px 14px; color: #2d3748;">Buildable Medium-to-Full with a Natural Satin Glow</td></tr>
        <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 14px; font-weight: 700; color: #4a5568; background: #f7fafc;">Key Actives</td><td style="padding: 10px 14px; color: #2d3748;">Hydrolyzed Collagen, Niacinamide, Volufiline, Peptides, Sea Buckthorn</td></tr>
        <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 14px; font-weight: 700; color: #4a5568; background: #f7fafc;">Skin Types</td><td style="padding: 10px 14px; color: #2d3748;">Formulated specifically for mature, sensitive, and dry/combination skin</td></tr>
        <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 14px; font-weight: 700; color: #4a5568; background: #f7fafc;">Free From</td><td style="padding: 10px 14px; color: #2d3748;">Parabens, Sulfates, Mineral Oils, Fragrance; 100% Cruelty-Free</td></tr>
        <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 14px; font-weight: 700; color: #4a5568; background: #f7fafc;">Weight</td><td style="padding: 10px 14px; color: #2d3748;">12g (0.42 oz) — Lasts 3-4 months of daily wear</td></tr>
      </tbody>
    </table>
  </div>

  <!-- Verified Customer Reviews -->
  <div style="background: #fff; border-radius: 12px; padding: 26px; border: 1px solid #e2e8f0; box-shadow: 0 4px 14px rgba(0,0,0,0.04); margin-bottom: 28px;">
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; border-bottom: 1px solid #edf2f7; padding-bottom: 16px;">
      <div>
        <div style="color: #f6ad55; font-size: 18px; margin-bottom: 4px;">★★★★★</div>
        <div style="font-size: 20px; font-weight: 800; color: #1a202c;">4.94 out of 5 Stars</div>
        <div style="font-size: 13px; color: #718096;">Based on 21,780+ Verified Zavelyn Customer Ratings</div>
      </div>
      <div style="text-align: right;">
        <span style="display: inline-block; background: #feebc8; color: #7b341e; font-size: 12px; font-weight: 700; padding: 6px 12px; border-radius: 20px;">98% Match Guarantee</span>
      </div>
    </div>

    <!-- Review 1 -->
    <div style="margin-bottom: 18px; padding-bottom: 18px; border-bottom: 1px solid #f7fafc;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
        <span style="font-weight: 700; font-size: 15px; color: #2d3748;">Mary K., 54 — <span style="color: #38a169; font-size: 12px; font-weight: 600;">✓ Verified Buyer</span></span>
        <span style="font-size: 13px; color: #a0aec0;">2 days ago</span>
      </div>
      <div style="color: #f6ad55; font-size: 13px; margin-bottom: 6px;">★★★★★ <strong style="color: #2d3748; margin-left: 6px;">Doesn't settle into my wrinkles or laugh lines!</strong></div>
      <p style="font-size: 14px; color: #4a5568; margin: 0;">
        "Every foundation I tried over the last 10 years settled into my marionette lines and made me look 10 years older. Zavelyn FlawlessBlend glides on like a dream. The built-in brush blends it out in 30 seconds, and it adapts to my exact skin color without looking like a mask. My skin looks plump, dewy, and fresh all day!"
      </p>
    </div>

    <!-- Review 2 -->
    <div style="margin-bottom: 18px; padding-bottom: 18px; border-bottom: 1px solid #f7fafc;">
      <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
        <span style="font-weight: 700; font-size: 15px; color: #2d3748;">Patricia B., 48 — <span style="color: #38a169; font-size: 12px; font-weight: 600;">✓ Verified Buyer</span></span>
        <span style="font-size: 13px; color: #a0aec0;">1 week ago</span>
      </div>
      <div style="color: #f6ad55; font-size: 13px; margin-bottom: 6px;">★★★★★ <strong style="color: #2d3748; margin-left: 6px;">Magic in a stick! The color match is unreal</strong></div>
      <p style="font-size: 14px; color: #4a5568; margin: 0;">
        "I was totally skeptical about the white-to-shade claim. I swiped it on my cheek and started buffing with the attached brush. Within 45 seconds, the white completely disappeared and merged seamlessly with my natural golden undertone. It covers age spots effortlessly. Already ordered the 3-pack!"
      </p>
    </div>

    <!-- Review 3 -->
    <div>
      <div style="display: flex; justify-content: space-between; margin-bottom: 4px;">
        <span style="font-weight: 700; font-size: 15px; color: #2d3748;">Susan T., 62 — <span style="color: #38a169; font-size: 12px; font-weight: 600;">✓ Verified Buyer</span></span>
        <span style="font-size: 13px; color: #a0aec0;">2 weeks ago</span>
      </div>
      <div style="color: #f6ad55; font-size: 13px; margin-bottom: 6px;">★★★★★ <strong style="color: #2d3748; margin-left: 6px;">Replaced primer, concealer, and powder</strong></div>
      <p style="font-size: 14px; color: #4a5568; margin: 0;">
        "My morning routine went from 20 minutes down to 3 minutes. Swipe on forehead, cheeks, chin, blend with the brush, and I'm out the door. The collagen and niacinamide keep my skin feeling moisturized in dry office AC all day. Highly recommend!"
      </p>
    </div>

  </div>

  <!-- Trust Badges -->
  <div style="display: flex; justify-content: space-around; flex-wrap: wrap; gap: 14px; padding: 18px; background: #f7fafc; border-radius: 10px; border: 1px solid #e2e8f0; text-align: center;">
    <div style="flex: 1; min-width: 140px;">
      <div style="font-size: 20px;">🛡️</div>
      <div style="font-weight: 700; font-size: 13px; color: #2d3748;">60-Day Shade Guarantee</div>
      <div style="font-size: 11px; color: #718096;">Free Exchanges if Not Perfect</div>
    </div>
    <div style="flex: 1; min-width: 140px;">
      <div style="font-size: 20px;">⚡</div>
      <div style="font-weight: 700; font-size: 13px; color: #2d3748;">Express US Shipping</div>
      <div style="font-size: 11px; color: #718096;">Ships in 24 Hours</div>
    </div>
    <div style="flex: 1; min-width: 140px;">
      <div style="font-size: 20px;">🐰</div>
      <div style="font-weight: 700; font-size: 13px; color: #2d3748;">100% Cruelty-Free</div>
      <div style="font-size: 11px; color: #718096;">Dermatologist Approved</div>
    </div>
  </div>

</div>
`;

async function seedHestia() {
  const token = await getAccessToken();
  console.log('Got access token. Checking if product already exists...');

  const existingRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/products.json?handle=zavelyn-flawlessblend-color-changing-foundation-stick`, {
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
    { src: uploadedUrls['hestia_hero_brush.jpg'], position: 1 },
    { src: uploadedUrls['hestia_swipe_blend.jpg'], position: 2 },
    { src: uploadedUrls['hestia_korean_ingredients.jpg'], position: 3 },
    { src: uploadedUrls['hestia_shade_adaptation.jpg'], position: 4 },
    { src: uploadedUrls['hestia_lineup_trio.jpg'], position: 5 },
    { src: uploadedUrls['hestia_before_after_light.jpg'], position: 6 },
    { src: uploadedUrls['hestia_before_after_medium.jpg'], position: 7 },
    { src: uploadedUrls['hestia_before_after_mature.jpg'], position: 8 },
    { src: uploadedUrls['hestia_wrinkle_coverage.jpg'], position: 9 },
    { src: uploadedUrls['hestia_customer_spotlight.jpg'], position: 10 }
  ];

  const tones = [
    { name: '#201 Light Ivory (Fair to Light)', imgKey: 'hestia_before_after_light.jpg' },
    { name: '#202 Natural Radiance (Most Popular)', imgKey: 'hestia_hero_brush.jpg' },
    { name: '#203 Warm Medium (Golden to Tan)', imgKey: 'hestia_before_after_medium.jpg' }
  ];

  const bundles = [
    {
      name: 'Buy 1 (Single Foundation Stick - Try Risk-Free)',
      price: '39.99',
      compare_at_price: '69.99'
    },
    {
      name: 'Buy 2 (Duo Everyday Set - Save 45%)',
      price: '59.99',
      compare_at_price: '139.99'
    },
    {
      name: 'Buy 3 (Capsule Beauty Trio - Buy 2 Get 1 FREE)',
      price: '79.99',
      compare_at_price: '209.99'
    }
  ];

  const variants = [];
  for (const b of bundles) {
    for (const t of tones) {
      variants.push({
        option1: b.name,
        option2: t.name,
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
        title: 'Zavelyn FlawlessBlend™ Self-Adjusting Color-Changing Foundation Stick',
        handle: 'zavelyn-flawlessblend-color-changing-foundation-stick',
        vendor: 'Zavelyn',
        product_type: 'Beauty & Cosmetics',
        tags: 'Foundation, Color Changing Foundation, Skincare Makeup, Foundation Stick, Mature Skin, Anti-Aging, Korean Beauty, Best Seller, New 2026',
        body_html: bodyHtml,
        options: [
          { name: 'Bundle' },
          { name: 'Tone' }
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

  // Link variant image_ids by tone
  console.log('Mapping variant images to respective tone photos...');
  const toneImgMap = {};
  for (const t of tones) {
    const foundImg = newProduct.images.find(img => img.src.includes(t.imgKey.split('.')[0]));
    if (foundImg) {
      toneImgMap[t.name] = foundImg.id;
    }
  }
  console.log('Tone image map:', toneImgMap);

  for (const v of newProduct.variants) {
    const targetImgId = toneImgMap[v.option2];
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

  console.log('\n🎉 Product #5 Hestia Foundation seeding complete!');
  console.log(`Live PDP: https://${SHOP_DOMAIN}/products/${newProduct.handle}`);
}

seedHestia().catch(console.error);
