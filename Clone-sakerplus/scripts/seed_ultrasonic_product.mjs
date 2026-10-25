import fs from 'fs';

const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';
const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || "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";

async function getAccessToken() {
  const res = await fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
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

async function fetchImageAsBase64(url) {
  try {
    const res = await fetch(url, {
      headers: {
        'Referer': 'https://m.sakerplus.com/',
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });
    if (!res.ok) return null;
    const arrayBuffer = await res.arrayBuffer();
    return Buffer.from(arrayBuffer).toString('base64');
  } catch (e) {
    console.error(`Failed to download ${url}:`, e.message);
    return null;
  }
}

async function main() {
  const token = await getAccessToken();
  console.log('Got access token.');

  const imageUrls = [
    'https://cdn.myshopage.com/db25d099-77fd-4ea4-8503-2f77737c8100/w1280.jpg',
    'https://cdn.myshopage.com/24dd62ec-c890-4ed9-6912-962119825500/w450.png',
    'https://cdn.myshopage.com/7b4e2e96-606c-4ab1-07ee-b7f9654d2200.jpg',
    'https://cdn.myshopage.com/066aa7cc-33b7-4d5c-6434-02d3bfc4fa00.jpg',
    'https://cdn.myshopage.com/09d31e6e-8ed3-4c5f-3f60-7a8e1a78b100.jpg',
    'https://cdn.myshopage.com/bc2d277c-b322-4fcc-661e-ddd1ef72c400.jpg',
    'https://cdn.myshopage.com/6fed926e-cf4e-4e2f-d855-7c3d46ca5600.jpg',
    'https://cdn.myshopage.com/4f369144-595b-4b87-7588-4ba680a98f00.jpg',
    'https://cdn.myshopage.com/48f526bb-90b9-4a74-fe9b-ee0786647500.jpg'
  ];

  console.log('Downloading and converting images to base64...');
  const imageAttachments = [];
  for (let i = 0; i < imageUrls.length; i++) {
    const b64 = await fetchImageAsBase64(imageUrls[i]);
    if (b64) {
      imageAttachments.push({
        attachment: b64,
        filename: `saker-ultrasonic-cutter-${i + 1}.jpg`
      });
      console.log(`  ✔ Prepared image ${i + 1}/${imageUrls.length}`);
    }
  }

  const descriptionHtml = `
<div class="saker-product-description">
  <h3><strong>Saker® 40kHz Cordless Ultrasonic Precision Cutter & Grinder Kit</strong></h3>
  <p>Experience effortless, razor-sharp precision cutting with the <strong>Saker® 40kHz Ultrasonic Precision Cutter</strong>. Operating at an astonishing <strong>40,000 vibrations per second</strong>, this ultrasonic micro-movement transforms standard craft blades into an ultra-smooth cutting laser that slices through resistant materials like butter—with <strong>zero burning, no melting edges, and zero splintering</strong>.</p>

  <hr>

  <h4><strong>🌟 KEY FEATURES:</strong></h4>
  <ul>
    <li><strong>40,000 Hz Ultrasonic Micro-Vibrations:</strong> Reduces cutting resistance by over 80%, allowing razor-clean cuts through dense materials with gentle hand guidance.</li>
    <li><strong>Cordless & Ergonomic Freedom:</strong> High-density lithium battery provides up to 120 minutes of continuous runtime per charge. No cables getting in your way.</li>
    <li><strong>Ultra-Clean Cut Edges:</strong> Eliminates burrs, rough margins, and stress fractures on delicate acrylics, 3D resin prints, and hobby models.</li>
    <li><strong>Quick-Release Blade Chuck:</strong> Swap out specialized surgical-grade blades in seconds. Comes with 50 replacement blades!</li>
    <li><strong>Intelligent Thermal Safety Control:</strong> Built-in microprocessor monitors heat levels and delivers constant cutting frequency under load.</li>
  </ul>

  <hr>

  <h4><strong>📦 PACKAGE BUNDLE OPTIONS:</strong></h4>
  <p><strong>Option 1: YO9 - Wireless Lithium Battery Version (Best Seller)</strong></p>
  <ul>
    <li>1 × Saker® 40kHz Cordless Ultrasonic Cutter Body</li>
    <li>1 × Heavy-Duty Storage Organizer Case</li>
    <li>50 × Interchangeable Surgical Steel Blades (5 Specialized Styles)</li>
    <li>1 × High-Speed USB-C Fast Charging Cable</li>
    <li>1 × Blade Lock Hex Key & Safety Cap</li>
  </ul>

  <p><strong>Option 2: Y10-PRO - Wired Version (Plug-In Continuous Studio Use)</strong></p>
  <ul>
    <li>1 × Saker® 40kHz High-Power Ultrasonic Studio Unit</li>
    <li>50 × Interchangeable Blades (6 Styles)</li>
    <li>4 × Cut-Resistant Silicone Protective Finger Sleeves</li>
    <li>1 × Magnetic Anti-Static Work Mat</li>
    <li>1 × AC High-Output Power Adapter</li>
  </ul>

  <hr>

  <h4><strong>⚙️ TECHNICAL SPECIFICATIONS:</strong></h4>
  <ul>
    <li><strong>Vibration Frequency:</strong> 40,000 Hz (40 kHz)</li>
    <li><strong>Max Power Output:</strong> 35W High-Torque Ultrasonic Driver</li>
    <li><strong>Battery Type (YO9):</strong> 2600mAh Rechargeable Lithium-Ion</li>
    <li><strong>Charging Interface:</strong> USB Type-C (5V / 2A)</li>
    <li><strong>Compatible Materials:</strong> 3D Prints (PLA/ABS/PETG/Resin), Acrylic, Carbon Fiber, Leather, Balsa Wood, PCB, Silicone, Rubber, Cardboard.</li>
  </ul>
</div>
`;

  const productPayload = {
    product: {
      title: "Saker® 40kHz Cordless Ultrasonic Precision Cutter Kit",
      handle: "saker-cordless-ultrasonic-cutter-and-grinder",
      body_html: descriptionHtml,
      vendor: "Sakerplus",
      product_type: "Power Tools",
      tags: "Power Tools, Ultrasonic Cutter, Best Sellers, Featured, Precision Tools, New Arrivals",
      status: "active",
      options: [
        {
          name: "Bundle Version"
        }
      ],
      variants: [
        {
          option1: "YO9-Wireless Lithium Battery Version",
          price: "169.99",
          compare_at_price: "339.99",
          sku: "SK-USC-YO9-WL",
          inventory_management: null,
          requires_shipping: true
        },
        {
          option1: "Y10-PRO-Wired Version (Plug-In Use)",
          price: "149.99",
          compare_at_price: "299.99",
          sku: "SK-USC-Y10-WD",
          inventory_management: null,
          requires_shipping: true
        }
      ],
      images: imageAttachments
    }
  };

  console.log('Sending Product Create request to Shopify Admin REST API...');
  const res = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/products.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify(productPayload)
  });

  if (res.ok) {
    const data = await res.json();
    console.log(`🎉 SUCCESS! Product Created!`);
    console.log(`  ID: ${data.product.id}`);
    console.log(`  Title: ${data.product.title}`);
    console.log(`  Handle: ${data.product.handle}`);
    console.log(`  Variants: ${data.product.variants.length}`);
    console.log(`  Images: ${data.product.images.length}`);
    console.log(`  URL: https://${SHOP_DOMAIN}/products/${data.product.handle}`);

    fs.writeFileSync('Clone-sakerplus/data/ultrasonic_product_created.json', JSON.stringify(data, null, 2));
    return data.product;
  } else {
    const err = await res.text();
    console.error('Failed to create product:', err);
    return null;
  }
}

main().catch(console.error);
