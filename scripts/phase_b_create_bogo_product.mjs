import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
import { getAccessToken, SHOP } from './batch1_config.mjs';

const API_VERSION = '2026-10';

async function checkAndCreateBogoProduct() {
  const token = await getAccessToken();
  const headers = {
    'X-Shopify-Access-Token': token,
    'Content-Type': 'application/json'
  };

  const targetHandle = 'zavelyn-botanaroots-bogo-special';

  // 1. Check if product already exists
  console.log(`Checking if product handle "${targetHandle}" already exists...`);
  const checkQuery = `
    query getProduct($handle: String!) {
      productByHandle(handle: $handle) {
        id
        title
        status
        handle
        variants(first: 10) {
          nodes {
            id
            title
            price
            sku
            selectedOptions {
              name
              value
            }
          }
        }
      }
    }
  `;
  const checkRes = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query: checkQuery, variables: { handle: targetHandle } })
  });
  const checkData = await checkRes.json();

  if (checkData.data?.productByHandle) {
    console.log('Product already exists:', JSON.stringify(checkData.data.productByHandle, null, 2));
    return checkData.data.productByHandle;
  }

  // 2. Fetch images from original product to reuse existing CDN URLs without duplicating uploads!
  console.log('Fetching media from original BotanaRoots product...');
  const origQuery = `
    query {
      product(id: "gid://shopify/Product/15461545935033") {
        media(first: 10) {
          nodes {
            ... on MediaImage {
              id
              image {
                url
                altText
              }
            }
          }
        }
      }
    }
  `;
  const origRes = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query: origQuery })
  });
  const origData = await origRes.json();
  const mediaUrls = (origData.data?.product?.media?.nodes || [])
    .map(m => m.image?.url)
    .filter(Boolean);
  console.log(`Found ${mediaUrls.length} media images to link.`);

  // 3. Create Product using productCreate in GraphQL 2026-10
  console.log('Creating Dedicated DRAFT BOGO Product via GraphQL 2026-10...');
  const createMutation = `
    mutation createProduct($input: ProductInput!, $media: [CreateMediaInput!]) {
      productCreate(input: $input, media: $media) {
        product {
          id
          title
          handle
          status
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const input = {
    title: 'Zavelyn BotanaRoots Batana Hair Growth Oil — Exclusive BOGO Offer',
    handle: targetHandle,
    status: 'DRAFT',
    vendor: 'Zavelyn',
    productType: 'Hair Growth Oil & Scalp Treatment',
    descriptionHtml: `
      <p>Exclusive BOGO promotion for Zavelyn BotanaRoots™ 100% Pure Raw Honduran Batana Oil. Manual Fulfillment Reference: Verify number of physical bottles according to selected offer before shipping.</p>
    `,
    productOptions: [
      {
        name: 'Offer',
        values: [
          { name: 'Buy 4 Get 4 FREE' },
          { name: 'Buy 2 Get 2 FREE' },
          { name: 'Buy 1' }
        ]
      },
      {
        name: 'Bottle Size',
        values: [
          { name: '60ml' },
          { name: '120ml' }
        ]
      }
    ]
  };

  const mediaInput = mediaUrls.slice(0, 5).map(url => ({
    originalSource: url,
    mediaContentType: 'IMAGE'
  }));

  const createRes = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query: createMutation, variables: { input, media: mediaInput } })
  });
  const createData = await createRes.json();
  console.log('ProductCreate response:', JSON.stringify(createData, null, 2));

  const newProduct = createData.data?.productCreate?.product;
  if (!newProduct) {
    throw new Error('Failed to create product: ' + JSON.stringify(createData.data?.productCreate?.userErrors));
  }

  console.log(`✔ Product created! ID: ${newProduct.id}`);
  return newProduct;
}

checkAndCreateBogoProduct().catch(console.error);
