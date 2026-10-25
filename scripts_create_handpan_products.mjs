import fs from 'fs';

const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = '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';
const SHOP = 'dsdujr-vn.myshopify.com';

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
  const data = await res.json();
  return data.access_token;
}

const productsToCreate = [
  {
    key: 'pro',
    title: 'Zavelyn Drum™ Pro (15-Tone Steel Tongue Handpan Drum)',
    handle: 'zavelyn-drum-pro',
    template_suffix: 'zavelyn-drum-pro',
    product_type: 'Handpan & Steel Tongue Drum',
    vendor: 'Zavelyn',
    tags: 'Handpan, Steel Tongue Drum, Zavelyn Drum Pro, 15 Tone, 432Hz, Sound Healing, Meditation, D-Major',
    body_html: `
      <h2>The Master Instrument for Harmonic Sound Healing & Musical Expression</h2>
      <p>The <strong>Zavelyn Drum™ Pro</strong> is our flagship 15-tone handcrafted steel tongue handpan drum. Tuned with surgical precision to the healing frequency of <strong>432 Hz</strong> in D-Major, it offers an expansive two-octave musical range that allows you to play virtually any song, create meditative soundscapes, or effortlessly unwind after a long day.</p>
      <h3>Why the Zavelyn Drum™ Pro is Extraordinary:</h3>
      <ul>
        <li><strong>15 Harmonic Notes:</strong> Full chromatic-extended D-Major scale covering deep bass undertones, warm mid-ranges, and crystal-clear high resonances.</li>
        <li><strong>432 Hz Natural Frequency:</strong> Scientifically recognized to induce alpha brainwave states, promoting cellular relaxation, anxiety relief, and deep focus.</li>
        <li><strong>Premium Alloy Steel Craftsmanship:</strong> Hand-cut and electroplated against tarnishing, scratches, and humidity for lifelong tonal stability.</li>
        <li><strong>Zero Experience Required:</strong> Numbered note system and intuitive harmonic layout make it impossible to hit a discordant note.</li>
      </ul>
      <h3>What's Included in Your Pro Bundle:</h3>
      <ul>
        <li>1x Zavelyn Drum™ Pro (15-Tone, 14-Inch Diameter)</li>
        <li>1x Heavy-Duty Padded Travel Backpack with Dual Shoulder Straps</li>
        <li>1x Pair of Solid Bamboo Mallets with Weighted Rubber Heads</li>
        <li>1x Comprehensive Master Songbook & Tutorial Guide (Numbered Notation)</li>
        <li>4x Ergonomic Silicone Finger Picks</li>
        <li>1x Set of High-Visibility Gold Note Decals</li>
      </ul>
    `,
    variants: [
      { option1: 'White', price: '259.95', compare_at_price: '499.95', sku: 'ZAV-PRO-WHT' },
      { option1: 'Black', price: '259.95', compare_at_price: '499.95', sku: 'ZAV-PRO-BLK' },
      { option1: 'Silver', price: '259.95', compare_at_price: '499.95', sku: 'ZAV-PRO-SLV' },
      { option1: 'Blue', price: '259.95', compare_at_price: '499.95', sku: 'ZAV-PRO-BLU' },
      { option1: 'Sandstone', price: '259.95', compare_at_price: '499.95', sku: 'ZAV-PRO-SND' },
      { option1: 'Emerald Green', price: '259.95', compare_at_price: '499.95', sku: 'ZAV-PRO-GRN' },
      { option1: 'Pink Tan', price: '259.95', compare_at_price: '499.95', sku: 'ZAV-PRO-PTN' },
      { option1: 'Burgundy', price: '259.95', compare_at_price: '499.95', sku: 'ZAV-PRO-BUR' }
    ],
    images: [
      'https://cdn.shopify.com/s/files/1/0566/1209/4037/files/PandaDrumPro_White.webp?v=1716783328',
      'https://cdn.shopify.com/s/files/1/0566/1209/4037/files/PandaDrumPro_White_Th_Pts.webp?v=1716961111',
      'https://cdn.shopify.com/s/files/1/0566/1209/4037/files/PandaDrumPro_White_1a_LFs.webp?v=1716961111',
      'https://cdn.shopify.com/s/files/1/0566/1209/4037/files/details.webp?v=1751703134',
      'https://cdn.shopify.com/s/files/1/0566/1209/4037/files/Pro_Black_Stickers.webp?v=1751703134',
      'https://cdn.shopify.com/s/files/1/0566/1209/4037/files/inside.webp?v=1751703134',
      'https://cdn.shopify.com/s/files/1/0566/1209/4037/products/DSC7112.webp?v=1751703134',
      'https://cdn.shopify.com/s/files/1/0566/1209/4037/files/UnpackingPro.webp?v=1751703134'
    ]
  },
  {
    key: 'plus',
    title: 'Zavelyn Drum™ Plus (11-Tone Steel Tongue Handpan Drum)',
    handle: 'zavelyn-drum-plus',
    template_suffix: 'zavelyn-drum-plus',
    product_type: 'Handpan & Steel Tongue Drum',
    vendor: 'Zavelyn',
    tags: 'Handpan, Steel Tongue Drum, Zavelyn Drum Plus, 11 Tone, 432Hz, Most Popular, Meditation, D-Major',
    body_html: `
      <h2>The Most Popular & Versatile Steel Handpan for Everyday Relaxation</h2>
      <p>The <strong>Zavelyn Drum™ Plus</strong> is our most beloved 11-tone handcrafted tongue drum. Sized at a comfortable 10 to 11 inches, it strikes the ideal balance between rich acoustic resonance and portable convenience. Perfectly calibrated to <strong>432 Hz</strong>, every tap resonates with soothing sustain that instantly melts away mental stress.</p>
      <h3>Why the Zavelyn Drum™ Plus is a Customer Favorite:</h3>
      <ul>
        <li><strong>11 Versatile Notes:</strong> Carefully tuned in D-Major, giving you the musical depth to play dozens of classic melodies, lullabies, and ambient chords.</li>
        <li><strong>Calming Therapeutic Sound:</strong> Produces bell-like tones with natural acoustic reverberation that quiets an overactive mind in minutes.</li>
        <li><strong>Ideal for Adults & Children (Ages 4+):</strong> Ergonomic size fits comfortably on your lap, desk, or meditation altar.</li>
        <li><strong>Durable Protective Coating:</strong> Multi-layered baked enamel finish resists chipping, rust, and fingerprint stains.</li>
      </ul>
      <h3>What's Included in Your Plus Bundle:</h3>
      <ul>
        <li>1x Zavelyn Drum™ Plus (11-Tone, 10-Inch Diameter)</li>
        <li>1x Padded Zippered Travel Carry Bag</li>
        <li>1x Pair of Natural Wood Mallets</li>
        <li>1x Beginner Songbook with Easy Numbered Tabs</li>
        <li>4x Silicone Finger Playing Tips</li>
        <li>1x Set of Note Guide Stickers</li>
      </ul>
    `,
    variants: [
      { option1: 'White', price: '159.95', compare_at_price: '299.95', sku: 'ZAV-PLS-WHT' },
      { option1: 'Black', price: '159.95', compare_at_price: '299.95', sku: 'ZAV-PLS-BLK' },
      { option1: 'Emerald Green', price: '159.95', compare_at_price: '299.95', sku: 'ZAV-PLS-GRN' },
      { option1: 'Red', price: '159.95', compare_at_price: '299.95', sku: 'ZAV-PLS-RED' },
      { option1: 'Blue', price: '159.95', compare_at_price: '299.95', sku: 'ZAV-PLS-BLU' },
      { option1: 'Pink', price: '159.95', compare_at_price: '299.95', sku: 'ZAV-PLS-PNK' },
      { option1: 'Sandstone', price: '159.95', compare_at_price: '299.95', sku: 'ZAV-PLS-SND' },
      { option1: 'Pink Tan', price: '159.95', compare_at_price: '299.95', sku: 'ZAV-PLS-PTN' }
    ],
    images: [
      'https://cdn.shopify.com/s/files/1/0566/1209/4037/files/PandaDrum_Plus_White.webp?v=1716735931',
      'https://cdn.shopify.com/s/files/1/0566/1209/4037/files/PDwhit_lfstl.webp?v=1716736589',
      'https://cdn.shopify.com/s/files/1/0566/1209/4037/files/78.jpg?v=1716736589',
      'https://cdn.shopify.com/s/files/1/0566/1209/4037/files/PDWHITEBG_LIFESTYLE.webp?v=1716736589',
      'https://cdn.shopify.com/s/files/1/0566/1209/4037/files/plusinside.webp?v=1751703631',
      'https://cdn.shopify.com/s/files/1/0566/1209/4037/files/Plus_black1000x1000.webp?v=1751703631',
      'https://cdn.shopify.com/s/files/1/0566/1209/4037/files/sideplusblack.webp?v=1751703802',
      'https://cdn.shopify.com/s/files/1/0566/1209/4037/files/PandaDrum_Plus_White_Lifestyle_white_bg.webp?v=1751703802'
    ]
  },
  {
    key: 'mini',
    title: 'Zavelyn Drum™ Mini (8-Tone Steel Tongue Handpan Drum)',
    handle: 'zavelyn-drum-mini',
    template_suffix: 'zavelyn-drum-mini',
    product_type: 'Handpan & Steel Tongue Drum',
    vendor: 'Zavelyn',
    tags: 'Handpan, Steel Tongue Drum, Zavelyn Drum Mini, 8 Tone, 432Hz, Compact, Kids, Beginner, Pentatonic',
    body_html: `
      <h2>Compact 6-Inch Handpan for Mindfulness, Travel & Young Explorers</h2>
      <p>The <strong>Zavelyn Drum™ Mini</strong> delivers enchanting acoustic harmony in an ultra-portable 6-inch form factor. Tuned to an 8-tone pentatonic C-scale at <strong>432 Hz</strong>, it is literally impossible to play a wrong note. Whether you are introducing children to musical creativity or packing a pocket sound bowl for nature walks, the Zavelyn Mini is your soothing sonic companion.</p>
      <h3>Highlights of the Zavelyn Drum™ Mini:</h3>
      <ul>
        <li><strong>8 Pentatonic Notes:</strong> Harmonious pentatonic scale where every combination of notes sounds sweet, melodious, and deeply peaceful.</li>
        <li><strong>Ultra-Lightweight & Portable:</strong> Weighs just 1.3 lbs (600g)—easily slips into a tote bag, backpack, or carry-on luggage.</li>
        <li><strong>Child-Safe & Screen-Free Engagement:</strong> Perfect for children aged 1-4+ to develop rhythm, auditory sensory processing, and emotional calm.</li>
        <li><strong>Laser-Cut Precision Steel:</strong> Hand-inspected acoustic tongues that hold true pitch indefinitely.</li>
      </ul>
      <h3>What's Included in Your Mini Bundle:</h3>
      <ul>
        <li>1x Zavelyn Drum™ Mini (8-Tone, 6-Inch Diameter)</li>
        <li>1x Travel Drawstring Pouch</li>
        <li>1x Pair of Mini Rubber-Tipped Mallets</li>
        <li>1x Introductory Songbook</li>
        <li>1x Note Marker Sticker Sheet</li>
      </ul>
    `,
    variants: [
      { option1: 'White', price: '109.95', compare_at_price: '179.95', sku: 'ZAV-MIN-WHT' },
      { option1: 'Red', price: '109.95', compare_at_price: '179.95', sku: 'ZAV-MIN-RED' },
      { option1: 'Black', price: '109.95', compare_at_price: '179.95', sku: 'ZAV-MIN-BLK' },
      { option1: 'Blue', price: '109.95', compare_at_price: '179.95', sku: 'ZAV-MIN-BLU' },
      { option1: 'Sandstone', price: '109.95', compare_at_price: '179.95', sku: 'ZAV-MIN-SND' },
      { option1: 'Pink', price: '109.95', compare_at_price: '179.95', sku: 'ZAV-MIN-PNK' },
      { option1: 'Pink Tan', price: '109.95', compare_at_price: '179.95', sku: 'ZAV-MIN-PTN' }
    ],
    images: [
      'https://cdn.shopify.com/s/files/1/0566/1209/4037/files/Mini_white.webp?v=1716782465',
      'https://cdn.shopify.com/s/files/1/0566/1209/4037/files/Mini_White2.webp?v=1716782465',
      'https://cdn.shopify.com/s/files/1/0566/1209/4037/products/panda-drum-6-inch-steel-tongue-drum.jpg?v=1716782465',
      'https://cdn.shopify.com/s/files/1/0566/1209/4037/products/1Box_Drum_8_new.jpg?v=1716782465',
      'https://cdn.shopify.com/s/files/1/0566/1209/4037/products/8-tone_6-inch_steel_tongue_panda_drum_help_by_a_little_girl.jpg?v=1716782465',
      'https://cdn.shopify.com/s/files/1/0566/1209/4037/products/drums_osteroy.jpg?v=1716782465',
      'https://cdn.shopify.com/s/files/1/0566/1209/4037/files/Mini_red.webp?v=1716782465',
      'https://cdn.shopify.com/s/files/1/0566/1209/4037/files/Mini_Sandstone.webp?v=1716782465'
    ]
  }
];

