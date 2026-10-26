import fs from 'fs';

const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = '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';
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

async function auditSite() {
  console.log('🔍 Starting Comprehensive Storefront Audit...');
  const token = await getAccessToken();

  // 1. Audit Navigation Links
  console.log('\n--- 1. AUDITING NAVIGATION & FOOTER LINKS ---');
  const urlsToCheck = [
    'https://tryzavelyn.com/',
    'https://tryzavelyn.com/collections/all',
    'https://tryzavelyn.com/collections/best-sellers',
    'https://tryzavelyn.com/collections/deals-of-the-day',
    'https://tryzavelyn.com/collections/handpans',
    'https://tryzavelyn.com/collections/power-tools',
    'https://tryzavelyn.com/collections/fence-farm',
    'https://tryzavelyn.com/pages/track-order',
    'https://tryzavelyn.com/pages/contact',
    'https://tryzavelyn.com/policies/privacy-policy',
    'https://tryzavelyn.com/policies/refund-policy',
    'https://tryzavelyn.com/policies/terms-of-service',
    'https://tryzavelyn.com/policies/shipping-policy'
  ];

  for (const url of urlsToCheck) {
    try {
      const res = await fetch(url, { redirect: 'follow' });
      console.log(`[${res.status}] ${url}`);
      if (res.status >= 400) {
        console.warn(`⚠️ Warning: ${url} returned status ${res.status}`);
      }
    } catch (e) {
      console.error(`❌ Error fetching ${url}: ${e.message}`);
    }
  }

  // 2. Audit Search API
  console.log('\n--- 2. AUDITING PREDICTIVE SEARCH ---');
  const queries = ['heating', 'lamp', 'glove', 'handpan', 'batana', 'plane'];
  for (const q of queries) {
    try {
      const sRes = await fetch(`https://tryzavelyn.com/search/suggest.json?q=${encodeURIComponent(q)}&resources[type]=product&resources[limit]=4`);
      const sData = await sRes.json();
      const count = sData.resources?.results?.products?.length || 0;
      console.log(`Query "${q}": found ${count} products (${sData.resources?.results?.products?.map(p => p.title.slice(0, 30)).join(', ') || 'none'})`);
    } catch (e) {
      console.error(`Error searching "${q}":`, e.message);
    }
  }

  // 3. Audit Collections Product Counts
  console.log('\n--- 3. AUDITING COLLECTIONS ---');
  const cRes = await fetch(`https://${SHOP}/admin/api/2024-10/custom_collections.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const { custom_collections } = await cRes.json();
  const scRes = await fetch(`https://${SHOP}/admin/api/2024-10/smart_collections.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const { smart_collections } = await scRes.json();
  const allCollections = [...(custom_collections || []), ...(smart_collections || [])];

  for (const col of allCollections) {
    const colCountRes = await fetch(`https://${SHOP}/admin/api/2024-10/products/count.json?collection_id=${col.id}`, {
      headers: { 'X-Shopify-Access-Token': token }
    });
    const { count } = await colCountRes.json();
    console.log(`Collection "${col.title}" (handle: ${col.handle}): ${count} products`);
  }

  // 4. Audit Policy content & check for unconfigured placeholders
  console.log('\n--- 4. AUDITING POLICIES ---');
  const polRes = await fetch(`https://${SHOP}/admin/api/2024-10/policies.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const { policies } = await polRes.json();
  for (const pol of policies) {
    const brackets = pol.body.match(/\[[^\]]+\]/g);
    if (brackets) {
      console.log(`Policy "${pol.title}": Found placeholders -> ${brackets.slice(0, 5).join(', ')}${brackets.length > 5 ? '...' : ''}`);
    } else {
      console.log(`Policy "${pol.title}": Clean (0 placeholders).`);
    }
  }
}

auditSite();
