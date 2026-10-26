import fs from 'fs';

const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || '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';
const SHOP = 'dsdujr-vn.myshopify.com';
const THEME_ID = '186607567033';

async function getAccessToken() {
  const tRes = await fetch(`https://${SHOP}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  const data = await tRes.json();
  return data.access_token;
}

async function main() {
  const token = await getAccessToken();
  console.log('--- 1. AUDITING SHOPIFY MENUS ---');
  const menuRes = await fetch(`https://${SHOP}/admin/api/2024-10/graphql.json`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
    body: JSON.stringify({
      query: `{
        menus(first: 10) {
          nodes {
            id
            handle
            title
            items {
              id
              title
              url
              items {
                id
                title
                url
              }
            }
          }
        }
      }`
    })
  });
  const menuJson = await menuRes.json();
  console.log(JSON.stringify(menuJson.data.menus.nodes, null, 2));

  console.log('\n--- 2. AUDITING ALL COLLECTIONS ---');
  const colRes = await fetch(`https://${SHOP}/admin/api/2024-10/custom_collections.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const { custom_collections } = await colRes.json();
  
  const smartColRes = await fetch(`https://${SHOP}/admin/api/2024-10/smart_collections.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const { smart_collections } = await smartColRes.json();

  const allCols = [...custom_collections, ...smart_collections];
  for (const c of allCols) {
    const pCountRes = await fetch(`https://${SHOP}/admin/api/2024-10/collections/${c.id}/products.json?limit=250`, {
      headers: { 'X-Shopify-Access-Token': token }
    });
    const { products } = await pCountRes.json();
    console.log(`Collection: "${c.title}" (handle: /collections/${c.handle}) - ${products ? products.length : 0} products`);
  }

  console.log('\n--- 3. AUDITING HOMEPAGE TEMPLATE SECTIONS ---');
  const indexAssetRes = await fetch(`https://${SHOP}/admin/api/2024-10/themes/${THEME_ID}/assets.json?asset[key]=templates/index.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const indexAsset = await indexAssetRes.json();
  if (indexAsset.asset && indexAsset.asset.value) {
    const parsedIndex = JSON.parse(indexAsset.asset.value);
    console.log('Homepage Order:', parsedIndex.order);
    for (const secId of parsedIndex.order) {
      console.log(`Section "${secId}": type = "${parsedIndex.sections[secId]?.type}"`);
    }
  }

  console.log('\n--- 4. AUDITING HEADER AND FOOTER GROUPS ---');
  for (const group of ['sections/header-group.json', 'sections/footer-group.json']) {
    const gRes = await fetch(`https://${SHOP}/admin/api/2024-10/themes/${THEME_ID}/assets.json?asset[key]=${encodeURIComponent(group)}`, {
      headers: { 'X-Shopify-Access-Token': token }
    });
    const gJson = await gRes.json();
    if (gJson.asset && gJson.asset.value) {
      console.log(`${group}:`);
      console.log(gJson.asset.value);
    }
  }
}

main().catch(console.error);
