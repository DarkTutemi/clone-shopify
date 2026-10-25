import fs from 'fs';
import path from 'path';

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

async function uploadThemeAsset(token, key, value) {
  const url = `https://${SHOP}/admin/api/2024-10/themes/${THEME_ID}/assets.json`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'X-Shopify-Access-Token': token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ asset: { key, value } })
  });
  const data = await res.json();
  if (data.errors) {
    throw new Error(`Failed to upload ${key}: ` + JSON.stringify(data.errors));
  }
  console.log(`✔ Successfully uploaded theme asset: ${key} (${value.length} bytes)`);
  return data.asset;
}

async function createOrUpdateShopifyPage(token) {
  const handle = 'sinus-relief';
  const getRes = await fetch(`https://${SHOP}/admin/api/2024-10/pages.json?handle=${handle}`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const { pages } = await getRes.json();
  const existing = pages && pages.length > 0 ? pages[0] : null;

  const pagePayload = {
    title: 'Sinus Relief - Drug-Free Powered Nasal Irrigation | Zavelyn',
    handle: handle,
    template_suffix: 'sinus-relief',
    body_html: '<p>Zavelyn Sinus Relief educational advertorial & comparison page.</p>',
    published: true
  };

  if (existing) {
    console.log(`Page /pages/${handle} already exists (ID: ${existing.id}). Updating template_suffix...`);
    const putRes = await fetch(`https://${SHOP}/admin/api/2024-10/pages/${existing.id}.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
      body: JSON.stringify({ page: { id: existing.id, ...pagePayload } })
    });
    const { page } = await putRes.json();
    console.log(`✔ Page updated: ID ${page.id}, handle: ${page.handle}`);
    return page;
  } else {
    console.log(`Creating new page /pages/${handle}...`);
    const postRes = await fetch(`https://${SHOP}/admin/api/2024-10/pages.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
      body: JSON.stringify({ page: pagePayload })
    });
    const { page } = await postRes.json();
    console.log(`✔ Page created: ID ${page.id}, handle: ${page.handle}`);
    return page;
  }
}

async function main() {
  console.log('================================================================');
  console.log('🚀 DEPLOYING & EVALUATING ZAVELYN SINUS RELIEF LANDING PAGE');
  console.log(`🎯 Store: ${SHOP} | Theme ID: ${THEME_ID}`);
  console.log('================================================================\n');

  const token = await getAccessToken();

  // 1. Upload Section
  const sectionContent = fs.readFileSync('sections_zavelyn-sinus-relief.liquid', 'utf8');
  await uploadThemeAsset(token, 'sections/zavelyn-sinus-relief.liquid', sectionContent);

  // 2. Upload Template
  const templateContent = fs.readFileSync('templates_page.sinus-relief.json', 'utf8');
  await uploadThemeAsset(token, 'templates/page.sinus-relief.json', templateContent);

  // 3. Create or update page
  const page = await createOrUpdateShopifyPage(token);
  const liveUrl = `https://tryzavelyn.com/pages/${page.handle}`;
  console.log(`\n🌐 Live Landing Page URL: ${liveUrl}`);

  // 4. Verify HTTP Response
  console.log('\n--- Verifying Live HTTP Response ---');
  const res = await fetch(liveUrl);
  console.log(`HTTP Status: ${res.status}`);
  const html = await res.text();
  console.log(`Rendered HTML Length: ${html.length} bytes`);

  const checks = [
    { name: 'Hero title present', ok: html.includes('Tired of Planning Your Day Around a Stuffy Nose?') },
    { name: 'Product A CTA present', ok: html.includes('https://tryzavelyn.com/products/navage-advanced-nose-cleaner') },
    { name: 'Product B CTA present', ok: html.includes('https://tryzavelyn.com/products/navage-starter-bundle') },
    { name: 'Water safety callout present', ok: html.includes('NEVER use untreated tap water') },
    { name: 'FAQ accordion present', ok: html.includes('What is saline nasal irrigation?') },
    { name: 'Final conversion section present', ok: html.includes('Make Nasal Care a More Convenient Part of Your Routine') },
    { name: 'Global Zavelyn Header intact', ok: html.includes('ZAVELYN') },
    { name: 'Global Theme Footer intact', ok: html.includes('footer') || html.includes('Footer') }
  ];

  console.log('\n--- Live HTTP Verification Checks ---');
  let allOk = true;
  for (const c of checks) {
    console.log(`  ${c.ok ? '✔' : '✖'} ${c.name}`);
    if (!c.ok) allOk = false;
  }

  if (allOk) {
    console.log('\n🎉 ALL LIVE CHECKS PASSED!');
  } else {
    console.error('\n⚠️ SOME CHECKS FAILED! Inspect above.');
  }
}

main().catch(console.error);
