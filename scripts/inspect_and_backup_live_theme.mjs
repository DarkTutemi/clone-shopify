import fs from 'fs';
import path from 'path';
import { getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';

const LIVE_THEME_ID = '187597717689';
const BACKUP_DIR = 'backups/live_theme_187597717689_baseline';

async function fetchAssetList(token) {
  const url = `https://${SHOP}/admin/api/${API_VERSION}/themes/${LIVE_THEME_ID}/assets.json`;
  const res = await fetch(url, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const data = await res.json();
  return data.assets || [];
}

async function fetchAssetContent(token, key) {
  const url = `https://${SHOP}/admin/api/${API_VERSION}/themes/${LIVE_THEME_ID}/assets.json?asset[key]=${encodeURIComponent(key)}`;
  const res = await fetch(url, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const data = await res.json();
  return data.asset || null;
}

async function main() {
  console.log(`========================================================================`);
  console.log(`INSPECTING & BACKING UP LIVE THEME ${LIVE_THEME_ID}`);
  console.log(`========================================================================\n`);

  const token = await getAccessToken();
  const assets = await fetchAssetList(token);
  console.log(`Total assets on Live Theme: ${assets.length}`);

  if (!fs.existsSync(BACKUP_DIR)) {
    fs.mkdirSync(BACKUP_DIR, { recursive: true });
  }

  // Save asset list manifest
  fs.writeFileSync(path.join(BACKUP_DIR, 'assets_manifest.json'), JSON.stringify(assets, null, 2));

  // Critical files to fetch and inspect
  const criticalKeys = [
    'config/settings_data.json',
    'templates/product.json',
    'sections/zavelyn-pdp-main.liquid',
    'sections/zavelyn-pdp-ticker.liquid',
    'sections/zavelyn-pdp-value-prop.liquid',
    'sections/zavelyn-pdp-features.liquid',
    'sections/zavelyn-pdp-storytelling.liquid',
    'sections/zavelyn-pdp-steps.liquid',
    'sections/zavelyn-pdp-comparison.liquid',
    'sections/zavelyn-pdp-specs.liquid',
    'sections/zavelyn-pdp-included.liquid',
    'sections/zavelyn-pdp-faq.liquid',
    'sections/zavelyn-pdp-description-fallback.liquid',
    'sections/zavelyn-pdp-shipping.liquid',
    'snippets/botanaroots-bundle-upsell.liquid',
    'assets/botanaroots-bundle.css',
    'assets/botanaroots-bundle.js'
  ];

  // Also check for any other product.* templates or botanaroots assets
  const extraTemplates = assets.filter(a => a.key.startsWith('templates/product') || a.key.includes('botana'));
  for (const a of extraTemplates) {
    if (!criticalKeys.includes(a.key)) {
      criticalKeys.push(a.key);
    }
  }

  console.log(`\nDownloading and backing up ${criticalKeys.length} critical files...`);
  const contentInventory = {};

  for (const key of criticalKeys) {
    try {
      const asset = await fetchAssetContent(token, key);
      if (asset) {
        const destPath = path.join(BACKUP_DIR, key.replace(/\//g, path.sep));
        const destDir = path.dirname(destPath);
        if (!fs.existsSync(destDir)) fs.mkdirSync(destDir, { recursive: true });

        if (asset.value) {
          fs.writeFileSync(destPath, asset.value, 'utf8');
          contentInventory[key] = {
            size: asset.size,
            updated_at: asset.updated_at,
            type: 'text'
          };
          console.log(`✓ Backed up text: ${key} (${asset.size} bytes)`);
        } else if (asset.attachment) {
          fs.writeFileSync(destPath, Buffer.from(asset.attachment, 'base64'));
          contentInventory[key] = {
            size: asset.size,
            updated_at: asset.updated_at,
            type: 'binary'
          };
          console.log(`✓ Backed up binary: ${key} (${asset.size} bytes)`);
        }
      } else {
        console.warn(`! Not found on live theme: ${key}`);
      }
    } catch (e) {
      console.error(`✗ Error fetching ${key}:`, e.message);
    }
  }

  fs.writeFileSync(path.join(BACKUP_DIR, 'content_inventory.json'), JSON.stringify(contentInventory, null, 2));

  // Check product template suffix for BotanaRoots
  console.log('\nChecking BotanaRoots product template_suffix on Live...');
  const prodRes = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/products/15461545935033.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const prodData = await prodRes.json();
  console.log(`BotanaRoots template_suffix: "${prodData.product?.template_suffix || 'default (product.json)'}"`);
  console.log(`BotanaRoots images count: ${prodData.product?.images?.length || 0}`);
  console.log(`BotanaRoots variants count: ${prodData.product?.variants?.length || 0}`);

  fs.writeFileSync(path.join(BACKUP_DIR, 'botanaroots_product_data.json'), JSON.stringify(prodData.product, null, 2));

  console.log(`\n========================================================================`);
  console.log(`BACKUP COMPLETE in ${BACKUP_DIR}`);
  console.log(`========================================================================\n`);
}

main().catch(console.error);
