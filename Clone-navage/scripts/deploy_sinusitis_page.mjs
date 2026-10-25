import fs from 'fs';

const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';
const THEME_ID = '186607567033';
const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || "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";

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
  if (!data.access_token) {
    throw new Error('Failed to get access token: ' + JSON.stringify(data));
  }
  return data.access_token;
}

async function uploadThemeAsset(token, key, value) {
  const url = `https://${SHOP_DOMAIN}/admin/api/2024-10/themes/${THEME_ID}/assets.json`;
  const res = await fetch(url, {
    method: 'PUT',
    headers: {
      'X-Shopify-Access-Token': token,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      asset: {
        key,
        value
      }
    })
  });
  const data = await res.json();
  if (data.errors) {
    console.error(`Error uploading ${key}:`, JSON.stringify(data.errors));
    throw new Error(`Failed to upload ${key}`);
  }
  console.log(`✔ Successfully uploaded theme asset: ${key} (${value.length} bytes)`);
  return data.asset;
}

async function findPageByHandle(token, handle) {
  const url = `https://${SHOP_DOMAIN}/admin/api/2024-10/pages.json?handle=${handle}`;
  const res = await fetch(url, {
    headers: {
      'X-Shopify-Access-Token': token,
      'Content-Type': 'application/json'
    }
  });
  const data = await res.json();
  return data.pages && data.pages.length > 0 ? data.pages[0] : null;
}

async function createOrUpdatePage(token) {
  const handle = 'sinusitis-sufferer';
  const existing = await findPageByHandle(token, handle);

  const pageData = {
    title: 'Sinusitis Sufferer - Naväge Nasal Care',
    handle: handle,
    template_suffix: 'sinusitis-sufferer',
    body_html: '<p>Naväge Sinusitis Sufferer advertorial & offer landing page.</p>',
    published: true
  };

  if (existing) {
    console.log(`Page already exists (ID: ${existing.id}). Updating template suffix...`);
    const updateUrl = `https://${SHOP_DOMAIN}/admin/api/2024-10/pages/${existing.id}.json`;
    const res = await fetch(updateUrl, {
      method: 'PUT',
      headers: {
        'X-Shopify-Access-Token': token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        page: {
          id: existing.id,
          title: pageData.title,
          template_suffix: pageData.template_suffix,
          published: true
        }
      })
    });
    const data = await res.json();
    return data.page || existing;
  } else {
    console.log(`Creating page /pages/${handle}...`);
    const createUrl = `https://${SHOP_DOMAIN}/admin/api/2024-10/pages.json`;
    const res = await fetch(createUrl, {
      method: 'POST',
      headers: {
        'X-Shopify-Access-Token': token,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({ page: pageData })
    });
    const data = await res.json();
    if (data.errors) {
      console.error('Error creating page:', JSON.stringify(data.errors));
      throw new Error(`Failed to create page ${handle}`);
    }
    return data.page;
  }
}

async function main() {
  const token = await getAccessToken();
  console.log('Got access token.');

  // 1. Upload CSS
  console.log('\n--- Uploading navage-sinusitis.css ---');
  const cssContent = fs.readFileSync('Clone-navage/theme/assets/navage-sinusitis.css', 'utf8');
  await uploadThemeAsset(token, 'assets/navage-sinusitis.css', cssContent);

  // 2. Upload Liquid Template
  console.log('\n--- Uploading page.sinusitis-sufferer.liquid ---');
  const liquidContent = fs.readFileSync('Clone-navage/theme/templates/page.sinusitis-sufferer.liquid', 'utf8');
  await uploadThemeAsset(token, 'templates/page.sinusitis-sufferer.liquid', liquidContent);

  // 3. Create or Update Page
  console.log('\n--- Syncing Shopify Page /pages/sinusitis-sufferer ---');
  const page = await createOrUpdatePage(token);
  console.log(`✔ Page configured! ID: ${page.id}, handle: ${page.handle}`);
  console.log(`  Live URL: https://tryzavelyn.com/pages/${page.handle}`);

  // 4. Verify HTTP Response
  console.log('\n--- Verifying live response ---');
  const testRes = await fetch(`https://tryzavelyn.com/pages/${page.handle}`);
  console.log(`Response HTTP Status: ${testRes.status}`);
  const html = await testRes.text();
  console.log(`Response Body Length: ${html.length}`);
  if (html.includes('Meet the Naväge Advanced Nose Cleaner')) {
    console.log('✔ Verified: Top announcement banner present in response!');
  }
  if (html.includes('I spent years organizing my whole life around my sinuses')) {
    console.log('✔ Verified: Main story headline present in response!');
  }
  if (html.includes('/products/navage-advanced-nose-cleaner')) {
    console.log('✔ Verified: Advanced Nose Cleaner product CTA link present!');
  }
  if (html.includes('/products/navage-starter-bundle')) {
    console.log('✔ Verified: Starter Bundle product CTA link present!');
  }
}

main().catch(console.error);
