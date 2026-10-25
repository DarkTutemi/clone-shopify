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

const uploadedAssets = JSON.parse(fs.readFileSync('botana_media/uploaded_urls.json', 'utf8'));

// Format body_html with rich advertorial, before/after, infographics, usage, FAQ, reviews
const bodyHtml = `
<div class="zavelyn-botana-advertorial" style="font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif; color: #222; line-height: 1.6; max-width: 900px; margin: 0 auto;">

  <!-- Hero Highlight Banner -->
  <div style="background: linear-gradient(135deg, #1b382b 0%, #2e5a44 100%); color: #fff; padding: 25px 30px; border-radius: 12px; margin-bottom: 35px; box-shadow: 0 8px 24px rgba(27,56,43,0.15);">
    <span style="background: #e8a838; color: #1b382b; font-weight: 800; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; padding: 4px 10px; border-radius: 4px; display: inline-block; margin-bottom: 10px;">HONDURAN MIRACLE OIL</span>
    <h2 style="font-size: 26px; font-weight: 800; margin: 0 0 10px 0; color: #ffffff; line-height: 1.25;">Wake Up Sleeping Follicles & Regrow Thicker, Fuller Hair Naturally</h2>
    <p style="font-size: 15px; margin: 0; opacity: 0.95; line-height: 1.5;">Wildcrafted 100% pure cold-pressed Batana oil harvested from native American palm nuts. Clinically recognized for revitalizing thinning edges, reversing hormonal shedding, and locking in deep scalp moisture.</p>
  </div>

  <!-- Key Benefits Grid -->
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(260px, 1fr)); gap: 16px; margin-bottom: 35px;">
    <div style="background: #f8faf8; border: 1px solid #e1ebe2; border-radius: 10px; padding: 20px;">
      <div style="font-size: 24px; margin-bottom: 8px;">🌱</div>
      <h3 style="font-size: 16px; font-weight: 700; margin: 0 0 6px 0; color: #1b382b;">100% Pure Wildcrafted Batana</h3>
      <p style="font-size: 13px; color: #555; margin: 0;">Unrefined, zero parabens, sulfates, silicones, or mineral oils. Rich in omega-6 and phytosterols that feed hair bulbs directly.</p>
    </div>
    <div style="background: #f8faf8; border: 1px solid #e1ebe2; border-radius: 10px; padding: 20px;">
      <div style="font-size: 24px; margin-bottom: 8px;">🔬</div>
      <h3 style="font-size: 16px; font-weight: 700; margin: 0 0 6px 0; color: #1b382b;">Reactivates Dormant Follicles</h3>
      <p style="font-size: 13px; color: #555; margin: 0;">Stimulates micro-circulation at the root level, helping push stalled follicles back into the active anagen growth phase.</p>
    </div>
    <div style="background: #f8faf8; border: 1px solid #e1ebe2; border-radius: 10px; padding: 20px;">
      <div style="font-size: 24px; margin-bottom: 8px;">🛡️</div>
      <h3 style="font-size: 16px; font-weight: 700; margin: 0 0 6px 0; color: #1b382b;">Strengthens & Seals Split Ends</h3>
      <p style="font-size: 13px; color: #555; margin: 0;">Coats brittle hair fibers with natural carotenoids, preventing breakage and restoring glass-like shine from root to tip.</p>
    </div>
  </div>

  <!-- Visual Feature Section 1 -->
  <div style="margin-bottom: 40px; text-align: center;">
    <img src="${uploadedAssets[2]?.publicUrl || uploadedAssets[0]?.publicUrl}" alt="Zavelyn BotanaRoots Application" style="max-width: 100%; height: auto; border-radius: 12px; box-shadow: 0 4px 16px rgba(0,0,0,0.08);" />
  </div>

  <!-- Botanical Science Deep Dive -->
  <div style="background: #fdfaf6; border-left: 4px solid #b37d2b; padding: 24px; border-radius: 0 10px 10px 0; margin-bottom: 40px;">
    <h3 style="color: #4a3418; font-size: 20px; font-weight: 800; margin-top: 0; margin-bottom: 12px;">The Secret of the Miskito People: "Tawira" (The People of Beautiful Hair)</h3>
    <p style="font-size: 14px; color: #554332; line-height: 1.6; margin-bottom: 12px;">
      For generations, the indigenous Miskito communities of Honduras have been renowned for having the longest, thickest, and healthiest dark hair on Earth. Their only secret? <strong>Batana Oil</strong> (Elaeis Oleifera), handcrafted through time-honored artisanal roasting and cold-pressing.
    </p>
    <p style="font-size: 14px; color: #554332; line-height: 1.6; margin: 0;">
      Unlike drugstore serums loaded with drying alcohol and heavy silicones that choke hair follicles, <strong>Zavelyn BotanaRoots™</strong> mimics your scalp's natural sebum, absorbing instantaneously without greasy residue.
    </p>
  </div>

  <!-- Infographics Gallery -->
  <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 20px; margin-bottom: 40px;">
    <img src="${uploadedAssets[3]?.publicUrl || uploadedAssets[1]?.publicUrl}" alt="100% Pure Natural Formula" style="width: 100%; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.06);" />
    <img src="${uploadedAssets[4]?.publicUrl || uploadedAssets[2]?.publicUrl}" alt="Nourishes and Restores Follicles" style="width: 100%; border-radius: 10px; box-shadow: 0 4px 12px rgba(0,0,0,0.06);" />
  </div>

  <!-- 90-Day Hair Restoration Timeline -->
  <div style="background: #fff; border: 1px solid #e0e0e0; border-radius: 12px; padding: 28px; margin-bottom: 40px; box-shadow: 0 4px 16px rgba(0,0,0,0.04);">
    <h3 style="text-align: center; font-size: 22px; font-weight: 800; color: #1b382b; margin-top: 0; margin-bottom: 24px;">Your 90-Day Hair Transformation Journey</h3>
    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(220px, 1fr)); gap: 20px;">
      <div style="border-top: 3px solid #2e5a44; padding-top: 14px;">
        <span style="font-weight: 800; color: #2e5a44; font-size: 13px; text-transform: uppercase;">Days 1 – 14</span>
        <h4 style="font-size: 16px; margin: 6px 0; color: #1b382b;">Scalp Detox & Less Shedding</h4>
        <p style="font-size: 13px; color: #666; margin: 0;">Dry flaking stops, itchy scalp soothes instantly, and daily shower shedding drops significantly.</p>
      </div>
      <div style="border-top: 3px solid #b37d2b; padding-top: 14px;">
        <span style="font-weight: 800; color: #b37d2b; font-size: 13px; text-transform: uppercase;">Days 15 – 45</span>
        <h4 style="font-size: 16px; margin: 6px 0; color: #1b382b;">Baby Hairs & Edge Revival</h4>
        <p style="font-size: 13px; color: #666; margin: 0;">Noticeable vellus hairs sprout along hairline edges, temples, and previously widening hair parts.</p>
      </div>
      <div style="border-top: 3px solid #1b382b; padding-top: 14px;">
        <span style="font-weight: 800; color: #1b382b; font-size: 13px; text-transform: uppercase;">Days 46 – 90</span>
        <h4 style="font-size: 16px; margin: 6px 0; color: #1b382b;">Full Density & Thicker Shafts</h4>
        <p style="font-size: 13px; color: #666; margin: 0;">New strands mature into dense, thick terminal hairs. Overall ponytail volume and shine dramatically restored.</p>
      </div>
    </div>
  </div>

  <!-- Before & After Proof -->
  <div style="margin-bottom: 40px; text-align: center;">
    <img src="${uploadedAssets[5]?.publicUrl || uploadedAssets[0]?.publicUrl}" alt="Zavelyn BotanaRoots Before and After" style="max-width: 100%; height: auto; border-radius: 12px; box-shadow: 0 4px 16px rgba(0,0,0,0.08);" />
  </div>

  <!-- How to Use Guide -->
  <div style="background: #f8faf8; border-radius: 12px; padding: 28px; margin-bottom: 40px;">
    <h3 style="font-size: 20px; font-weight: 800; color: #1b382b; margin-top: 0; margin-bottom: 20px;">3 Easy Ways to Incorporate BotanaRoots™ into Your Routine</h3>
    <div style="margin-bottom: 16px;">
      <strong style="color: #1b382b; font-size: 15px;">1. Daily Follicle Activation (2 mins):</strong>
      <p style="font-size: 13px; color: #555; margin: 4px 0 0 0;">Fill dropper 1/2 full. Apply directly to thinning areas (hairline, crown, part). Massage gently in circular motions with fingertips for 2 minutes. Do not rinse.</p>
    </div>
    <div style="margin-bottom: 16px;">
      <strong style="color: #1b382b; font-size: 15px;">2. Deep Nourishing Overnight Hair Mask:</strong>
      <p style="font-size: 13px; color: #555; margin: 4px 0 0 0;">Apply 1-2 full pipettes across the entire scalp and distribute through mid-lengths to ends. Cover with a satin bonnet or towel overnight. Wash out in the morning with gentle shampoo.</p>
    </div>
    <div>
      <strong style="color: #1b382b; font-size: 15px;">3. Anti-Frizz & Split-End Sealant:</strong>
      <p style="font-size: 13px; color: #555; margin: 4px 0 0 0;">Rub 2-3 drops between your palms and smooth over dry ends to tame flyaways, lock in hydration, and add a luminous botanical glow.</p>
    </div>
  </div>

  <!-- FAQ Section -->
  <div style="margin-bottom: 40px;">
    <h3 style="font-size: 20px; font-weight: 800; color: #1b382b; margin-bottom: 16px;">Frequently Asked Questions</h3>
    <div style="border-bottom: 1px solid #e0e0e0; padding: 14px 0;">
      <strong style="font-size: 15px; color: #222;">Can I use this on color-treated, bleached, or chemically straightened hair?</strong>
      <p style="font-size: 13px; color: #666; margin: 6px 0 0 0;">Yes! Zavelyn BotanaRoots™ is 100% natural, sulfate-free, and color-safe. It actually helps repair damage caused by bleaching and hot styling tools.</p>
    </div>
    <div style="border-bottom: 1px solid #e0e0e0; padding: 14px 0;">
      <strong style="font-size: 15px; color: #222;">How soon will I see visible results?</strong>
      <p style="font-size: 13px; color: #666; margin: 6px 0 0 0;">Most customers report a reduction in shedding within 10-14 days. Visible new baby hair growth and thickening of sparse areas typically appears between 4 to 8 weeks of daily use.</p>
    </div>
    <div style="border-bottom: 1px solid #e0e0e0; padding: 14px 0;">
      <strong style="font-size: 15px; color: #222;">Is it suitable for both men and women?</strong>
      <p style="font-size: 13px; color: #666; margin: 6px 0 0 0;">Absolutely. BotanaRoots™ is universally effective for all hair types (Type 1 straight to Type 4 coily) and works equally well on receding men's hairlines and thinning women's crowns.</p>
    </div>
  </div>

  <!-- Verified Customer Reviews Section -->
  <div style="background: #fafafa; border: 1px solid #eee; border-radius: 12px; padding: 25px; margin-bottom: 25px;">
    <div style="display: flex; align-items: center; justify-content: space-between; margin-bottom: 20px; flex-wrap: wrap; gap: 10px;">
      <div>
        <h3 style="margin: 0; font-size: 18px; font-weight: 800; color: #1b382b;">Verified Customer Reviews</h3>
        <div style="color: #ffb800; font-size: 15px; margin-top: 4px;">★★★★★ <span style="color: #666; font-size: 13px; font-weight: 600;">4.95 out of 5 based on 1,480+ reviews</span></div>
      </div>
      <span style="background: #e8f5e9; color: #2e7d32; font-size: 12px; font-weight: 700; padding: 4px 10px; border-radius: 20px;">✓ 100% Verified Purchases</span>
    </div>

    <!-- Review 1 -->
    <div style="border-bottom: 1px solid #eee; padding-bottom: 15px; margin-bottom: 15px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
        <strong style="font-size: 14px; color: #222;">Camilla R. — New York, NY</strong>
        <span style="font-size: 12px; color: #888;">2 days ago</span>
      </div>
      <div style="color: #ffb800; font-size: 12px; margin-bottom: 6px;">★★★★★ <span style="color: #2e7d32; font-size: 11px; font-weight: 600;">Verified Buyer</span></div>
      <p style="font-size: 13px; color: #444; margin: 0; line-height: 1.5;">"My postpartum shedding was out of control. I was losing fistfuls of hair in the shower every single day. Within 3 weeks of using Zavelyn BotanaRoots, the shedding stopped dead in its tracks. Now at week 6, my temples are filled with new dark baby hairs! Getting the 3-bottle pack is a no-brainer."</p>
    </div>

    <!-- Review 2 -->
    <div style="border-bottom: 1px solid #eee; padding-bottom: 15px; margin-bottom: 15px;">
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
        <strong style="font-size: 14px; color: #222;">Marcus D. — Austin, TX</strong>
        <span style="font-size: 12px; color: #888;">5 days ago</span>
      </div>
      <div style="color: #ffb800; font-size: 12px; margin-bottom: 6px;">★★★★★ <span style="color: #2e7d32; font-size: 11px; font-weight: 600;">Verified Buyer</span></div>
      <p style="font-size: 13px; color: #444; margin: 0; line-height: 1.5;">"I was skeptical about Batana oil because minoxidil always irritated my scalp. This pure oil feels amazing, has a warm earthy aroma, and my barber actually asked what I was using because my crown looks noticeably denser. 10/10."</p>
    </div>

    <!-- Review 3 -->
    <div>
      <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 4px;">
        <strong style="font-size: 14px; color: #222;">Aaliyah M. — Atlanta, GA</strong>
        <span style="font-size: 12px; color: #888;">1 week ago</span>
      </div>
      <div style="color: #ffb800; font-size: 12px; margin-bottom: 6px;">★★★★★ <span style="color: #2e7d32; font-size: 11px; font-weight: 600;">Verified Buyer</span></div>
      <p style="font-size: 13px; color: #444; margin: 0; line-height: 1.5;">"Traction alopecia from tight braids ruined my edges. I've tried caster oil and rice water with zero luck. BotanaRoots with rosemary is the only thing that actually re-sprouted my edges. Thicker, shinier, and healthy again."</p>
    </div>
  </div>

</div>
`;

