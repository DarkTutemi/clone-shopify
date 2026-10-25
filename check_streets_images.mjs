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
        productByHandle(handle: "bronoir-streets-minimalist-everyday-barefoot-sneakers") {
          id
          title
          variants(first: 20) {
            nodes {
              id
              title
              image {
                url
              }
            }
          }
          images(first: 20) {
            nodes {
              id
              url
              altText
            }
          }
        }
      }`
    })
  });
  const data = await res.json();
  const p = data.data.productByHandle;
  console.log('Variants count:', p.variants.nodes.length);
  p.variants.nodes.slice(0, 10).forEach(v => {
    console.log(v.title, 'hasImage:', !!v.image, v.image?.url?.slice(0, 60));
  });
  console.log('Images count:', p.images.nodes.length);
  p.images.nodes.slice(0, 10).forEach(img => {
    console.log(img.id, img.altText, img.url.slice(0, 80));
  });
}
main().catch(console.error);
