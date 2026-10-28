import { getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';

const CLONE_THEME_ID = '187720335545';

async function main() {
  const token = await getAccessToken();

  for (let i = 0; i < 20; i++) {
    const res = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/${CLONE_THEME_ID}.json`, {
      headers: { 'X-Shopify-Access-Token': token }
    });
    const data = await res.json();
    console.log(`Poll ${i + 1}: processing = ${data.theme?.processing}`);
    if (data.theme && !data.theme.processing) {
      console.log('✓ Theme is ready!');
      return;
    }
    await new Promise(r => setTimeout(r, 2000));
  }
}

main().catch(console.error);
