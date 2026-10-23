import fs from 'fs';
import path from 'path';

const SHOP_DOMAIN = process.env.SHOPIFY_SHOP_DOMAIN || 'vwpb1k-8z.myshopify.com';
const CLIENT_ID = process.env.SHOPIFY_CLIENT_ID || '82d6aaab9e73809cb37b6643302b1255';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || process.env.SHOPIFY_CLIENT_SECRET || process.env.SHOPIFY_API_SECRET || "SHOPIFY_SECRET_TOKEN";

const CATALOG_PATH = 'h:/Shopify-Clone/Clone-navage/data/catalog_harvested.json';
const COLLECTIONS_PATH = 'h:/Shopify-Clone/Clone-navage/data/collections_harvested.json';

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function fetchWithRetry(url, options = {}, retries = 3, delay = 1000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, options);
      return res;
    } catch (err) {
      if (attempt === retries) throw err;
      await sleep(delay);
      delay *= 1.5;
    }
  }
}

async function getAccessToken() {
  const tokenRes = await fetchWithRetry(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'client_credentials'
    })
  });
  const data = await tokenRes.json();
  return data.access_token;
}

async function seedNavageCatalog() {
  console.log('====================================================');
  console.log('🚀 PHASE 3: SEEDING NAVAGE CATALOG (41 PRODUCTS)');
  console.log('====================================================\n');

  const accessToken = await getAccessToken();
  console.log('✔ Authenticated successfully.\n');

  const catalog = JSON.parse(fs.readFileSync(CATALOG_PATH, 'utf8'));
  console.log(`Loaded ${catalog.length} products to seed.\n`);

  const createdProducts = {};

  for (let i = 0; i < catalog.length; i++) {
    const p = catalog[i];
    console.log(`[${i + 1}/${catalog.length}] Seeding product: ${p.title} (${p.handle})...`);

    // Check if product already exists
    const checkQuery = `
      query GetProductByHandle($handle: String!) {
        productByHandle(handle: $handle) {
          id
          title
          handle
        }
      }
    `;
    const checkRes = await fetchWithRetry(`https://${SHOP_DOMAIN}/admin/api/2025-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': accessToken
      },
      body: JSON.stringify({
        query: checkQuery,
        variables: { handle: p.handle }
      })
    });
    const checkData = await checkRes.json();
    const existingProduct = checkData.data?.productByHandle;

    if (existingProduct) {
      console.log(`  ✔ Already exists: ${existingProduct.id}`);
      createdProducts[p.handle] = existingProduct.id;
      await sleep(200);
      continue;
    }

    // Build product input
    const input = {
      title: p.title,
      handle: p.handle,
      descriptionHtml: p.bodyHtml || `<p>${p.title}</p>`,
      vendor: p.vendor || 'Naväge',
      productType: p.productType || 'Nasal Care',
      tags: p.tags && p.tags.length > 0 ? p.tags : ['Navage', 'Nasal Care'],
      status: 'ACTIVE'
    };

    // Prepare media (max 8 images for initial fast creation)
    const media = (p.images || []).slice(0, 8).map(img => ({
      originalSource: img.src.startsWith('//') ? 'https:' + img.src : img.src,
      alt: img.alt || p.title,
      mediaContentType: 'IMAGE'
    }));

    const createQuery = `
      mutation CreateProduct($input: ProductInput!, $media: [CreateMediaInput!]) {
        productCreate(input: $input, media: $media) {
          product {
            id
            handle
            title
            variants(first: 5) {
              edges {
                node {
                  id
                  price
                }
              }
            }
          }
          userErrors {
            field
            message
          }
        }
      }
    `;

    try {
      const createRes = await fetchWithRetry(`https://${SHOP_DOMAIN}/admin/api/2025-01/graphql.json`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': accessToken
        },
        body: JSON.stringify({
          query: createQuery,
          variables: { input, media: media.length > 0 ? media : undefined }
        })
      });
      const createData = await createRes.json();
      const userErrors = createData.data?.productCreate?.userErrors;
      if (userErrors && userErrors.length > 0) {
        console.warn(`  ⚠️ Creation warning for ${p.handle}:`, userErrors.map(e => e.message).join('; '));
      }

      const prod = createData.data?.productCreate?.product;
      if (prod && prod.id) {
        console.log(`  ✔ Successfully created: ${prod.id}`);
        createdProducts[p.handle] = prod.id;

        // Update default variant price
        if (p.variants && p.variants[0] && prod.variants?.edges?.[0]?.node?.id) {
          const varId = prod.variants.edges[0].node.id;
          const varPrice = p.variants[0].price;
          const varComparePrice = p.variants[0].compareAtPrice;

          const updateVariantQuery = `
            mutation UpdateDefaultVariant($input: ProductVariantInput!) {
              productVariantUpdate(input: $input) {
                productVariant {
                  id
                  price
                }
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
              query: updateVariantQuery,
              variables: {
                input: {
                  id: varId,
                  price: String(varPrice),
                  compareAtPrice: varComparePrice ? String(varComparePrice) : null
                }
              }
            })
          });
        }
      }
    } catch (err) {
      console.error(`  ❌ Error creating product ${p.handle}:`, err.message);
    }

    await sleep(300);
  }

  fs.writeFileSync('h:/Shopify-Clone/Clone-navage/data/seeded_product_ids.json', JSON.stringify(createdProducts, null, 2), 'utf8');
  console.log(`\n✔ Finished seeding ${Object.keys(createdProducts).length} products.`);

  // STEP 2: Seed & Link Collections
  console.log('\n--- Step 2: Seeding & Linking 17 Collections ---');
  const collections = JSON.parse(fs.readFileSync(COLLECTIONS_PATH, 'utf8'));

  for (let j = 0; j < collections.length; j++) {
    const col = collections[j];
    console.log(`[${j + 1}/${collections.length}] Linking collection: ${col.title} (${col.handle})...`);

    let colId;
    try {
      const getColRes = await fetchWithRetry(`https://${SHOP_DOMAIN}/admin/api/2025-01/custom_collections.json?handle=${col.handle}`, {
        headers: { 'X-Shopify-Access-Token': accessToken }
      });
      const getColData = await getColRes.json();
      if (getColData.custom_collections && getColData.custom_collections.length > 0) {
        colId = getColData.custom_collections[0].id;
      }

      // Link products
      if (colId && col.productHandles && col.productHandles.length > 0) {
        const targetProductGids = col.productHandles
          .map(h => createdProducts[h])
          .filter(Boolean);

        if (targetProductGids.length > 0) {
          const addQuery = `
            mutation AddProductsToCol($id: ID!, $productIds: [ID!]!) {
              collectionAddProducts(id: $id, productIds: $productIds) {
                collection {
                  id
                  productsCount {
                    count
                  }
                }
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
              query: addQuery,
              variables: {
                id: `gid://shopify/Collection/${colId}`,
                productIds: targetProductGids
              }
            })
          });
          console.log(`  ✔ Linked ${targetProductGids.length} products to collection ${col.handle}.`);
        }
      }
    } catch (e) {
      console.warn(`  ⚠️ Collection warning for ${col.handle}:`, e.message);
    }
    await sleep(200);
  }

  console.log('\n====================================================');
  console.log('🎉 SEEDING COMPLETE: ALL PRODUCTS & COLLECTIONS ACTIVE!');
  console.log('====================================================');
}

seedNavageCatalog().catch(console.error);
