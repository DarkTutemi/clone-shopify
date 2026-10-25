// sync_all_4_collections_products.mjs
import fs from 'fs';

const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || "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";
const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';

const storeProducts = JSON.parse(fs.readFileSync('all_store_products.json', 'utf8'));

// Collection IDs
const COLLECTIONS = {
  bestsellers: {
    id: 'gid://shopify/Collection/493127598234',
    title: 'Bestsellers'
  },
  bogo: {
    id: 'gid://shopify/Collection/493127631002',
    title: 'Barefoot Shoes BOGO Volume'
  },
  winter: {
    id: 'gid://shopify/Collection/493127696538',
    title: 'Winter Collection'
  },
  socks: {
    id: 'gid://shopify/Collection/493127729306',
    title: 'Socks and Insoles'
  }
};

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

async function addProductsToCollection(token, collectionId, productIds) {
  console.log(`Adding ${productIds.length} products to collection ${collectionId}...`);
  const query = `
    mutation collectionAddProducts($id: ID!, $productIds: [ID!]!) {
      collectionAddProducts(id: $id, productIds: $productIds) {
        collection {
          id
          title
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

  // Chunk in batches of 25
  for (let i = 0; i < productIds.length; i += 25) {
    const chunk = productIds.slice(i, i + 25);
    const res = await fetch(`https://${SHOP_DOMAIN}/admin/api/2025-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': token
      },
      body: JSON.stringify({
        query,
        variables: {
          id: collectionId,
          productIds: chunk
        }
      })
    });
    const json = await res.json();
    if (json.errors) {
      console.error('GraphQL errors:', json.errors);
    }
    const userErrors = json.data?.collectionAddProducts?.userErrors;
    if (userErrors && userErrors.length > 0) {
      console.warn('User errors:', userErrors);
    } else {
      console.log(`✔ Added chunk of ${chunk.length} items. Total collection count now:`, json.data?.collectionAddProducts?.collection?.productsCount?.count);
    }
  }
}

async function main() {
  const token = await getAccessToken();

  // 1. BESTSELLERS:
  // Query all 50 product IDs from bestseller-old
  const oldQuery = `
    query {
      collection(id: "gid://shopify/Collection/493136052378") {
        products(first: 50) {
          nodes {
            id
            handle
          }
        }
      }
    }
  `;
  const oldRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/2025-01/graphql.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
    body: JSON.stringify({ query: oldQuery })
  });
  const oldData = await oldRes.json();
  const bestsellerProductIds = oldData.data.collection.products.nodes.map(p => p.id);
  console.log(`Found ${bestsellerProductIds.length} products from bestseller-old to assign to Bestsellers.`);
  await addProductsToCollection(token, COLLECTIONS.bestsellers.id, bestsellerProductIds);

  // 2. BAREFOOT-SHOES-BOGO-VOLUME:
  // All BOGO / volume deal products
  const bogoProducts = storeProducts.filter(p => {
    const h = p.handle.toLowerCase();
    const t = p.title.toLowerCase();
    return h.includes('bogo') || h.includes('free') || h.includes('gratis') ||
           t.includes('bogo') || t.includes('free') || t.includes('1+1') || t.includes('buy 2') || t.includes('buy 1');
  });
  console.log(`Found ${bogoProducts.length} BOGO products in store.`);
  const bogoIds = bogoProducts.map(p => p.id);
  // Also include key shoes that have BOGO offers on trybronoir
  const additionalBogoHandles = [
    'bronoir-skin-pro-with-copper-grounding-allround-barefoot-shoes-kopie',
    'bronoir-skin-pro-with-copper-grounding-allround-barefoot-shoes',
    'bronoir-streets-casual-everyday-barefoot-shoes-1-1-free',
    'bronoir-streets-minimalist-everyday-barefoot-sneakers',
    'bronoir-flex-barefoot-shoes',
    'bronoir-runner-pro-barefoot-performance-running-shoes'
  ];
  for (const h of additionalBogoHandles) {
    const p = storeProducts.find(sp => sp.handle === h);
    if (p && !bogoIds.includes(p.id)) {
      bogoIds.push(p.id);
    }
  }
  await addProductsToCollection(token, COLLECTIONS.bogo.id, bogoIds);

  // 3. WINTER-COLLECTION:
  // All winter boots, fleece, thermal, insulated footwear
  const winterProducts = storeProducts.filter(p => {
    const h = p.handle.toLowerCase();
    const t = p.title.toLowerCase();
    return h.includes('winter') || h.includes('boot') || h.includes('arctic') ||
           h.includes('fleece') || h.includes('insulated') || h.includes('snow') ||
           h.includes('warmers') || h.includes('cosycloud') || h.includes('high-pro') ||
           t.includes('winter') || t.includes('boot') || t.includes('arctic') ||
           t.includes('fleece') || t.includes('insulated') || t.includes('snow') ||
           t.includes('warmers') || t.includes('cosycloud');
  });
  console.log(`Found ${winterProducts.length} Winter products in store.`);
  const winterIds = winterProducts.map(p => p.id);
  // Also add any other cold-weather trail shoes featured in winter collection (hikers, ergo streets)
  const additionalWinter = ['hikers', 'hikers-bogo', 'bronoir-hikers-orthopedic-outdoor-trail-shoes', 'bronoir-ergo-streets-orthopedic-sneakers-for-pain-free-walking-1'];
  for (const h of additionalWinter) {
    const p = storeProducts.find(sp => sp.handle === h);
    if (p && !winterIds.includes(p.id)) {
      winterIds.push(p.id);
    }
  }
  await addProductsToCollection(token, COLLECTIONS.winter.id, winterIds);

  // 4. SOCKS-AND-INSOLES:
  // Insoles, socks, plus complementary shoes featured in that collection
  const socksHandles = [
    'bronoir-connect-orthopedic-fleece-conductive-insoles',
    'bronoir-barefoot-recovery-socks-3-pack',
    'bronoir-air-barefoot-shoes-1-1-free',
    'bronoir-feel-barefoot-shoes',
    'bronoir-feel-barefoot-shoes-1-1-free',
    'bronoir-sports-barefoot-shoes',
    'bronoir-sports-barefoot-shoes-1-1-free',
    'bronoir-streets-casual-everyday-barefoot-shoes-1-1-free',
    'bronoir-workers-casual-everyday-barefoot-shoes-1-1-free',
    'bronoir-skin-pro-with-copper-grounding-allround-barefoot-shoes-kopie',
    'hikers'
  ];
  const sockIds = [];
  for (const h of socksHandles) {
    const p = storeProducts.find(sp => sp.handle === h);
    if (p) sockIds.push(p.id);
  }
  console.log(`Found ${sockIds.length} products for Socks & Insoles.`);
  await addProductsToCollection(token, COLLECTIONS.socks.id, sockIds);

  console.log('\n✔ All 4 collections successfully synced with authentic products!');
}

main();
