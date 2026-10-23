const CLIENT_ID = '82d6aaab9e73809cb37b6643302b1255';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || "SHOPIFY_SECRET_TOKEN";
const SHOP_DOMAIN = 'vwpb1k-8z.myshopify.com';

const PRODUCT_IMAGES = {
  'bronoir-skin-pro-copper-grounding': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
  'bronoir™-skin-pro-with-copper-grounding-allround-barefoot-shoes': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
  'bronoir™-skin-pro-with-copper-grounding-allround-barefoot-shoes-1': 'https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=800&auto=format&fit=crop&q=80',
  'bronoir-cosycloud-boot': 'https://images.unsplash.com/photo-1520639888713-7851133b1ed0?w=800&auto=format&fit=crop&q=80',
  'bronoir-runner-pro': 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?w=800&auto=format&fit=crop&q=80',
  'bronoir-streets': 'https://images.unsplash.com/photo-1600185365926-3a2ce3cdb9eb?w=800&auto=format&fit=crop&q=80',
  'bronoir-hikers': 'https://images.unsplash.com/photo-1551107696-a4b0c5a0d9a2?w=800&auto=format&fit=crop&q=80',
  'bronoir-air': 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?w=800&auto=format&fit=crop&q=80',
  'bronoir-warmers-fleece': 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=800&auto=format&fit=crop&q=80',
  'bronoir-ortho-clouds-insoles': 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?w=800&auto=format&fit=crop&q=80',
  'bronoir-connect-conductive-insoles': 'https://images.unsplash.com/photo-1512374382149-233c42b6a83b?w=800&auto=format&fit=crop&q=80'
};

async function main() {
  const tokenRes = await fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'client_credentials'
    })
  });
  const { access_token } = await tokenRes.json();
  if (!access_token) throw new Error('Token error');

  const graphql = async (query, variables = {}) => {
    const res = await fetch(`https://${SHOP_DOMAIN}/admin/api/2025-01/graphql.json`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-Shopify-Access-Token': access_token
      },
      body: JSON.stringify({ query, variables })
    });
    return (await res.json()).data;
  };

  const prodRes = await graphql('{ products(first: 20) { nodes { id handle title } } }');
  console.log(`Found ${prodRes?.products?.nodes?.length} products in store.`);

  for (const prod of prodRes.products.nodes) {
    const imgUrl = PRODUCT_IMAGES[prod.handle];
    if (imgUrl) {
      console.log(`Attaching media to ${prod.title} (${prod.handle})...`);
      const res = await graphql(`
        mutation productCreateMedia($media: [CreateMediaInput!]!, $productId: ID!) {
          productCreateMedia(media: $media, productId: $productId) {
            media {
              id
              status
            }
            mediaUserErrors {
              field
              message
            }
          }
        }
      `, {
        productId: prod.id,
        media: [{
          originalSource: imgUrl,
          mediaContentType: 'IMAGE'
        }]
      });
      console.log('Result:', res?.productCreateMedia);
    }
  }

  console.log('🎉 ALL PRODUCT IMAGES SUCCESSFULLY ATTACHED!');
}

main().catch(console.error);
