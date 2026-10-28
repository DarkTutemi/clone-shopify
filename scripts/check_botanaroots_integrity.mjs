import { getAccessToken, SHOP } from './batch1_config.mjs';

const LIVE_THEME_ID = 187597717689;

async function main() {
  const token = await getAccessToken();

  // Check if snippets/botanaroots-bundle-upsell.liquid or assets/botanaroots-bundle.css was modified
  const resTheme = await fetch(`https://${SHOP}/admin/api/2024-01/themes/${LIVE_THEME_ID}/assets.json?asset[key]=snippets/botanaroots-bundle-upsell.liquid`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const data = await resTheme.json();
  console.log('BotanaRoots snippet size on Live Theme:', data.asset.size);
  console.log('BotanaRoots snippet updated_at:', data.asset.updated_at);

  const resCss = await fetch(`https://${SHOP}/admin/api/2024-01/themes/${LIVE_THEME_ID}/assets.json?asset[key]=assets/botanaroots-bundle.css`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const dataCss = await resCss.json();
  console.log('BotanaRoots CSS size on Live Theme:', dataCss.asset.size);
  console.log('BotanaRoots CSS updated_at:', dataCss.asset.updated_at);
}

main().catch(console.error);
