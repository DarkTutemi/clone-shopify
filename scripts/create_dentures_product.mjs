import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
import fs from 'fs';
import { getAccessToken, SHOP } from './batch1_config.mjs';

const API_VERSION = '2026-10';

async function main() {
  const token = await getAccessToken();
  console.log(`Connecting to Shopify Store: ${SHOP}`);

  // 1. Check if product already exists
  const checkRes = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/products.json?handle=zavelyn-custom-fit-home-dentures`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const checkData = await checkRes.json();
  if (checkData.products && checkData.products.length > 0) {
    console.log(`Product already exists with ID: ${checkData.products[0].id}. Will update instead of creating duplicate.`);
  }

  // 2. Prepare Images as Base64 Attachments
  console.log('Preparing images for upload...');
  const images = [];

  // Hero Image
  const heroPath = './scratch/denture_hero_main.jpg';
  // Let's copy from artifacts
  const artifactHero = fs.readdirSync('C:/Users/Admin/.gemini/antigravity-ide/brain/d0f634e2-c9dd-4bad-bdb2-3c956abea303')
    .find(f => f.startsWith('denture_hero_main_') && f.endsWith('.jpg'));
  if (artifactHero) {
    const heroBuf = fs.readFileSync(`C:/Users/Admin/.gemini/antigravity-ide/brain/d0f634e2-c9dd-4bad-bdb2-3c956abea303/${artifactHero}`);
    images.push({
      attachment: heroBuf.toString('base64'),
      filename: 'zavelyn-custom-fit-home-dentures-hero.jpg',
      alt: 'Zavelyn Custom-Fit Home Dentures Complete Set with Molding Beads and Storage Box'
    });
  }

  // Upper & Lower Macro
  const artifactMacro = fs.readdirSync('C:/Users/Admin/.gemini/antigravity-ide/brain/d0f634e2-c9dd-4bad-bdb2-3c956abea303')
    .find(f => f.startsWith('denture_upper_lower_') && f.endsWith('.jpg'));
  if (artifactMacro) {
    const macroBuf = fs.readFileSync(`C:/Users/Admin/.gemini/antigravity-ide/brain/d0f634e2-c9dd-4bad-bdb2-3c956abea303/${artifactMacro}`);
    images.push({
      attachment: macroBuf.toString('base64'),
      filename: 'zavelyn-dentures-upper-lower-pair.jpg',
      alt: 'Zavelyn Removable Dentures - Upper and Lower Dental Arches'
    });
  }

  // Fitting Kit
  const artifactFitting = fs.readdirSync('C:/Users/Admin/.gemini/antigravity-ide/brain/d0f634e2-c9dd-4bad-bdb2-3c956abea303')
    .find(f => f.startsWith('denture_fitting_kit_') && f.endsWith('.jpg'));
  if (artifactFitting) {
    const fittingBuf = fs.readFileSync(`C:/Users/Admin/.gemini/antigravity-ide/brain/d0f634e2-c9dd-4bad-bdb2-3c956abea303/${artifactFitting}`);
    images.push({
      attachment: fittingBuf.toString('base64'),
      filename: 'zavelyn-dentures-at-home-fitting-process.jpg',
      alt: 'At-Home Thermal Molding Process with Warm Water and Adjustment Tool'
    });
  }

  // Product Dimensions (Supplier technical specs)
  if (fs.existsSync('./scratch/dentures_images/img_6.jpg')) {
    const dimBuf = fs.readFileSync('./scratch/dentures_images/img_6.jpg');
    images.push({
      attachment: dimBuf.toString('base64'),
      filename: 'zavelyn-dentures-dimensions-specifications.jpg',
      alt: 'Zavelyn Custom-Fit Home Dentures Product Dimensions and Component Sizes'
    });
  }

  // Natural Smile Feature
  if (fs.existsSync('./scratch/dentures_images/img_4.jpg')) {
    const featBuf = fs.readFileSync('./scratch/dentures_images/img_4.jpg');
    images.push({
      attachment: featBuf.toString('base64'),
      filename: 'zavelyn-dentures-natural-smile-appearance.jpg',
      alt: 'Natural Looking Smile Fitting Design'
    });
  }

  // User Friendly Feature
  if (fs.existsSync('./scratch/dentures_images/img_7.jpg')) {
    const feat2Buf = fs.readFileSync('./scratch/dentures_images/img_7.jpg');
    images.push({
      attachment: feat2Buf.toString('base64'),
      filename: 'zavelyn-dentures-user-friendly-results.jpg',
      alt: 'Easy to Use At-Home Denture Kit Results'
    });
  }

  console.log(`Loaded ${images.length} high-resolution gallery images.`);

  // 3. Prepare Product Description HTML
  const bodyHtml = `
<div class="zavelyn-dentures-description">
  <div class="zv-intro-summary">
    <p class="zv-lead-text">
      <strong>Zavelyn Custom-Fit Home Dentures</strong> provide an accessible, non-invasive cosmetic dental solution designed for at-home thermal fitting. Engineered with realistic dental resin teeth and a natural gum-toned base, this complete upper and lower arch kit helps restore a full, confident smile comfortably without messy adhesives or complicated appointments.
    </p>
  </div>

  <section class="zv-pdp-section zv-section-cosmetic">
    <h2>1. A Natural-Looking, Confident Smile</h2>
    <p>
      Designed to replicate the shape, translucency, and natural alignment of healthy adult teeth, Zavelyn Home Dentures blend seamlessly with your facial contours. The lightweight, contoured pink base rests smoothly against your gumline, providing balanced lip and cheek fullness for an authentic, age-appropriate appearance.
    </p>
  </section>

  <section class="zv-pdp-section zv-section-thermal">
    <h2>2. How the Thermal-Adaptive Fitting System Works</h2>
    <p>
      Our kit uses medical-grade, thermal-responsive molding beads that soften in warm water (140°F–160°F). Once pliable, the material easily molds to the exact shape of your upper and lower alveolar ridges, creating a custom suction-assisted fit. When cooled in room temperature or cold water, it firms up to retain your unique impression.
    </p>
    <p>
      <strong>Fully Re-moldable:</strong> If your initial fit feels too tight or uneven, simply immerse the molding material in warm water again to reshape and re-fit as needed.
    </p>
  </section>

  <section class="zv-pdp-section zv-section-included">
    <h2>3. What's Included in Each Kit</h2>
    <ul>
      <li><strong>1 × Full Suction Denture Pair:</strong> 1 Upper Arch Tray & 1 Lower Arch Tray.</li>
      <li><strong>1 × Thermal-Adaptive Molding Beads (50g):</strong> Generous supply for custom lining and micro-adjustments.</li>
      <li><strong>1 × Dual-Ended Silicone Adjusting Tool:</strong> For precise placement and trimming.</li>
      <li><strong>1 × Step-by-Step Instruction Guide:</strong> Clear illustrated fitting guidelines.</li>
      <li><strong>1 × Compact Protective Storage Case:</strong> Hygienic, ventilated carrying case.</li>
    </ul>
  </section>

  <section class="zv-pdp-section zv-section-how-to">
    <h2>4. Step-by-Step Fitting Instructions</h2>
    <ol>
      <li><strong>Step 1 — Warm Water Softening:</strong> Place approximately 15–20 molding beads into a cup of warm water (approx. 140°F–160°F / 60°C–70°C). Wait 60–90 seconds until the beads turn completely transparent and pliable.</li>
      <li><strong>Step 2 — Line the Tray:</strong> Remove the softened gel with a spoon or the provided tool and press it evenly into the inner channel of the denture arch.</li>
      <li><strong>Step 3 — Custom Impression:</strong> Position the arch firmly over your teeth and gums. Gently bite down with steady, uniform pressure for 60 seconds while using your fingers to smooth the gel against the gumline.</li>
      <li><strong>Step 4 — Cool & Set:</strong> Carefully remove the denture and place it in a glass of cold water for 2–3 minutes. The molding material will turn opaque white, locking in your personalized fit.</li>
    </ol>
  </section>

  <section class="zv-pdp-section zv-section-specs">
    <h2>5. Product Specifications</h2>
    <table class="zv-specs-table">
      <tbody>
        <tr><th>Product Type</th><td>Removable At-Home Cosmetic Denture Kit</td></tr>
        <tr><th>Upper Denture Width</th><td>Approx. 5.8 cm / 2.28 in (Adjustable contour)</td></tr>
        <tr><th>Lower Denture Width</th><td>Approx. 5.0 cm / 1.97 in (Adjustable contour)</td></tr>
        <tr><th>Materials</th><td>BPA-Free Cosmetic Resin & Thermal-Adaptive Polymer Gel</td></tr>
        <tr><th>Package Box Dimensions</th><td>19.4 cm × 10.3 cm × 2.7 cm (7.64 in × 4.06 in × 1.06 in)</td></tr>
        <tr><th>Net Weight</th><td>Approx. 150g (Complete kit with case and accessories)</td></tr>
      </tbody>
    </table>
  </section>

  <section class="zv-pdp-section zv-section-safety">
    <h2>6. Safety, Care & Oral Hygiene Guidelines</h2>
    <p>
      <strong>Cleaning & Daily Care:</strong> Rinse thoroughly with lukewarm water after every wear. Gently clean using a soft-bristled toothbrush with mild liquid soap or standard effervescent denture cleaning tablets. Do not expose to boiling water or harsh abrasive chemical bleaches.
    </p>
    <p>
      <strong>Eating Recommendations:</strong> Suitable for everyday speaking, smiling, and eating soft-to-medium foods. To maintain the longevity of the molding seal, avoid excessively hard, crunchy, or sticky foods (such as hard nuts, tough crusts, or chewing gum).
    </p>
    <p>
      <strong>Important Health Notice:</strong> This product is intended for cosmetic, aesthetic, and temporary personal use. It is not an implant, dental prosthesis, or a substitute for professional dental care. It does not treat periodontal disease, prevent jawbone resorption, or replace evaluations by a licensed dental professional. Discontinue use immediately if you experience gum inflammation or persistent discomfort.
    </p>
  </section>
</div>
  `.trim();

  // 4. Product Payload
  const productPayload = {
    product: {
      title: 'Zavelyn Custom-Fit Home Dentures',
      handle: 'zavelyn-custom-fit-home-dentures',
      body_html: bodyHtml,
      vendor: 'Zavelyn',
      product_type: 'Instant Custom-Fit Home Dentures',
      status: 'draft', // MUST BE DRAFT
      template_suffix: 'dentures',
      options: [
        {
          name: 'Package'
        }
      ],
      variants: [
        // BUNDLE 1: BUY 3 (BEST VALUE, DEFAULT SELECTED)
        {
          option1: '3 Complete Sets',
          price: '107.97',
          compare_at_price: '239.94',
          sku: 'ZAV-DENTURE-3SET',
          inventory_policy: 'continue',
          requires_shipping: true,
          taxable: true
        },
        // BUNDLE 2: BUY 2
        {
          option1: '2 Complete Sets',
          price: '79.98',
          compare_at_price: '159.96',
          sku: 'ZAV-DENTURE-2SET',
          inventory_policy: 'continue',
          requires_shipping: true,
          taxable: true
        },
        // BUNDLE 3: BUY 1
        {
          option1: '1 Complete Set',
          price: '39.99',
          compare_at_price: '79.98',
          sku: 'ZAV-DENTURE-1SET',
          inventory_policy: 'continue',
          requires_shipping: true,
          taxable: true
        }
      ],
      images: images
    }
  };

  console.log('\nCreating Product in Shopify Admin API (status: draft)...');
  const createRes = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/products.json`, {
    method: 'POST',
    headers: {
      'X-Shopify-Access-Token': token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(productPayload)
  });

  const createData = await createRes.json();
  if (!createData.product) {
    throw new Error('Failed to create product: ' + JSON.stringify(createData));
  }

  const p = createData.product;
  console.log(`\n========================================================================`);
  console.log(`✓ PRODUCT CREATED SUCCESSFULLY!`);
  console.log(`ID: ${p.id}`);
  console.log(`Title: ${p.title}`);
  console.log(`Handle: ${p.handle}`);
  console.log(`Status: ${p.status}`);
  console.log(`Template Suffix: ${p.template_suffix}`);
  console.log(`Images: ${p.images?.length || 0}`);
  console.log(`Variants (${p.variants.length}):`);
  p.variants.forEach(v => {
    console.log(`  - ${v.title} (ID: ${v.id}): $${v.price} (Compare: $${v.compare_at_price}) [SKU: ${v.sku}]`);
  });
  console.log(`========================================================================\n`);

  // Write product details to file for subsequent steps
  fs.writeFileSync('./scratch/created_dentures_product.json', JSON.stringify(p, null, 2));
}

main().catch(console.error);
