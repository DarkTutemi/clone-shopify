import fs from 'fs';

const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = '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';
const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';

const uploadedUrls = JSON.parse(fs.readFileSync('joylux_media/uploaded_urls.json', 'utf-8'));

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
  <div style="background: #fffafa; border-radius: 12px; padding: 26px; border: 1px solid #fce8e6; box-shadow: 0 4px 14px rgba(165,0,52,0.04); margin-bottom: 28px;">
    <div style="display: flex; align-items: center; gap: 10px; margin-bottom: 14px; border-bottom: 1px solid #fae1de; padding-bottom: 12px;">
      <span style="background: #a50034; color: #fff; font-size: 11px; font-weight: 800; text-transform: uppercase; padding: 4px 10px; border-radius: 20px; letter-spacing: 0.5px;">Clinically Validated &amp; Doctor Recommended</span>
      <span style="font-size: 13px; color: #718096;">Endorsed by Over 1,000+ OB-GYNs &amp; Women's Health Specialists</span>
    </div>

    <h2 style="font-size: 24px; line-height: 1.3; font-weight: 800; color: #1a202c; margin: 0 0 16px;">
      "My husband and I noticed a huge difference in tightness, natural lubrication, and sensation — all within 3 weeks!"
    </h2>

    <p style="font-size: 15px; color: #4a5568; margin-bottom: 14px;">
      Millions of women silently experience the frustrating changes of hormonal shifts, childbirth, and menopause: dryness, loss of elasticity, bladder leakage when laughing or sneezing, and diminishing intimate sensation. For years, the only answers were messy hormonal creams or invasive clinical procedures.
    </p>

    <p style="font-size: 15px; color: #4a5568; margin-bottom: 16px;">
      The <strong>Zavelyn vFit™</strong> is the groundbreaking at-home intimate wellness solution. Combining therapeutic red light phototherapy, gentle soothing thermal energy, and sonic pelvic floor stimulation, it restores tissue vitality, strengthens the pelvic floor sling, and revives natural confidence.
    </p>

    <div style="text-align: center; margin: 20px 0;">
      <img src="${uploadedUrls['joylux_clinical_diagram.png']}" alt="Clinically Proven Lasting Results" style="width: 100%; max-width: 580px; border-radius: 12px; box-shadow: 0 4px 14px rgba(0,0,0,0.06);" />
    </div>
  </div>

  <!-- 3-in-1 Patented Triple Action Technology -->
  <div style="text-align: center; margin-bottom: 32px;">
    <span style="color: #a50034; font-size: 13px; font-weight: 800; text-transform: uppercase; letter-spacing: 1px;">Patented Multi-Energy Synergy</span>
    <h3 style="font-size: 26px; font-weight: 800; color: #1a202c; margin: 8px 0 14px;">How the Zavelyn vFit™ Triple Action Works</h3>
    <p style="font-size: 15px; color: #718096; max-width: 660px; margin: 0 auto 22px;">
      Just 10 to 12 minutes every other day in the comfort and privacy of your home delivers cumulative, noticeable transformation.
    </p>
    <img src="${uploadedUrls['joylux_triple_tech.png']}" alt="3-in-1 Red Light, Thermal Energy, Sonic Vibrations" style="width: 100%; border-radius: 12px; box-shadow: 0 6px 18px rgba(0,0,0,0.06);" />
  </div>

  <!-- The 3 Pillars Breakdown -->
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 20px; margin-bottom: 32px;">
    
    <div style="background: #ffffff; padding: 22px; border-radius: 10px; border: 1px solid #fed7d7; border-left: 4px solid #a50034;">
      <div style="font-size: 24px; margin-bottom: 8px;">🔴</div>
      <h4 style="font-size: 17px; font-weight: 700; color: #2d3748; margin: 0 0 8px;">1. Medical-Grade Red Light Phototherapy</h4>
      <p style="font-size: 14px; color: #718096; margin: 0;">Specialized 662nm red LEDs penetrate deep into intimate tissues to stimulate cellular ATP production, stimulate natural collagen synthesis, and restore mucosal elasticity.</p>
    </div>

    <div style="background: #ffffff; padding: 22px; border-radius: 10px; border: 1px solid #fed7d7; border-left: 4px solid #a50034;">
      <div style="font-size: 24px; margin-bottom: 8px;">🔥</div>
      <h4 style="font-size: 17px; font-weight: 700; color: #2d3748; margin: 0 0 8px;">2. Gentle Therapeutic Thermal Energy</h4>
      <p style="font-size: 14px; color: #718096; margin: 0;">Calibrated soothing micro-warmth increases microcirculation and local blood flow, replenishing essential oxygen and nutrients to revive natural lubrication and comfort.</p>
    </div>

    <div style="background: #ffffff; padding: 22px; border-radius: 10px; border: 1px solid #fed7d7; border-left: 4px solid #a50034;">
      <div style="font-size: 24px; margin-bottom: 8px;">⚡</div>
      <h4 style="font-size: 17px; font-weight: 700; color: #2d3748; margin: 0 0 8px;">3. Multi-Mode Sonic Vibrations</h4>
      <p style="font-size: 14px; color: #718096; margin: 0;">6 distinct ultrasonic pulsation modes gently contract and tone pelvic floor muscles, reinforcing bladder control support and heightened sensory responsiveness.</p>
    </div>

  </div>

  <!-- Companion App & Tracking -->
  <div style="display: flex; flex-direction: column; md-flex-direction: row; gap: 24px; align-items: center; background: #faf8f5; padding: 26px; border-radius: 12px; border: 1.5px solid #eae5dc; margin-bottom: 32px;">
    <div style="flex: 1;">
      <span style="color: #8a2c13; font-size: 12px; font-weight: 800; text-transform: uppercase;">Smart Wellness Companion</span>
      <h4 style="font-size: 20px; font-weight: 800; color: #2d3748; margin: 6px 0 10px;">Guided Sessions &amp; Personal Health Tracker</h4>
      <p style="font-size: 14px; color: #4a5568; line-height: 1.5; margin-bottom: 14px;">
        Use the free Zavelyn Companion App to track your session progress, set custom treatment reminders, access pelvic health exercises, and log your personal improvements over time.
      </p>
      <div style="display: flex; flex-direction: column; gap: 6px; font-size: 13px; font-weight: 600; color: #2d3748;">
        <span>✓ Calendar alerts &amp; gentle routine reminders</span>
        <span>✓ Step-by-step guided relaxation &amp; session timers</span>
        <span>✓ 100% private, encrypted personal progress reports</span>
      </div>
    </div>
    <div style="flex: 1; max-width: 320px; text-align: center;">
      <img src="${uploadedUrls['joylux_app_tracker.png']}" alt="Zavelyn App Tracker" style="width: 100%; border-radius: 10px; box-shadow: 0 4px 14px rgba(0,0,0,0.08);" />
    </div>
  </div>

  <!-- Technical Specifications Table -->
  <div style="margin-bottom: 32px;">
    <h3 style="font-size: 20px; font-weight: 800; color: #1a202c; margin-bottom: 14px;">Product Specifications</h3>
    <table style="width: 100%; border-collapse: collapse; font-size: 14px; text-align: left;">
      <tbody>
        <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 14px; font-weight: 700; color: #4a5568; background: #f7fafc; width: 35%;">Brand</td><td style="padding: 10px 14px; color: #2d3748;">Zavelyn</td></tr>
        <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 14px; font-weight: 700; color: #4a5568; background: #f7fafc;">Model</td><td style="padding: 10px 14px; color: #2d3748;">vFit™ Red Light Intimate Rejuvenation Device</td></tr>
        <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 14px; font-weight: 700; color: #4a5568; background: #f7fafc;">Technology</td><td style="padding: 10px 14px; color: #2d3748;">Triple Action: 662nm Red Light LEDs, Thermal Energy, Sonic Matrix</td></tr>
        <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 14px; font-weight: 700; color: #4a5568; background: #f7fafc;">Treatment Time</td><td style="padding: 10px 14px; color: #2d3748;">10 - 12 Minutes per session (Every other day)</td></tr>
        <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 14px; font-weight: 700; color: #4a5568; background: #f7fafc;">Body Material</td><td style="padding: 10px 14px; color: #2d3748;">Medical-Grade Bio-Compatible Silicone &amp; ABS</td></tr>
        <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 14px; font-weight: 700; color: #4a5568; background: #f7fafc;">Waterproof Rating</td><td style="padding: 10px 14px; color: #2d3748;">IPX4 Water-Resistant (Easy cleaning with wipes/warm water)</td></tr>
        <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 14px; font-weight: 700; color: #4a5568; background: #f7fafc;">Charging</td><td style="padding: 10px 14px; color: #2d3748;">Rechargeable Lithium-Ion Battery via USB Dock</td></tr>
        <tr style="border-bottom: 1px solid #e2e8f0;"><td style="padding: 10px 14px; font-weight: 700; color: #4a5568; background: #f7fafc;">Warranty &amp; Guarantee</td><td style="padding: 10px 14px; color: #2d3748;">1-Year Full Warranty + 90-Day Satisfaction Guarantee</td></tr>
      </tbody>
    </table>
  </div>

  <!-- What's in the Box -->
  <div style="background: #f7fafc; border-radius: 10px; padding: 20px; border: 1px solid #e2e8f0; margin-bottom: 32px;">
    <h4 style="font-size: 16px; font-weight: 800; color: #2d3748; margin: 0 0 10px;">📦 Complete Kit Includes:</h4>
    <ul style="margin: 0; padding-left: 20px; font-size: 14px; color: #4a5568; line-height: 1.8;">
      <li>1x Zavelyn vFit™ Intimate Wellness Device (Classic or Plus Pro)</li>
      <li>1x Photonic Hydrating Gel (30-day supply, enhances red light refraction)</li>
      <li>1x Cleansing Wipes Pack (30 antibacterial wipes formulated for intimate devices)</li>
      <li>1x Magnetic USB Charging Cradle &amp; Cable</li>
      <li>1x Discreet Travel &amp; Storage Pouch</li>
      <li>1x Quick-Start User Guide &amp; OB-GYN Routine Plan</li>
    </ul>
  </div>

  <!-- Verified Customer Reviews Section -->
  <div>
    <div style="text-align: center; margin-bottom: 24px;">
      <h3 style="font-size: 22px; font-weight: 800; color: #1a202c; margin-bottom: 6px;">Real Reviews from Over 100,000+ Women</h3>
      <div style="color: #f59e0b; font-size: 18px; margin-bottom: 4px;">★★★★★</div>
      <span style="font-size: 14px; color: #718096; font-weight: 600;">Rated 4.9 / 5.0 based on verified medical and consumer trials</span>
    </div>

    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 18px;">
      
      <!-- Review 1 -->
      <div style="background: #ffffff; border: 1px solid #fed7d7; border-radius: 10px; padding: 18px; box-shadow: 0 2px 8px rgba(0,0,0,0.03);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <strong style="color: #2d3748; font-size: 14px;">Jennifer M. (Age 52)</strong>
          <span style="color: #16a34a; font-size: 12px; font-weight: 600;">✓ Verified Buyer</span>
        </div>
        <div style="color: #f59e0b; font-size: 13px; margin-bottom: 6px;">★★★★★</div>
        <p style="font-size: 13px; color: #4a5568; line-height: 1.5; margin: 0 0 10px;">
          "I was extremely skeptical at first. But after having 3 kids and entering peri-menopause, my intimacy with my husband was painful and distant. By week 4 of using this, natural lubrication returned and dryness was gone. An absolute game-changer!"
        </p>
        <span style="font-size: 11px; color: #a0aec0;">Scottsdale, AZ • Verified Customer</span>
      </div>

      <!-- Review 2 -->
      <div style="background: #ffffff; border: 1px solid #fed7d7; border-radius: 10px; padding: 18px; box-shadow: 0 2px 8px rgba(0,0,0,0.03);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <strong style="color: #2d3748; font-size: 14px;">Dr. Laura B., MD (OB-GYN)</strong>
          <span style="color: #16a34a; font-size: 12px; font-weight: 600;">✓ Clinical Endorsement</span>
        </div>
        <div style="color: #f59e0b; font-size: 13px; margin-bottom: 6px;">★★★★★</div>
        <p style="font-size: 13px; color: #4a5568; line-height: 1.5; margin: 0 0 10px;">
          "I recommend red light therapy to my patients who cannot or do not want to take estrogen therapies. The tissue response is scientifically grounded: improved micro-vascularity, enhanced collagen elasticity, and pelvic muscle tone without drugs."
        </p>
        <span style="font-size: 11px; color: #a0aec0;">New York, NY • Practicing OB-GYN</span>
      </div>

      <!-- Review 3 -->
      <div style="background: #ffffff; border: 1px solid #fed7d7; border-radius: 10px; padding: 18px; box-shadow: 0 2px 8px rgba(0,0,0,0.03);">
        <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 8px;">
          <strong style="color: #2d3748; font-size: 14px;">Carolyn S. (Age 46)</strong>
          <span style="color: #16a34a; font-size: 12px; font-weight: 600;">✓ Verified Buyer</span>
        </div>
        <div style="color: #f59e0b; font-size: 13px; margin-bottom: 6px;">★★★★★</div>
        <p style="font-size: 13px; color: #4a5568; line-height: 1.5; margin: 0 0 10px;">
          "The bladder leaks while jogging or sneezing have completely stopped. My pelvic floor feels significantly stronger, and the sonic warmth is so soothing. Best investment I've made in my health."
        </p>
        <span style="font-size: 11px; color: #a0aec0;">San Diego, CA • Verified Customer</span>
      </div>

    </div>
  </div>

