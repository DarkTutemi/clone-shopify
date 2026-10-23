import fs from 'fs';
import path from 'path';

const SHOP_DOMAIN = process.env.SHOPIFY_SHOP_DOMAIN || 'vwpb1k-8z.myshopify.com';
const CLIENT_ID = process.env.SHOPIFY_CLIENT_ID || '82d6aaab9e73809cb37b6643302b1255';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || process.env.SHOPIFY_CLIENT_SECRET || process.env.SHOPIFY_API_SECRET || "SHOPIFY_SECRET_TOKEN";
const THEME_ID = '189598367898';

const THEME_DIR = 'h:/Shopify-Clone/Clone-navage';

const sleep = ms => new Promise(r => setTimeout(r, ms));

async function fetchWithRetry(url, options = {}, retries = 3, delay = 1000) {
  for (let attempt = 1; attempt <= retries; attempt++) {
    try {
      const res = await fetch(url, options);
      return res;
    } catch (err) {
      if (attempt === retries) throw err;
      await sleep(delay);
      delay *= 1.5;
    }
  }
}

async function getAccessToken() {
  const tokenRes = await fetchWithRetry(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: CLIENT_SECRET,
      grant_type: 'client_credentials'
    })
  });
  const data = await tokenRes.json();
  return data.access_token;
}

function getAllFiles(dir, base = '') {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    if (file === 'data' || file === 'node_modules' || file.startsWith('.')) continue;
    const fullPath = path.join(dir, file);
    const relPath = base ? `${base}/${file}` : file;
    const stat = fs.statSync(fullPath);
    if (stat.isDirectory()) {
      results = results.concat(getAllFiles(fullPath, relPath));
    } else {
      results.push({ fullPath, key: relPath });
    }
  }
  return results;
}

async function uploadTheme() {
  console.log('====================================================');
  console.log(`📤 UPLOADING CLONE-NAVAGE THEME (ID: ${THEME_ID})`);
  console.log('====================================================\n');

  const accessToken = await getAccessToken();
  console.log('✔ Authenticated.\n');

  const files = getAllFiles(THEME_DIR);
  console.log(`Discovered ${files.length} total files to upload.\n`);

  let successCount = 0;
  for (let i = 0; i < files.length; i++) {
    const { fullPath, key } = files[i];
    const isBinary = /\.(png|jpg|jpeg|gif|webp|ico|svg|woff|woff2|ttf|eot)$/i.test(key);

    let assetPayload = { key };
    if (isBinary) {
      const content = fs.readFileSync(fullPath).toString('base64');
      assetPayload.attachment = content;
    } else {
      const content = fs.readFileSync(fullPath, 'utf8');
      assetPayload.value = content;
    }

    try {
      const res = await fetchWithRetry(`https://${SHOP_DOMAIN}/admin/api/2025-01/themes/${THEME_ID}/assets.json`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': accessToken
        },
        body: JSON.stringify({ asset: assetPayload })
      });
      const data = await res.json();
      if (data.errors) {
        console.warn(`  ⚠️ Upload error on ${key}:`, JSON.stringify(data.errors));
      } else {
        successCount++;
        if (successCount % 10 === 0 || i === files.length - 1) {
          console.log(`  [${i + 1}/${files.length}] Uploaded: ${key}`);
        }
      }
    } catch (e) {
      console.error(`  ❌ Failed uploading ${key}:`, e.message);
    }

    await sleep(150);
  }

  console.log('\n====================================================');
  console.log(`🎉 THEME UPLOAD COMPLETE: ${successCount}/${files.length} FILES DEPLOYED!`);
  console.log(`Preview URL: https://${SHOP_DOMAIN}/?preview_theme_id=${THEME_ID}`);
  console.log('====================================================');
}

uploadTheme().catch(console.error);
