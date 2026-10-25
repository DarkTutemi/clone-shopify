import fs from 'fs';

const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = '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';
const SHOP = 'dsdujr-vn.myshopify.com';
const PRODUCT_ID = '15459315220665';

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

  // 1. Fetch current product
  const pRes = await fetch(`https://${SHOP}/admin/api/2024-10/products/${PRODUCT_ID}.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const pData = await pRes.json();
  const product = pData.product;
  console.log('Current product:', product.title);
  console.log('Current variants count:', product.variants.length);

  // 2. We want 5 variants: Green, Black, Navy, Purple, Gold
  const targetColors = ['Green', 'Black', 'Navy', 'Purple', 'Gold'];

  // Let's first update product options values and update variants
  // Update the product description to 13-Inch as well
  let updatedBody = product.body_html;
  if (updatedBody.includes('14-Inch')) {
    updatedBody = updatedBody.replace(/14-Inch/g, '13-Inch');
    console.log('Updated body_html 14-Inch -> 13-Inch');
  }
  if (updatedBody.includes('14 Inches')) {
    updatedBody = updatedBody.replace(/14 Inches/g, '13 Inches');
    console.log('Updated body_html 14 Inches -> 13 Inches');
  }

  // Update product body_html first
  const updateBodyRes = await fetch(`https://${SHOP}/admin/api/2024-10/products/${PRODUCT_ID}.json`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify({
      product: {
        id: PRODUCT_ID,
        body_html: updatedBody
      }
    })
  });
  const updateBodyData = await updateBodyRes.json();
  console.log('Body update result:', updateBodyData.product ? 'SUCCESS' : JSON.stringify(updateBodyData));

  // Now delete extra variants (from index 5 onwards: Emerald Green, Pink Tan, Burgundy)
  const variantsToDelete = product.variants.slice(5);
  for (const v of variantsToDelete) {
    console.log(`Deleting variant ${v.id} (${v.title})...`);
    const dRes = await fetch(`https://${SHOP}/admin/api/2024-10/products/${PRODUCT_ID}/variants/${v.id}.json`, {
      method: 'DELETE',
      headers: { 'X-Shopify-Access-Token': token }
    });
    console.log(`Delete ${v.id} status:`, dRes.status);
  }

  // Now update the first 5 variants to target colors
  const variantsToUpdate = product.variants.slice(0, 5);
  for (let i = 0; i < targetColors.length; i++) {
    const v = variantsToUpdate[i];
    const newColor = targetColors[i];
    console.log(`Updating variant ${v.id} to "${newColor}"...`);
    const uRes = await fetch(`https://${SHOP}/admin/api/2024-10/variants/${v.id}.json`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': token
      },
      body: JSON.stringify({
        variant: {
          id: v.id,
          option1: newColor,
          price: '259.95',
          compare_at_price: '499.95',
          sku: `ZAV-PRO-13-${newColor.toUpperCase().slice(0, 3)}`
        }
      })
    });
    const uData = await uRes.json();
    console.log(`Variant ${v.id} result:`, uData.variant ? uData.variant.title : JSON.stringify(uData));
  }

  // Verify resulting product
  const checkRes = await fetch(`https://${SHOP}/admin/api/2024-10/products/${PRODUCT_ID}.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const checkData = await checkRes.json();
  console.log('\n--- FINAL VARIANTS ---');
  checkData.product.variants.forEach(v => {
    console.log(`- ID: ${v.id} | Title: "${v.title}" | Price: ${v.price} | CompareAt: ${v.compare_at_price} | Option1: ${v.option1}`);
  });
}

run().catch(console.error);
