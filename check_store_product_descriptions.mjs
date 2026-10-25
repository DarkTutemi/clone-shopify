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
  
  const handles = [
    'bronoir-nola-cozy-elegant-supportive-ballerinas-for-daily-comfort',
    'bronoir-limited-barefoot-shoes',
    'bronoir-force-barefoot-shoes',
    'bronoir-vista-barefoot-shoes',
    'bronoir-warmers-fleece-lined-non-slip-winter-boots-for-pain-free-walking'
  ];

  for (const handle of handles) {
    const res = await globalThis.fetch(`https://${SHOP_DOMAIN}/admin/api/2025-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': access_token
      },
      body: JSON.stringify({
        query: `{
          productByHandle(handle: "${handle}") {
            id
            title
            description
            descriptionHtml
          }
        }`
      })
    });
    const data = await res.json();
    const p = data.data.productByHandle;
    console.log(`\n=== Store Product: ${handle} ===`);
    if (p) {
      console.log('Title:', p.title);
      console.log('Desc HTML length:', p.descriptionHtml?.length);
      console.log('Desc preview:', p.descriptionHtml?.slice(0, 200).replace(/\n/g, ' '));
    } else {
      console.log('NOT FOUND');
    }
  }
}
main().catch(console.error);
