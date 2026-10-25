const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';
const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || "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";

async function main() {
  const tokenRes = await globalThis.fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'client_credentials'
    })
  });
  const { access_token } = await tokenRes.json();

  const res = await globalThis.fetch(`https://${SHOP_DOMAIN}/admin/api/2025-01/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': access_token
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
  const prods = data.data.products.nodes;
  console.log(`Total store products: ${prods.length}`);

  let emptyDesc = 0;
  let uniqueDescMap = new Map();

  for (const p of prods) {
    const len = p.descriptionHtml ? p.descriptionHtml.length : 0;
    if (len === 0) {
      emptyDesc++;
      console.log(`[EMPTY] ${p.handle} (${p.title})`);
    } else {
      const hash = p.descriptionHtml.slice(0, 80);
      if (!uniqueDescMap.has(hash)) {
        uniqueDescMap.set(hash, []);
      }
      uniqueDescMap.get(hash).push(p.handle);
    }
  }

  console.log(`\nEmpty descriptions: ${emptyDesc}`);
  console.log(`Unique description clusters: ${uniqueDescMap.size}`);
  for (const [hash, handles] of uniqueDescMap.entries()) {
    console.log(`\nCluster (${handles.length} products): "${hash.slice(0, 60)}..."`);
    console.log(`  Handles: ${handles.slice(0, 5).join(', ')}${handles.length > 5 ? '...' : ''}`);
  }
}
main().catch(console.error);