async function run() {
  const token = await getAccessToken();
  console.log('Got access token. Creating 3 Handpan products on Shopify...');

  const createdProducts = [];

  for (const item of productsToCreate) {
    console.log(`\nCreating ${item.title}...`);
    const payload = {
      product: {
        title: item.title,
        body_html: item.body_html,
        vendor: item.vendor,
        product_type: item.product_type,
        handle: item.handle,
        template_suffix: item.template_suffix,
        tags: item.tags,
        options: [{ name: 'Color' }],
        variants: item.variants.map(v => ({
          option1: v.option1,
          price: v.price,
          compare_at_price: v.compare_at_price,
          sku: v.sku,
          inventory_management: null,
          inventory_policy: 'continue',
          requires_shipping: true
        })),
        images: item.images.map(img => ({ src: img }))
      }
    };

    const res = await fetch(`https://${SHOP}/admin/api/2024-10/products.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': token
      },
      body: JSON.stringify(payload)
    });

    const data = await res.json();
    if (res.ok && data.product) {
      console.log(`  ✔ Successfully created: ${data.product.title}`);
      console.log(`    Product ID: ${data.product.id} | Handle: ${data.product.handle} | Variants: ${data.product.variants.length}`);
      createdProducts.push(data.product);
    } else {
      console.error(`  ✗ Failed to create ${item.title}:`, JSON.stringify(data.errors || data));
    }
  }

  fs.writeFileSync('Clone-pandadrum/created_products.json', JSON.stringify(createdProducts, null, 2));
  console.log(`\nSaved created products info to Clone-pandadrum/created_products.json`);
}

run().catch(console.error);
