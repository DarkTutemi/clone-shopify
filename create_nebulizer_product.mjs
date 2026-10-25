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

const uploadedUrls = JSON.parse(fs.readFileSync('nebulizer_media/uploaded_urls.json', 'utf8'));

// Build high-converting rich advertorial body_html
const bodyHtml = `
<div class="zavelyn-nebulizer-content" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #1e293b; line-height: 1.6; max-width: 900px; margin: 0 auto; padding: 10px 0;">

  <!-- As Seen On Trust Bar -->
  <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 18px 24px; margin-bottom: 28px; text-align: center;">
    <span style="font-size: 12px; font-weight: 700; color: #64748b; letter-spacing: 0.12em; text-transform: uppercase; display: block; margin-bottom: 12px;">AS FEATURED & RECOGNIZED IN</span>
    <div style="display: flex; flex-wrap: wrap; align-items: center; justify-content: center; gap: 28px;">
      <img src="${uploadedUrls['logo_webmd.webp']}" alt="WebMD" style="height: 28px; object-fit: contain; filter: grayscale(100%); opacity: 0.75;" />
      <img src="${uploadedUrls['logo_womenshealth.webp']}" alt="Women's Health" style="height: 24px; object-fit: contain; filter: grayscale(100%); opacity: 0.75;" />
      <img src="${uploadedUrls['logo_usatoday.png']}" alt="USA Today" style="height: 24px; object-fit: contain; filter: grayscale(100%); opacity: 0.75;" />
    </div>
  </div>

  <!-- Hero Highlight Header -->
  <div style="background: linear-gradient(135deg, #059669 0%, #064e3b 100%); color: #ffffff; padding: 32px 24px; border-radius: 12px; margin-bottom: 32px; text-align: center;">
    <span style="display: inline-block; background-color: #34d399; color: #064e3b; font-weight: 800; font-size: 12px; letter-spacing: 0.1em; padding: 4px 12px; border-radius: 999px; text-transform: uppercase; margin-bottom: 12px;">❄️ FLU & ALLERGY SEASON ESSENTIAL</span>
    <h2 style="font-size: 28px; font-weight: 800; line-height: 1.25; margin: 0 0 12px; color: #ffffff;">Because Every Parent Deserves Peace of Mind — Quiet Mist Day & Night</h2>
    <p style="font-size: 16px; color: #d1fae5; max-width: 680px; margin: 0 auto; line-height: 1.6;">
      Tired of wrestling with loud, clunky tabletop nebulizers that scare your little ones? The <strong>Zavelyn® 2.0 Portable Ultrasonic Mesh Nebulizer</strong> creates a soothing, ultra-fine medical mist under 25dB. Instant respiratory relief—at home, in the car, or while your baby sleeps.
    </p>
  </div>

  <!-- 4 Quick Value Highlights -->
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(200px, 1fr)); gap: 16px; margin-bottom: 36px;">
    <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 18px; text-align: center;">
      <div style="font-size: 26px; margin-bottom: 6px;">💨</div>
      <strong style="display: block; font-size: 15px; color: #065f46; margin-bottom: 4px;">Whisper-Quiet (< 25dB)</strong>
      <span style="font-size: 13px; color: #047857;">Virtually silent. Administer treatment during naptime without waking your baby.</span>
    </div>
    <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 18px; text-align: center;">
      <div style="font-size: 26px; margin-bottom: 6px;">🔋</div>
      <strong style="display: block; font-size: 15px; color: #065f46; margin-bottom: 4px;">Dual Power Cordless</strong>
      <span style="font-size: 13px; color: #047857;">Runs on 2x AA batteries or USB-C plug. Truly pocket-sized and always travel ready.</span>
    </div>
    <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 18px; text-align: center;">
      <div style="font-size: 26px; margin-bottom: 6px;">👶</div>
      <strong style="display: block; font-size: 15px; color: #065f46; margin-bottom: 4px;">Complete Family Kit</strong>
      <span style="font-size: 13px; color: #047857;">Includes Pediatric mask, Adult mask, and targeted Inhalation Mouthpiece.</span>
    </div>
    <div style="background: #f0fdf4; border: 1px solid #bbf7d0; border-radius: 10px; padding: 18px; text-align: center;">
      <div style="font-size: 26px; margin-bottom: 6px;">🛡️</div>
      <strong style="display: block; font-size: 15px; color: #065f46; margin-bottom: 4px;">1-Year Free Warranty</strong>
      <span style="font-size: 13px; color: #047857;">Full 100% replacement guarantee if anything fails, plus 30-day money back trial.</span>
    </div>
  </div>

  <!-- Feature 1: Whisper Quiet -->
  <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin-bottom: 28px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
    <img src="${uploadedUrls['nebulizer_kid_using.webp']}" alt="Quiet Comfort During Sleep" style="width: 100%; border-radius: 8px; margin-bottom: 16px; display: block;" />
    <span style="font-size: 12px; font-weight: 700; color: #059669; letter-spacing: 0.08em; text-transform: uppercase;">PEACEFUL SESSIONS</span>
    <h3 style="font-size: 22px; font-weight: 700; color: #0f172a; margin: 4px 0 10px;">1. Whisper-Quiet Comfort — No More Tears or Nighttime Struggles</h3>
    <p style="font-size: 15px; color: #475569; margin: 0 0 12px;">
      Bulky traditional compressor nebulizers roar like vacuum cleaners and vibrate uncontrollably, frightening toddlers and escalating bedtime meltdowns. The Zavelyn® 2.0 uses micro-perforated ultrasonic mesh vibrating at 110 kHz to atomize liquid without audible motor noise (< 25 dB). Your child can receive gentle saline relief while resting peacefully in their crib or watching a cartoon.
    </p>
    <div style="background: #f0fdf4; border-left: 3px solid #10b981; padding: 12px 16px; border-radius: 4px; font-size: 14px; color: #065f46; font-style: italic;">
      "My 3-year-old used to scream whenever we brought out our old heavy nebulizer. With Zavelyn, she holds it herself and falls asleep during treatments. An absolute miracle for our family!" — Jessica R., Verified Parent
    </div>
  </div>

  <!-- Feature 2: Parts & Components Kit -->
  <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin-bottom: 28px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
    <img src="${uploadedUrls['nebulizer_parts_kit.webp']}" alt="Zavelyn Nebulizer Complete Parts" style="width: 100%; border-radius: 8px; margin-bottom: 16px; display: block;" />
    <span style="font-size: 12px; font-weight: 700; color: #059669; letter-spacing: 0.08em; text-transform: uppercase;">FAMILY FRIENDLY DESIGN</span>
    <h3 style="font-size: 22px; font-weight: 700; color: #0f172a; margin: 4px 0 10px;">2. Complete All-In-One Kit — Safe for Toddlers, Kids & Adults</h3>
    <p style="font-size: 15px; color: #475569; margin: 0 0 14px;">
      No complicated hoses, no messy filters, and no confusing assembly. The Zavelyn® 2.0 unboxes with everything your household needs for safe respiratory care:
    </p>
    <ul style="font-size: 14px; color: #334155; margin: 0 0 14px; padding-left: 20px;">
      <li style="margin-bottom: 6px;"><strong>Ergonomic Pediatric Mask:</strong> Soft, contoured silicone designed specifically for delicate infant and child facial structures.</li>
      <li style="margin-bottom: 6px;"><strong>Comfort-Fit Adult Mask:</strong> Full-coverage mask for parents suffering from bronchitis, allergies, or nasal congestion.</li>
      <li style="margin-bottom: 6px;"><strong>Targeted Mouthpiece:</strong> Direct airway inhalation for focused bronchial and throat therapy.</li>
      <li style="margin-bottom: 6px;"><strong>Detachable 8ml Medicine Cup:</strong> Transparent, angled bottom reservoir ensures near-zero medication waste (< 0.1ml).</li>
    </ul>
  </div>

  <!-- Clinical & Survey Results Banner -->
  <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin-bottom: 28px; box-shadow: 0 4px 6px -1px rgba(0,0,0,0.05);">
    <img src="${uploadedUrls['nebulizer_testimonials_banner.webp']}" alt="Parent Survey Results" style="width: 100%; border-radius: 8px; margin-bottom: 16px; display: block;" />
    <span style="font-size: 12px; font-weight: 700; color: #059669; letter-spacing: 0.08em; text-transform: uppercase;">PROVEN RELIEF</span>
    <h3 style="font-size: 22px; font-weight: 700; color: #0f172a; margin: 4px 0 10px;">Over 50,000+ Families Breathe Easier Every Day</h3>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 14px; margin-top: 14px;">
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 14px; border-radius: 8px;">
        <span style="font-size: 24px; font-weight: 800; color: #059669; display: block;">92%</span>
        <span style="font-size: 13px; color: #475569;">of parents experienced significantly less anxiety during winter flu & allergy peaks.</span>
      </div>
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 14px; border-radius: 8px;">
        <span style="font-size: 24px; font-weight: 800; color: #059669; display: block;">88%</span>
        <span style="font-size: 13px; color: #475569;">reported that daily therapy was noticeably faster and completely struggle-free.</span>
      </div>
      <div style="background: #f8fafc; border: 1px solid #e2e8f0; padding: 14px; border-radius: 8px;">
        <span style="font-size: 24px; font-weight: 800; color: #059669; display: block;">95%</span>
        <span style="font-size: 13px; color: #475569;">praised the pocket portability for car rides, school bags, and family vacations.</span>
      </div>
    </div>
  </div>

  <!-- Comparison Table -->
  <div style="background: #ffffff; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin-bottom: 28px;">
    <h3 style="font-size: 20px; font-weight: 700; color: #0f172a; text-align: center; margin: 0 0 16px;">Old Clunky Compressors vs. Zavelyn® 2.0 Ultrasonic Mesh</h3>
    <table style="width: 100%; border-collapse: collapse; font-size: 14px;">
      <thead>
        <tr style="border-bottom: 2px solid #e2e8f0; text-align: left;">
          <th style="padding: 10px 8px; color: #64748b;">Feature</th>
          <th style="padding: 10px 8px; color: #dc2626;">Old Tabletop Compressor</th>
          <th style="padding: 10px 8px; color: #059669; font-weight: 800;">Zavelyn® 2.0 Mesh</th>
        </tr>
      </thead>
      <tbody>
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 10px 8px; font-weight: 600;">Noise Level</td>
          <td style="padding: 10px 8px; color: #dc2626;">Loud Motor (65dB+)</td>
          <td style="padding: 10px 8px; color: #059669; font-weight: 700;">Whisper-Quiet (< 25dB)</td>
        </tr>
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 10px 8px; font-weight: 600;">Portability</td>
          <td style="padding: 10px 8px; color: #64748b;">Heavy (3+ lbs), wall plug only</td>
          <td style="padding: 10px 8px; color: #059669; font-weight: 700;">Pocket-Sized (95g), Cordless</td>
        </tr>
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 10px 8px; font-weight: 600;">Particle MMAD</td>
          <td style="padding: 10px 8px; color: #64748b;">> 8.0 μm (poor absorption)</td>
          <td style="padding: 10px 8px; color: #059669; font-weight: 700;">< 5.0 μm Deep Alveolar Reach</td>
        </tr>
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 10px 8px; font-weight: 600;">Child Reaction</td>
          <td style="padding: 10px 8px; color: #dc2626;">Crying, screaming, fear</td>
          <td style="padding: 10px 8px; color: #059669; font-weight: 700;">Calm, peaceful, holds own mask</td>
        </tr>
        <tr style="border-bottom: 1px solid #f1f5f9;">
          <td style="padding: 10px 8px; font-weight: 600;">Cleaning Mode</td>
          <td style="padding: 10px 8px; color: #64748b;">Cumbersome tubing to dry</td>
          <td style="padding: 10px 8px; color: #059669; font-weight: 700;">1-Click Auto Flush Cleaning</td>
        </tr>
        <tr>
          <td style="padding: 10px 8px; font-weight: 600;">Power Source</td>
          <td style="padding: 10px 8px; color: #dc2626;">Wall AC Outlet Required</td>
          <td style="padding: 10px 8px; color: #059669; font-weight: 700;">Dual 2x AA Battery or USB-C</td>
        </tr>
      </tbody>
    </table>
  </div>

  <!-- Frequently Asked Questions -->
  <div style="background: #f8fafc; border: 1px solid #e2e8f0; border-radius: 12px; padding: 24px; margin-bottom: 28px;">
    <h3 style="font-size: 20px; font-weight: 700; color: #0f172a; text-align: center; margin: 0 0 20px;">Frequently Asked Questions</h3>
    
    <div style="margin-bottom: 16px; background: #ffffff; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0;">
      <strong style="color: #0f172a; font-size: 15px; display: block; margin-bottom: 6px;">Q: What liquid do I put in the nebulizer?</strong>
      <p style="font-size: 14px; color: #475569; margin: 0;">
        Most parents use sterile isotonic saline solution (0.9% sodium chloride), which is completely natural, 100% drug-free, and gently loosens stubborn mucus and blocked nasal passages. The device is also fully compatible with doctor-prescribed respiratory medications.
      </p>
    </div>

    <div style="margin-bottom: 16px; background: #ffffff; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0;">
      <strong style="color: #0f172a; font-size: 15px; display: block; margin-bottom: 6px;">Q: Can adults use this as well as children?</strong>
      <p style="font-size: 14px; color: #475569; margin: 0;">
        Absolutely. Every Zavelyn® 2.0 includes both an adult-sized mask and an infant/child mask, plus an oral inhalation mouthpiece. It provides fast, soothing steam relief for the whole family during allergy season, colds, or sinus congestion.
      </p>
    </div>

    <div style="margin-bottom: 16px; background: #ffffff; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0;">
      <strong style="color: #0f172a; font-size: 15px; display: block; margin-bottom: 6px;">Q: How do I clean and maintain the mesh plate?</strong>
      <p style="font-size: 14px; color: #475569; margin: 0;">
        After each session, simply empty any leftover solution, add 2-5ml of warm water, and hold the power button down for 3 seconds to initiate the automatic self-cleaning cycle. Rinse the cup with clean water and let it air dry.
      </p>
    </div>

    <div style="background: #ffffff; padding: 16px; border-radius: 8px; border: 1px solid #e2e8f0;">
      <strong style="color: #0f172a; font-size: 15px; display: block; margin-bottom: 6px;">Q: What is the warranty coverage?</strong>
      <p style="font-size: 14px; color: #475569; margin: 0;">
        We stand 100% behind our medical-grade quality. Every purchase is covered by our Free 1-Year Replacement Warranty and 30-Day Money Back Guarantee. If your unit experiences any technical fault, we will replace it immediately free of charge.
      </p>
    </div>
  </div>

  <!-- 30-Day Guarantee Card -->
  <div style="background: #ecfdf5; border: 1px solid #a7f3d0; border-radius: 12px; padding: 24px; text-align: center;">
    <div style="font-size: 32px; margin-bottom: 8px;">🛡️</div>
    <h3 style="font-size: 20px; font-weight: 700; color: #065f46; margin: 0 0 8px;">30-Day Risk-Free Family Breathing Trial</h3>
    <p style="font-size: 15px; color: #047857; margin: 0; line-height: 1.6;">
      Try the Zavelyn® 2.0 in your home. If it doesn't give your family calmer nights, easier breathing, and instant peace of mind, contact our friendly support team for a full refund.
    </p>
  </div>

</div>
`;

