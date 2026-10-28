import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
import { getAccessToken, SHOP } from './batch1_config.mjs';

const API_VERSION = '2026-10';
const LIVE_THEME_ID = '187597717689'; // Live Theme
const DEV_THEME_ID = '187736654009';  // Dev Theme

const ASSETS_TO_EXPORT = [
  'snippets/botanaroots-bogo-bundle.liquid',
  'assets/botanaroots-bogo.js',
  'sections/botanaroots-bogo-pdp.liquid',
  'sections/botanaroots-bogo-description.liquid',
  'templates/page.botanaroots-bogo.json'
];

async function main() {
  const token = await getAccessToken();

  console.log('========================================================================');
  console.log('EXPORTING BOGO ASSETS TO LIVE THEME ' + LIVE_THEME_ID);
  console.log('========================================================================\n');

  for (const key of ASSETS_TO_EXPORT) {
    console.log(`1. Reading ${key} from Dev Theme ${DEV_THEME_ID}...`);
    const getRes = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/${DEV_THEME_ID}/assets.json?asset[key]=${key}`, {
      headers: { 'X-Shopify-Access-Token': token }
    });
    const getData = await getRes.json();
    if (!getData.asset) {
      throw new Error(`Failed to read asset ${key} from dev theme: ` + JSON.stringify(getData));
    }

    console.log(`2. Uploading ${key} to Live Theme ${LIVE_THEME_ID}...`);
    const putRes = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/${LIVE_THEME_ID}/assets.json`, {
      method: 'PUT',
      headers: {
        'X-Shopify-Access-Token': token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        asset: {
          key: key,
          value: getData.asset.value
        }
      })
    });
    const putData = await putRes.json();
    if (putData.asset) {
      console.log(`✓ Successfully deployed ${key} to Live Theme!\n`);
    } else {
      throw new Error(`Failed to deploy ${key} to live theme: ` + JSON.stringify(putData));
    }
  }

  // 3. Activate Dedicated BOGO Product 15469942145209 & Publish to Online Store
  console.log('3. Activating Dedicated BOGO Product 15469942145209...');
  const prodRes = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/products/15469942145209.json`, {
    method: 'PUT',
    headers: {
      'X-Shopify-Access-Token': token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      product: {
        id: 15469942145209,
        status: 'active'
      }
    })
  });
  const prodData = await prodRes.json();
  console.log('Product status is now:', prodData.product?.status);

  console.log('4. Publishing product to Online Store Sales Channel...');
  const pubMutation = `
    mutation publishProduct($id: ID!, $input: [PublicationInput!]!) {
      publishablePublish(id: $id, input: $input) {
        publishable {
          availablePublicationsCount {
            count
          }
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const pubRes = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: {
      'X-Shopify-Access-Token': token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      query: pubMutation,
      variables: {
        id: 'gid://shopify/Product/15469942145209',
        input: [{ publicationId: 'gid://shopify/Publication/225336393913' }] // Online Store publication
      }
    })
  });
  const pubData = await pubRes.json();
  console.log('Publish result:', JSON.stringify(pubData.data?.publishablePublish, null, 2));

  console.log('\n✔ EXPORT TO LIVE THEME COMPLETED SUCCESSFULLY.');
}

main().catch(console.error);
