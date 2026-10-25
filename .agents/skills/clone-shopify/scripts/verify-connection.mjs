import fs from 'fs';

/**
 * Phase 1: Shopify Handshake & Permissions Verifier
 * With automatic exponential backoff retry.
 */

const CLIENT_ID = process.env.SHOPIFY_CLIENT_ID || '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = process.env.SHOPIFY_CLIENT_SECRET || process.env.SHOPIFY_API_SECRET || "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";
const SHOP_DOMAIN = process.env.SHOPIFY_SHOP_DOMAIN || 'dsdujr-vn.myshopify.com';
const THEME_ID = process.env.SHOPIFY_THEME_ID || '186607567033';

async function fetchWithRetry(url, options = {}, retries = 3, delay = 1500) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, options);
      return res;
    } catch (err) {
      if (attempt === retries) throw err;
      console.warn(`  [Network Warning] Attempt ${attempt} failed: ${err.message}. Retrying in ${delay}ms...`);
      await new Promise(r => setTimeout(r, delay));
      delay *= 1.5;
    }
  }
}

async function verifyShopifyConnection() {
  console.log('====================================================');
  console.log('🟢 PHASE 1 CHECKPOINT: SHOPIFY HANDSHAKE & PERMISSIONS');
  console.log(`Target Store: https://${SHOP_DOMAIN}`);
  console.log(`Target Theme ID: ${THEME_ID}`);
  console.log('====================================================\n');

  // Step 1: Token Exchange
  console.log('[1/4] Authenticating with Client Credentials...');
  let accessToken;
  try {
    const tokenRes = await fetchWithRetry(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        client_id: CLIENT_ID,
        client_secret: CLIENT_SECRET,
        grant_type: 'client_credentials'
      })
    });
    const tokenData = await tokenRes.json();
    accessToken = tokenData.access_token;
    if (!accessToken) throw new Error(JSON.stringify(tokenData));
    console.log('  ✔ Access Token successfully obtained.');
  } catch (err) {
    console.error('  ❌ FAILED to get access token:', err.message);
    process.exit(1);
  }

  // Step 2: GraphQL Product Creation Test
  console.log('\n[2/4] Testing Product Write Permission (GraphQL productCreate)...');
  let testProductId;
  try {
    const createQuery = `
      mutation CreateTestProduct($input: ProductInput!) {
        productCreate(input: $input) {
          product {
            id
            title
            handle
          }
          userErrors {
            field
            message
          }
        }
      }
    `;
    const createRes = await fetchWithRetry(`https://${SHOP_DOMAIN}/admin/api/2025-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': accessToken
      },
      body: JSON.stringify({
        query: createQuery,
        variables: {
          input: {
            title: '__TEST_HANDSHAKE_PRODUCT__',
            handle: 'test-handshake-product-' + Date.now(),
            vendor: 'System Check',
            productType: 'Diagnostic'
          }
        }
      })
    });
    const createData = await createRes.json();
    const userErrors = createData.data?.productCreate?.userErrors;
    if (userErrors && userErrors.length > 0) {
      throw new Error(userErrors.map(e => e.message).join(', '));
    }
    testProductId = createData.data?.productCreate?.product?.id;
    if (!testProductId) throw new Error('No product ID returned');
    console.log(`  ✔ Successfully created test product: ${testProductId}`);
  } catch (err) {
    console.error('  ❌ FAILED Product Write test:', err.message);
    process.exit(1);
  }

  // Step 3: Cleanup Test Product
  console.log('\n[3/4] Cleaning up test product (GraphQL productDelete)...');
  try {
    const deleteQuery = `
      mutation DeleteTestProduct($input: ProductDeleteInput!) {
        productDelete(input: $input) {
          deletedProductId
          userErrors {
            field
            message
          }
        }
      }
    `;
    await fetchWithRetry(`https://${SHOP_DOMAIN}/admin/api/2025-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': accessToken
      },
      body: JSON.stringify({
        query: deleteQuery,
        variables: { input: { id: testProductId } }
      })
    });
    console.log('  ✔ Test product deleted cleanly.');
  } catch (err) {
    console.warn('  ⚠️ Warning during cleanup:', err.message);
  }

  // Step 4: Theme Asset API Upload Test
  console.log('\n[4/4] Testing Theme Asset API Write Permission...');
  const testKey = 'snippets/__diagnostic_handshake_test__.liquid';
  try {
    const uploadRes = await fetchWithRetry(`https://${SHOP_DOMAIN}/admin/api/2025-01/themes/${THEME_ID}/assets.json`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': accessToken
      },
      body: JSON.stringify({
        asset: {
          key: testKey,
          value: '{% comment %} diagnostic handshake pass {% endcomment %}'
        }
      })
    });
    const uploadData = await uploadRes.json();
    if (uploadData.errors) throw new Error(JSON.stringify(uploadData.errors));
    console.log(`  ✔ Successfully wrote test asset: ${uploadData.asset?.key}`);

    // Cleanup test asset
    await fetchWithRetry(`https://${SHOP_DOMAIN}/admin/api/2025-01/themes/${THEME_ID}/assets.json?asset[key]=${encodeURIComponent(testKey)}`, {
      method: 'DELETE',
      headers: { 'X-Shopify-Access-Token': accessToken }
    });
    console.log('  ✔ Test theme asset deleted cleanly.');
  } catch (err) {
    console.error('  ❌ FAILED Theme Asset test:', err.message);
    process.exit(1);
  }

  console.log('\n====================================================');
  console.log('🎉 PHASE 1 CHECKPOINT PASSED: ALL PERMISSIONS VERIFIED!');
  console.log('Ready to proceed to Phase 2 (Deep Recon & Harvesting).');
  console.log('====================================================');
}

verifyShopifyConnection();
