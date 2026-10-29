import dns from 'dns';
dns.setDefaultResultOrder('ipv4first');
import { getAccessToken, SHOP } from './batch1_config.mjs';

async function inspectBundleSource() {
  const token = await getAccessToken();
  const liveThemeId = '187597717689';

  // 1. Inspect sections/zavelyn-pdp-main.liquid
  const pdpRes = await fetch(`https://${SHOP}/admin/api/2026-10/themes/${liveThemeId}/assets.json?asset[key]=sections/zavelyn-pdp-main.liquid`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const pdpData = await pdpRes.json();
  const pdpContent = pdpData.asset?.value || '';

  console.log('--- sections/zavelyn-pdp-main.liquid size:', pdpContent.length);
  // Search for bundle or variant loop
  const pdpLines = pdpContent.split('\n');
  pdpLines.forEach((l, idx) => {
    if (l.includes('bundle') || l.includes('Bundle') || l.includes('heating') || l.includes('livestock') || l.includes('render') || l.includes('include')) {
      if (l.includes('render') || l.includes('include') || l.includes('bundle')) {
        console.log(`Line ${idx+1}: ${l.trim()}`);
      }
    }
  });

  // 2. Check sections/heating-lamp-funnel.liquid
  const funnelRes = await fetch(`https://${SHOP}/admin/api/2026-10/themes/${liveThemeId}/assets.json?asset[key]=sections/heating-lamp-funnel.liquid`, {
    headers: { 'X-Shopify-Access-Token': token }
  });
  const funnelData = await funnelRes.json();
  if (funnelData.asset?.value) {
    console.log('\n--- sections/heating-lamp-funnel.liquid size:', funnelData.asset.value.length);
    const fLines = funnelData.asset.value.split('\n');
    fLines.forEach((l, idx) => {
      if (l.includes('bundle') || l.includes('Bundle') || l.includes('1 Pack') || l.includes('2 Pack') || l.includes('3 Pack') || l.includes('BEST VALUE') || l.includes('POPULAR')) {
        console.log(`Funnel Line ${idx+1}: ${l.trim().slice(0, 100)}`);
      }
    });
  }
}

inspectBundleSource().catch(console.error);
