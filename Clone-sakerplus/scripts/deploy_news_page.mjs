import fs from 'fs';

const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';
const THEME_ID = '186607567033';
const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || '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';

async function getAccessToken() {
  const res = await fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'client_credentials'
    })
  });
  const data = await res.json();
  return data.access_token;
}

async function uploadThemeAsset(token, key, value) {
  const url = `https://${SHOP_DOMAIN}/admin/api/2024-10/themes/${THEME_ID}/assets.json`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify({
      asset: { key, value }
    })
  });
  if (res.ok) {
    console.log(`  ✔ Uploaded: ${key}`);
    return true;
  } else {
    const err = await res.text();
    console.error(`  ✗ Failed ${key}:`, err);
    return false;
  }
}

async function main() {
  const token = await getAccessToken();

  console.log('1. Uploading templates/page.news-sakerplus-livestock-heating-lamp.liquid...');
  const templateLiquid = fs.readFileSync('Clone-sakerplus/data/heating_lamp/page.news-sakerplus-livestock-heating-lamp.liquid', 'utf-8');
  await uploadThemeAsset(token, 'templates/page.news-sakerplus-livestock-heating-lamp.liquid', templateLiquid);

  console.log('2. Creating or updating Shopify Page...');
  const pagesRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/pages.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const pagesData = await pagesRes.json();
  const existingPage = pagesData.pages?.find(p => p.handle === 'news-sakerplus-livestock-heating-lamp');

  const pagePayload = {
    page: {
      title: "7 Reasons Backyard Farmers Are Ditching Their Old Heat Lamps (And Never Looking Back)",
      handle: "news-sakerplus-livestock-heating-lamp",
      template_suffix: "news-sakerplus-livestock-heating-lamp",
      published: true
    }
  };

  if (existingPage) {
    console.log(`  Updating existing page ID: ${existingPage.id}...`);
    const updateRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/pages/${existingPage.id}.json`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
      body: JSON.stringify(pagePayload)
    });
    console.log('  Page update status:', updateRes.status);
  } else {
    console.log('  Creating new page...');
    const createRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/2024-10/pages.json`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'X-Shopify-Access-Token': token },
      body: JSON.stringify(pagePayload)
    });
    const pageData = await createRes.json();
    console.log('  Page created! ID:', pageData.page?.id, '| Handle:', pageData.page?.handle);
  }

  console.log('\n🚀 ALL DONE!');
  console.log(`Live Page: https://tryzavelyn.com/pages/news-sakerplus-livestock-heating-lamp`);
}

main().catch(console.error);