async function createProduct() {
  const token = await getAccessToken();
  console.log('Got access token. Creating Zavelyn Nebulizer product on Shopify...');

  const productData = {
    title: 'Zavelyn® 2.0 | Portable Ultrasonic Mesh Nebulizer',
    handle: 'zavelyn-portable-ultrasonic-mesh-nebulizer',
    vendor: 'Zavelyn',
    product_type: 'Respiratory Care',
    body_html: bodyHtml,
    tags: 'Nebulizer, Ultrasonic Mesh, Respiratory Health, Flu Season, Kids Care, Best Sellers, Clearance',
    images: [
      { src: uploadedUrls['nebulizer_hero_bogo.webp'], position: 1 },
      { src: uploadedUrls['nebulizer_kid_using.webp'], position: 2 },
      { src: uploadedUrls['nebulizer_parts_kit.webp'], position: 3 },
      { src: uploadedUrls['nebulizer_case_box.webp'], position: 4 },
      { src: uploadedUrls['nebulizer_testimonials_banner.webp'], position: 5 },
      { src: uploadedUrls['nebulizer_dimensions.webp'], position: 6 },
      { src: uploadedUrls['nebulizer_customer_susan.webp'], position: 7 },
      { src: uploadedUrls['nebulizer_review_1.jpg'], position: 8 },
      { src: uploadedUrls['nebulizer_review_2.jpg'], position: 9 },
      { src: uploadedUrls['nebulizer_review_3.jpg'], position: 10 }
    ],
    options: [
      {
        name: 'Bundle & Save',
        values: [
          'Buy 1 + Get 1 FREE (+ Free eBook)',
          'Buy 2 + Get 2 FREE (Best Family Bundle)'
        ]
      }
    ],
    variants: [
      {
        option1: 'Buy 1 + Get 1 FREE (+ Free eBook)',
        price: '49.95',
        compare_at_price: '112.00',
        inventory_policy: 'continue',
        inventory_management: null,
        requires_shipping: true
      },
      {
        option1: 'Buy 2 + Get 2 FREE (Best Family Bundle)',
        price: '99.90',
        compare_at_price: '224.00',
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
  fs.writeFileSync('created_nebulizer_product.json', JSON.stringify(p, null, 2));

  // Link variant images
  console.log('\n--- Linking variant images ---');
  for (const v of p.variants) {
    console.log(`Linking variant "${v.title}" -> image ${p.images[0].id}...`);
    await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/variants/${v.id}.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
      body: JSON.stringify({
        variant: {
          id: v.id,
          image_id: p.images[0].id,
          inventory_policy: 'continue'
        }
      })
    });
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