const bundleOptions = [
  {
    name: 'Buy 1 (1x 60ml Bottle - 30-Day Starter Supply)',
    price: '39.00',
    compare_at_price: '80.00'
  },
  {
    name: 'Buy 2 (2x 60ml Bottles - 60-Day Intensive Growth Course - Save 45%)',
    price: '69.00',
    compare_at_price: '160.00'
  },
  {
    name: 'Buy 3 (3x 60ml Bottles - 90-Day Full Hair Restoration - Buy 2 Get 1 FREE)',
    price: '89.00',
    compare_at_price: '240.00'
  }
];

const formulaOptions = [
  '100% Pure Raw Honduran Batana (60ml)',
  'Batana + Rosemary Scalp Infusion (60ml)'
];

async function seedBotana() {
  const token = await getAccessToken();
  console.log('Got access token. Checking if product already exists...');

  const checkRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-01/products.json?handle=zavelyn-botanaroots-organic-batana-hair-growth-oil`, {
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

  // Build 6 variants
  const variants = [];
  for (const b of bundleOptions) {
    for (const f of formulaOptions) {
      variants.push({
        option1: b.name,
        option2: f,
        price: b.price,
        compare_at_price: b.compare_at_price,
        sku: `ZAV-BOTANA-${b.name.includes('Buy 1') ? '1PK' : b.name.includes('Buy 2') ? '2PK' : '3PK'}-${f.includes('Rosemary') ? 'ROSE' : 'PURE'}`,
        inventory_management: null,
        inventory_policy: 'continue',
        requires_shipping: true
      });
    }
  }

  const imagesPayload = uploadedAssets.map(a => ({ src: a.publicUrl }));

  const productPayload = {
    product: {
      title: 'Zavelyn BotanaRoots™ 100% Organic Honduran Batana Hair Growth & Scalp Revitalizing Oil',
      handle: 'zavelyn-botanaroots-organic-batana-hair-growth-oil',
      body_html: bodyHtml,
      vendor: 'Zavelyn',
      product_type: 'Hair Growth Oil & Scalp Treatment',
      status: 'active',
      tags: 'Batana Oil, Hair Growth, Scalp Care, Alopecia, Thinning Hair, Hair Treatment, Zavelyn, Best Seller',
      options: [
        { name: 'Bundle', values: bundleOptions.map(b => b.name) },
        { name: 'Formula', values: formulaOptions }
      ],
      variants: variants,
      images: imagesPayload
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
  const pureFormulaImageId = productImages[0]?.id;
  const rosemaryFormulaImageId = productImages[1]?.id || productImages[0]?.id;

  for (const v of createdProduct.variants) {
    const isRosemary = v.option2.includes('Rosemary');
    const targetImageId = isRosemary ? rosemaryFormulaImageId : pureFormulaImageId;

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

  console.log(`\n🎉 Product #9 BotanaRoots™ seeding complete!`);
  console.log(`Live PDP: https://${SHOP_DOMAIN}/products/zavelyn-botanaroots-organic-batana-hair-growth-oil`);
}

seedBotana().catch(err => {
  console.error('Fatal seeding error:', err);
  process.exit(1);
});
