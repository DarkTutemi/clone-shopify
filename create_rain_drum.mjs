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
  console.log('Got access token. Creating Zavelyn Rain Drum™ (3-Inch 6-Tone Outdoor Pocket Drum)...');

  // Prepare images with base64 attachment
  const imageFiles = [
    { file: 'ali_images2/img_1.jpg', alt: 'Zavelyn Rain Drum 3 Inch 6 Tones All 5 Colors Green Black Navy Purple Gold' },
    { file: 'ali_images2/img_2.jpg', alt: 'Zavelyn Rain Drum Gold Purple Green with Mallets' },
    { file: 'ali_images2/img_3.jpg', alt: 'Zavelyn Rain Drum Outdoor Sound Experience' },
    { file: 'ali_images2/img_4.jpg', alt: 'Zavelyn Rain Drum Dimensions 8cm 3 Inch Diameter 115g' },
    { file: 'ali_images2/img_5.png', alt: 'Zavelyn Rain Drum Close-up Playing with Mallet' }
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
    <h2>The Enchanting 3-Inch Outdoor Garden Rain Drum &amp; Pocket Melodic Companion</h2>
    <p>The <strong>Zavelyn Rain Drum™</strong> is our ultra-portable 3-inch (8 cm) 6-tone steel tongue drum designed for both acoustic outdoor garden ambiance and on-the-go mindful relaxation. Place it on your patio, balcony, or garden rockery to let raindrops play natural chime symphonies, or tap serene melodies anywhere using the included solid wooden mallet.</p>
    
    <h3>Why You Will Adore the Zavelyn Rain Drum™:</h3>
    <ul>
      <li><strong>Natural Raindrop Resonator:</strong> Specially tuned harmonic tongues ring out crystal-clear chimes whenever outdoor raindrops patter across its surface.</li>
      <li><strong>Pocket-Sized Portability:</strong> At just 3 inches (8 cm) and 115 grams, it slips effortlessly into your pocket, backpack, or desk drawer for instant stress relief.</li>
      <li><strong>6 Harmonic Chime Notes:</strong> Precision laser-cut Pentatonic scale guarantees every tap produces sweet, chime-like, meditative tones with zero discordance.</li>
      <li><strong>All-Weather Rustproof Enamel:</strong> Electrostatic baked powder-coated finish repels rain, humidity, sun, and frost for years of outdoor enjoyment.</li>
      <li><strong>No Musical Skill Needed:</strong> Numbered tone petals make intuitive play effortless for toddlers, adults, and grandparents alike.</li>
    </ul>

    <h3>What's Included in Your Rain Drum Kit:</h3>
    <ul>
      <li>1x Zavelyn Rain Drum™ (3-Inch / 8 cm, 6-Tone Pentatonic Tuning)</li>
      <li>1x Solid Wooden Mallet with Rubber Resonance Tip</li>
      <li>1x Set of Pre-Applied Numbered Tone Decals</li>
      <li>1x Pocket Protective Velvet Pouch</li>
    </ul>
  `;

  const colors = ['Green', 'Black', 'Navy', 'Purple', 'Gold'];

  const variantsPayload = colors.map((col, idx) => ({
    option1: col,
    price: '59.00',
    compare_at_price: '118.00',
    sku: `ZAV-RAIN-3-${col.toUpperCase().slice(0, 3)}`,
    requires_shipping: true,
    taxable: true,
    inventory_policy: 'continue',
    inventory_management: null
  }));

  const newProductPayload = {
    product: {
      title: 'Zavelyn Rain Drum™ (3-Inch 6-Tone Outdoor Pocket Drum)',
      handle: 'zavelyn-rain-drum',
      vendor: 'Zavelyn',
      product_type: 'Handpan & Steel Tongue Drum',
      template_suffix: 'zavelyn-rain-drum',
      status: 'active',
      tags: '6 Tone, 3-Inch, Rain Drum, Pocket Drum, Outdoor, Garden Drum, Meditation, Steel Tongue Drum, Zavelyn Rain Drum',
      body_html: bodyHtml,
      options: [
        {
          name: 'Color',
          values: colors
        }
      ],
      variants: variantsPayload,
      images: imagesPayload
    }
  };

  // Check if product already exists
  const existingCheck = await fetch(`https://${SHOP}/admin/api/2024-10/products.json?handle=zavelyn-rain-drum`, {
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
  console.log(`Variants (${finalProduct.variants.length}):`);
  finalProduct.variants.forEach(v => {
    console.log(`  Variant ID: ${v.id} | Title: "${v.title}" | Price: $${v.price} | CompareAt: $${v.compare_at_price}`);
  });
  console.log(`Images (${finalProduct.images.length}):`);
  finalProduct.images.forEach((img, idx) => {
    console.log(`  Img #${idx+1}: ${img.src}`);
  });

  fs.writeFileSync('Clone-pandadrum/created_rain_drum.json', JSON.stringify(finalProduct, null, 2));
}

run().catch(console.error);