</div>
`;

async function seedJoylux() {
  const token = await getAccessToken();
  console.log('Got access token. Checking existing products...');

  // 1. Delete if already exists
  const existingRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/products.json?handle=zavelyn-vfit-red-light-intimate-wellness-device`, {
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

  // 2. Images
  const images = [
    { src: uploadedUrls['joylux_vfit_starter_kit.jpg'], alt: 'Zavelyn vFit Intimate Wellness Starter Kit - Classic Edition' },
    { src: uploadedUrls['joylux_vfit_plus_pro.jpg'], alt: 'Zavelyn vFit Plus Pro Medical Edition with Camellia' },
    { src: uploadedUrls['joylux_vfit_classic_device.jpg'], alt: 'Zavelyn vFit Red Light Therapy Device' },
    { src: uploadedUrls['joylux_triple_tech.png'], alt: '3-in-1 Triple Action Technology: Red Light, Thermal Energy, Sonic Vibrations' },
    { src: uploadedUrls['joylux_clinical_diagram.png'], alt: 'Clinically Proven Results Diagram' },
    { src: uploadedUrls['joylux_app_tracker.png'], alt: 'Zavelyn Companion App Tracker' },
    { src: uploadedUrls['joylux_dr_sarah.webp'], alt: 'Medical Advisory Board Endorsement' },
    { src: uploadedUrls['joylux_review_1.png'], alt: 'Customer Review Testimonial 1' }
  ];

  // 3. Variants (3 Bundles x 2 Editions)
  const variants = [
    // Buy 1
    {
      option1: 'Buy 1 (Essential Starter Kit - Save 45%)',
      option2: 'Classic Edition',
      price: '249.99',
      compare_at_price: '450.00',
      inventory_policy: 'continue',
      inventory_management: null,
      requires_shipping: true
    },
    {
      option1: 'Buy 1 (Essential Starter Kit - Save 45%)',
      option2: 'Plus Pro Medical Edition',
      price: '299.99',
      compare_at_price: '495.00',
      inventory_policy: 'continue',
      inventory_management: null,
      requires_shipping: true
    },
    // Buy 2
    {
      option1: 'Buy 2 (Complete Rejuvenation Set - Save 50%)',
      option2: 'Classic Edition',
      price: '449.99',
      compare_at_price: '900.00',
      inventory_policy: 'continue',
      inventory_management: null,
      requires_shipping: true
    },
    {
      option1: 'Buy 2 (Complete Rejuvenation Set - Save 50%)',
      option2: 'Plus Pro Medical Edition',
      price: '549.99',
      compare_at_price: '990.00',
      inventory_policy: 'continue',
      inventory_management: null,
      requires_shipping: true
    },
    // Buy 3
    {
      option1: 'Buy 3 (The Ultimate VIP Longevity Bundle - Save 60%)',
      option2: 'Classic Edition',
      price: '599.99',
      compare_at_price: '1350.00',
      inventory_policy: 'continue',
      inventory_management: null,
      requires_shipping: true
    },
    {
      option1: 'Buy 3 (The Ultimate VIP Longevity Bundle - Save 60%)',
      option2: 'Plus Pro Medical Edition',
      price: '699.99',
      compare_at_price: '1485.00',
      inventory_policy: 'continue',
      inventory_management: null,
      requires_shipping: true
    }
  ];

  console.log('Creating new product on Shopify API...');
  const createRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/products.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify({
      product: {
        title: 'Zavelyn vFit™ Red Light Intimate Wellness & Pelvic Rejuvenation Device',
        handle: 'zavelyn-vfit-red-light-intimate-wellness-device',
        vendor: 'Zavelyn',
        product_type: 'Health & Wellness',
        tags: 'vFit, Intimate Wellness, Red Light Therapy, Women Health, Pelvic Floor, Best Seller, New 2026, OB-GYN Recommended',
        body_html: bodyHtml,
        options: [
          { name: 'Bundle' },
          { name: 'Edition' }
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

  // Link variant images
  const classicImg = newProduct.images.find(img => img.position === 1);
  const plusImg = newProduct.images.find(img => img.position === 2);

  console.log('Linking variant images...');
  for (const v of newProduct.variants) {
    const isClassic = v.option2 === 'Classic Edition';
    const targetImg = isClassic ? classicImg : plusImg;
    if (targetImg) {
      await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/variants/${v.id}.json`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
        body: JSON.stringify({
          variant: {
            id: v.id,
            image_id: targetImg.id,
            inventory_policy: 'continue'
          }
        })
      });
    }
  }
  console.log('✔ Linked all variant images & verified inventory_policy: continue');

  // Add to collections
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

  console.log('\n🎉 Product seeding complete!');
  console.log(`URL: https://${SHOP_DOMAIN}/products/${newProduct.handle}`);
}

seedJoylux().catch(console.error);
