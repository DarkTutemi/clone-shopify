const SHOP_DOMAIN = 'vwpb1k-8z.myshopify.com';
const CLIENT_ID = '82d6aaab9e73809cb37b6643302b1255';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || "SHOPIFY_SECRET_TOKEN";

const SKIN_PRO_IMAGES = [
  "https://trybronoir.com/cdn/shop/files/Hauptbild-4_8897c560-2faf-4244-a125-be3a505158d5_1001x.jpg?v=1761602498",
  "https://trybronoir.com/cdn/shop/files/Ueberblick-13_64ac82c4-9290-4ac3-834e-a546159247d1_1001x.jpg?v=1761602501",
  "https://trybronoir.com/cdn/shop/files/DeinAbschnittstext_9_1080x.png?v=1761602495"
];

async function main() {
  const tokenRes = await fetch('https://' + SHOP_DOMAIN + '/admin/oauth/access_token', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  const { access_token } = await tokenRes.json();

  async function graphql(query, variables = {}) {
    const res = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': access_token
      },
      body: JSON.stringify({ query, variables })
    });
    return (await res.json()).data;
  }

  const prodData = await graphql(`
    query {
      productByHandle(handle: "bronoir-skin-pro-with-copper-grounding-allround-barefoot-shoes") {
        id
        title
        media(first: 10) {
          nodes { id }
        }
      }
    }
  `);

  const prod = prodData?.productByHandle;
  console.log('Found product:', prod?.title, prod?.id);

  if (prod) {
    // Delete old non-working media if any
    for (const m of prod.media?.nodes || []) {
      console.log('Deleting old media:', m.id);
      await graphql(`
        mutation delMedia($productId: ID!, $mediaIds: [ID!]!) {
          productDeleteMedia(productId: $productId, mediaIds: $mediaIds) {
            deletedMediaIds
          }
        }
      `, { productId: prod.id, mediaIds: [m.id] });
    }

    // Upload verified working images
    const mediaInput = SKIN_PRO_IMAGES.map(src => ({
      originalSource: src,
      mediaContentType: "IMAGE"
    }));

    const addRes = await graphql(`
      mutation createMedia($productId: ID!, $media: [CreateMediaInput!]!) {
        productCreateMedia(productId: $productId, media: $media) {
          media { id status }
          mediaUserErrors { field message }
        }
      }
    `, { productId: prod.id, media: mediaInput });

    console.log('Upload result:', JSON.stringify(addRes, null, 2));
  }
}
main().catch(console.error);
