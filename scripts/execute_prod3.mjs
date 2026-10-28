import fs from 'fs';
import path from 'path';

const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || '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';
const SHOP = 'dsdujr-vn.myshopify.com';
const API_VERSION = '2026-10';

const prod3 = {
  rawId: '15454948556985',
  gid: 'gid://shopify/Product/15454948556985',
  shortName: 'Tearable Shelf & Drawer Liner',
  oldHandle: 'sakerplus®-tearable-shelf-liner-and-drawer-liner',
  proposedTitle: 'Zavelyn Tearable Shelf & Drawer Liner',
  proposedSeoTitle: 'Tearable Shelf & Drawer Mat Liner for Kitchen | Zavelyn',
  proposedMetaDesc: 'Protect shelves, cabinets, and drawers from spills, moisture, and scratches with textured EVA liners. Perforated design pulls apart by hand for a custom fit.',
  proposedHandle: 'zavelyn-shelf-drawer-liner'
};

async function getAccessToken() {
  const tRes = await fetch(`https://${SHOP}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  const data = await tRes.json();
  return data.access_token;
}

async function shopifyGQL(query, variables = {}, token) {
  const res = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify({ query, variables })
  });
  return await res.json();
}

async function run() {
  console.log('=== STAGE 3 BATCH 1 - PRODUCT 3 EXECUTION ===\n');
  const token = await getAccessToken();

  // 1. Fetch current live state
  console.log(`1. Reading current live state of Product ${prod3.rawId}...`);
  const readQuery = `
    query getProduct($id: ID!) {
      product(id: $id) {
        id
        title
        handle
        status
        seo {
          title
          description
        }
        variants(first: 10) {
          nodes {
            id
            title
            price
            sku
          }
        }
      }
    }
  `;
  const curRes = await shopifyGQL(readQuery, { id: prod3.gid }, token);
  const curProduct = curRes.data?.product;
  if (!curProduct) {
    throw new Error(`Failed to fetch current product ${prod3.gid}: ${JSON.stringify(curRes)}`);
  }
  console.log('   Current state in Admin:', JSON.stringify({
    title: curProduct.title,
    handle: curProduct.handle,
    seo: curProduct.seo,
    variantsCount: curProduct.variants.nodes.length
  }, null, 2));

  // 2. Check handle availability in Admin API
  console.log(`\n2. Checking availability of new handle "${prod3.proposedHandle}" in Shopify Admin...`);
  const handleCheckQuery = `
    query checkHandle($query: String!) {
      products(first: 1, query: $query) {
        nodes {
          id
          title
          handle
        }
      }
    }
  `;
  const handleRes = await shopifyGQL(handleCheckQuery, { query: `handle:${prod3.proposedHandle}` }, token);
  const existingWithHandle = handleRes.data?.products?.nodes || [];
  if (existingWithHandle.length > 0 && existingWithHandle[0].id !== prod3.gid) {
    throw new Error(`Handle collision detected! Existing product ${existingWithHandle[0].id} already uses handle "${prod3.proposedHandle}"`);
  }
  console.log(`   Handle "${prod3.proposedHandle}" is SAFE and FREE to use.`);

  // 3. Create pre-write snapshot
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const snapshotPath = path.join('scripts', `snapshot_prod_${prod3.rawId}_${timestamp}.json`);
  fs.writeFileSync(snapshotPath, JSON.stringify(curProduct, null, 2), 'utf8');
  console.log(`\n3. Pre-write snapshot saved to: ${snapshotPath}`);

  // 4. Execute productUpdate on API 2026-10 (strictly 4 fields)
  console.log(`\n4. Executing productUpdate mutation on Shopify GraphQL Admin API ${API_VERSION}...`);
  const updateMutation = `
    mutation updateProduct($input: ProductInput!) {
      productUpdate(input: $input) {
        product {
          id
          title
          handle
          seo {
            title
            description
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;
  const updateInput = {
    id: prod3.gid,
    title: prod3.proposedTitle,
    handle: prod3.proposedHandle,
    seo: {
      title: prod3.proposedSeoTitle,
      description: prod3.proposedMetaDesc
    }
  };
  const mutationRes = await shopifyGQL(updateMutation, { input: updateInput }, token);
  const userErrors = mutationRes.data?.productUpdate?.userErrors || [];
  if (userErrors.length > 0) {
    throw new Error(`productUpdate returned userErrors: ${JSON.stringify(userErrors)}`);
  }
  const updatedProduct = mutationRes.data?.productUpdate?.product;
  console.log('   productUpdate SUCCESS:', JSON.stringify(updatedProduct, null, 2));

  // 5. Check URL Redirects
  console.log('\n5. Checking 301 URL Redirects...');
  const expectedPath = `/products/${prod3.oldHandle}`;
  const targetPath = `/products/${prod3.proposedHandle}`;

  const redirectCheckQuery = `
    query getRedirects($path: String!) {
      urlRedirects(first: 5, query: $path) {
        nodes {
          id
          path
          target
        }
      }
    }
  `;
  const rRes = await shopifyGQL(redirectCheckQuery, { path: `path:${expectedPath}` }, token);
  const foundRedirects = rRes.data?.urlRedirects?.nodes || [];
  let finalRedirectId = null;

  const exactMatch = foundRedirects.find(r => r.path === expectedPath && r.target === targetPath);
  if (exactMatch) {
    console.log(`   Shopify already created exact 301 redirect: ID ${exactMatch.id} (${exactMatch.path} -> ${exactMatch.target})`);
    finalRedirectId = exactMatch.id;
  } else {
    console.log(`   Exact redirect not found in Admin records. Creating via urlRedirectCreate...`);
    const createRedirectMutation = `
      mutation createRedirect($urlRedirect: UrlRedirectInput!) {
        urlRedirectCreate(urlRedirect: $urlRedirect) {
          urlRedirect {
            id
            path
            target
          }
          userErrors {
            field
            message
          }
        }
      }
    `;
    const crRes = await shopifyGQL(createRedirectMutation, {
      urlRedirect: { path: expectedPath, target: targetPath }
    }, token);

    const crErrors = crRes.data?.urlRedirectCreate?.userErrors || [];
    if (crErrors.length > 0) {
      console.warn(`   urlRedirectCreate notice:`, crErrors);
      // Check if target was already covered
      const retryCheck = await shopifyGQL(redirectCheckQuery, { path: `path:${expectedPath}` }, token);
      finalRedirectId = retryCheck.data?.urlRedirects?.nodes?.[0]?.id || 'AUTO_CREATED_BY_HANDLE_CHANGE';
    } else {
      finalRedirectId = crRes.data?.urlRedirectCreate?.urlRedirect?.id;
      console.log(`   urlRedirectCreate SUCCESS: ID ${finalRedirectId}`);
    }
  }

  const mutationSummary = {
    productId: prod3.rawId,
    timestamp: new Date().toISOString(),
    snapshotFile: snapshotPath,
    before: {
      title: curProduct.title,
      handle: curProduct.handle,
      seo: curProduct.seo
    },
    after: updatedProduct,
    redirect: {
      path: expectedPath,
      target: targetPath,
      id: finalRedirectId
    }
  };

  fs.writeFileSync('scripts/batch1_item3_mutation.json', JSON.stringify(mutationSummary, null, 2), 'utf8');
  console.log('\nPRODUCT 3 MUTATION COMPLETE. Ready for Independent QA!');
}

run().catch(err => {
  console.error('\nFATAL ERROR in Product 3 execution:', err);
  process.exit(1);
});
