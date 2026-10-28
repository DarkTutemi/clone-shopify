import { getAccessToken, SHOP, API_VERSION } from './batch1_config.mjs';

async function waitProcessing() {
  const token = await getAccessToken();
  const themeId = 187702804665;

  for (let i = 0; i < 30; i++) {
    const res = await fetch(`https://${SHOP}/admin/api/${API_VERSION}/themes/${themeId}.json`, {
      headers: { 'X-Shopify-Access-Token': token }
    });
    const data = await res.json();
    console.log(`[${i+1}/30] Theme ${themeId}: processing=${data.theme.processing}, previewable=${data.theme.previewable}`);
    if (!data.theme.processing) {
      console.log('Duplication complete and theme is ready!');
      return true;
    }
    await new Promise(r => setTimeout(r, 4000));
  }
  return false;
}

waitProcessing().catch(console.error);
