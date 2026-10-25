const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';
const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || "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";

async function getAccessToken() {
  const res = await globalThis.fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
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

const sleep = (ms) => new Promise(r => setTimeout(r, ms));

async function main() {
  const token = await getAccessToken();

  // 1. Get all store products
  const res = await globalThis.fetch(`https://${SHOP_DOMAIN}/admin/api/2025-01/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify({
      query: `{
        products(first: 100) {
          nodes {
            id
            title
            handle
            descriptionHtml
          }
        }
      }`
    })
  });
  const data = await res.json();
  const storeProducts = data.data.products.nodes;
  console.log(`Checking ${storeProducts.length} store products against trybronoir.com...`);

  let updatedCount = 0;

  for (let i = 0; i < storeProducts.length; i++) {
    const p = storeProducts[i];
    
    // Try fetching from trybronoir
    // Try variations of handle (e.g. with or without ™, with or without -1-1-free)
    const testHandles = [
      p.handle,
      p.handle.replace(/™/g, ''),
      encodeURIComponent(p.handle),
      p.handle.replace(/-1-1-free$/, ''),
      p.handle.replace(/-bogo$/, ''),
      `bronoir™-${p.handle.replace(/^bronoir-/, '')}`
    ];
    // Also try adding / removing bronoir-
    const uniqueTestHandles = [...new Set(testHandles)];

    let sourceDesc = null;
    let matchedHandle = null;

    for (const h of uniqueTestHandles) {
      try {
        const srcRes = await fetch(`https://trybronoir.com/products/${h}.js`);
        if (srcRes.ok) {
          const srcData = await srcRes.json();
          if (srcData && srcData.description && srcData.description.length > 50) {
            sourceDesc = srcData.description;
            matchedHandle = h;
            break;
          }
        }
      } catch (e) {}
    }

    if (sourceDesc) {
      // Check if current description is different or empty
      const isDifferent = !p.descriptionHtml || p.descriptionHtml.length < 50 || p.descriptionHtml !== sourceDesc;
      if (isDifferent) {
        console.log(`[${i+1}/${storeProducts.length}] Updating ${p.handle} from ${matchedHandle} (Length: ${sourceDesc.length})...`);
        
        // Update product via GraphQL
        const updateMutation = `
          mutation productUpdate($input: ProductInput!) {
            productUpdate(input: $input) {
              product { id }
              userErrors { field message }
            }
          }
        `;
        const upRes = await globalThis.fetch(`https://${SHOP_DOMAIN}/admin/api/2025-01/graphql.json`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            'X-Shopify-Access-Token': token
          },
          body: JSON.stringify({
            query: updateMutation,
            variables: {
              input: {
                id: p.id,
                descriptionHtml: sourceDesc
              }
            }
          })
        });
        const upData = await upRes.json();
        if (upData.data?.productUpdate?.userErrors?.length > 0) {
          console.error('  Update error:', upData.data.productUpdate.userErrors);
        } else {
          console.log(`  ✓ Successfully updated description for ${p.title}!`);
          updatedCount++;
        }
        await sleep(250);
      } else {
        // console.log(`[${i+1}/${storeProducts.length}] ${p.handle} already matches.`);
      }
    } else {
      console.warn(`[${i+1}/${storeProducts.length}] Could not find trybronoir source for ${p.handle}`);
    }
  }

  console.log(`\n=== Done! Updated ${updatedCount} products with their authentic description ===`);
}

main().catch(console.error);
