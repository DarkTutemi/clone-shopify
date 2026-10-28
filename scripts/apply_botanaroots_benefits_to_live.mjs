import fs from 'fs';

const CLIENT_ID = '172e9e29abd0fe12f671d8441479c7c2';
const CLIENT_SECRET = process.env.SHOPIFY_API_SECRET || "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";
const SHOP_DOMAIN = 'dsdujr-vn.myshopify.com';

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

async function main() {
  const token = await getAccessToken();

  // 1. Verify Live Theme
  const themesRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/2026-01/themes.json`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const themesData = await themesRes.json();
  const liveTheme = themesData.themes.find(t => t.role === 'main');
  console.log(`Live Theme: ID=${liveTheme.id}, Name="${liveTheme.name}"`);
  if (!liveTheme || liveTheme.id !== 187597717689) {
    console.warn(`WARNING: Live theme ID is ${liveTheme?.id}, expected 187597717689`);
  }

  // 2. Fetch fresh content of sections/zavelyn-pdp-main.liquid from Live Theme
  const assetKey = 'sections/zavelyn-pdp-main.liquid';
  const getAssetRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/2026-01/themes/${liveTheme.id}/assets.json?asset[key]=${encodeURIComponent(assetKey)}`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const assetData = await getAssetRes.json();
  if (!assetData.asset || !assetData.asset.value) {
    throw new Error('Failed to fetch asset from live theme');
  }

  const originalContent = assetData.asset.value;
  // Save dated pre-edit backup
  const timestamp = new Date().toISOString().replace(/[:.]/g, '-');
  const backupPath = `backups/live_theme_${liveTheme.id}_zavelyn-pdp-main_${timestamp}.liquid.bak`;
  fs.writeFileSync(backupPath, originalContent);
  console.log(`✓ Saved pre-modification backup to ${backupPath}`);

  // 3. Define target insertion
  const targetAnchor = `{% elsif product.handle contains 'diesel' or product.handle contains 'injector' %}`;
  if (!originalContent.includes(targetAnchor)) {
    throw new Error(`Target anchor not found in ${assetKey}`);
  }

  const botanarootsOverride = `{% elsif product.handle == 'zavelyn-botanaroots-organic-batana-hair-growth-oil' %}
              <p class="zv-lead-prop">
                Nourish your scalp and bring dry, fragile hair back to life with Zavelyn BotanaRoots Batana Hair Oil. A simple, natural addition to your hair care routine.
              </p>
              <div class="zv-bullet-list">
                <div class="zv-bullet-item"><span class="zv-bullet-icon">🌿</span><span><strong>Pure Batana Oil</strong> — rich, nourishing care for your hair and scalp.</span></div>
                <div class="zv-bullet-item"><span class="zv-bullet-icon">✨</span><span><strong>Fuller, Healthier-Looking Hair</strong> — helps hair look smoother, shinier, and more vibrant.</span></div>
                <div class="zv-bullet-item"><span class="zv-bullet-icon">💧</span><span><strong>Deep Moisture &amp; Nourishment</strong> — helps soften dry strands and reduce the appearance of frizz.</span></div>
                <div class="zv-bullet-item"><span class="zv-bullet-icon">🚚</span><span><strong>Tracked US Shipping</strong> — estimated delivery in 7–15 business days.</span></div>
                <div class="zv-bullet-item"><span class="zv-bullet-icon">🛡️</span><span><strong>30-Day Returns</strong> — shop with confidence under our return policy.</span></div>
              </div>
            `;

  const modifiedContent = originalContent.replace(targetAnchor, `${botanarootsOverride}${targetAnchor}`);
  console.log(`Original content length: ${originalContent.length}`);
  console.log(`Modified content length: ${modifiedContent.length}`);

  // 4. Upload to Live Theme
  console.log(`Uploading modified ${assetKey} to Live Theme ${liveTheme.id}...`);
  const putRes = await fetch(`https://${SHOP_DOMAIN}/admin/api/2026-01/themes/${liveTheme.id}/assets.json`, {
    method: 'PUT',
    headers: {
      'Content-Type': 'application/json',
      'X-Shopify-Access-Token': token
    },
    body: JSON.stringify({
      asset: {
        key: assetKey,
        value: modifiedContent
      }
    })
  });

  const putData = await putRes.json();
  if (!putRes.ok) {
    console.error('Upload failed:', putRes.status, putData);
    throw new Error(`Upload error: ${JSON.stringify(putData)}`);
  }

  console.log('✓ Successfully uploaded to Live Theme!');
  console.log('Asset details:', {
    key: putData.asset?.key,
    updated_at: putData.asset?.updated_at,
    size: putData.asset?.size
  });
}

main().catch(console.error);
