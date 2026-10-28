import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
import { getAccessToken, SHOP } from './batch1_config.mjs';

const API_VERSION = '2026-10';

async function checkFunctionsAndApps() {
  const token = await getAccessToken();
  const headers = {
    'X-Shopify-Access-Token': token,
    'Content-Type': 'application/json'
  };

  // Check shopify functions / cart transforms
  try {
    const q = `
      query {
        cartTransforms(first: 10) {
          nodes {
            id
            functionId
          }
        }
      }
    `;
    const res = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/graphql.json`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query: q })
    });
    const data = await res.json();
    console.log('CART_TRANSFORMS:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.log('CART_TRANSFORMS ERR:', err.message);
  }

  // Check installed apps
  try {
    const q = `
      query {
        appInstallations(first: 20) {
          nodes {
            app {
              id
              title
              handle
            }
          }
        }
      }
    `;
    const res = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/graphql.json`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ query: q })
    });
    const data = await res.json();
    console.log('INSTALLED_APPS:', JSON.stringify(data, null, 2));
  } catch (err) {
    console.log('APPS ERR:', err.message);
  }
}

checkFunctionsAndApps().catch(console.error);
