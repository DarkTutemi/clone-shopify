import fs from 'fs';

const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || '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';
const SHOP = 'dsdujr-vn.myshopify.com';
const API_VERSION = '2026-10';

async function getAccessToken() {
  const tRes = await fetch(`https://${SHOP}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: CLIENT_ID, client_secret: CLIENT_SECRET, grant_type: 'client_credentials' })
  });
  const data = await tRes.json();
  return data.access_token;
}

async function introspect() {
  const token = await getAccessToken();
  console.log(`Checking API version: ${API_VERSION}...`);

  // Introspect ProductInput
  const query = `
    query IntrospectMutations {
      productUpdateType: __type(name: "ProductInput") {
        name
        inputFields {
          name
          type {
            name
            kind
            ofType {
              name
              kind
            }
          }
        }
      }
      urlRedirectCreateType: __type(name: "UrlRedirectInput") {
        name
        inputFields {
          name
          type {
            name
            kind
          }
        }
      }
    }
  `;

  const res = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify({ query })
  });

  const json = await res.json();
  const apiHeader = res.headers.get('x-shopify-api-version');
  console.log('HTTP Status:', res.status, '| Header Version:', apiHeader);
  
  const productInputFields = json.data?.productUpdateType?.inputFields?.map(f => f.name) || [];
  console.log('ProductInput supported fields count:', productInputFields.length);
  console.log('Has id:', productInputFields.includes('id'));
  console.log('Has title:', productInputFields.includes('title'));
  console.log('Has handle:', productInputFields.includes('handle'));
  console.log('Has seo:', productInputFields.includes('seo'));

  const redirectInputFields = json.data?.urlRedirectCreateType?.inputFields?.map(f => f.name) || [];
  console.log('UrlRedirectInput supported fields:', redirectInputFields);

  fs.writeFileSync('scripts/api_2026_10_introspection.json', JSON.stringify(json.data, null, 2), 'utf8');
}

introspect().catch(console.error);
