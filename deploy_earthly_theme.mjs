import fs from 'fs';
import path from 'path';

const CLIENT_ID = '82d6aaab9e73809cb37b6643302b1255';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || "SHOPIFY_SECRET_TOKEN";
const SHOP_DOMAIN = 'vwpb1k-8z.myshopify.com';
const THEME_ID = '189572219034'; // Clone-earthlyderm
const SOURCE_DIR = 'h:/Shopify-Clone/Clone-earthlyderm';

async function getAccessToken() {
  const tokenRes = await fetch(`https://${SHOP_DOMAIN}/admin/oauth/access_token`, {
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

function getAllFiles(dir, baseDir = '') {
  let results = [];
  const list = fs.readdirSync(dir);
  for (const file of list) {
    const fullPath = path.join(dir, file);
    const relPath = path.join(baseDir, file).replace(/\\/g, '/');
    const stat = fs.statSync(fullPath);
    if (stat && stat.isDirectory()) {
      if (file !== 'data' && file !== '.git') {
        results = results.concat(getAllFiles(fullPath, relPath));
      }
    } else {
      // Only include theme subfolders: layout, templates, sections, snippets, assets, config, locales
      const topDir = relPath.split('/')[0];
      if (['layout', 'templates', 'sections', 'snippets', 'assets', 'config', 'locales'].includes(topDir)) {
        results.push({ fullPath, relPath });
      }
    }
  }
  return results;
}

async function uploadAsset(token, relPath, content, isBinary = false) {
  const url = `https://${SHOP_DOMAIN}/admin/api/2026-01/themes/${THEME_ID}/assets.json`;
  const body = {
    asset: {
      key: relPath
    }
  };
  if (isBinary) {
    body.asset.attachment = content.toString('base64');
  } else {
    body.asset.value = content.toString('utf8');
  }

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const res = await fetch(url, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'X-Shopify-Access-Token': token
        },
        body: JSON.stringify(body)
      });
      if (res.ok) {
        return true;
      } else {
        const errText = await res.text();
        if (attempt === 3) {
          console.error(`  ❌ Failed to upload ${relPath} (Attempt ${attempt}): ${errText}`);
          return false;
        }
        await new Promise(r => setTimeout(r, 1000 * attempt));
      }
    } catch(e) {
      if (attempt === 3) {
        console.error(`  ❌ Exception uploading ${relPath}: ${e.message}`);
        return false;
      }
      await new Promise(r => setTimeout(r, 1000 * attempt));
    }
  }
  return false;
}

async function deploy() {
  console.log(`Starting deployment of Clone-earthlyderm to Theme ID: ${THEME_ID}...`);
  const token = await getAccessToken();
  console.log('Got token.');

  const files = getAllFiles(SOURCE_DIR);
  console.log(`Found ${files.length} theme files to upload.`);

  let successCount = 0;
  for (let i = 0; i < files.length; i++) {
    const f = files[i];
    const isBinary = /\.(png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|eot)$/i.test(f.relPath);
    const content = fs.readFileSync(f.fullPath);
    const ok = await uploadAsset(token, f.relPath, content, isBinary);
    if (ok) {
      successCount++;
      process.stdout.write(`  [${i + 1}/${files.length}] Uploaded: ${f.relPath}\n`);
    }
    // slight delay to avoid rate limiting
    await new Promise(r => setTimeout(r, 200));
  }

  console.log(`\n====================================================`);
  console.log(`🎉 DEPLOY COMPLETE: ${successCount}/${files.length} files uploaded!`);
  console.log(`Preview URL: https://${SHOP_DOMAIN}/?preview_theme_id=${THEME_ID}`);
  console.log(`====================================================`);
}

deploy().catch(console.error);
