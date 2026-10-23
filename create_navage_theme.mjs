import fs from 'fs';

const SHOP_DOMAIN = process.env.SHOPIFY_SHOP_DOMAIN || 'vwpb1k-8z.myshopify.com';
const CLIENT_ID = process.env.SHOPIFY_CLIENT_ID || '82d6aaab9e73809cb37b6643302b1255';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || process.env.SHOPIFY_CLIENT_SECRET || process.env.SHOPIFY_API_SECRET || "SHOPIFY_SECRET_TOKEN";

async function fetchWithRetry(url, options = {}, retries = 3, delay = 1000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, options);
      return res;
    } catch (err) {
      if (attempt === retries) throw err;
      await new Promise(r => setTimeout(r, delay));
      delay *= 1.5;
    }
  }
}

async function createNavageTheme() {
  console.log('--- Step 1: Authenticating with Shopify ---');
  const tokenRes = await fetchWithRetry(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'client_credentials'
    })
  });
  const { access_token } = await tokenRes.json();
  if (!access_token) throw new Error('Failed to get access token');
  console.log('✔ Access token obtained.');

  console.log('--- Step 2: Checking existing themes ---');
  const listRes = await fetchWithRetry(`https://${SHOP_DOMAIN}/admin/api/2025-01/themes.json`, {
    headers: { 'X-Shopify-Access-Token': access_token }
  });
  const { themes } = await listRes.json();
  const existing = themes.find(t => t.name === 'Clone-navage');
  if (existing) {
    console.log(`✔ Found existing Clone-navage theme with ID: ${existing.id}`);
    fs.writeFileSync('navage_theme_id.txt', String(existing.id), 'utf8');
    return existing.id;
  }

  console.log('--- Step 3: Creating new Theme "Clone-navage" ---');
  const createRes = await fetchWithRetry(`https://${SHOP_DOMAIN}/admin/api/2025-01/themes.json`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': access_token
    },
    body: JSON.stringify({
      theme: {
        name: 'Clone-navage',
        role: 'unpublished'
      }
    })
  });
  const data = await createRes.json();
  const newId = data.theme?.id;
  if (!newId) throw new Error(JSON.stringify(data));
  console.log(`✔ Successfully created new Theme "Clone-navage" with ID: ${newId}`);
  fs.writeFileSync('navage_theme_id.txt', String(newId), 'utf8');
  return newId;
}

createNavageTheme().catch(console.error);
