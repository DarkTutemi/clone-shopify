import fs from 'fs';

const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = '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';
const SHOP = 'dsdujr-vn.myshopify.com';
const COLLECTION_ID = 510448337081;

async function getAccessToken() {
  const res = await fetch(`https://${SHOP}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'client_credentials'
    })
  });
  return (await res.json()).access_token;
}

async function run() {
  const token = await getAccessToken();
  console.log('Got access token. Creating Zavelyn Handpan Master 22" (12 Notes 432Hz)...');

  // Prepare images with base64 attachment
  const imageFiles = [
    { file: 'ali_images/img_1.jpg', alt: 'Zavelyn Handpan Master 22 Inch 12 Notes 432Hz with Tripod Stand and Bag' },
    { file: 'ali_images/img_2.jpg', alt: 'Zavelyn Handpan Master 12 Dimple Tone Fields Close-up' },
    { file: 'ali_images/img_4.jpg', alt: 'Zavelyn Handpan Master on Tripod Stand with Braided Rope' },
    { file: 'ali_images/img_3.png', alt: 'Zavelyn Handpan Master Resonant Acoustic Gu Soundhole' },
    { file: 'ali_images/img_5.jpg', alt: 'Zavelyn Handpan Master Dimensions 55cm Diameter 28cm Height' },
    { file: 'ali_images/img_6.jpg', alt: 'Zavelyn Handpan Master Included Accessories Tripod Stand Bag Mallets' }
  ];

  const imagesPayload = imageFiles.map((item, index) => {
    const buf = fs.readFileSync(item.file);
    return {
      position: index + 1,
      alt: item.alt,
      attachment: buf.toString('base64'),
      filename: item.file.split('/').pop()
    };
  });

  const bodyHtml = `
    <h2>The Definitive 22-Inch Concert Handpan in Pure 432 Hz Resonance</h2>
    <p>The <strong>Zavelyn Handpan™ Master</strong> represents the absolute zenith of harmonic sound sculpture. Meticulously hand-hammered and nitrogen-hardened from high-grade nitrided carbon steel, this full-sized <strong>22-inch (55 cm)</strong> concert instrument is tuned in <strong>D-Minor Kurd</strong> across <strong>12 resonant tone fields</strong> at the biological healing frequency of <strong>432 Hz</strong>.</p>
    
    <h3>Why the Zavelyn Handpan™ Master is Unrivaled:</h3>
    <ul>
      <li><strong>12 Harmonic Tone Fields (D-Minor Kurd):</strong> Central Ding (D3) surrounded by 11 meticulously tuned dimples (A3, Bb3, C4, D4, E4, F4, G4, A4, C5, D5, E5) providing expansive melodic storytelling.</li>
      <li><strong>Concert-Grade Cathedral Sustain:</strong> Nitrided steel treatment creates warm, bell-like sustain that lingers in the air without dissonant cross-talk.</li>
      <li><strong>432 Hz Natural Biological Alignment:</strong> Calibrated to induce deep parasympathetic relaxation, heart-rate deceleration, and restorative meditative states.</li>
      <li><strong>Hand-Hammered Artistry:</strong> Every individual tone field is shaped and tuned by master acoustic artisans with lifelong pitch stability.</li>
      <li><strong>All-Weather Protection:</strong> High-temperature nitriding provides extreme scratch, moisture, and corrosion resistance.</li>
    </ul>

    <h3>What's Included in Your Complete Master Set:</h3>
    <ul>
      <li>1x Zavelyn Handpan™ Master (22-Inch / 55 cm, 12 Notes, 432 Hz)</li>
      <li>1x Foldable Heavy-Duty Aluminum Handpan Tripod Stand</li>
      <li>1x Premium Padded Travel Backpack with Reinforced Dual Shoulder Straps</li>
      <li>1x Pair of Acoustic Wooden Mallets with Balanced Rubber Heads</li>
      <li>1x Hand-Woven Protective Braided Edge Rope Wrap</li>
      <li>1x Set of Visual Tone Stickers</li>
      <li>1x Microfiber Instrument Cleaning Cloth</li>
    </ul>
  `;

  const newProductPayload = {
    product: {
      title: 'Zavelyn Handpan™ Master (12-Tone 432Hz D-Minor Kurd)',
      handle: 'zavelyn-handpan-master',
      vendor: 'Zavelyn',
      product_type: 'Handpan & Steel Tongue Drum',
      template_suffix: 'zavelyn-handpan-master',
      status: 'active',
      tags: '12 Tone, 432Hz, D-Minor Kurd, Handpan, 22-Inch, Master Series, Concert Handpan, Meditation, Sound Healing',
      body_html: bodyHtml,
      options: [
        {
          name: 'Scale & Frequency',
          values: ['432Hz (12 Notes)']
        }
      ],
      variants: [
        {
          option1: '432Hz (12 Notes)',
          price: '599.00',
          compare_at_price: '1199.00',
          sku: 'ZAV-HP-MST-432-12',
          requires_shipping: true,
          taxable: true,
          inventory_policy: 'continue',
          inventory_management: null
        }
      ],
      images: imagesPayload
    }
  };

  // Check if product already exists
  const existingCheck = await fetch(`https://${SHOP}/admin/api/2024-10/products.json?handle=zavelyn-handpan-master`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const existingData = await existingCheck.json();
  let productId;

  if (existingData.products && existingData.products.length > 0) {
    productId = existingData.products[0].id;
    console.log(`Product already exists with ID: ${productId}. Updating...`);
    newProductPayload.product.id = productId;
    const updateRes = await fetch(`https://${SHOP}/admin/api/2024-10/products/${productId}.json`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': token
      },
      body: JSON.stringify(newProductPayload)
    });
    const updateData = await updateRes.json();
    console.log('Product update result:', updateData.product ? 'SUCCESS' : JSON.stringify(updateData));
  } else {
    console.log('Creating new product on Shopify...');
    const createRes = await fetch(`https://${SHOP}/admin/api/2024-10/products.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': token
      },
      body: JSON.stringify(newProductPayload)
    });
    const createData = await createRes.json();
    if (!createData.product) {
      console.error('Failed to create product:', JSON.stringify(createData));
      return;
    }
    productId = createData.product.id;
    console.log(`✔ Created product successfully! ID: ${productId}`);
  }

  // 2. Add to Collection 510448337081
  console.log(`\nAdding product ${productId} to collection ${COLLECTION_ID}...`);
  const collectRes = await fetch(`https://${SHOP}/admin/api/2024-10/collects.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify({
      collect: {
        collection_id: COLLECTION_ID,
        product_id: productId
      }
    })
  });
  const collectData = await collectRes.json();
  console.log('Collect result:', collectData.collect ? 'SUCCESS' : JSON.stringify(collectData));

  // 3. Output product details and image URLs
  const checkRes = await fetch(`https://${SHOP}/admin/api/2024-10/products/${productId}.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const checkData = await checkRes.json();
  const finalProduct = checkData.product;
  console.log('\n--- CREATED PRODUCT DETAILS ---');
  console.log(`Title: ${finalProduct.title}`);
  console.log(`Handle: ${finalProduct.handle}`);
  console.log(`Variants: ${finalProduct.variants.length}`);
  finalProduct.variants.forEach(v => {
    console.log(`  Variant ID: ${v.id} | Title: "${v.title}" | Price: $${v.price} | CompareAt: $${v.compare_at_price}`);
  });
  console.log(`Images: ${finalProduct.images.length}`);
  finalProduct.images.forEach((img, idx) => {
    console.log(`  Img #${idx+1}: ${img.src}`);
  });

  // Save product data locally for building template
  fs.writeFileSync('Clone-pandadrum/created_master_handpan.json', JSON.stringify(finalProduct, null, 2));
}

run().catch(console.error);
