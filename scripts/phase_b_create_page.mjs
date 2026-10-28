import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
import { getAccessToken, SHOP } from './batch1_config.mjs';

const API_VERSION = '2026-10';

async function checkAndCreatePage() {
  const token = await getAccessToken();
  const headers = {
    'X-Shopify-Access-Token': token,
    'Content-Type': 'application/json'
  };

  const handle = 'botanaroots-bogo-offer';
  console.log(`Checking if page "${handle}" exists...`);

  const q = `
    query getPage($handle: String!) {
      pageByHandle(handle: $handle) {
        id
        title
        handle
        templateSuffix
      }
    }
  `;
  const res = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query: q, variables: { handle } })
  });
  const data = await res.json();

  if (data.data?.pageByHandle) {
    console.log('Page already exists:', JSON.stringify(data.data.pageByHandle, null, 2));
    return data.data.pageByHandle;
  }

  console.log('Creating Shopify Page "botanaroots-bogo-offer"...');
  const createPageMutation = `
    mutation pageCreate($page: PageCreateInput!) {
      pageCreate(page: $page) {
        page {
          id
          title
          handle
          templateSuffix
        }
        userErrors {
          field
          message
        }
      }
    }
  `;

  const pageInput = {
    title: 'Zavelyn BotanaRoots Batana Hair Growth Oil — Special BOGO Offer',
    handle: handle,
    templateSuffix: 'botanaroots-bogo',
    isPublished: true, // Visible when previewing theme or with direct link
    body: '<p>BotanaRoots BOGO Special Offer Landing Page.</p>'
  };

  const cRes = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/graphql.json`, {
    method: 'POST',
    headers,
    body: JSON.stringify({ query: createPageMutation, variables: { page: pageInput } })
  });
  const cData = await cRes.json();
  console.log('PageCreate response:', JSON.stringify(cData, null, 2));

  const page = cData.data?.pageCreate?.page;
  if (!page) {
    throw new Error('Failed to create page: ' + JSON.stringify(cData.data?.pageCreate?.userErrors));
  }
  console.log(`✔ Page created! ID: ${page.id}`);
  return page;
}

checkAndCreatePage().catch(console.error);
