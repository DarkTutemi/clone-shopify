// create_ortho_clouds_insole.mjs
import fs from 'fs';

const CLIENT_ID = '82d6aaab9e73809cb37b6643302b1255';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || "SHOPIFY_SECRET_TOKEN";
const SHOP_DOMAIN = 'vwpb1k-8z.myshopify.com';

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

async function main() {
  const token = await getAccessToken();

  // 1. Create Bronoir™ Ortho Clouds - Orthopedic Insoles
  console.log('Creating Bronoir™ Ortho Clouds - Orthopedic Insoles...');
  const createRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/2025-01/products.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify({
      product: {
        title: 'Bronoir™ Ortho Clouds - Orthopedic Insoles',
        handle: 'bronoir-ortho-clouds-orthopedic-insoles',
        product_type: 'Insoles',
        vendor: 'Bronoir',
        status: 'active',
        variants: [
          {
            price: '522000',
            compare_at_price: '654000',
            option1: 'Black'
          }
        ],
        images: [
          { src: 'https://trybronoir.com/cdn/shop/files/Mainimage-1_fa22d2c1-c13f-4deb-b89c-a991c61c0d2e.jpg' },
          { src: 'https://trybronoir.com/cdn/shop/files/Mainimage-3_faf20d70-1094-4b7a-83c6-4b131c1a282d.jpg' },
          { src: 'https://trybronoir.com/cdn/shop/files/Mainimage-4_b2babbd6-2597-480d-b72c-81150fe2aceb.jpg' }
        ]
      }
    })
  });
  const createData = await createRes.json();
  console.log('Created product result:', createData.product ? `ID: ${createData.product.id}` : createData);

  // 2. Update Fleece Insoles (15459274227866) with price & image
  console.log('Updating Bronoir Connect Fleece Insoles (15459274227866)...');
  const updateRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/2025-01/products/15459274227866.json`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify({
      product: {
        id: 15459274227866,
        variants: [
          {
            price: '785000',
            compare_at_price: '1047000'
          }
        ],
        images: [
          { src: 'https://trybronoir.com/cdn/shop/files/products_KopievonWinterBarfussschuhe_4.png' },
          { src: 'https://trybronoir.com/cdn/shop/files/products_KopievonWinterBarfussschuhe_5.png' }
        ]
      }
    })
  });
  const updateData = await updateRes.json();
  console.log('Updated fleece insole result:', updateData.product ? 'OK' : updateData);
}

main();
