import fs from 'fs';

const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = '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';
const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';

async function getAccessToken() {
  const tokenRes = await fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  const data = await tokenRes.json();
  return data.access_token;
}

async function main() {
  const token = await getAccessToken();
  console.log('Got access token.');

  let products = [];
  let url = `https://${SHOP_DOMAIN}/admin/api/2024-10/products.json?limit=250`;
  while (url) {
    const res = await fetch(url, { headers: { 'X-Shopify-Access-Token': token } });
    const data = await res.json();
    products = products.concat(data.products || []);
    const linkHeader = res.headers.get('link');
    if (linkHeader && linkHeader.includes('rel="next"')) {
      const match = linkHeader.match(/<([^>]+)>;\s*rel="next"/);
      url = match ? match[1] : null;
    } else {
      url = null;
    }
  }

  console.log(`Checking ${products.length} products across store...`);

  let updatedCount = 0;
  let alreadyContinue = 0;
  let errorsCount = 0;

  for (const p of products) {
    for (const v of p.variants) {
      if (v.inventory_policy !== 'continue') {
        try {
          const putRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/variants/${v.id}.json`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
              'X-Shopify-Access-Token': token
            },
            body: JSON.stringify({
              variant: {
                id: v.id,
                inventory_policy: 'continue'
              }
            })
          });

          if (putRes.ok) {
            updatedCount++;
            process.stdout.write(`✔ [${updatedCount}] Updated: ${p.title.slice(0, 30)} - ${v.title}\n`);
          } else {
            const err = await putRes.text();
            console.error(`✗ Error on variant ${v.id}: ${err}`);
            errorsCount++;
          }
          // Throttle slightly to respect Shopify API limits (2 req/s)
          await new Promise(r => setTimeout(r, 250));
        } catch (e) {
          console.error(`✗ Exception on variant ${v.id}:`, e);
          errorsCount++;
        }
      } else {
        alreadyContinue++;
      }
    }
  }

  console.log('\n================ SUMMARY ================');
  console.log(`Total variants checked: ${alreadyContinue + updatedCount + errorsCount}`);
  console.log(`Variants updated to 'continue': ${updatedCount}`);
  console.log(`Variants already 'continue': ${alreadyContinue}`);
  console.log(`Errors: ${errorsCount}`);
}

main().catch(console.error);
